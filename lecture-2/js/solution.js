/* Builds the code blocks (with loop arrows), the solution slides (steps
   revealed one at a time) and the "Trace it" panel with its trace table. */
(function () {
  const KEYWORDS = /\b(Start|End|Declare|Input|Print|If|then|go to step)\b/g;
  const NUMBERS = /\b(\d+)\b/g;
  const SPEEDS = [{ label: '1×', ms: 700 }, { label: '2×', ms: 340 }, { label: '4×', ms: 120 }];
  const GUTTER = 112;

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const highlight = (text) => esc(text).replace(KEYWORDS, '<span class="kw">$1</span>').replace(NUMBERS, '<span class="num">$1</span>');
  const fmt = window.fmt;

  /* ----- Code block with one line per step ----- */
  function codeMarkup(ex) {
    return `
      <ol class="code" aria-label="Algorithm">
        ${ex.steps.map((s, i) => `
          <li class="line" data-i="${i}"${s.lane != null ? ` data-lane="${s.lane}"` : ''}>
            <span class="line__n">${i + 1}</span><code class="line__code">${highlight(s.text)}</code>
          </li>`).join('')}
        <svg class="arcs" aria-hidden="true"></svg>
      </ol>`;
  }

  /* One arrow per loop, from its "go to" line back to the target line.
     Outer loops sit one lane further left; arrows that land on the same
     line are spread apart so both heads stay visible. */
  function drawArcs(root, ex) {
    const code = root.querySelector('.code');
    const svg = root.querySelector('.arcs');
    const lines = [...root.querySelectorAll('.line')];
    const loops = ex.steps.map((s, i) => ({ s, i })).filter((l) => l.s.loop != null);
    const sameTarget = (l) => loops.filter((m) => m.s.loop === l.s.loop);
    svg.setAttribute('width', GUTTER);
    svg.setAttribute('height', code.offsetHeight);
    svg.innerHTML = loops.map((l) => {
      const from = lines[l.i];
      const to = lines[l.s.loop];
      const group = sameTarget(l);
      const spread = group.length > 1 ? (group.indexOf(l) - (group.length - 1) / 2) * -14 : 0;
      const y1 = from.offsetTop + from.offsetHeight / 2;
      const y2 = to.offsetTop + to.offsetHeight / 2 + spread;
      const x = l.s.lane ? 22 : 54;
      const end = GUTTER - 6;
      const r = 14;
      return `
        <g class="arc arc--${l.s.lane ? 1 : 0}" data-from="${l.i}">
          <path d="M ${end - 8} ${y1} H ${x + r} Q ${x} ${y1} ${x} ${y1 - r} V ${y2 + r} Q ${x} ${y2} ${x + r} ${y2} H ${end - 14}"/>
          <path class="head" d="M ${end} ${y2} L ${end - 15} ${y2 - 8} L ${end - 15} ${y2 + 8} Z"/>
        </g>`;
    }).join('');
  }

  /* Formulas are written once in examples.js and shown on both slides. */
  document.querySelectorAll('[data-formula]').forEach((el) => {
    el.innerHTML = window.EXAMPLES[el.dataset.formula].formula;
  });

  /* ----- Solution slides ----- */
  function build(root) {
    const id = root.dataset.example;
    const ex = window.EXAMPLES[id];

    root.innerHTML = `
      <header class="sol__head">
        <p class="kicker">Example ${id} <span>· Solution</span></p>
        <h2 class="sol__formula">${ex.formula}</h2>
      </header>
      <div class="sol__grid">
        <div class="code-col">
          ${codeMarkup(ex)}
          <p class="sol__hint" data-hint>Press → to show the next step.</p>
          <p class="sol__note" data-note hidden>${esc(ex.note)}</p>
        </div>
        <section class="trace" aria-label="Trace the algorithm">
          <div class="trace__head">
            <h3>Trace it</h3>
            <div class="speed" role="group" aria-label="Run speed">
              ${SPEEDS.map((s, i) => `<button type="button" data-speed="${i}" aria-pressed="${i === 1}">${s.label}</button>`).join('')}
            </div>
          </div>
          <div class="trace__ctrl">
            ${ex.inputs.length
              ? ex.inputs.map((f) => `
                <label class="field">${f.key} =
                  <input type="number" inputmode="numeric" step="1" min="${f.min}" max="${f.max}" value="${f.value}" data-key="${f.key}" aria-label="Value of ${f.key}">
                </label>`).join('')
              : `<p class="trace__fixed">${esc(ex.fixed)}</p>`}
            <div class="trace__btns">
              <button type="button" class="btn btn--accent" data-do="step">Step</button>
              <button type="button" class="btn" data-do="run">Run</button>
              <button type="button" class="btn btn--line" data-do="reset">Reset</button>
            </div>
          </div>
          <p class="trace__err" role="alert"></p>
          <div class="vars">
            ${ex.vars.map((name) => `<span class="var" data-var="${name}">${name} <b>–</b></span>`).join('')}
          </div>
          <div class="terms" aria-label="Terms of the series">
            <span class="terms__label">Terms</span>
            ${ex.terms.map((t, i) => `<span class="term" data-term="${i}"><span class="term__name">${esc(t)}</span><b></b></span>`).join('<span class="terms__plus" aria-hidden="true">+</span>')}
          </div>
          <div class="ttable">
            <table>
              <thead><tr><th>#</th>${ex.table.map((key) => `<th>${key}</th>`).join('')}<th>Check</th></tr></thead>
              <tbody></tbody>
            </table>
          </div>
          <div class="out"><span>Output</span><output></output></div>
        </section>
      </div>`;

    const lines = [...root.querySelectorAll('.line')];
    const hint = root.querySelector('[data-hint]');
    const note = root.querySelector('[data-note]');
    const tableBox = root.querySelector('.ttable');
    const tbody = root.querySelector('tbody');
    const out = root.querySelector('.out');
    const outValue = out.querySelector('output');
    const err = root.querySelector('.trace__err');
    const btnStep = root.querySelector('[data-do="step"]');
    const btnRun = root.querySelector('[data-do="run"]');
    const inputs = [...root.querySelectorAll('input[data-key]')];
    const varEls = Object.fromEntries([...root.querySelectorAll('.var')].map((el) => [el.dataset.var, el]));
    const termEls = [...root.querySelectorAll('.term')];
    const speedBtns = [...root.querySelectorAll('[data-speed]')];

    let shown = 0;
    let frames = null;
    let k = -1;
    let timer = null;
    let speed = 1;

    const arcs = () => [...root.querySelectorAll('.arc')];
    function paintArcs() {
      arcs().forEach((g) => g.classList.toggle('is-shown', shown > Number(g.dataset.from)));
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
        varEls[name].querySelector('b').textContent = fmt(now);
        varEls[name].classList.toggle('is-changed', !!frame && now !== before);
      }

      const past = frames ? frames.slice(0, k + 1) : [];
      const found = past.filter((f) => f.term).map((f) => f.term);
      termEls.forEach((el, i) => {
        const t = found.find((x) => x.index === i);
        el.classList.toggle('is-done', !!t);
        el.classList.toggle('is-new', !!t && !!frame.term && frame.term.index === i);
        el.querySelector('b').textContent = t ? `= ${fmt(t.value)}` : '';
      });

      const rows = past.filter((f) => f.row);
      tbody.innerHTML = rows.length
        ? rows.map((f, i) => `
            <tr class="lane-${f.row.lane ? 1 : 0}${i === rows.length - 1 && frame.row ? ' is-new' : ''}">
              <td>${f.row.n}</td>
              ${ex.table.map((key) => `<td>${fmt(f.row[key])}</td>`).join('')}
              <td class="chk"><span>${esc(f.row.check)}</span> <b class="${f.row.again ? 'yes' : 'no'}">${f.row.again ? 'yes' : 'no'}</b></td>
            </tr>`).join('')
        : `<tr class="ttable__empty"><td colspan="${ex.table.length + 2}">Press Step to start. A row is added every time a loop checks its condition.</td></tr>`;
      tableBox.scrollTop = tableBox.scrollHeight;

      const printed = frame && frame.vars.out !== undefined;
      const justPrinted = printed && !(prev && prev.vars.out !== undefined);
      outValue.textContent = printed ? fmt(frame.vars.out) : '';
      out.classList.toggle('is-printed', justPrinted);

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

    function startAuto() {
      clearInterval(timer);
      timer = setInterval(step, SPEEDS[speed].ms);
    }

    function toggleRun() {
      if (timer) { stopAuto(); return; }
      if (!prepare()) return;
      btnRun.textContent = 'Pause';
      step();
      startAuto();
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
    speedBtns.forEach((b) => b.addEventListener('click', () => {
      speed = Number(b.dataset.speed);
      speedBtns.forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
      if (timer) startAuto();
    }));

    const draw = () => { drawArcs(root, ex); paintArcs(); };
    reveal(0);
    render();
    draw();
    if (document.fonts) document.fonts.ready.then(draw);

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
