/* Builds the page from EXAMPLES: the level stairs (also a filter), one card
   per example (problem, example run, hint), and on demand its solution:
   the algorithm explained line by line, the "Watch it run" player that
   explains every step with the real numbers, and the trace table.
   Also the "solved" ticks with the progress bar, and the language switch. */
(function () {
  const { I18n, Explain } = window;
  const { esc, t } = I18n;
  const fmt = window.fmtValue;
  const EX = window.EXAMPLES;
  const TOTAL = EX.length;
  const LEVELS = [...new Set(EX.map((e) => e.level))];
  const KEY = 'alg-examples-solved-v2';
  // The first version saved the numbers of the solved examples (0-19).
  const OLD_KEY = 'alg-examples-solved';
  const OLD_ORDER = ['sum-avg', 'rectangle', 'c-to-f', 'swap', 'even-odd', 'greater-two', 'pos-neg-zero', 'greater-total', 'largest-three', 'grade', 'print-1-n', 'sum-1-n', 'times-table', 'factorial', 'sum-evens', 'largest-n', 'avg-passed', 'prime', 'three-largest', 'sum-factorials'];
  const PLAY_MS = 1100;

  /* ----- Solved ticks (kept in this browser only) ----- */
  let solved = new Set();
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) solved = new Set(JSON.parse(saved));
    else solved = new Set(JSON.parse(localStorage.getItem(OLD_KEY) || '[]').map((i) => OLD_ORDER[i]).filter(Boolean));
  } catch (e) { /* private mode: start empty */ }
  function saveSolved() {
    try { localStorage.setItem(KEY, JSON.stringify([...solved])); } catch (e) { /* not saved, still works this visit */ }
  }

  /* ----- Algorithm text with colours ----- */
  const KW = /\b(Start|End|Declare|Input|Print new line|Print|If|if|then|else|go to step|mod|and|or)\b/g;
  function highlight(text) {
    return esc(text)
      .split(/(&quot;.*?&quot;)/)
      .map((part, i) => (i % 2
        ? `<span class="str">${part}</span>`
        : part.replace(KW, '<span class="kw">$1</span>').replace(/(^|[^\w])(-?\d+(?:\.\d+)?)\b/g, '$1<span class="num">$2</span>')))
      .join('');
  }
  const codeLines = (text) => text.split('\n').map((line) => `<span class="cl">${highlight(line)}</span>`).join('');
  const code = (text, cls = '') => `<code class="c ${cls}">${highlight(text)}</code>`;

  const ICON = {
    first: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5v14M18 6l-8 6 8 6z"/></svg>',
    back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
    next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
    last: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 5v14M6 6l8 6-8 6z"/></svg>',
    play: '<svg class="i-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg><svg class="i-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5h3v14H8zM13 5h3v14h-3z"/></svg>',
    bulb: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.6 10.8c.6.5 1 1.2 1.1 2V16h5v-.2c.1-.8.5-1.5 1.1-2A6 6 0 0012 3z"/></svg>',
    list: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/></svg>',
    eye: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    table: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 10v10"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    run: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
  };

  /* ----- Strings for every example ----- */
  EX.forEach((ex, i) => {
    I18n.add(`ex${i}.title`, esc(ex.title[0]), ex.title[1]);
    I18n.add(`ex${i}.task`, esc(ex.task[0]), ex.task[1]);
    I18n.add(`ex${i}.hint`, esc(ex.hint[0]), ex.hint[1]);
    if (ex.note) I18n.add(`ex${i}.note`, esc(ex.note[0]), ex.note[1]);
    ex.steps.forEach((s, k) => { if (s.say) I18n.add(`ex${i}.s${k}`, esc(s.say[0]), s.say[1]); });
  });
  const whyKey = (i, s, k) => (s.say ? `ex${i}.s${k}` : s.t === 'Start' ? 'why.start' : s.t === 'End' ? 'why.end' : 'why.declare');

  /* ----- Level stairs (filter) ----- */
  const ladder = document.getElementById('ladder');
  const allBtn = document.getElementById('all-btn');
  let level = 0;
  ladder.innerHTML = LEVELS.map((n) => {
    const count = EX.filter((e) => e.level === n).length;
    return `
      <button type="button" class="stair lv-${n}" data-level="${n}" aria-pressed="false" style="--k:${n}">
        <span class="stair__bar"><span class="stair__num">${n}</span></span>
        <span class="stair__name" data-i18n="lvl.${n}"></span>
        <span class="stair__count" data-i18n="lvl.count" data-i18n-vars='{"n":${count}}'></span>
      </button>`;
  }).join('');
  allBtn.dataset.i18nVars = JSON.stringify({ n: TOTAL });

  /* ----- Cards ----- */
  const list = document.getElementById('list');
  function sampleOutput(ex) {
    const out = window.runAlgorithm(ex, ex.sample.split(/\s+/).map(Number)).output;
    return out.length > 5 ? [...out.slice(0, 3), '…'] : out;
  }
  list.innerHTML = EX.map((ex, i) => {
    const n = i + 1;
    return `
      <article class="ex lv-${ex.level}" id="ex-${n}" data-i="${i}" data-level="${ex.level}">
        <header class="ex__head">
          <span class="ex__num">${String(n).padStart(2, '0')}</span>
          <div class="ex__titles">
            <p class="ex__level"><span data-i18n="lvl.word" data-i18n-vars='{"n":${ex.level}}'></span><span aria-hidden="true">·</span><span data-i18n="lvl.${ex.level}"></span></p>
            <h2 class="ex__title" data-i18n="ex${i}.title"></h2>
          </div>
          <button type="button" class="ex__done" data-done aria-pressed="false" data-i18n-label="ex.mark" data-i18n-vars='{"n":${n}}'>${ICON.check}<span data-i18n="ex.solved"></span></button>
        </header>
        <p class="ex__task" data-i18n="ex${i}.task"></p>
        <div class="ex__example">
          <div class="ex__io"><span class="ex__label" data-i18n="ex.input"></span><code>${esc(ex.sample)}</code></div>
          <span class="ex__arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
          <div class="ex__io"><span class="ex__label" data-i18n="ex.output"></span><pre>${sampleOutput(ex).map(esc).join('\n')}</pre></div>
        </div>
        <ul class="ex__skills">${ex.skills.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
        <div class="ex__actions">
          <button type="button" class="btn btn--soft" data-toggle="hint" aria-expanded="false">${ICON.bulb}<span data-i18n="ex.hint"></span></button>
          <button type="button" class="btn btn--main" data-toggle="sol" aria-expanded="false">${ICON.eye}<span data-i18n="ex.show"></span></button>
        </div>
        <p class="ex__hint" data-hint hidden><span data-i18n="ex${i}.hint"></span></p>
        <div class="sol" data-sol hidden></div>
      </article>`;
  }).join('');
  I18n.apply();
  const cards = [...list.querySelectorAll('.ex')];

  /* ----- The solution, built the first time it is opened ----- */
  function buildSolution(card) {
    const i = Number(card.dataset.i);
    const ex = EX[i];
    const box = card.querySelector('[data-sol]');
    const loops = ex.steps.some((s) => s.loop != null);
    box.innerHTML = `
      <p class="sol__idea">${ICON.bulb}<span><b data-i18n="ex.idea"></b> <span data-i18n="ex${i}.hint"></span></span></p>
      <div class="sol__grid">
        <section class="panel sol__alg">
          <div class="panel__head">
            <h3 class="panel__title">${ICON.list}<span data-i18n="sol.alg"></span></h3>
            <label class="switch switch--small"><input type="checkbox" data-why checked><span class="switch__ui" aria-hidden="true"></span><span data-i18n="sol.why"></span></label>
          </div>
          <ol class="alg">${ex.steps.map((s, k) => `
            <li class="alg__step${s.loop != null ? ' is-loop' : ''}" data-step="${k + 1}"${s.loop != null ? ` data-to="${s.loop}"` : ''}>
              <span class="alg__n">${k + 1}-</span>
              <div class="alg__body">
                <code class="alg__t">${codeLines(s.t)}</code>
                <p class="alg__why" data-i18n="${whyKey(i, s, k)}"></p>
              </div>
              ${s.loop != null ? `<span class="alg__jump" aria-hidden="true">↩ ${s.loop}</span>` : ''}
            </li>`).join('')}
          </ol>
          ${ex.note ? `<p class="sol__note"><b data-i18n="ex.note"></b> <span data-i18n="ex${i}.note"></span></p>` : ''}
        </section>

        <section class="panel run" aria-labelledby="run-${i}">
          <div class="panel__head">
            <h3 class="panel__title" id="run-${i}">${ICON.run}<span data-i18n="sol.run"></span></h3>
          </div>
          <div class="run__form">
            <label class="run__label" for="in-${i}" data-i18n="run.input"></label>
            <input id="in-${i}" type="text" inputmode="decimal" spellcheck="false" autocomplete="off" value="${esc(ex.sample)}" data-inputs>
            <button type="button" class="btn btn--main btn--sm" data-run><span data-i18n="run.go"></span></button>
            <button type="button" class="btn btn--ghost btn--sm" data-sample data-i18n="run.sample"></button>
          </div>
          <p class="run__order" data-i18n="run.order" data-i18n-vars='${esc(JSON.stringify({ order: { html: `<code>${esc(ex.order)}</code>` } }))}'></p>
          <p class="run__msg" data-msg hidden></p>
          <div class="run__player" data-player tabindex="-1">
            <div class="run__top">
              <p class="run__count"><b data-count></b><span data-pos></span></p>
              <div class="run__ctrls">
                <button type="button" class="ic" data-go="first" data-i18n-label="run.first">${ICON.first}</button>
                <button type="button" class="ic" data-go="back" data-i18n-label="run.back">${ICON.back}</button>
                <button type="button" class="ic ic--next" data-go="next">${ICON.next}<span data-i18n="run.next"></span></button>
                <button type="button" class="ic" data-go="play" data-i18n-label="run.play" aria-pressed="false">${ICON.play}</button>
                <button type="button" class="ic" data-go="last" data-i18n-label="run.last">${ICON.last}</button>
              </div>
            </div>
            <div class="run__track"><span class="run__fill" data-fill></span></div>
            <div class="run__now" aria-live="polite">
              <p class="run__line"><span class="alg__n" data-line-n></span><code class="alg__t" data-line></code></p>
              <p class="run__why" data-why-now></p>
              <div class="run__say" data-say></div>
            </div>
            <div class="run__mem">
              <p class="mini" data-i18n="run.vars"></p>
              <div class="run__vars" data-vars></div>
            </div>
            <div class="run__screen">
              <p class="mini" data-i18n="run.screen"></p>
              <pre data-screen></pre>
            </div>
          </div>
        </section>
      </div>

      <section class="panel trace">
        <div class="panel__head">
          <div>
            <h3 class="panel__title">${ICON.table}<span data-i18n="tr.title"></span></h3>
            <p class="panel__sub" data-i18n="tr.sub"></p>
          </div>
        </div>
        <div class="trace__wrap" data-wrap><table class="ttable" data-table></table></div>
        ${loops ? '<p class="trace__legend" data-i18n="tr.legend"></p>' : ''}
      </section>`;
    I18n.apply(box);
    box.dataset.built = '1';
  }

  /* ----- Running an algorithm and the player ----- */
  const state = new Map(); // card → { ex, i, r, pos, timer }

  function runCard(card) {
    const i = Number(card.dataset.i);
    const ex = EX[i];
    const field = card.querySelector('[data-inputs]');
    const msg = card.querySelector('[data-msg]');
    const player = card.querySelector('[data-player]');
    stop(card);
    const raw = field.value.trim().split(/[\s,]+/).filter(Boolean);
    const values = raw.map(Number);
    msg.hidden = true;
    if (!raw.length || values.some((x) => !Number.isFinite(x))) {
      I18n.set(msg, 'tr.bad');
      msg.hidden = false;
      player.hidden = true;
      card.querySelector('.trace').hidden = true;
      return;
    }
    const r = window.runAlgorithm(ex, values);
    if (r.missing) I18n.set(msg, 'tr.missing', { name: r.missing });
    else if (r.stopped) I18n.set(msg, 'tr.stopped');
    else if (r.extra > 0) I18n.set(msg, 'tr.extra', { n: r.extra });
    msg.hidden = !(r.missing || r.stopped || r.extra > 0);
    player.hidden = !r.rows.length;
    card.querySelector('.trace').hidden = !r.rows.length;
    const s = { ex, i, r, pos: 0, timer: null };
    state.set(card, s);
    buildTable(card, s);
    render(card);
  }

  function buildTable(card, s) {
    const { ex, r } = s;
    let prev = {};
    const body = r.rows.map((row, k) => {
      const cells = ex.vars.map((name) => {
        const val = row.vars[name];
        const changed = val !== undefined && val !== prev[name];
        return `<td class="${changed ? 'is-new' : ''}">${val === undefined ? '' : esc(fmt(val))}</td>`;
      }).join('');
      prev = row.vars;
      const jump = row.loop != null ? `<span class="tj ${row.jump ? 'tj--yes' : 'tj--no'}">${row.jump ? `↩ ${row.loop}` : '↓'}</span>` : '';
      let out = '';
      if (row.newline) out = '<span class="tnl">↵</span>';
      else if (row.printed != null) out = row.printed.trim() === '' ? '<span class="tsp">␣</span>' : esc(row.printed);
      return `<tr data-k="${k}"><th scope="row">${row.step}${jump}</th>${cells}<td class="tout">${out}</td></tr>`;
    }).join('');
    const table = card.querySelector('[data-table]');
    table.innerHTML = `
      <thead><tr><th scope="col" data-i18n="tr.step"></th>${ex.vars.map((v) => `<th scope="col">${esc(v)}</th>`).join('')}<th scope="col" data-i18n="tr.output"></th></tr></thead>
      <tbody>${body}</tbody>`;
    I18n.apply(table);
  }

  // One line of the explanation: a small tag, then the words and numbers.
  const sayRow = (tag, body, cls = '') => `<div class="say ${cls}"><span class="say__tag">${tag}</span><div class="say__body">${body}</div></div>`;
  const ans = (yes) => `<b class="ans ans--${yes ? 'yes' : 'no'}">${t(yes ? 'nar.yes' : 'nar.no')}</b>`;
  const shown = (text) => (text.trim() === '' ? `<span class="say__space">␣</span> <span class="say__hint">(${t('nar.space')})</span>` : `<span class="say__out">${esc(text)}</span>`);

  function partHTML(p, step) {
    switch (p.k) {
      case 'start': return sayRow('▶', `<p>${t('nar.start')}</p>`);
      case 'end': return sayRow('■', `<p>${t('nar.end')}</p>`);
      case 'declare': return sayRow('▢', `<p>${t('nar.declare', { list: { html: code(p.names.join(', ')) } })}</p>`);
      case 'read': return sayRow('Input', `<p>${code(p.code)}</p>`, 'say--read');
      case 'calc': return sayRow('=', `<p>${code(p.code)}</p>`, 'say--calc');
      case 'ask': {
        const chain = p.red ? `${code(p.sub)}<span class="say__to">→</span>${code(p.red)}` : code(p.sub);
        const each = p.each
          ? `<span class="say__each">${p.each.map((x) => (typeof x === 'string' ? `<code class="c c--op">${x}</code>` : ans(x))).join(' ')}</span><span class="say__to">→</span>`
          : '';
        return sayRow('If', `<p>${t('nar.ask', { cond: { html: code(p.cond) } })}</p><p class="say__nums"><span class="say__lbl">${t('nar.nums')}</span> <span class="say__chain">${chain}<span class="say__to">→</span>${each}${ans(p.ans)}</span></p>`, 'say--ask');
      }
      case 'jump': return sayRow(p.yes ? '↩' : '↓', `<p>${t(p.yes ? 'nar.back' : 'nar.on', { n: p.to })}</p>`, `say--jump ${p.yes ? 'is-yes' : 'is-no'}`);
      case 'out': {
        const from = p.code !== step.t ? `${code(p.code)}<span class="say__to">→</span>` : '';
        return sayRow('Print', `<p class="say__chain">${from}${shown(p.text)}</p>${p.same ? `<p class="say__hint">${t('nar.same')}</p>` : ''}`, 'say--out');
      }
      case 'newline': return sayRow('↵', `<p>${t('nar.newline')}</p>`, 'say--out');
      case 'skip': return sayRow('–', `<p>${t('nar.skip')}</p>`);
      case 'else': return sayRow('else', `<p>${t('nar.else')}</p>`, 'say--ask');
      default: return '';
    }
  }

  function render(card) {
    const s = state.get(card);
    if (!s) return;
    const { ex, i, r, pos } = s;
    const row = r.rows[pos];
    if (!row) return;
    const step = ex.steps[row.step - 1];
    const prev = pos ? r.rows[pos - 1].vars : {};
    const { parts } = Explain.narrate(ex, r.rows, pos);

    card.querySelector('[data-count]').innerHTML = t('run.step', { n: row.step });
    card.querySelector('[data-pos]').textContent = `${pos + 1} / ${r.rows.length}`;
    card.querySelector('[data-fill]').style.width = `${((pos + 1) / r.rows.length) * 100}%`;
    card.querySelector('[data-line-n]').textContent = `${row.step}-`;
    card.querySelector('[data-line]').innerHTML = codeLines(step.t);
    card.querySelector('[data-why-now]').innerHTML = t(whyKey(i, step, row.step - 1));
    card.querySelector('[data-say]').innerHTML = parts.map((p) => partHTML(p, step)).join('');
    card.querySelector('[data-vars]').innerHTML = ex.vars.map((name) => {
      const val = row.vars[name];
      const old = prev[name];
      const changed = val !== undefined && val !== old;
      return `<div class="vbox${changed ? ' is-new' : ''}${val === undefined ? ' is-empty' : ''}">
          <span class="vbox__n">${esc(name)}</span>
          <span class="vbox__v">${val === undefined ? '–' : esc(fmt(val))}</span>
          ${changed && old !== undefined ? `<span class="vbox__was">${t('run.was', { v: fmt(old) })}</span>` : ''}
        </div>`;
    }).join('');
    const screen = card.querySelector('[data-screen]');
    screen.classList.toggle('is-empty', !row.screen);
    screen.textContent = row.screen || t('run.empty');
    screen.classList.toggle('is-new', row.printed != null || row.newline);
    screen.scrollTop = screen.scrollHeight;

    const at = (go) => card.querySelector(`[data-go="${go}"]`);
    at('first').disabled = at('back').disabled = pos === 0;
    at('next').disabled = at('last').disabled = pos === r.rows.length - 1;
    const playing = !!s.timer;
    at('play').setAttribute('aria-pressed', String(playing));
    I18n.label(at('play'), playing ? 'run.pause' : 'run.play');
    at('play').disabled = !playing && pos === r.rows.length - 1;

    // Show the same step in the algorithm and in the trace table.
    card.querySelectorAll('.alg__step.is-now').forEach((li) => li.classList.remove('is-now'));
    const li = card.querySelector(`.alg__step[data-step="${row.step}"]`);
    if (li) li.classList.add('is-now');
    const wrap = card.querySelector('[data-wrap]');
    wrap.querySelectorAll('tr.is-now').forEach((tr) => tr.classList.remove('is-now'));
    const tr = wrap.querySelector(`tr[data-k="${pos}"]`);
    if (tr) {
      tr.classList.add('is-now');
      const head = wrap.querySelector('thead').offsetHeight;
      if (tr.offsetTop < wrap.scrollTop + head || tr.offsetTop + tr.offsetHeight > wrap.scrollTop + wrap.clientHeight) {
        wrap.scrollTop = Math.max(0, tr.offsetTop - head - wrap.clientHeight / 3);
      }
    }
  }

  function go(card, pos) {
    const s = state.get(card);
    if (!s) return;
    s.pos = Math.max(0, Math.min(s.r.rows.length - 1, pos));
    render(card);
  }
  function stop(card) {
    const s = state.get(card);
    if (s && s.timer) { clearInterval(s.timer); s.timer = null; }
  }
  function play(card) {
    const s = state.get(card);
    if (!s) return;
    if (s.timer) { stop(card); render(card); return; }
    if (s.pos >= s.r.rows.length - 1) s.pos = 0;
    s.timer = setInterval(() => {
      if (s.pos >= s.r.rows.length - 1) { stop(card); render(card); return; }
      s.pos += 1;
      render(card);
    }, PLAY_MS);
    render(card);
  }

  /* ----- Clicks ----- */
  function toggle(card, which) {
    const btn = card.querySelector(`[data-toggle="${which}"]`);
    const box = card.querySelector(which === 'hint' ? '[data-hint]' : '[data-sol]');
    if (which === 'sol' && !box.dataset.built) buildSolution(card);
    box.hidden = !box.hidden;
    btn.setAttribute('aria-expanded', String(!box.hidden));
    if (which !== 'sol') return;
    I18n.set(btn.querySelector('span'), box.hidden ? 'ex.show' : 'ex.hide');
    if (box.hidden) { stop(card); render(card); return; }
    // The solution starts with the same idea as the hint, so close the hint.
    card.querySelector('[data-hint]').hidden = true;
    card.querySelector('[data-toggle="hint"]').setAttribute('aria-expanded', 'false');
    if (!state.has(card)) runCard(card);
  }

  list.addEventListener('click', (e) => {
    const card = e.target.closest('.ex');
    if (!card) return;
    const tog = e.target.closest('[data-toggle]');
    if (tog) { toggle(card, tog.dataset.toggle); return; }
    if (e.target.closest('[data-run]')) { runCard(card); return; }
    if (e.target.closest('[data-sample]')) {
      card.querySelector('[data-inputs]').value = EX[Number(card.dataset.i)].sample;
      runCard(card);
      return;
    }
    const btn = e.target.closest('[data-go]');
    if (btn) {
      const s = state.get(card);
      if (!s) return;
      const g = btn.dataset.go;
      if (g === 'play') { play(card); return; }
      stop(card);
      go(card, g === 'first' ? 0 : g === 'last' ? s.r.rows.length - 1 : s.pos + (g === 'next' ? 1 : -1));
      return;
    }
    const tr = e.target.closest('tr[data-k]');
    if (tr) { stop(card); go(card, Number(tr.dataset.k)); return; }
    const done = e.target.closest('[data-done]');
    if (done) {
      const id = EX[Number(card.dataset.i)].id;
      if (solved.has(id)) solved.delete(id); else solved.add(id);
      saveSolved();
      paintSolved();
      applyFilter();
    }
  });
  list.addEventListener('change', (e) => {
    if (e.target.matches('[data-why]')) e.target.closest('.ex').classList.toggle('hide-why', !e.target.checked);
  });
  list.addEventListener('keydown', (e) => {
    const card = e.target.closest('.ex');
    if (!card) return;
    if (e.key === 'Enter' && e.target.matches('[data-inputs]')) { e.preventDefault(); runCard(card); return; }
    // Arrow keys move the player while it (or one of its buttons) has focus.
    if (!e.target.closest('[data-player]') || !state.has(card)) return;
    const fwd = document.documentElement.dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    const bwd = fwd === 'ArrowRight' ? 'ArrowLeft' : 'ArrowRight';
    if (e.key !== fwd && e.key !== bwd) return;
    e.preventDefault();
    stop(card);
    go(card, state.get(card).pos + (e.key === fwd ? 1 : -1));
  });
  // Pointing at a loop line shows where it jumps back to.
  list.addEventListener('mouseover', (e) => {
    const card = e.target.closest('.ex');
    if (!card) return;
    card.querySelectorAll('.alg__step.is-target').forEach((li) => li.classList.remove('is-target'));
    const loop = e.target.closest('.alg__step.is-loop');
    if (loop) {
      const to = card.querySelector(`.alg__step[data-step="${loop.dataset.to}"]`);
      if (to) to.classList.add('is-target');
    }
  });

  /* ----- Progress and filters ----- */
  const hideSolved = document.getElementById('hide-solved');
  const count = document.getElementById('count');
  const empty = document.getElementById('empty');

  function paintSolved() {
    cards.forEach((card) => {
      const on = solved.has(EX[Number(card.dataset.i)].id);
      card.classList.toggle('is-solved', on);
      card.querySelector('[data-done]').setAttribute('aria-pressed', String(on));
    });
    const n = EX.filter((ex) => solved.has(ex.id)).length;
    document.getElementById('progress-fill').style.width = `${(n / TOTAL) * 100}%`;
    I18n.set(document.getElementById('progress-text'), 'progress', { n, total: TOTAL });
  }

  function applyFilter() {
    let shown = 0;
    cards.forEach((card) => {
      const ex = EX[Number(card.dataset.i)];
      const ok = (!level || ex.level === level) && !(hideSolved.checked && solved.has(ex.id));
      card.hidden = !ok;
      if (!ok && state.get(card)?.timer) { stop(card); render(card); }
      if (ok) shown += 1;
    });
    I18n.set(count, 'count', { n: shown, total: TOTAL });
    empty.hidden = shown > 0;
  }

  function pickLevel(n) {
    level = n;
    allBtn.setAttribute('aria-pressed', String(n === 0));
    ladder.querySelectorAll('[data-level]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.level) === n)));
    applyFilter();
  }
  ladder.addEventListener('click', (e) => {
    const b = e.target.closest('[data-level]');
    if (!b) return;
    const n = Number(b.dataset.level);
    pickLevel(level === n ? 0 : n);
  });
  allBtn.addEventListener('click', () => pickLevel(0));
  hideSolved.addEventListener('change', applyFilter);
  document.getElementById('lang').addEventListener('click', () => I18n.toggle());
  I18n.onChange(() => state.forEach((s, card) => render(card)));

  I18n.apply();
  paintSolved();
  applyFilter();
})();
