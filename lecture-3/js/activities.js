/* The three class activities after the examples:
   1. Predict: one line of an example is changed; the class guesses, then it draws.
   2. Your turn: students write the algorithm for a shape, then reveal the solution.
   3. Pattern Lab: change the shape, size and characters and watch both update. */
(function () {
  const I18n = window.I18n;
  const { Canvas, Code } = window;
  const esc = I18n.esc;
  const DRAW_MS = 170;

  /* Plays only the steps that print or start a new line, so a drawing appears
     character by character. The grid grows as it draws, so its size gives
     nothing away before the answer. Returns a function that stops it. */
  function animate(canvas, box, steps, done) {
    const events = window.runSteps(steps).filter((f) => f.event);
    const final = window.drawShape(steps);
    const fit = { w: box.clientWidth - 64, h: box.clientHeight - 56, max: 72 };
    const cell = Math.max(18, Math.min(fit.max, Math.floor(fit.w / (Math.max(...final.map((r) => r.length)) + 1)), Math.floor(fit.h / (final.length + 1))));
    let n = 0;
    Canvas.render(canvas, [''], { cell, cursor: true });
    const timer = setInterval(() => {
      const f = events[n];
      const rows = f.rows;
      const last = rows.length - 1;
      n += 1;
      const end = n >= events.length;
      Canvas.render(canvas, end ? final : rows, {
        cell,
        cursor: !end,
        fresh: f.event.type === 'print' ? { r: last, c: rows[last].length - 1 } : null,
      });
      if (f.event.type === 'print') window.Sound.play('select');
      if (end) { clearInterval(timer); if (done) done(); }
    }, DRAW_MS);
    return () => clearInterval(timer);
  }

  const codeInto = (box, steps) => {
    box.innerHTML = Code.markup(steps);
    I18n.apply(box);
    Code.drawArcs(box, steps);
  };

  /* ----- 1. Predict ----- */
  (function () {
    const root = document.getElementById('predict');
    const rounds = root.querySelector('.rounds');
    const from = root.querySelector('[data-from]');
    const code = root.querySelector('[data-code]');
    const canvas = root.querySelector('[data-canvas]');
    const paper = root.querySelector('.paper');
    const q = root.querySelector('[data-q]');
    const why = root.querySelector('[data-why]');
    const drawBtn = root.querySelector('[data-draw]');
    let round = 0;
    let stop = null;

    window.PREDICT.forEach((p, i) => I18n.add(`p.why${i}`, esc(p.why), p.ar && p.ar.why));
    rounds.innerHTML = window.PREDICT.map((_, i) => `<button type="button" data-round="${i}" aria-pressed="${i === 0}">${i + 1}</button>`).join('');

    function clear() {
      if (stop) stop();
      stop = null;
      canvas.innerHTML = '';
      q.hidden = false;
      why.hidden = true;
      drawBtn.disabled = false;
    }
    function show(i) {
      round = i;
      rounds.querySelectorAll('button').forEach((b, k) => b.setAttribute('aria-pressed', k === i ? 'true' : 'false'));
      const p = window.PREDICT[i];
      I18n.set(from, 'p.from', { n: { html: String(p.base) } });
      I18n.set(why, `p.why${i}`);
      codeInto(code, p.steps);
      clear();
    }
    function draw() {
      clear();
      q.hidden = true;
      drawBtn.disabled = true;
      stop = animate(canvas, paper, window.PREDICT[round].steps, () => {
        why.hidden = false;
        drawBtn.disabled = false;
      });
    }

    rounds.addEventListener('click', (e) => {
      const b = e.target.closest('[data-round]');
      if (b) show(Number(b.dataset.round));
    });
    drawBtn.addEventListener('click', draw);
    root.querySelector('[data-clear]').addEventListener('click', clear);
    show(0);
    window.Activities = { predict: { refresh: () => Code.drawArcs(code, window.PREDICT[round].steps), pause: clear } };
  })();

  /* ----- 2. Your turn ----- */
  (function () {
    const root = document.getElementById('yourturn');
    const picks = root.querySelector('[data-picks]');
    const canvas = root.querySelector('[data-canvas]');
    const paper = root.querySelector('.paper');
    const code = root.querySelector('[data-code]');
    const wait = root.querySelector('[data-wait]');
    const showBtn = root.querySelector('[data-show]');
    const runBtn = root.querySelector('[data-run]');
    let pick = 0;
    let open = false;
    let stop = null;

    picks.innerHTML = window.CHALLENGES.map((c, i) => `
      <button type="button" class="pick" data-pick="${i}" aria-pressed="${i === 0}">
        <span class="pick__level pick__level--${c.level}" data-i18n="y.${c.level}"></span>
        <span class="canvas" data-mini="${i}"></span>
      </button>`).join('');
    I18n.apply(picks);
    picks.querySelectorAll('[data-mini]').forEach((el) => Canvas.render(el, window.CHALLENGES[el.dataset.mini].shape, { cell: 30 }));

    const target = () => window.CHALLENGES[pick].shape;
    const fit = () => ({ w: paper.clientWidth - 64, h: paper.clientHeight - 56, max: 72 });
    function drawTarget() {
      if (stop) stop();
      stop = null;
      Canvas.render(canvas, target(), { fit: fit() });
    }
    function setOpen(next) {
      open = next;
      code.hidden = !open;
      wait.hidden = open;
      runBtn.hidden = !open;
      I18n.set(showBtn, open ? 'y.hide' : 'y.show');
      if (open) codeInto(code, window.CHALLENGES[pick].steps);
      drawTarget();
    }
    function choose(i) {
      pick = i;
      picks.querySelectorAll('[data-pick]').forEach((b, k) => b.setAttribute('aria-pressed', k === i ? 'true' : 'false'));
      setOpen(false);
    }

    picks.addEventListener('click', (e) => {
      const b = e.target.closest('[data-pick]');
      if (b) choose(Number(b.dataset.pick));
    });
    showBtn.addEventListener('click', () => setOpen(!open));
    runBtn.addEventListener('click', () => {
      if (stop) stop();
      runBtn.disabled = true;
      stop = animate(canvas, paper, window.CHALLENGES[pick].steps, () => { runBtn.disabled = false; });
    });
    choose(0);
    window.Activities.yourturn = {
      refresh: () => { if (open) Code.drawArcs(code, window.CHALLENGES[pick].steps); drawTarget(); },
      pause: () => { if (stop) stop(); runBtn.disabled = false; },
    };
  })();

  /* ----- 3. Pattern Lab ----- */
  (function () {
    const root = document.getElementById('lab');
    const CHARS = ['*', '@', '#', '+', 'o', '5', 'x'];
    const SHAPES = {
      row: { max: 14, a: 'l.odd', b: 'l.even', n: 'l.length' },
      triangle: { max: 8, a: 'l.char', b: null, n: 'l.rows' },
      stairs: { max: 8, a: 'l.fill', b: 'l.end', n: 'l.rows' },
    };
    const state = { shape: 'row', n: 7, a: '*', b: '@' };
    const shapes = root.querySelector('[data-shapes]');
    const nValue = root.querySelector('[data-n-value]');
    const code = root.querySelector('[data-code]');
    const canvas = root.querySelector('[data-canvas]');
    const paper = root.querySelector('.paper');
    const charBoxes = { a: root.querySelector('[data-chars="a"]'), b: root.querySelector('[data-chars="b"]') };

    shapes.innerHTML = Object.keys(SHAPES).map((s) =>
      `<button type="button" role="radio" data-shape-pick="${s}" data-i18n="l.${s}"></button>`).join('');
    Object.entries(charBoxes).forEach(([which, box]) => {
      box.innerHTML = CHARS.map((c) => `<button type="button" role="radio" class="${Canvas.tone(c)}" data-char="${c}" aria-label="${esc(c)}">${esc(c)}</button>`).join('');
      box.addEventListener('click', (e) => {
        const b = e.target.closest('[data-char]');
        if (b) { state[which] = b.dataset.char; update(); }
      });
    });
    I18n.apply(shapes);

    function update() {
      const cfg = SHAPES[state.shape];
      state.n = Math.min(cfg.max, Math.max(1, state.n));
      shapes.querySelectorAll('[data-shape-pick]').forEach((b) => b.setAttribute('aria-checked', b.dataset.shapePick === state.shape ? 'true' : 'false'));
      Object.entries(charBoxes).forEach(([which, box]) => box.querySelectorAll('[data-char]').forEach((b) =>
        b.setAttribute('aria-checked', b.dataset.char === state[which] ? 'true' : 'false')));
      nValue.textContent = state.n;
      I18n.set(root.querySelector('[data-n-label]'), cfg.n);
      I18n.set(root.querySelector('[data-a-label]'), cfg.a);
      root.querySelector('[data-ctl-b]').hidden = !cfg.b;
      if (cfg.b) I18n.set(root.querySelector('[data-b-label]'), cfg.b);
      const steps = window.laneSteps(window.LAB[state.shape](state));
      codeInto(code, steps);
      Canvas.render(canvas, window.drawShape(steps), { fit: { w: paper.clientWidth - 64, h: paper.clientHeight - 56, max: 84 } });
    }

    shapes.addEventListener('click', (e) => {
      const b = e.target.closest('[data-shape-pick]');
      if (!b) return;
      state.shape = b.dataset.shapePick;
      if (state.shape === 'row') { state.n = 7; state.a = '*'; state.b = '@'; }
      if (state.shape === 'triangle') { state.n = 4; state.a = '*'; }
      if (state.shape === 'stairs') { state.n = 4; state.a = '*'; state.b = '5'; }
      update();
    });
    root.querySelectorAll('[data-n]').forEach((b) => b.addEventListener('click', () => { state.n += Number(b.dataset.n); update(); }));
    update();
    window.Activities.lab = { refresh: update, pause() {} };
  })();

  // Arrows depend on line positions, which change with fonts and language.
  const refreshAll = () => Object.values(window.Activities).forEach((a) => a.refresh());
  if (document.fonts) document.fonts.ready.then(refreshAll);
  I18n.onChange(refreshAll);
})();
