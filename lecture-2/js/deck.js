/* Slide deck: scaling, navigation, progress bar, language switch, thinking timers and the cover animation. */
(function () {
  const stage = document.getElementById('stage');
  const slides = [...document.querySelectorAll('.slide')];
  const progress = document.getElementById('progress');
  const count = document.getElementById('count');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const TITLE = 'Factorial Series';
  let index = -1;

  /* ----- Fit the 1920 x 1080 stage to the window ----- */
  function fit() {
    const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    stage.style.setProperty('--scale', scale);
  }
  window.addEventListener('resize', fit);
  fit();

  /* ----- Progress bar: one segment per slide, a gap before each example ----- */
  slides.forEach((slide, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', `Slide ${i + 1}: ${slide.dataset.title}`);
    if (slide.classList.contains('slide--question') || slide.classList.contains('slide--recap')) b.classList.add('is-gap');
    b.addEventListener('click', () => go(i));
    progress.appendChild(b);
  });
  const dots = [...progress.children];

  /* ----- Navigation ----- */
  function go(target, how = 'jump') {
    target = Math.max(0, Math.min(slides.length - 1, target));
    if (target === index) return;
    const leaving = slides[index];
    if (leaving) {
      const sol = window.Solutions.get(leaving);
      if (sol) sol.pause();
      const t = timers.get(leaving);
      if (t) t.pause();
    }

    // Arriving with "next" starts a solution from step zero; any other way shows it whole.
    const arriving = slides[target];
    const sol = window.Solutions.get(arriving);
    if (sol) {
      if (how === 'next') sol.reset();
      else if (sol.shown === 0) sol.showAll();
    }

    index = target;
    slides.forEach((s, i) => {
      const active = i === index;
      s.classList.toggle('is-active', active);
      s.classList.toggle('is-before', i < index);
      s.setAttribute('aria-hidden', active ? 'false' : 'true');
      s.inert = !active;
    });
    dots.forEach((d, i) => {
      d.classList.toggle('is-done', i < index);
      if (i === index) d.setAttribute('aria-current', 'step');
      else d.removeAttribute('aria-current');
    });
    count.textContent = `${index + 1} / ${slides.length}`;
    document.title = index === 0 ? TITLE : `${arriving.dataset.title} | ${TITLE}`;
    history.replaceState(null, '', `#${index + 1}`);
    if (index === 0) playCover();
  }

  function next() {
    const sol = window.Solutions.get(slides[index]);
    if (sol && sol.shown < sol.total) sol.reveal(sol.shown + 1);
    else go(index + 1, 'next');
  }
  function prev() { go(index - 1, 'prev'); }

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
  }

  document.getElementById('bar').addEventListener('click', (e) => {
    const act = e.target.closest('[data-act]');
    if (!act) return;
    if (act.dataset.act === 'prev') prev();
    if (act.dataset.act === 'next') next();
    if (act.dataset.act === 'full') toggleFullscreen();
    if (act.dataset.act === 'lang') window.I18n.toggle();
  });

  document.addEventListener('keydown', (e) => {
    if (window.Game && window.Game.isOpen()) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target instanceof Element ? e.target : document.body;
    if (t.matches('input, textarea, select')) {
      if (e.key === 'Escape') t.blur();
      return;
    }
    const onButton = t.matches('button, summary, [role="radio"]');
    switch (e.key) {
      case 'ArrowRight': case 'PageDown': next(); break;
      case 'ArrowLeft': case 'PageUp': prev(); break;
      case ' ': if (onButton) return; next(); break;
      case 'Home': go(0); break;
      case 'End': go(slides.length - 1); break;
      case 'f': case 'F': toggleFullscreen(); break;
      case 'l': case 'L': window.I18n.toggle(); break;
      default: return;
    }
    e.preventDefault();
  });

  // Swipe on touch screens
  let touchX = null;
  stage.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    if (touchX == null || (window.Game && window.Game.isOpen())) return;
    const dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 60) (dx < 0 ? next : prev)();
  });

  /* ----- Cover: the outer loop moves i 8 → 6 → 4 while the inner loop builds each factorial ----- */
  const heroTerms = [...document.querySelectorAll('.hero__term')];
  const heroI = document.getElementById('hero-i');
  const heroC = document.getElementById('hero-c');
  const heroFact = document.getElementById('hero-fact');
  const heroCells = document.getElementById('hero-cells');
  const cells = (n, filled) => {
    heroCells.innerHTML = Array.from({ length: n }, (_, j) => `<span${j < filled ? ' class="is-on"' : ''}></span>`).join('');
  };
  cells(4, 4);
  let coverPlayed = false;

  function playCover() {
    if (coverPlayed || reduceMotion.matches) return;
    coverPlayed = true;
    const plan = [];
    [8, 6, 4].forEach((i, t) => {
      plan.push({ i, c: 1, fact: 1, t, start: true });
      let fact = 1;
      for (let c = 1; c <= i; c++) { fact *= c; plan.push({ i, c, fact, t }); }
      plan.push({ i, c: i, fact, t, done: true });
    });
    heroTerms.forEach((el) => el.classList.remove('is-done', 'is-active'));
    plan.forEach((s, n) => setTimeout(() => {
      heroI.textContent = s.i;
      heroC.textContent = s.c;
      heroFact.textContent = window.fmt(s.fact);
      heroTerms[s.t].classList.toggle('is-active', !s.done);
      if (s.done) heroTerms[s.t].classList.add('is-done');
      cells(s.i, s.start ? 0 : s.c);
    }, 700 + n * 190));
  }

  /* ----- Thinking timers on question slides ----- */
  const RING = 2 * Math.PI * 180;
  const timers = new Map();
  const I18n = window.I18n;

  function buildTimer(el) {
    el.innerHTML = `
      <div class="timer__ring">
        <svg viewBox="0 0 400 400" aria-hidden="true">
          <circle class="timer__track" cx="200" cy="200" r="180"/>
          <circle class="timer__arc" cx="200" cy="200" r="180" stroke-dasharray="${RING}" stroke-dashoffset="0"/>
        </svg>
        <div class="timer__face">
          <p class="timer__time" role="timer" aria-live="off">3:00</p>
          <p class="timer__cap"></p>
        </div>
      </div>
      <div class="timer__presets" role="group" data-i18n-label="timer.length">
        ${[3, 5, 10, 15].map((m) => `<button type="button" data-min="${m}" aria-pressed="${m === 3}" data-i18n="timer.${m}"></button>`).join('')}
      </div>
      <div class="timer__ctrl">
        <button type="button" class="btn btn--accent" data-t="toggle"></button>
        <button type="button" class="btn btn--line" data-t="reset" data-i18n="timer.reset"></button>
      </div>`;
    I18n.apply(el);

    const arc = el.querySelector('.timer__arc');
    const time = el.querySelector('.timer__time');
    const cap = el.querySelector('.timer__cap');
    const toggle = el.querySelector('[data-t="toggle"]');
    let total = 180000;
    let left = total;
    let endAt = 0;
    let tick = null;

    const fmt = (ms) => {
      const s = Math.ceil(ms / 1000);
      return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    };
    function paint() {
      time.textContent = fmt(left);
      arc.setAttribute('stroke-dashoffset', RING * (1 - left / total));
      el.classList.toggle('is-low', left > 0 && left <= 10000);
    }
    function pause() {
      if (!tick) return;
      clearInterval(tick);
      tick = null;
      I18n.set(toggle, 'timer.resume');
    }
    function start() {
      if (left <= 0) reset();
      endAt = Date.now() + left;
      el.classList.remove('is-done');
      I18n.set(cap, 'timer.thinking');
      I18n.set(toggle, 'timer.pause');
      tick = setInterval(() => {
        left = Math.max(0, endAt - Date.now());
        paint();
        if (left === 0) {
          clearInterval(tick);
          tick = null;
          el.classList.add('is-done');
          I18n.set(cap, 'timer.up');
          I18n.set(toggle, 'timer.again');
          window.Sound.play('timeup');
        }
      }, 200);
    }
    function reset() {
      clearInterval(tick);
      tick = null;
      left = total;
      el.classList.remove('is-done', 'is-low');
      I18n.set(cap, 'timer.thinking');
      I18n.set(toggle, 'timer.start');
      paint();
    }

    toggle.addEventListener('click', () => (tick ? pause() : start()));
    el.querySelector('[data-t="reset"]').addEventListener('click', reset);
    el.querySelectorAll('[data-min]').forEach((b) => b.addEventListener('click', () => {
      el.querySelectorAll('[data-min]').forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
      total = Number(b.dataset.min) * 60000;
      reset();
    }));
    reset();
    return { pause };
  }

  document.querySelectorAll('[data-timer]').forEach((el) => timers.set(el.closest('.slide'), buildTimer(el)));

  /* ----- Start ----- */
  window.Deck = { go, next, prev, count: slides.length, gameSlide: slides.length - 1 };
  const slideFromHash = () => {
    const n = parseInt(location.hash.slice(1), 10);
    return Number.isFinite(n) ? n - 1 : 0;
  };
  window.addEventListener('hashchange', () => go(slideFromHash()));
  go(slideFromHash());
})();
