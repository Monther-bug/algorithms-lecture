/* Builds the solution slides: the algorithm (revealed one step at a time)
   and the "Trace it" panel that runs it with a trace table. */
(function () {
  const KEYWORDS = /\b(Start|End|Declare|Input|Print|If|then|go to step)\b/g;
  const NUMBERS = /\b(\d+)\b/g;
  const STEP_MS = 650;

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const highlight = (text) => esc(text).replace(KEYWORDS, '<span class="kw">$1</span>').replace(NUMBERS, '<span class="num">$1</span>');
  const show = (value) => (value === undefined ? '–' : String(value));

  function build(root) {
    const id = root.dataset.example;
    const ex = window.EXAMPLES[id];

    root.innerHTML = `
      <header class="sol__head">
        <h2 class="sol__tag">Example ${id} solution</h2>
        <p class="sol__q">${esc(ex.question)}</p>
      </header>
      <div class="sol__grid">
        <div class="code-col">
          <ol class="code" aria-label="Algorithm">
            ${ex.steps.map((s, i) => `
              <li class="line" data-i="${i}">
                <span class="line__n">${i + 1}</span><code class="line__code">${highlight(s.text)}</code>
              </li>`).join('')}
            <svg class="loop-arc" aria-hidden="true"></svg>
          </ol>
          <p class="sol__hint" data-hint></p>
          ${ex.note ? `<p class="sol__note" data-note hidden>${esc(ex.note)}</p>` : ''}
        </div>
        <section class="trace" aria-label="Trace the algorithm">
          <div class="trace__head">
            <h3>Trace it</h3>
            <p>Run it one step at a time and watch the variables change.</p>
          </div>
          <div class="trace__ctrl">
            ${ex.inputs.length
              ? ex.inputs.map((f) => `
                <label class="field">${f.key} =
                  <input type="number" inputmode="numeric" step="1" min="${f.min}" max="${f.max}" value="${f.value}" data-key="${f.key}" aria-label="Value of ${f.key}">
                </label>`).join('')
              : `<p class="trace__fixed">${esc(ex.fixed)}</p>`}
            <div class="trace__btns">
              <button type="button" class="btn btn--step" data-do="step">Step</button>
              <button type="button" class="btn" data-do="run">Run</button>
              <button type="button" class="btn btn--line" data-do="reset">Reset</button>
            </div>
          </div>
          <p class="trace__err" role="alert"></p>
          <div class="vars">
            ${ex.vars.map((name) => `<span class="var" data-var="${name}">${name} <b>–</b></span>`).join('')}
          </div>
          <div class="ttable">
            <table>
              <thead><tr><th>Pass</th>${ex.table.map(([, label]) => `<th>${label}</th>`).join('')}<th>${esc(ex.check)}</th></tr></thead>
              <tbody></tbody>
            </table>
          </div>
          <div class="out"><span>Output</span><output></output></div>
        </section>
      </div>`;

    const lines = [...root.querySelectorAll('.line')];
    const hint = root.querySelector('[data-hint]');
    const note = root.querySelector('[data-note]');
    const arcSvg = root.querySelector('.loop-arc');
    const codeBox = root.querySelector('.code');
    const tableBox = root.querySelector('.ttable');
    const tbody = root.querySelector('tbody');
    const out = root.querySelector('.out');
    const outValue = out.querySelector('output');
    const err = root.querySelector('.trace__err');
    const btnStep = root.querySelector('[data-do="step"]');
    const btnRun = root.querySelector('[data-do="run"]');
    const inputs = [...root.querySelectorAll('input[data-key]')];
    const varEls = Object.fromEntries([...root.querySelectorAll('.var')].map((el) => [el.dataset.var, el]));
    const loopIndex = ex.steps.findIndex((s) => s.loop != null);

    let shown = 0;
    let frames = null;
    let k = -1;
    let timer = null;

    /* ----- Loop arrow from the "go to" line back to its target ----- */
    function drawArc() {
      if (loopIndex < 0) return;
      const from = lines[loopIndex];
      const to = lines[ex.steps[loopIndex].loop];
      const y1 = from.offsetTop + from.offsetHeight / 2;
      const y2 = to.offsetTop + to.offsetHeight / 2;
      arcSvg.setAttribute('width', 78);
      arcSvg.setAttribute('height', codeBox.offsetHeight);
      arcSvg.innerHTML = `
        <g class="${shown > loopIndex ? 'is-shown' : ''}">
          <path d="M 66 ${y1} H 30 Q 12 ${y1} 12 ${y1 - 18} V ${y2 + 18} Q 12 ${y2} 30 ${y2} H 60"/>
          <path class="head" d="M 76 ${y2} L 60 ${y2 - 9} L 60 ${y2 + 9} Z"/>
        </g>`;
    }

    /* ----- Step-by-step reveal (driven by the deck's arrow keys) ----- */
    function reveal(count) {
      shown = Math.max(0, Math.min(ex.steps.length, count));
      lines.forEach((li, i) => {
        li.classList.toggle('is-shown', i < shown);
        li.classList.toggle('is-next', i === shown);
      });
      const g = arcSvg.querySelector('g');
      if (g) g.classList.toggle('is-shown', shown > loopIndex);
      const done = shown === ex.steps.length;
      hint.textContent = done ? 'All steps shown. Use Step or Run to trace it.' : 'Press → to show the next step.';
      if (note) note.hidden = !done;
    }

    /* ----- Trace ----- */
    function readInputs() {
      const values = {};
      for (const el of inputs) {
        const f = ex.inputs.find((x) => x.key === el.dataset.key);
        const num = Number(el.value);
        if (el.value.trim() === '' || !Number.isInteger(num) || num < f.min || num > f.max) {
          err.textContent = `Enter a whole number from ${f.min} to ${f.max} for ${f.key}.`;
          el.focus();
          return null;
        }
        values[f.key] = num;
      }
      err.textContent = '';
      return values;
    }

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

      const rows = frames ? frames.slice(0, k + 1).filter((f) => f.row) : [];
      tbody.innerHTML = rows.length
        ? rows.map((f, i) => `
            <tr class="${i === rows.length - 1 && frame.row ? 'is-new' : ''}">
              <td>${f.row.pass}</td>
              ${ex.table.map(([key]) => `<td>${show(f.row[key])}</td>`).join('')}
              <td class="${f.row.check ? 'yes' : 'no'}">${f.row.check ? 'Yes, loop' : 'No, stop'}</td>
            </tr>`).join('')
        : `<tr class="ttable__empty"><td colspan="${ex.table.length + 2}">Press Step to start. A row is added each time the loop checks its condition.</td></tr>`;
      tableBox.scrollTop = tableBox.scrollHeight;

      const printed = frame && frame.vars.out !== undefined;
      const justPrinted = printed && !(prev && prev.vars.out !== undefined);
      outValue.textContent = printed ? frame.vars.out : '';
      out.classList.toggle('is-printed', justPrinted);

      if (frame && frame.jumped) {
        const g = arcSvg.querySelector('g');
        if (g) { g.classList.remove('is-jump'); void g.getBoundingClientRect(); g.classList.add('is-jump'); }
      }

      const atEnd = !!frames && k >= frames.length - 1;
      btnStep.disabled = atEnd;
      btnRun.disabled = atEnd;
      if (atEnd) stopAuto();
    }

    function prepare() {
      if (frames) return true;
      const values = readInputs();
      if (!values) return false;
      reveal(ex.steps.length);
      frames = window.runExample(ex, values);
      k = -1;
      return true;
    }

    function step() {
      if (!prepare()) return;
      if (k < frames.length - 1) { k += 1; render(); }
    }

    function stopAuto() {
      clearInterval(timer);
      timer = null;
      btnRun.textContent = 'Run';
    }

    function toggleRun() {
      if (timer) { stopAuto(); return; }
      if (!prepare()) return;
      btnRun.textContent = 'Pause';
      step();
      timer = setInterval(step, STEP_MS);
    }

    function resetTrace() {
      stopAuto();
      frames = null;
      k = -1;
      err.textContent = '';
      render();
    }

    btnStep.addEventListener('click', () => { stopAuto(); step(); });
    btnRun.addEventListener('click', toggleRun);
    root.querySelector('[data-do="reset"]').addEventListener('click', resetTrace);
    inputs.forEach((el) => el.addEventListener('input', resetTrace));

    reveal(0);
    render();
    drawArc();
    if (document.fonts) document.fonts.ready.then(drawArc);

    return {
      get total() { return ex.steps.length; },
      get shown() { return shown; },
      reveal,
      showAll() { reveal(ex.steps.length); },
      reset() { resetTrace(); reveal(0); },
      pause: stopAuto,
    };
  }

  const controllers = new Map();
  document.querySelectorAll('.sol[data-example]').forEach((root) => {
    controllers.set(root.closest('.slide'), build(root));
  });
  window.Solutions = controllers;
})();
