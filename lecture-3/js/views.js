/* Shared pieces: the output canvas (graph paper the algorithm prints on),
   code blocks with loop arrows, and the drawings on the "tool" slides. */
(function () {
  const esc = window.I18n.esc;
  const KEYWORDS = /\b(Start|End|Declare|Print|print|If|then|else|go to step|New line|mod)\b/g;
  const NUMBERS = /\b(\d+)\b/g;
  const GUTTER = 112;

  /* ----- Output canvas ----- */
  const tone = (ch) => (ch === '*' ? 't-pink' : ch === '@' ? 't-blue' : /\d/.test(ch) ? 't-ink' : 't-mint');

  /* rows: the printed lines. Options: cols/rows (minimum size), cell (px),
     fit {w, h, max} to size the cells to a box, cursor (show where the next
     character goes) and fresh {r, c} (the character printed just now). */
  function render(el, rows, o = {}) {
    const last = rows.length - 1;
    const nRows = Math.max(o.rows || 0, rows.length, 1);
    const nCols = Math.max(o.cols || 0, ...rows.map((r) => r.length), o.cursor ? rows[last].length + 1 : 1, 1);
    let cell = o.cell || Number(el.dataset.cell) || 56;
    if (o.fit) cell = Math.max(18, Math.min(o.fit.max || 96, Math.floor(o.fit.w / nCols), Math.floor(o.fit.h / nRows)));
    el.style.setProperty('--cell', `${cell}px`);
    el.style.setProperty('--cols', nCols);
    let html = '';
    for (let r = 0; r < nRows; r++) {
      const line = rows[r] || '';
      for (let c = 0; c < nCols; c++) {
        const ch = line[c];
        const cls = ['cell'];
        if (ch) cls.push(tone(ch));
        if (o.cursor && r === last && c === line.length) cls.push('is-cursor');
        if (ch && o.fresh && o.fresh.r === r && o.fresh.c === c) cls.push('is-new');
        html += `<span class="${cls.join(' ')}">${ch ? esc(ch) : ''}</span>`;
      }
    }
    el.innerHTML = html;
  }

  /* ----- Code blocks ----- */
  function highlight(text) {
    return esc(text)
      .split(/("[^"]*")/)
      .map((part, i) => (i % 2
        ? `<span class="str">${part}</span>`
        : part.replace(KEYWORDS, '<span class="kw">$1</span>').replace(NUMBERS, '<span class="num">$1</span>')))
      .join('')
      .replace(/«([^»]*)»/g, '<mark>$1</mark>');
  }

  function markup(steps) {
    return `
      <ol class="code" aria-label="Algorithm">
        ${steps.map((s, i) => `
          <li class="line${s.changed ? ' is-changed' : ''}${s.removed ? ' is-removed' : ''}" data-i="${i}">
            <span class="line__n">${i + 1}</span><code class="line__code">${highlight(s.text)}</code>${s.removed
              ? '<span class="line__tag" data-i18n="code.removed">removed</span>'
              : s.changed ? '<span class="line__tag" data-i18n="code.changed">changed</span>' : ''}
          </li>`).join('')}
        <svg class="arcs" aria-hidden="true"></svg>
      </ol>`;
  }

  /* One arrow per loop, from its "go to" line back to the target line. Outer
     loops sit one lane further left; arrows landing on the same line are spread apart. */
  function drawArcs(root, steps, shown = steps.length) {
    const code = root.querySelector('.code');
    const svg = root.querySelector('.arcs');
    const lines = [...root.querySelectorAll('.line')];
    const loops = steps.map((s, i) => ({ s, i })).filter((l) => l.s.loop != null && !l.s.removed);
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
        <g class="arc arc--${l.s.lane ? 1 : 0}${shown > l.i ? ' is-shown' : ''}" data-from="${l.i}">
          <path d="M ${end - 8} ${y1} H ${x + r} Q ${x} ${y1} ${x} ${y1 - r} V ${y2 + r} Q ${x} ${y2} ${x + r} ${y2} H ${end - 14}"/>
          <path class="head" d="M ${end} ${y2} L ${end - 15} ${y2 - 8} L ${end - 15} ${y2 + 8} Z"/>
        </g>`;
    }).join('');
  }

  window.Canvas = { render, tone };
  window.Code = { markup, drawArcs, highlight };

  /* ----- Fixed drawings ----- */
  document.querySelectorAll('.canvas[data-rows]').forEach((el) => render(el, JSON.parse(el.dataset.rows)));
  document.querySelectorAll('.canvas[data-shape]').forEach((el) => render(el, window.EXAMPLES[el.dataset.shape].shape));

  // Tool 1: i mod 2 for i = 1 … 8
  const mods = document.getElementById('mods');
  mods.innerHTML = Array.from({ length: 8 }, (_, k) => {
    const i = k + 1;
    const odd = i % 2 === 1;
    return `
      <li class="mod mod--${odd ? 'odd' : 'even'}" style="--n: ${k}">
        <span class="mod__i">i = ${i}</span>
        <span class="mod__calc">${i} mod 2</span>
        <span class="mod__res">${i % 2}</span>
        <span class="mod__tag" data-i18n="${odd ? 'mod.oddShort' : 'mod.evenShort'}">${odd ? 'odd' : 'even'}</span>
      </li>`;
  }).join('');

  // Tool 2: the triangle on a grid, with i down the side and j across the top
  const grid = document.getElementById('grid-demo');
  const tri = window.EXAMPLES[3].shape;
  let html = '<span class="gd__corner"></span>';
  for (let j = 1; j <= 4; j++) html += `<span class="gd__j">j = ${j}</span>`;
  html += '<span></span>';
  tri.forEach((row, r) => {
    html += `<span class="gd__i">i = ${r + 1}</span>`;
    for (let c = 0; c < 4; c++) html += `<span class="gd__cell${row[c] ? ' is-on' : ''}" style="--n: ${r * 4 + c}">${row[c] || ''}</span>`;
    html += '<span class="gd__nl">↵ New line</span>';
  });
  grid.innerHTML = html;
})();
