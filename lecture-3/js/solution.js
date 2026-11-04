/* Solution slides: the algorithm (revealed one step at a time) and the
   "Trace it" panel, which runs it on the output canvas with a print log. */
(function () {
  const I18n = window.I18n;
  const { Canvas, Code } = window;
  const esc = I18n.esc;
  const SPEEDS = [{ label: '1×', ms: 650 }, { label: '2×', ms: 320 }, { label: '4×', ms: 110 }];
  const show = (value) => (value === undefined ? '–' : String(value));

  window.Steppers = window.Steppers || new Map();

  function build(root) {
    const id = root.dataset.example;
    const ex = window.EXAMPLES[id];
    I18n.add(`ex${id}.note`, esc(ex.note), ex.ar && ex.ar.note);
    // The output grid is sized for the finished drawing, plus room for the cursor.
    const size = { cols: Math.max(...ex.shape.map((r) => r.length)) + 1, rows: ex.shape.length + 1 };

    root.innerHTML = `
      <header class="sol__head">
        <p class="kicker" data-i18n="sol.kicker" data-i18n-vars='{"n":${id}}'></p>
        <div class="canvas canvas--mini" data-target></div>
      </header>
      <div class="sol__grid">
        <div class="code-col">
          ${Code.markup(ex.steps)}
          <p class="sol__hint" data-hint data-i18n="trace.hint"></p>
          <p class="sol__note" data-note data-i18n="ex${id}.note" hidden></p>
        </div>
        <section class="trace" aria-label="Trace the algorithm">
          <div class="trace__head">
            <h3 data-i18n="trace.title"></h3>
            <div class="speed" role="group" data-i18n-label="trace.speed">
              ${SPEEDS.map((s, i) => `<button type="button" data-speed="${i}" aria-pressed="${i === 1}">${s.label}</button>`).join('')}
            </div>
            <div class="trace__btns">
              <button type="button" class="btn btn--accent" data-do="step" data-i18n="trace.step"></button>
              <button type="button" class="btn" data-do="run" data-i18n="trace.run"></button>
              <button type="button" class="btn btn--line" data-do="reset" data-i18n="trace.reset"></button>
            </div>
          </div>
          <div class="vars">
            ${ex.vars.map((name) => `<span class="var" data-var="${name}">${name} <b>–</b></span>`).join('')}
          </div>
          <div class="trace__out">
            <p class="trace__label">Output</p>
            <div class="paper paper--trace"><div class="canvas" data-out></div></div>
          </div>
          <div class="trace__log">
            <p class="trace__label" data-i18n="trace.log"></p>
            <div class="ttable">
              <table>
                <thead><tr><th>#</th>${ex.log.map(([label]) => `<th>${esc(label)}</th>`).join('')}<th data-i18n="trace.prints"></th></tr></thead>
                <tbody></tbody>
              </table>
            </div>
          </div>
        </section>
      </div>`;
    I18n.apply(root);
    Canvas.render(root.querySelector('[data-target]'), ex.shape, { cell: 24 });

    const lines = [...root.querySelectorAll('.line')];
    const hint = root.querySelector('[data-hint]');
    const note = root.querySelector('[data-note]');
    const outEl = root.querySelector('[data-out]');
    const outBox = root.querySelector('.paper--trace');
    const tableBox = root.querySelector('.ttable');
    const tbody = root.querySelector('tbody');
    const btnStep = root.querySelector('[data-do="step"]');
    const btnRun = root.querySelector('[data-do="run"]');
    const varEls = Object.fromEntries([...root.querySelectorAll('.var')].map((el) => [el.dataset.var, el]));
    const speedBtns = [...root.querySelectorAll('[data-speed]')];

    let shown = 0;
    let frames = null;
    let k = -1;
    let timer = null;
    let speed = 1;

    function paintArcs() {
      root.querySelectorAll('.arc').forEach((g) => g.classList.toggle('is-shown', shown > Number(g.dataset.from)));
    }

    /* ----- Step-by-step reveal (driven by the deck's arrow keys) ----- */
    function reveal(count) {
      shown = Math.max(0, Math.min(ex.steps.length, count));
      lines.forEach((li, i) => {
        li.classList.toggle('is-shown', i < shown);
        li.classList.toggle('is-next', i === shown);
      });
      paintArcs();
      // Once every step is on screen, the note about the idea takes the hint's place.
      const done = shown === ex.steps.length;
      hint.hidden = done;
      note.hidden = !done;
    }

    /* ----- Trace ----- */
    const cell = (value) => (typeof value === 'boolean' ? I18n.t(value ? 'trace.yes' : 'trace.no') : esc(show(value)));

    function render() {
      const frame = frames && frames[k];
      const prev = frames && frames[k - 1];
      lines.forEach((li, i) => li.classList.toggle('is-current', !!frame && frame.pc === i));

      for (const name of ex.vars) {
        const now = frame ? frame.vars[name] : undefined;
        const before = prev ? prev.vars[name] : undefined;
        varEls[name].querySelector('b').textContent = show(now);
        varEls[name].classList.toggle('is-changed', !!frame && now !== before);
      }

      const rows = frame ? frame.rows : [''];
      const printed = frame && frame.event && frame.event.type === 'print';
      const last = rows.length - 1;
      Canvas.render(outEl, rows, {
        ...size,
        cursor: !frames || k < frames.length - 1,
        fresh: printed ? { r: last, c: rows[last].length - 1 } : null,
        fit: { w: outBox.clientWidth - 48, h: outBox.clientHeight - 40, max: 64 },
      });

      const events = frames ? frames.slice(0, k + 1).filter((f) => f.event) : [];
      tbody.innerHTML = events.length
        ? events.map((f, n) => {
          const isNew = n === events.length - 1 && frame.event ? ' is-new' : '';
          if (f.event.type === 'nl') return `<tr class="is-nl${isNew}"><td>${n + 1}</td><td colspan="${ex.log.length + 1}">↵ New line</td></tr>`;
          const ch = f.event.ch;
          return `<tr class="${isNew}"><td>${n + 1}</td>${f.event.cols.map((c) => `<td>${cell(c)}</td>`).join('')}<td><span class="chip ${Canvas.tone(ch)}">${esc(ch)}</span></td></tr>`;
        }).join('')
        : `<tr class="ttable__empty"><td colspan="${ex.log.length + 2}">${I18n.t('trace.empty')}</td></tr>`;
      tableBox.scrollTop = tableBox.scrollHeight;

      if (frame && frame.jumped) {
        const g = root.querySelector(`.arc[data-from="${frame.pc}"]`);
        if (g) { g.classList.remove('is-jump'); void g.getBoundingClientRect(); g.classList.add('is-jump'); }
      }

      const atEnd = !!frames && k >= frames.length - 1;
      btnStep.disabled = atEnd;
      btnRun.disabled = atEnd;
      if (atEnd) stopAuto();
    }

    function prepare() {
      if (frames) return;
      reveal(ex.steps.length);
      frames = window.runSteps(ex.steps, ex.log);
      k = -1;
    }

    function step() {
      prepare();
      if (k < frames.length - 1) { k += 1; render(); }
    }

    function stopAuto() {
      clearInterval(timer);
      timer = null;
      I18n.set(btnRun, 'trace.run');
    }

    function startAuto() {
      clearInterval(timer);
      timer = setInterval(step, SPEEDS[speed].ms);
    }

    function toggleRun() {
      if (timer) { stopAuto(); return; }
      prepare();
      I18n.set(btnRun, 'trace.pause');
      step();
      startAuto();
    }

    function resetTrace() {
      stopAuto();
      frames = null;
      k = -1;
      render();
    }

    btnStep.addEventListener('click', () => { stopAuto(); step(); });
    btnRun.addEventListener('click', toggleRun);
    root.querySelector('[data-do="reset"]').addEventListener('click', resetTrace);
    speedBtns.forEach((b) => b.addEventListener('click', () => {
      speed = Number(b.dataset.speed);
      speedBtns.forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
      if (timer) startAuto();
    }));

    const draw = () => { Code.drawArcs(root, ex.steps, shown); render(); };
    reveal(0);
    draw();
    if (document.fonts) document.fonts.ready.then(draw);

    return {
      get total() { return ex.steps.length; },
      get shown() { return shown; },
      reveal,
      showAll() { reveal(ex.steps.length); },
      reset() { resetTrace(); reveal(0); },
      pause: stopAuto,
      // Re-measure when the slide becomes visible, and after a language switch.
      refresh: draw,
    };
  }

  document.querySelectorAll('.sol[data-example]').forEach((root) => {
    window.Steppers.set(root.closest('.slide'), build(root));
  });
  I18n.onChange(() => window.Steppers.forEach((c) => c.refresh && c.refresh()));
})();
