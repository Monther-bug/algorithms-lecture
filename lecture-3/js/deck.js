/* Slide deck: scaling, navigation, progress bar, language switch, step-by-step
   reveals, thinking timers and the cover animation. */
(function () {
  const stage = document.getElementById('stage');
  const slides = [...document.querySelectorAll('.slide')];
  const progress = document.getElementById('progress');
  const count = document.getElementById('count');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const TITLE = 'Drawing Shapes';
  let index = -1;

  /* ----- Fit the 1920 x 1080 stage to the window ----- */
  function fit() {
    const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    stage.style.setProperty('--scale', scale);
  }
  window.addEventListener('resize', fit);
  fit();

  /* ----- Slides that reveal one item per → (the memes) ----- */
  window.Steppers = window.Steppers || new Map();
  document.querySelectorAll('[data-reveal]').forEach((box) => {
    const items = [...box.querySelectorAll('[data-reveal-item]')];
    let shown = 0;
    const reveal = (n) => {
      shown = Math.max(0, Math.min(items.length, n));
      items.forEach((el, i) => el.classList.toggle('is-shown', i < shown));
    };
    window.Steppers.set(box.closest('.slide'), {
      get total() { return items.length; },
      get shown() { return shown; },
      reveal,
      showAll() { reveal(items.length); },
      reset() { reveal(0); },
      pause() {},
    });
    reveal(items.length);
  });

  /* ----- Progress bar: one segment per slide, a gap before each new part ----- */
  slides.forEach((slide, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', `Slide ${i + 1}: ${slide.dataset.title}`);
    if (slide.dataset.gap != null) b.classList.add('is-gap');
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
      const stepper = window.Steppers.get(leaving);
      if (stepper) stepper.pause();
      const t = timers.get(leaving);
      if (t) t.pause();
      const act = leaving.querySelector('.act');
      if (act && window.Activities[act.id]) window.Activities[act.id].pause();
    }

    // Arriving with "next" starts a reveal from step zero; any other way shows it whole.
    const arriving = slides[target];
    const stepper = window.Steppers.get(arriving);
    if (stepper) {
      if (how === 'next') stepper.reset();
      else if (stepper.shown === 0) stepper.showAll();
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
    const stepper = window.Steppers.get(slides[index]);
    if (stepper && stepper.shown < stepper.total) stepper.reveal(stepper.shown + 1);
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

  /* ----- Cover: Example 3 runs once and prints the triangle, star by star ----- */
  const heroCanvas = document.getElementById('hero-canvas');
  const heroLine = document.getElementById('hero-line');
  const heroI = document.getElementById('hero-i');
  const heroJ = document.getElementById('hero-j');
  const heroSteps = window.EXAMPLES[3].steps;
  const heroSize = { cell: 76, cols: 5, rows: 5 };
  window.Canvas.render(heroCanvas, window.EXAMPLES[3].shape, heroSize);
  let coverPlayed = false;

  function playCover() {
    if (coverPlayed || reduceMotion.matches) return;
    coverPlayed = true;
    const frames = window.runSteps(heroSteps);
    frames.forEach((f, n) => setTimeout(() => {
      const end = n === frames.length - 1;
      const rows = end ? window.EXAMPLES[3].shape : f.rows;
      const last = rows.length - 1;
      window.Canvas.render(heroCanvas, rows, {
        ...heroSize,
        cursor: !end,
        fresh: f.event && f.event.type === 'print' ? { r: last, c: rows[last].length - 1 } : null,
      });
      heroLine.textContent = heroSteps[f.pc].text;
      heroI.textContent = f.vars.i ?? '–';
      heroJ.textContent = f.vars.j ?? '–';
    }, 600 + n * 150));
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
