/* Pattern Party: a turn-based team quiz for the end of the lecture.
   One screen, one instructor: teams call out answers, the instructor clicks them. */
(function () {
  const overlay = document.getElementById('game');
  const form = document.getElementById('game-setup');
  const seg = document.getElementById('team-count');
  const namesBox = document.getElementById('team-names');
  const resumeBtn = document.getElementById('game-resume');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const TEAMS = [
    { name: 'Stars', color: '#FF6FB5' },
    { name: 'Rows', color: '#7C9BFF' },
    { name: 'Columns', color: '#FFD23F' },
    { name: 'Loops', color: '#52E3C2' },
  ];
  const TIME = { mcq: 30, tf: 20, order: 60 };
  const STEAL_TIME = { mcq: 15, order: 30 };
  const BASE = 100;
  const BONUS = 50;
  const STEAL = 50;
  const KEYS = ['A', 'B', 'C', 'D'];

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const I18n = window.I18n;
  const num = (n) => ({ html: String(n) });

  // Each question's text gets a key, so switching language re-renders it in place.
  window.QUESTIONS.forEach((q, i) => {
    const ar = q.ar || {};
    I18n.add(`q${i}.kind`, esc(q.kind), ar.kind);
    I18n.add(`q${i}.q`, esc(q.q), ar.q);
    I18n.add(`q${i}.why`, esc(q.why), ar.why);
    (q.options || []).forEach((o, j) => I18n.add(`q${i}.o${j}`, esc(o), ar.options ? esc(ar.options[j]) : null));
  });

  /* ---------- Setup form on the game slide ---------- */
  let teamCount = 2;
  const names = TEAMS.map((t) => t.name);

  function renderSetup() {
    seg.innerHTML = [2, 3, 4].map((n) =>
      `<button type="button" role="radio" aria-checked="${n === teamCount}" tabindex="${n === teamCount ? 0 : -1}" data-n="${n}">${n}</button>`).join('');
    namesBox.innerHTML = names.slice(0, teamCount).map((name, i) => `
      <label class="team-row" style="--team:${TEAMS[i].color}">
        <span class="badge" aria-hidden="true">${i + 1}</span>
        <input type="text" dir="auto" maxlength="18" value="${esc(name)}" data-i="${i}" aria-label="${esc(I18n.t('g.teamName', { n: num(i + 1) }))}">
      </label>`).join('');
  }
  function setCount(n) {
    teamCount = n;
    renderSetup();
    seg.querySelector(`[data-n="${n}"]`).focus();
  }
  seg.addEventListener('click', (e) => {
    const b = e.target.closest('[data-n]');
    if (b) setCount(Number(b.dataset.n));
  });
  seg.addEventListener('keydown', (e) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
    e.preventDefault();
    e.stopPropagation();
    const step = e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 1;
    setCount(Math.min(4, Math.max(2, teamCount + step)));
  });
  namesBox.addEventListener('input', (e) => {
    if (e.target.dataset.i != null) names[Number(e.target.dataset.i)] = e.target.value;
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    start(names.slice(0, teamCount).map((n, i) => ({ name: n.trim() || I18n.t('g.team', { n: num(i + 1) }), color: TEAMS[i].color, score: 0 })));
  });
  resumeBtn.addEventListener('click', () => { open(); resumeClock(); });
  renderSetup();
  I18n.onChange(renderSetup);

  /* ---------- Overlay ---------- */
  const SPEAKER = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path class="wave" d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12"/></svg>';
  const SPEAKER_OFF = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>';

  overlay.innerHTML = `
    <header class="g-top">
      <div>
        <p class="g-name">Pattern Party</p>
        <p class="g-count"></p>
      </div>
      <ol class="g-teams" aria-label="Scores"></ol>
      <div class="g-tools">
        <button type="button" class="lang-btn" data-g="lang" data-i18n-label="lang.label"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/></svg><span data-i18n="lang.switch"></span></button>
        <button type="button" class="icon-btn" data-g="sound"></button>
        <button type="button" class="icon-btn" data-g="close" data-i18n-label="g.back">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </div>
    </header>
    <div class="g-play">
      <div class="g-timer"><div class="g-timer__fill"></div><span class="g-timer__num"></span></div>
      <div class="g-body">
        <div class="g-left">
          <p class="g-turn"></p>
          <p class="g-kind"></p>
          <h2 class="g-q"></h2>
          <div class="g-visual"></div>
        </div>
        <div class="g-right"></div>
      </div>
      <div class="g-feedback" aria-live="polite">
        <p class="g-msg"></p>
        <button type="button" class="btn" data-g="next" data-i18n="g.next" hidden></button>
      </div>
    </div>
    <div class="g-end" hidden></div>
    <canvas class="g-confetti" width="1920" height="1080" aria-hidden="true"></canvas>`;
  I18n.apply(overlay);

  const $ = (sel) => overlay.querySelector(sel);
  const el = {
    count: $('.g-count'), teams: $('.g-teams'), play: $('.g-play'), end: $('.g-end'),
    timer: $('.g-timer'), fill: $('.g-timer__fill'), num: $('.g-timer__num'),
    turn: $('.g-turn'), kind: $('.g-kind'), q: $('.g-q'), visual: $('.g-visual'), right: $('.g-right'),
    feedback: $('.g-feedback'), msg: $('.g-msg'), next: $('[data-g="next"]'), sound: $('[data-g="sound"]'),
    confetti: $('.g-confetti'),
  };

  function paintSound() {
    el.sound.innerHTML = window.Sound.muted ? SPEAKER_OFF : SPEAKER;
    I18n.label(el.sound, window.Sound.muted ? 'g.unmute' : 'g.mute');
  }
  paintSound();

  overlay.addEventListener('click', (e) => {
    const b = e.target.closest('[data-g]');
    if (!b) return;
    const act = b.dataset.g;
    if (act === 'sound') { window.Sound.toggle(); paintSound(); }
    if (act === 'lang') I18n.toggle();
    if (act === 'close') close();
    if (act === 'next') nextQuestion();
    if (act === 'again') start(game.teams.map((t) => ({ ...t, score: 0 })));
  });

  let game = null;
  let clock = null;

  function isOpen() { return !overlay.hidden; }
  function open() {
    overlay.hidden = false;
    document.getElementById('slides').inert = true;
    document.getElementById('bar').inert = true;
    const focusable = overlay.querySelector('.g-opt:not(:disabled), .g-tile, [data-g="next"]:not([hidden]), [data-g="close"]');
    if (focusable) focusable.focus({ preventScroll: true });
  }
  function close() {
    pauseClock();
    overlay.hidden = true;
    document.getElementById('slides').inert = false;
    document.getElementById('bar').inert = false;
    resumeBtn.hidden = !game || game.finished;
    stopConfetti();
  }

  /* ---------- Game flow ---------- */
  function start(teams) {
    game = { teams, qi: 0, finished: false };
    el.end.hidden = true;
    el.play.hidden = false;
    stopConfetti();
    open();
    showQuestion();
  }

  const current = () => window.QUESTIONS[game.qi];
  const actor = () => game.teams[game.actor];
  const canSteal = (q) => game.teams.length > 1 && q.type !== 'tf';

  function renderTeams() {
    el.teams.innerHTML = game.teams.map((t, i) => `
      <li class="g-team${i === game.actor && !game.finished ? ' is-turn' : ''}" style="--team:${t.color}">
        <span class="badge" aria-hidden="true">${i + 1}</span>
        <div><p class="g-team__name">${esc(t.name)}</p><p class="g-team__score" data-score="${i}">${t.score}</p></div>
      </li>`).join('');
  }

  function setActor(i, stealing) {
    game.actor = i;
    overlay.style.setProperty('--team', actor().color);
    el.turn.innerHTML = `<span class="badge" aria-hidden="true">${i + 1}</span><span></span>`;
    I18n.set(el.turn.lastElementChild, stealing ? 'g.steal' : 'g.turn', { team: actor().name });
    renderTeams();
  }

  function showQuestion() {
    const q = current();
    game.phase = 'answer';
    game.tried = new Set();
    setActor(game.qi % game.teams.length, false);
    I18n.set(el.count, 'g.count', { n: game.qi + 1, total: window.QUESTIONS.length });
    I18n.set(el.kind, `q${game.qi}.kind`);
    I18n.set(el.q, `q${game.qi}.q`);
    el.visual.innerHTML = q.code
      ? `<pre class="g-code">${q.code.map((line) => {
          const m = line.match(/^(\d+-)\s(.*)$/);
          return m ? `<span class="n">${m[1]}</span> ${esc(m[2])}` : esc(line);
        }).join('\n')}</pre>`
      : '';
    el.right.className = 'g-right';

    if (q.type === 'mcq') {
      el.right.innerHTML = `<div class="g-options">${q.options.map((o, i) => `
        <button type="button" class="g-opt" data-opt="${i}"><span class="g-key" aria-hidden="true">${KEYS[i]}</span><span class="g-opt__text" dir="auto" data-i18n="q${game.qi}.o${i}"></span></button>`).join('')}</div>`;
    } else if (q.type === 'tf') {
      el.right.innerHTML = `<div class="g-options g-options--tf">
        <button type="button" class="g-opt" data-opt="0"><span class="g-key" aria-hidden="true">T</span><span class="g-opt__text" data-i18n="g.true"></span></button>
        <button type="button" class="g-opt" data-opt="1"><span class="g-key" aria-hidden="true">F</span><span class="g-opt__text" data-i18n="g.false"></span></button></div>`;
    } else {
      setupOrder(q);
    }
    I18n.apply(el.right);
    el.right.querySelectorAll('[data-opt]').forEach((b) => b.addEventListener('click', () => choose(Number(b.dataset.opt))));

    el.feedback.className = 'g-feedback';
    I18n.set(el.msg, q.type === 'order' ? 'g.tapSteps' : 'g.callOut');
    el.next.hidden = true;
    startClock(TIME[q.type]);
  }

  function answerIndex(q) { return q.type === 'tf' ? (q.answer ? 0 : 1) : q.answer; }
  function answerText(q) { return { key: q.type === 'tf' ? (q.answer ? 'g.true' : 'g.false') : `q${game.qi}.o${q.answer}`, bdi: true }; }
  const why = () => ({ key: `q${game.qi}.why` });

  function choose(i) {
    if (game.phase !== 'answer' && game.phase !== 'steal') return;
    const q = current();
    if (q.type === 'order' || game.tried.has(i)) return;
    const btn = el.right.querySelector(`[data-opt="${i}"]`);
    if (i === answerIndex(q)) {
      btn.classList.add('is-right');
      win();
    } else {
      btn.classList.add('is-wrong');
      btn.disabled = true;
      game.tried.add(i);
      lose({ key: 'g.notQuite' });
    }
  }

  function win() {
    const q = current();
    const points = game.phase === 'answer' ? BASE + Math.round(BONUS * (clock ? clock.left / clock.total : 0)) : STEAL;
    stopClock();
    const team = actor();
    const from = team.score;
    team.score += points;
    game.phase = 'done';
    lockOptions();
    window.Sound.play('correct');
    el.feedback.className = 'g-feedback is-good';
    I18n.set(el.msg, 'g.correct', { points, team: team.name, why: why() });
    countUp(game.actor, from, team.score);
    showNext();
  }

  function lose(lead) {
    const q = current();
    stopClock();
    window.Sound.play(lead.key === 'g.timeUp' ? 'timeup' : 'wrong');
    if (game.phase === 'answer' && canSteal(q)) {
      game.phase = 'steal';
      const thief = (game.actor + 1) % game.teams.length;
      setActor(thief, true);
      el.feedback.className = 'g-feedback is-bad';
      I18n.set(el.msg, 'g.canSteal', { lead, team: game.teams[thief].name });
      if (q.type === 'order') reopenOrder();
      startClock(STEAL_TIME[q.type]);
      return;
    }
    game.phase = 'done';
    if (q.type === 'order') revealOrder();
    else {
      const right = el.right.querySelector(`[data-opt="${answerIndex(q)}"]`);
      if (right) right.classList.add('is-right');
      lockOptions();
    }
    el.feedback.className = 'g-feedback is-bad';
    I18n.set(el.msg, q.type === 'order' ? 'g.rightOrder' : 'g.answerIs', { lead, answer: answerText(q), why: why() });
    renderTeams();
    showNext();
  }

  function lockOptions() {
    el.right.querySelectorAll('.g-opt, .g-tile, .g-slot__box, .g-check').forEach((b) => { b.disabled = true; });
  }

  function showNext() {
    const last = game.qi === window.QUESTIONS.length - 1;
    I18n.set(el.next, last ? 'g.seeScores' : 'g.next');
    el.next.hidden = false;
    el.next.focus({ preventScroll: true });
  }

  function nextQuestion() {
    if (game.phase !== 'done') return;
    if (game.qi === window.QUESTIONS.length - 1) { showEnd(); return; }
    game.qi += 1;
    showQuestion();
  }

  function countUp(i, from, to) {
    const node = el.teams.querySelector(`[data-score="${i}"]`);
    if (!node) return;
    if (reduceMotion.matches) { node.textContent = to; return; }
    const t0 = performance.now();
    const frame = (now) => {
      const p = Math.min(1, (now - t0) / 700);
      node.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  /* ---------- Order questions ---------- */
  function shuffle(list) {
    const a = list.slice();
    do {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
    } while (a.every((x, i) => x === i));
    return a;
  }

  function setupOrder(q) {
    game.order = { pool: shuffle(q.items.map((_, i) => i)), slots: q.items.map(() => null), locked: new Set() };
    el.right.className = 'g-right g-right--order';
    drawOrder();
  }

  function drawOrder() {
    const q = current();
    const o = game.order;
    const open = game.phase === 'answer' || game.phase === 'steal';
    el.visual.innerHTML = `<div class="g-pool">${o.pool.map((i) =>
      `<button type="button" class="g-tile" data-tile="${i}" ${open ? '' : 'disabled'}>${esc(q.items[i])}</button>`).join('')}</div>`;
    el.right.innerHTML = `
      <ol class="g-slots">${o.slots.map((item, s) => `
        <li class="g-slot"><span class="g-slot__n">${s + (q.from || 1)}</span><button type="button" class="g-slot__box${item != null ? ' is-filled' : ''}${o.locked.has(s) ? ' is-right' : ''}" data-slot="${s}" ${item == null || o.locked.has(s) || !open ? 'disabled' : ''}>${item != null ? esc(q.items[item]) : '<span class="g-slot__empty" data-i18n="g.tapStep"></span>'}</button></li>`).join('')}
      </ol>
      <button type="button" class="btn g-check" data-i18n="g.checkOrder" ${o.slots.every((x) => x != null) && open ? '' : 'disabled'}></button>`;
    I18n.apply(el.right);
    el.visual.querySelectorAll('[data-tile]').forEach((b) => b.addEventListener('click', () => place(Number(b.dataset.tile))));
    el.right.querySelectorAll('[data-slot]').forEach((b) => b.addEventListener('click', () => unplace(Number(b.dataset.slot))));
    el.right.querySelector('.g-check').addEventListener('click', checkOrder);
  }

  function place(item) {
    const o = game.order;
    const s = o.slots.findIndex((x) => x == null);
    if (s < 0) return;
    o.slots[s] = item;
    o.pool = o.pool.filter((x) => x !== item);
    window.Sound.play('select');
    drawOrder();
    const nextTile = el.visual.querySelector('.g-tile');
    (nextTile || el.right.querySelector('.g-check')).focus({ preventScroll: true });
  }

  function unplace(s) {
    const o = game.order;
    if (o.locked.has(s) || o.slots[s] == null) return;
    o.pool.push(o.slots[s]);
    o.slots[s] = null;
    drawOrder();
  }

  function checkOrder() {
    if (game.phase !== 'answer' && game.phase !== 'steal') return;
    const o = game.order;
    if (o.slots.some((x) => x == null)) return;
    o.slots.forEach((item, s) => { if (item === s) o.locked.add(s); });
    if (o.locked.size === o.slots.length) {
      drawOrder();
      win();
      return;
    }
    drawOrder();
    o.slots.forEach((item, s) => {
      if (!o.locked.has(s)) el.right.querySelector(`[data-slot="${s}"]`).classList.add('is-wrong');
    });
    lose({ key: 'g.placed', vars: { n: o.locked.size, total: o.slots.length } });
  }

  // Wrong steps go back to the pool so the next team can fix them.
  function reopenOrder() {
    const o = game.order;
    setTimeout(() => {
      o.slots.forEach((item, s) => {
        if (!o.locked.has(s) && item != null) { o.pool.push(item); o.slots[s] = null; }
      });
      drawOrder();
    }, 900);
  }

  function revealOrder() {
    const o = game.order;
    o.slots = o.slots.map((_, s) => s);
    o.pool = [];
    o.slots.forEach((_, s) => o.locked.add(s));
    drawOrder();
  }

  /* ---------- Clock ---------- */
  function startClock(seconds) {
    stopClock();
    const total = seconds * 1000;
    clock = { total, left: total, endAt: performance.now() + total, sec: seconds, raf: 0, paused: false };
    paintClock();
    clock.raf = requestAnimationFrame(tick);
  }
  function tick(now) {
    if (!clock || clock.paused) return;
    clock.left = Math.max(0, clock.endAt - now);
    paintClock();
    const sec = Math.ceil(clock.left / 1000);
    if (sec !== clock.sec) {
      clock.sec = sec;
      if (sec > 0 && sec <= 5) window.Sound.play('tick');
    }
    if (clock.left <= 0) { lose({ key: 'g.timeUp' }); return; }
    clock.raf = requestAnimationFrame(tick);
  }
  function paintClock() {
    el.fill.style.width = `${(clock.left / clock.total) * 100}%`;
    el.num.textContent = Math.ceil(clock.left / 1000);
    el.timer.classList.toggle('is-low', clock.left <= 5000);
  }
  function pauseClock() {
    if (!clock || clock.paused) return;
    cancelAnimationFrame(clock.raf);
    clock.paused = true;
  }
  function resumeClock() {
    if (!clock || !clock.paused) return;
    clock.paused = false;
    clock.endAt = performance.now() + clock.left;
    clock.raf = requestAnimationFrame(tick);
  }
  function stopClock() {
    if (clock) cancelAnimationFrame(clock.raf);
    clock = null;
  }

  /* ---------- End screen ---------- */
  function showEnd() {
    stopClock();
    game.finished = true;
    renderTeams();
    I18n.set(el.count, 'g.final');
    const ranked = game.teams.map((t, i) => ({ ...t, i })).sort((a, b) => b.score - a.score);
    const top = ranked[0].score;
    const winners = ranked.filter((t) => t.score === top);
    const max = Math.max(top, 1);
    el.play.hidden = true;
    el.end.hidden = false;
    el.end.innerHTML = `
      <div>
        <p class="g-end__sub" data-i18n="${winners.length > 1 ? 'g.tie' : 'g.winner'}"></p>
        <h2 class="g-end__title">${winners.map((w) => esc(w.name)).join(' &amp; ')}</h2>
      </div>
      <div class="podium">${ranked.map((t, r) => `
        <div class="podium__col" style="--team:${t.color}">
          <p class="podium__name">${esc(t.name)}</p>
          <p class="podium__score">${t.score}</p>
          <div class="podium__bar" data-h="${Math.max(10, (t.score / max) * 100)}">${t.score === top ? 1 : r + 1}</div>
        </div>`).join('')}
      </div>
      <div class="g-end__actions">
        <button type="button" class="btn btn--go" data-g="again" data-i18n="g.again"></button>
        <button type="button" class="btn btn--line" data-g="close" data-i18n="g.back"></button>
      </div>`;
    I18n.apply(el.end);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.end.querySelectorAll('.podium__bar').forEach((b) => { b.style.height = `${b.dataset.h}%`; });
    }));
    el.end.querySelector('[data-g="again"]').focus({ preventScroll: true });
    window.Sound.play('fanfare');
    confetti(winners.map((w) => w.color));
  }

  /* ---------- Confetti: little "*" and "@" marks and strips ---------- */
  let confettiRaf = 0;
  function confetti(colors) {
    if (reduceMotion.matches) return;
    const ctx = el.confetti.getContext('2d');
    const palette = colors.concat(['#FF6FB5', '#FFD23F', '#7C9BFF']);
    const pieces = Array.from({ length: 170 }, () => ({
      x: 960 + (Math.random() - 0.5) * 500,
      y: 380 + (Math.random() - 0.5) * 120,
      vx: (Math.random() - 0.5) * 26,
      vy: -10 - Math.random() * 20,
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      s: 14 + Math.random() * 18,
      c: palette[Math.floor(Math.random() * palette.length)],
      ch: Math.random() < 0.4 ? (Math.random() < 0.6 ? '*' : '@') : null,
    }));
    const t0 = performance.now();
    cancelAnimationFrame(confettiRaf);
    const frame = (now) => {
      const t = now - t0;
      ctx.clearRect(0, 0, 1920, 1080);
      for (const p of pieces) {
        p.vy += 0.55; p.vx *= 0.985; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - Math.max(0, t - 3200) / 1200);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = p.c;
        if (p.ch) {
          ctx.font = `800 ${p.s * 2}px 'JetBrains Mono', monospace`;
          ctx.textAlign = 'center';
          ctx.fillText(p.ch, 0, p.s * 0.6);
        } else {
          ctx.fillRect(-p.s / 2, -p.s / 5, p.s, p.s / 2.5);
        }
        ctx.restore();
      }
      if (t < 4400) confettiRaf = requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, 1920, 1080);
    };
    confettiRaf = requestAnimationFrame(frame);
  }
  function stopConfetti() {
    cancelAnimationFrame(confettiRaf);
    el.confetti.getContext('2d').clearRect(0, 0, 1920, 1080);
  }

  /* ---------- Keyboard ---------- */
  document.addEventListener('keydown', (e) => {
    if (!isOpen() || e.metaKey || e.ctrlKey || e.altKey) return;
    const key = e.key.toLowerCase();
    const onButton = e.target instanceof Element && e.target.matches('button');
    if (key === 'escape') { close(); e.preventDefault(); return; }
    if (key === 'm') { window.Sound.toggle(); paintSound(); return; }
    if (key === 'l') { I18n.toggle(); return; }
    if (!game || game.finished) return;
    if (game.phase === 'done') {
      if ((key === 'enter' || key === ' ') && onButton) return;
      if (key === 'enter' || key === ' ' || key === 'arrowright') { e.preventDefault(); nextQuestion(); }
      return;
    }
    const q = current();
    if (q.type === 'mcq') {
      let i = 'abcd'.indexOf(key);
      if (i < 0) i = '1234'.indexOf(key);
      if (i >= 0 && i < q.options.length) { e.preventDefault(); choose(i); }
    } else if (q.type === 'tf') {
      if (key === 't') choose(0);
      if (key === 'f') choose(1);
    }
  });

  window.Game = { isOpen, open, close };
})();
