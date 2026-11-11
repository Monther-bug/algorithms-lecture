/* Builds the page from EXAMPLES: the level ladder (also a filter), one card
   per example (problem, example run, hint, solution, trace table), the
   "solved" ticks with the progress bar, and the language switch. */
(function () {
  const { I18n } = window;
  const esc = I18n.esc;
  const EX = window.EXAMPLES;
  const LEVELS = [1, 2, 3, 4, 5];
  const KEY = 'alg-examples-solved';

  /* ----- Solved ticks (kept in this browser only) ----- */
  let solved = new Set();
  try { solved = new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch (e) { /* private mode: start empty */ }
  function saveSolved() {
    try { localStorage.setItem(KEY, JSON.stringify([...solved])); } catch (e) { /* not saved, still works this visit */ }
  }

  /* ----- Algorithm text with colours ----- */
  const KW = /\b(Start|End|Declare|Input|Print|If|if|then|else|go to step|mod|and|or)\b/g;
  function highlight(text) {
    return esc(text)
      .split(/(&quot;.*?&quot;)/)
      .map((part, i) => (i % 2
        ? `<span class="str">${part}</span>`
        : part.replace(KW, '<span class="kw">$1</span>').replace(/(^|[^\w])(-?\d+)\b/g, '$1<span class="num">$2</span>')))
      .join('');
  }
  function stepHTML(s, k) {
    const [first, ...rest] = s.t.split('\n');
    const loop = s.loop != null ? ` data-to="${s.loop}"` : '';
    return `
      <li class="alg__step${s.loop != null ? ' is-loop' : ''}" data-step="${k + 1}"${loop}>
        <span class="alg__n">${k + 1}-</span>
        <code class="alg__t">${highlight(first)}${rest.map((r) => `<span class="alg__cont">${highlight(r)}</span>`).join('')}</code>
        ${s.loop != null ? `<span class="alg__jump" aria-hidden="true">↩ ${s.loop}</span>` : ''}
      </li>`;
  }

  /* ----- Ladder (level filter) ----- */
  const ladder = document.getElementById('ladder');
  let level = 0;
  ladder.innerHTML = [0, ...LEVELS].map((n) => {
    const count = n ? EX.filter((e) => e.level === n).length : EX.length;
    return `
      <button type="button" class="step-btn lv-${n}" data-level="${n}" aria-pressed="${n === 0}">
        <span class="step-btn__top">${n ? `<span data-i18n="lvl.word" data-i18n-vars='{"n":${n}}'></span>` : '<span>★</span>'}</span>
        <span class="step-btn__name" data-i18n="${n ? `lvl.${n}` : 'lvl.all'}"></span>
        <span class="step-btn__count" data-i18n="lvl.count" data-i18n-vars='{"n":${count}}'></span>
      </button>`;
  }).join('');

  /* ----- Cards ----- */
  const list = document.getElementById('list');
  EX.forEach((ex, i) => {
    I18n.add(`ex${i}.title`, esc(ex.title[0]), ex.title[1]);
    I18n.add(`ex${i}.task`, esc(ex.task[0]), ex.task[1]);
    I18n.add(`ex${i}.hint`, esc(ex.hint[0]), ex.hint[1]);
    if (ex.note) I18n.add(`ex${i}.note`, esc(ex.note[0]), ex.note[1]);
  });

  list.innerHTML = EX.map((ex, i) => {
    const n = i + 1;
    const sample = window.runAlgorithm(ex, ex.sample.split(/\s+/).map(Number)).output;
    const shown = sample.length > 4 ? [...sample.slice(0, 3), '…'] : sample;
    return `
      <article class="ex lv-${ex.level}" id="ex-${n}" data-i="${i}" data-level="${ex.level}">
        <div class="ex__head">
          <span class="ex__num">${String(n).padStart(2, '0')}</span>
          <div class="ex__titles">
            <p class="ex__level"><span class="ex__dot" aria-hidden="true"></span><span data-i18n="lvl.word" data-i18n-vars='{"n":${ex.level}}'></span> · <span data-i18n="lvl.${ex.level}"></span></p>
            <h2 class="ex__title" data-i18n="ex${i}.title"></h2>
          </div>
          <button type="button" class="ex__done" data-done aria-pressed="false" data-i18n-label="ex.mark" data-i18n-vars='{"n":${n}}'>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg><span data-i18n="ex.solved"></span>
          </button>
        </div>
        <p class="ex__task" data-i18n="ex${i}.task"></p>
        <div class="ex__meta">
          <div class="ex__sample">
            <p class="ex__label" data-i18n="ex.example"></p>
            <div class="io">
              <div><span class="io__k" data-i18n="ex.input"></span><code class="io__v">${esc(ex.sample)}</code></div>
              <div><span class="io__k" data-i18n="ex.output"></span><code class="io__v">${shown.map(esc).join('<br>')}</code></div>
            </div>
          </div>
          <ul class="ex__skills">${ex.skills.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
        </div>
        <div class="ex__actions">
          <button type="button" class="btn btn--soft" data-toggle="hint" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.6 10.8c.6.5 1 1.2 1.1 2V16h5v-.2c.1-.8.5-1.5 1.1-2A6 6 0 0012 3z"/></svg><span data-i18n="ex.hint"></span></button>
          <button type="button" class="btn" data-toggle="sol" aria-expanded="false"><span data-i18n="ex.show"></span></button>
        </div>
        <p class="ex__hint" data-hint hidden><span data-i18n="ex${i}.hint"></span></p>
        <div class="ex__sol" data-sol hidden>
          <p class="ex__idea"><b data-i18n="ex.idea"></b> <span data-i18n="ex${i}.hint"></span></p>
          <ol class="alg">${ex.steps.map(stepHTML).join('')}</ol>
          ${ex.note ? `<p class="ex__note"><b data-i18n="ex.note"></b> <span data-i18n="ex${i}.note"></span></p>` : ''}
          <div class="trace">
            <p class="trace__title" data-i18n="tr.title"></p>
            <p class="trace__order" data-i18n="tr.order" data-i18n-vars='${esc(JSON.stringify({ order: { html: `<code>${esc(ex.order)}</code>` } }))}'></p>
            <div class="trace__form">
              <input type="text" inputmode="decimal" spellcheck="false" autocomplete="off" value="${esc(ex.sample)}" data-inputs aria-label="Input">
              <button type="button" class="btn btn--go" data-run><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg><span data-i18n="tr.run"></span></button>
              <button type="button" class="btn btn--ghost" data-sample data-i18n="tr.reset"></button>
            </div>
            <p class="trace__msg" data-msg hidden></p>
            <div class="trace__result" data-result hidden>
              <div class="trace__out"><p class="ex__label" data-i18n="tr.output"></p><pre data-out></pre></div>
              <div class="trace__wrap"><table class="ttable" data-table></table></div>
              <p class="trace__legend" data-legend data-i18n="tr.legend" hidden></p>
            </div>
          </div>
        </div>
      </article>`;
  }).join('');
  I18n.apply();

  const cards = [...list.querySelectorAll('.ex')];

  /* ----- Trace ----- */
  function trace(card) {
    const ex = EX[Number(card.dataset.i)];
    const field = card.querySelector('[data-inputs]');
    const msg = card.querySelector('[data-msg]');
    const result = card.querySelector('[data-result]');
    const raw = field.value.trim().split(/[\s,]+/).filter(Boolean);
    const values = raw.map(Number);
    msg.hidden = true;
    if (!raw.length || values.some((x) => !Number.isFinite(x))) {
      I18n.set(msg, 'tr.bad');
      msg.hidden = false;
      result.hidden = true;
      return;
    }
    const r = window.runAlgorithm(ex, values);
    if (r.missing) {
      I18n.set(msg, 'tr.missing', { name: r.missing });
      msg.hidden = false;
    } else if (r.stopped) {
      I18n.set(msg, 'tr.stopped');
      msg.hidden = false;
    } else if (r.extra > 0) {
      I18n.set(msg, 'tr.extra', { n: r.extra });
      msg.hidden = false;
    }
    const out = card.querySelector('[data-out]');
    if (r.output.length) {
      out.textContent = r.output.join('\n');
      delete out.dataset.i18n;
    } else {
      I18n.set(out, 'tr.nothing');
    }

    const table = card.querySelector('[data-table]');
    let prev = {};
    const body = r.rows.map((row) => {
      const cells = ex.vars.map((name) => {
        const val = row.vars[name];
        const changed = val !== undefined && val !== prev[name];
        return `<td class="${changed ? 'is-new' : ''}">${val === undefined ? '' : esc(window.fmtValue(val))}</td>`;
      }).join('');
      prev = row.vars;
      const jump = row.loop != null ? `<span class="tj ${row.jump ? 'tj--yes' : 'tj--no'}">${row.jump ? `↩ ${row.loop}` : '↓'}</span>` : '';
      return `<tr data-step="${row.step}"><th scope="row">${row.step}${jump}</th>${cells}<td class="tout">${row.printed != null ? esc(row.printed) : ''}</td></tr>`;
    }).join('');
    table.innerHTML = `
      <thead><tr><th scope="col" data-i18n="tr.step"></th>${ex.vars.map((v) => `<th scope="col">${esc(v)}</th>`).join('')}<th scope="col" data-i18n="tr.output"></th></tr></thead>
      <tbody>${body}</tbody>`;
    I18n.apply(table);
    card.querySelector('[data-legend]').hidden = !ex.steps.some((s) => s.loop != null);
    result.hidden = false;
  }

  // Point at the algorithm step that a trace row (or a loop line) refers to.
  function mark(card, step, cls) {
    card.querySelectorAll(`.alg__step.${cls}`).forEach((li) => li.classList.remove(cls));
    if (step) {
      const li = card.querySelector(`.alg__step[data-step="${step}"]`);
      if (li) li.classList.add(cls);
    }
  }

  list.addEventListener('click', (e) => {
    const card = e.target.closest('.ex');
    if (!card) return;
    const toggle = e.target.closest('[data-toggle]');
    if (toggle) {
      const box = card.querySelector(toggle.dataset.toggle === 'hint' ? '[data-hint]' : '[data-sol]');
      box.hidden = !box.hidden;
      toggle.setAttribute('aria-expanded', String(!box.hidden));
      if (toggle.dataset.toggle === 'sol') {
        I18n.set(toggle.querySelector('span'), box.hidden ? 'ex.show' : 'ex.hide');
        // The solution starts with the same idea as the hint, so close the hint.
        if (!box.hidden) {
          card.querySelector('[data-hint]').hidden = true;
          card.querySelector('[data-toggle="hint"]').setAttribute('aria-expanded', 'false');
        }
        if (!box.hidden && card.querySelector('[data-result]').hidden) trace(card);
      }
      return;
    }
    if (e.target.closest('[data-run]')) { trace(card); return; }
    if (e.target.closest('[data-sample]')) {
      card.querySelector('[data-inputs]').value = EX[Number(card.dataset.i)].sample;
      trace(card);
      return;
    }
    const done = e.target.closest('[data-done]');
    if (done) {
      const i = Number(card.dataset.i);
      if (solved.has(i)) solved.delete(i); else solved.add(i);
      saveSolved();
      paintSolved();
      applyFilter();
    }
  });
  list.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.matches('[data-inputs]')) { e.preventDefault(); trace(e.target.closest('.ex')); }
  });
  list.addEventListener('mouseover', (e) => {
    const card = e.target.closest('.ex');
    if (!card) return;
    const row = e.target.closest('tr[data-step]');
    mark(card, row ? row.dataset.step : null, 'is-traced');
    const loop = e.target.closest('.alg__step.is-loop');
    mark(card, loop ? loop.dataset.to : null, 'is-target');
  });

  /* ----- Progress and filters ----- */
  const hideSolved = document.getElementById('hide-solved');
  const count = document.getElementById('count');
  const empty = document.getElementById('empty');

  function paintSolved() {
    cards.forEach((card, i) => {
      const on = solved.has(i);
      card.classList.toggle('is-solved', on);
      card.querySelector('[data-done]').setAttribute('aria-pressed', String(on));
    });
    document.getElementById('progress-fill').style.width = `${(solved.size / EX.length) * 100}%`;
    I18n.set(document.getElementById('progress-text'), 'progress', { n: solved.size });
  }

  function applyFilter() {
    let shown = 0;
    cards.forEach((card, i) => {
      const ok = (!level || Number(card.dataset.level) === level) && !(hideSolved.checked && solved.has(i));
      card.hidden = !ok;
      if (ok) shown += 1;
    });
    I18n.set(count, 'count', { n: shown });
    empty.hidden = shown > 0;
  }

  ladder.addEventListener('click', (e) => {
    const b = e.target.closest('[data-level]');
    if (!b) return;
    level = Number(b.dataset.level);
    ladder.querySelectorAll('[data-level]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    applyFilter();
  });
  hideSolved.addEventListener('change', applyFilter);
  document.getElementById('lang').addEventListener('click', () => I18n.toggle());

  paintSolved();
  applyFilter();
})();
