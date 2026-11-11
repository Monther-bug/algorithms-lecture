/* The practice page as a slide deck.
   Slides: cover, levels, rules, then for every level a level slide followed
   by two slides per example (the problem, then its solution), and an end
   slide. The solution slide shows the algorithm explained line by line, the
   "Watch it run" player (every step explained with the real numbers) and the
   trace table. Also: the bottom bar, the "All examples" list, the thinking
   timer, the "solved" ticks and the language switch. */
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
  const TIMER_MIN = [3, 5, 10];
  const pad = (n) => String(n).padStart(2, '0');

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
    table: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 10v10"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    run: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/></svg>',
    reset: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 108-8 8 8 0 00-6 2.7M4 4v4h4"/></svg>',
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

  /* ----- Building the level and example slides ----- */
  const slidesEl = document.getElementById('slides');
  const levelLine = (lv) => `<span data-i18n="lvl.word" data-i18n-vars='{"n":${lv}}'></span><span aria-hidden="true">·</span><span data-i18n="lvl.${lv}"></span>`;
  const doneBtn = (i) => `<button type="button" class="ex__done" data-done data-i="${i}" aria-pressed="false" data-i18n-label="ex.mark" data-i18n-vars='{"n":${i + 1}}'>${ICON.check}<span data-i18n="ex.solved"></span></button>`;
  const pick = (i) => `<button type="button" class="pick lv-${EX[i].level}" data-go-slide="s-ex-${i + 1}" data-i="${i}"><span class="pick__num">${pad(i + 1)}</span><span class="pick__title" data-i18n="ex${i}.title"></span><span class="pick__tick" aria-hidden="true">${ICON.check}</span></button>`;
  function sampleOutput(ex) {
    const out = window.runAlgorithm(ex, ex.sample.split(/\s+/).map(Number)).output;
    return out.length > 5 ? [...out.slice(0, 3), '…'] : out;
  }

  function levelSlide(lv) {
    const list = EX.map((e, i) => i).filter((i) => EX[i].level === lv);
    return `
      <section class="slide slide--level lv-${lv}" id="s-level-${lv}" data-section="${lv}">
        <div class="slide__in lvl">
          <div class="lvl__head">
            <div class="lvl__stairs" aria-hidden="true">${LEVELS.map((n) => `<span class="lv-${n}${n === lv ? ' is-on' : ''}${n < lv ? ' is-past' : ''}" style="--k:${n}"></span>`).join('')}</div>
            <p class="kicker kicker--lv"><span class="kicker__dot" aria-hidden="true"></span><span data-i18n="lvl.of" data-i18n-vars='{"n":${lv},"total":${LEVELS.length}}'></span></p>
            <h2 class="h2 lvl__title" data-i18n="lvl.${lv}"></h2>
            <p class="lead" data-i18n="lvl.d${lv}"></p>
          </div>
          <ol class="lvl__list">${list.map((i) => `<li>${pick(i)}</li>`).join('')}</ol>
        </div>
      </section>`;
  }

  function problemSlide(i) {
    const ex = EX[i];
    return `
      <section class="slide slide--q lv-${ex.level}" id="s-ex-${i + 1}" data-i="${i}" data-kind="q" data-section="${ex.level}">
        <div class="slide__in q">
          <div class="q__top">
            <p class="ex__level">${levelLine(ex.level)}</p>
            ${doneBtn(i)}
          </div>
          <div class="q__head">
            <span class="ex__num">${pad(i + 1)}</span>
            <h2 class="q__title" data-i18n="ex${i}.title"></h2>
          </div>
          <p class="q__task" data-i18n="ex${i}.task"></p>
          <div class="ex__example">
            <div class="ex__io"><span class="ex__label" data-i18n="ex.input"></span><code>${esc(ex.sample)}</code></div>
            <span class="ex__arrow" aria-hidden="true">${ICON.arrow}</span>
            <div class="ex__io"><span class="ex__label" data-i18n="ex.output"></span><pre>${sampleOutput(ex).map(esc).join('\n')}</pre></div>
          </div>
          <ul class="ex__skills">${ex.skills.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
          <div class="q__actions">
            <button type="button" class="btn btn--soft" data-hint aria-expanded="false">${ICON.bulb}<span data-i18n="ex.hint"></span></button>
            <div class="timer" data-timer>
              <span class="timer__icon">${ICON.clock}</span>
              <span class="timer__time" data-time role="timer">5:00</span>
              <button type="button" class="timer__btn" data-t="toggle" data-i18n-label="timer.start" aria-pressed="false">${ICON.play}</button>
              <button type="button" class="timer__btn" data-t="reset" data-i18n-label="timer.reset">${ICON.reset}</button>
              <span class="timer__mins" role="group" data-i18n-label="timer.length">${TIMER_MIN.map((m) => `<button type="button" class="timer__min" data-min="${m}" aria-pressed="${m === 5}" data-i18n="timer.m" data-i18n-vars='{"n":${m}}'></button>`).join('')}</span>
            </div>
            <button type="button" class="btn btn--main q__go" data-act="next"><span data-i18n="q.solution"></span>${ICON.arrow}</button>
          </div>
          <p class="ex__hint" data-hint-box hidden>${ICON.bulb}<span data-i18n="ex${i}.hint"></span></p>
        </div>
      </section>`;
  }

  function solutionSlide(i) {
    const ex = EX[i];
    return `
      <section class="slide slide--sol lv-${ex.level}" id="s-ex-${i + 1}-solution" data-i="${i}" data-kind="sol" data-section="${ex.level}">
        <div class="slide__in sol">
          <header class="sol__head">
            <span class="ex__num">${pad(i + 1)}</span>
            <div class="sol__titles">
              <p class="ex__level"><span data-i18n="sol.title"></span><span aria-hidden="true">·</span>${levelLine(ex.level)}</p>
              <h2 class="sol__title" data-i18n="ex${i}.title"></h2>
            </div>
            ${doneBtn(i)}
          </header>
          <div data-sol-body></div>
        </div>
      </section>`;
  }

  let built = '';
  LEVELS.forEach((lv) => {
    built += levelSlide(lv);
    EX.forEach((ex, i) => { if (ex.level === lv) built += problemSlide(i) + solutionSlide(i); });
  });
  document.getElementById('s-end').insertAdjacentHTML('beforebegin', built);

  // Levels slide: the stairs jump to a level.
  document.getElementById('ladder').innerHTML = LEVELS.map((n) => {
    const count = EX.filter((e) => e.level === n).length;
    return `
      <button type="button" class="stair lv-${n}" data-go-slide="s-level-${n}" style="--k:${n}">
        <span class="stair__bar"><span class="stair__num">${n}</span></span>
        <span class="stair__name" data-i18n="lvl.${n}"></span>
        <span class="stair__count" data-i18n="lvl.count" data-i18n-vars='{"n":${count}}'></span>
      </button>`;
  }).join('');

  // The "All examples" list.
  document.getElementById('menu-body').innerHTML = `
    <div class="menu__start">
      <button type="button" class="chip" data-go-slide="s-start" data-i18n="menu.start"></button>
      <button type="button" class="chip" data-go-slide="s-levels" data-i18n="levels.title"></button>
      <button type="button" class="chip" data-go-slide="s-rules" data-i18n="rules.title"></button>
    </div>
    ${LEVELS.map((lv) => `
      <section class="menu__level lv-${lv}">
        <button type="button" class="menu__lvl" data-go-slide="s-level-${lv}"><span class="menu__lvn">${lv}</span><span data-i18n="lvl.${lv}"></span><span class="menu__count" data-level-count="${lv}"></span></button>
        <div class="menu__picks">${EX.map((e, i) => i).filter((i) => EX[i].level === lv).map(pick).join('')}</div>
      </section>`).join('')}`;

  /* ----- The solution, built the first time its slide is shown ----- */
  function buildSolution(slide) {
    const i = Number(slide.dataset.i);
    const ex = EX[i];
    const body = slide.querySelector('[data-sol-body]');
    const loops = ex.steps.some((s) => s.loop != null);
    body.className = 'sol__body';
    body.innerHTML = `
      <p class="sol__idea">${ICON.bulb}<span><b data-i18n="ex.idea"></b> <span data-i18n="ex${i}.hint"></span></span></p>
      <div class="sol__grid">
        <section class="panel sol__alg">
          <div class="panel__head">
            <h3 class="panel__title">${ICON.list}<span data-i18n="sol.alg"></span></h3>
            <label class="switch"><input type="checkbox" data-why checked><span class="switch__ui" aria-hidden="true"></span><span data-i18n="sol.why"></span></label>
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

        <section class="panel sol__side">
          <div class="run__form">
            <label class="run__label" for="in-${i}" data-i18n="run.input"></label>
            <input id="in-${i}" type="text" inputmode="decimal" spellcheck="false" autocomplete="off" value="${esc(ex.sample)}" data-inputs>
            <button type="button" class="btn btn--main btn--sm" data-run><span data-i18n="run.go"></span></button>
            <button type="button" class="btn btn--ghost btn--sm" data-sample data-i18n="run.sample"></button>
          </div>
          <p class="run__order" data-i18n="run.order" data-i18n-vars='${esc(JSON.stringify({ order: { html: `<code>${esc(ex.order)}</code>` } }))}'></p>
          <p class="run__msg" data-msg hidden></p>
          <div class="tabs" role="tablist">
            <button type="button" role="tab" class="tab" data-tab="run" aria-selected="true">${ICON.run}<span data-i18n="sol.run"></span></button>
            <button type="button" role="tab" class="tab" data-tab="trace" aria-selected="false">${ICON.table}<span data-i18n="tr.title"></span></button>
          </div>

          <div class="tabpanel run__player" data-panel="run" data-player role="tabpanel">
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

          <div class="tabpanel trace" data-panel="trace" role="tabpanel" hidden>
            <p class="trace__sub" data-i18n="tr.sub"></p>
            <div class="trace__wrap" data-wrap><table class="ttable" data-table></table></div>
            ${loops ? '<p class="trace__legend" data-i18n="tr.legend"></p>' : ''}
          </div>
        </section>
      </div>`;
    I18n.apply(body);
    slide.dataset.built = '1';
  }

  /* ----- Running an algorithm and the player ----- */
  const state = new Map(); // slide → { ex, i, r, pos, timer }

  function runSlide(slide) {
    const i = Number(slide.dataset.i);
    const ex = EX[i];
    const field = slide.querySelector('[data-inputs]');
    const msg = slide.querySelector('[data-msg]');
    stop(slide);
    const raw = field.value.trim().split(/[\s,]+/).filter(Boolean);
    const values = raw.map(Number);
    msg.hidden = true;
    if (!raw.length || values.some((x) => !Number.isFinite(x))) {
      I18n.set(msg, 'tr.bad');
      msg.hidden = false;
      return;
    }
    const r = window.runAlgorithm(ex, values);
    if (r.missing) I18n.set(msg, 'tr.missing', { name: r.missing });
    else if (r.stopped) I18n.set(msg, 'tr.stopped');
    else if (r.extra > 0) I18n.set(msg, 'tr.extra', { n: r.extra });
    msg.hidden = !(r.missing || r.stopped || r.extra > 0);
    if (!r.rows.length) return;
    const s = { ex, i, r, pos: 0, timer: null };
    state.set(slide, s);
    buildTable(slide, s);
    render(slide);
  }

  function buildTable(slide, s) {
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
    const table = slide.querySelector('[data-table]');
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

  function render(slide) {
    const s = state.get(slide);
    if (!s) return;
    const { ex, i, r, pos } = s;
    const row = r.rows[pos];
    if (!row) return;
    const step = ex.steps[row.step - 1];
    const prev = pos ? r.rows[pos - 1].vars : {};
    const { parts } = Explain.narrate(ex, r.rows, pos);

    slide.querySelector('[data-count]').innerHTML = t('run.step', { n: row.step });
    slide.querySelector('[data-pos]').textContent = `${pos + 1} / ${r.rows.length}`;
    slide.querySelector('[data-fill]').style.width = `${((pos + 1) / r.rows.length) * 100}%`;
    slide.querySelector('[data-line-n]').textContent = `${row.step}-`;
    slide.querySelector('[data-line]').innerHTML = codeLines(step.t);
    slide.querySelector('[data-why-now]').innerHTML = t(whyKey(i, step, row.step - 1));
    slide.querySelector('[data-say]').innerHTML = parts.map((p) => partHTML(p, step)).join('');
    slide.querySelector('[data-vars]').innerHTML = ex.vars.map((name) => {
      const val = row.vars[name];
      const old = prev[name];
      const changed = val !== undefined && val !== old;
      return `<div class="vbox${changed ? ' is-new' : ''}${val === undefined ? ' is-empty' : ''}">
          <span class="vbox__n">${esc(name)}</span>
          <span class="vbox__v">${val === undefined ? '–' : esc(fmt(val))}</span>
          ${changed && old !== undefined ? `<span class="vbox__was">${t('run.was', { v: fmt(old) })}</span>` : ''}
        </div>`;
    }).join('');
    const screen = slide.querySelector('[data-screen]');
    screen.classList.toggle('is-empty', !row.screen);
    screen.textContent = row.screen || t('run.empty');
    screen.classList.toggle('is-new', row.printed != null || row.newline);
    screen.scrollTop = screen.scrollHeight;

    const at = (g) => slide.querySelector(`[data-go="${g}"]`);
    at('first').disabled = at('back').disabled = pos === 0;
    at('next').disabled = at('last').disabled = pos === r.rows.length - 1;
    const playing = !!s.timer;
    at('play').setAttribute('aria-pressed', String(playing));
    I18n.label(at('play'), playing ? 'run.pause' : 'run.play');
    at('play').disabled = !playing && pos === r.rows.length - 1;

    // Show the same step in the algorithm and in the trace table.
    slide.querySelectorAll('.alg__step.is-now').forEach((li) => li.classList.remove('is-now'));
    const li = slide.querySelector(`.alg__step[data-step="${row.step}"]`);
    if (li) {
      li.classList.add('is-now');
      keepVisible(li, li.closest('.alg'));
    }
    const wrap = slide.querySelector('[data-wrap]');
    wrap.querySelectorAll('tr.is-now').forEach((tr) => tr.classList.remove('is-now'));
    const tr = wrap.querySelector(`tr[data-k="${pos}"]`);
    if (tr) {
      tr.classList.add('is-now');
      keepVisible(tr, wrap, wrap.querySelector('thead').offsetHeight);
    }
  }

  // Scroll a box (only that box, not the page) so that el is inside it.
  function keepVisible(el, box, head = 0) {
    if (!box || box.scrollHeight <= box.clientHeight + 1 || !box.offsetParent) return;
    const top = el.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop;
    if (top - head < box.scrollTop || top + el.offsetHeight > box.scrollTop + box.clientHeight) {
      box.scrollTop = Math.max(0, top - head - box.clientHeight / 3);
    }
  }

  function step(slide, pos) {
    const s = state.get(slide);
    if (!s) return;
    s.pos = Math.max(0, Math.min(s.r.rows.length - 1, pos));
    render(slide);
  }
  function stop(slide) {
    const s = state.get(slide);
    if (s && s.timer) { clearInterval(s.timer); s.timer = null; }
  }
  function play(slide) {
    const s = state.get(slide);
    if (!s) return;
    if (s.timer) { stop(slide); render(slide); return; }
    if (s.pos >= s.r.rows.length - 1) s.pos = 0;
    s.timer = setInterval(() => {
      if (s.pos >= s.r.rows.length - 1) { stop(slide); render(slide); return; }
      s.pos += 1;
      render(slide);
    }, PLAY_MS);
    render(slide);
  }

  function showTab(slide, name) {
    slide.querySelectorAll('[data-tab]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tab === name)));
    slide.querySelectorAll('[data-panel]').forEach((p) => { p.hidden = p.dataset.panel !== name; });
    render(slide);
  }

  /* ----- Thinking timer on the problem slides ----- */
  const timers = new Map(); // slide → { total, left, endAt, tick }
  const clock = (ms) => { const sec = Math.ceil(ms / 1000); return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`; };
  function timerOf(slide) {
    if (!timers.has(slide)) timers.set(slide, { total: 300000, left: 300000, endAt: 0, tick: null });
    return timers.get(slide);
  }
  function paintTimer(slide) {
    const tm = timerOf(slide);
    const box = slide.querySelector('[data-timer]');
    box.querySelector('[data-time]').textContent = clock(tm.left);
    box.classList.toggle('is-running', !!tm.tick);
    box.classList.toggle('is-low', tm.left > 0 && tm.left <= 30000);
    box.classList.toggle('is-done', tm.left === 0);
    const toggle = box.querySelector('[data-t="toggle"]');
    toggle.setAttribute('aria-pressed', String(!!tm.tick));
    I18n.label(toggle, tm.tick ? 'timer.pause' : 'timer.start');
    box.querySelectorAll('[data-min]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.min) * 60000 === tm.total)));
  }
  function pauseTimer(slide) {
    const tm = timers.get(slide);
    if (!tm || !tm.tick) return;
    clearInterval(tm.tick);
    tm.tick = null;
    paintTimer(slide);
  }
  function startTimer(slide) {
    const tm = timerOf(slide);
    if (tm.left <= 0) tm.left = tm.total;
    tm.endAt = Date.now() + tm.left;
    tm.tick = setInterval(() => {
      tm.left = Math.max(0, tm.endAt - Date.now());
      if (tm.left === 0) { clearInterval(tm.tick); tm.tick = null; }
      paintTimer(slide);
    }, 250);
    paintTimer(slide);
  }
  function resetTimer(slide, total) {
    const tm = timerOf(slide);
    clearInterval(tm.tick);
    tm.tick = null;
    if (total) tm.total = total;
    tm.left = tm.total;
    paintTimer(slide);
  }

  /* ----- The deck ----- */
  const slides = [...slidesEl.querySelectorAll('.slide')];
  const bar = document.getElementById('bar');
  const count = document.getElementById('count');
  const where = document.getElementById('where');
  const track = document.getElementById('track');
  const menu = document.getElementById('menu');
  const SECTIONS = ['start', ...LEVELS.map(String), 'end'];
  let index = -1;

  // The bar's track: one part for the start, one per level, one for the end.
  track.innerHTML = SECTIONS.map((sec) => {
    const n = slides.filter((s) => s.dataset.section === sec).length;
    const first = slides.find((s) => s.dataset.section === sec);
    const lv = /^\d+$/.test(sec) ? ` lv-${sec}` : '';
    return `<button type="button" class="track__part${lv}" style="flex-grow:${n}" data-go-slide="${first.id}" data-sec="${sec}"><span class="track__fill"></span></button>`;
  }).join('');
  const parts = [...track.children];

  const secLabel = (sec) => (sec === 'start' ? t('where.start') : sec === 'end' ? t('where.end') : `${t('lvl.word', { n: sec })} · ${t(`lvl.${sec}`)}`);
  const plain = (html) => { const d = document.createElement('div'); d.innerHTML = html; return d.textContent; };
  function slideLabel(slide) {
    const i = Number(slide.dataset.i);
    if (slide.dataset.kind === 'q') return t('where.ex', { n: i + 1 });
    if (slide.dataset.kind === 'sol') return t('where.sol', { n: i + 1 });
    if (slide.dataset.titleKey) return t(slide.dataset.titleKey);
    return secLabel(slide.dataset.section);
  }
  function paintBar() {
    const slide = slides[index];
    count.textContent = `${index + 1} / ${slides.length}`;
    where.innerHTML = slideLabel(slide);
    parts.forEach((p) => {
      const mine = slides.filter((s) => s.dataset.section === p.dataset.sec);
      const at = mine.indexOf(slide);
      const before = slides.indexOf(mine[0]) < index;
      const fill = at >= 0 ? (at + 1) / mine.length : before ? 1 : 0;
      p.querySelector('.track__fill').style.width = `${fill * 100}%`;
      p.classList.toggle('is-here', at >= 0);
      p.setAttribute('aria-label', plain(secLabel(p.dataset.sec)));
      if (at >= 0) p.setAttribute('aria-current', 'step'); else p.removeAttribute('aria-current');
    });
    bar.querySelector('[data-act="prev"]').disabled = index === 0;
    bar.querySelector('[data-act="next"]').disabled = index === slides.length - 1;
    const i = Number(slide.dataset.i);
    const name = slide.dataset.kind ? `${pad(i + 1)}. ${plain(t(`ex${i}.title`))}` : plain(slideLabel(slide));
    document.title = index === 0 ? t('doc.title') : `${name} | ${t('doc.title')}`;
  }

  function go(target) {
    if (typeof target === 'string') target = slides.findIndex((s) => s.id === target);
    target = Math.max(0, Math.min(slides.length - 1, target));
    if (target === index || Number.isNaN(target)) return;
    const leaving = slides[index];
    if (leaving) {
      if (state.has(leaving)) { stop(leaving); render(leaving); }
      pauseTimer(leaving);
    }
    const arriving = slides[target];
    const forward = target > index;
    index = target;
    slides.forEach((s, k) => {
      const active = k === index;
      s.classList.toggle('is-active', active);
      s.classList.toggle('is-before', k < index);
      s.setAttribute('aria-hidden', String(!active));
      s.inert = !active;
    });
    arriving.classList.toggle('from-back', !forward);
    arriving.scrollTop = 0;
    if (arriving.dataset.kind === 'sol') {
      if (!arriving.dataset.built) buildSolution(arriving);
      if (!state.has(arriving)) runSlide(arriving);
    }
    paintBar();
    history.replaceState(null, '', `#${arriving.id.slice(2)}`);
  }
  const next = () => go(index + 1);
  const prev = () => go(index - 1);

  /* ----- The "All examples" list ----- */
  let lastFocus = null;
  function openMenu() {
    lastFocus = document.activeElement;
    menu.hidden = false;
    document.body.classList.add('menu-open');
    slides.forEach((s) => { s.inert = true; });
    bar.inert = true;
    const here = slides[index];
    const target = menu.querySelector(here.dataset.i != null ? `.pick[data-i="${here.dataset.i}"]` : '.chip');
    if (target) { target.focus(); target.scrollIntoView({ block: 'center' }); }
  }
  function closeMenu() {
    if (menu.hidden) return;
    menu.hidden = true;
    document.body.classList.remove('menu-open');
    bar.inert = false;
    slides.forEach((s, k) => { s.inert = k !== index; });
    if (lastFocus && document.contains(lastFocus) && !lastFocus.closest('[inert]')) lastFocus.focus();
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
  }
  if (!document.documentElement.requestFullscreen) bar.querySelector('[data-act="full"]').hidden = true;

  /* ----- Progress ----- */
  function paintSolved() {
    document.querySelectorAll('[data-done]').forEach((b) => {
      const on = solved.has(EX[Number(b.dataset.i)].id);
      b.setAttribute('aria-pressed', String(on));
    });
    document.querySelectorAll('.pick[data-i]').forEach((p) => p.classList.toggle('is-solved', solved.has(EX[Number(p.dataset.i)].id)));
    const n = EX.filter((ex) => solved.has(ex.id)).length;
    document.querySelectorAll('[data-solved-fill]').forEach((f) => { f.style.width = `${(n / TOTAL) * 100}%`; });
    document.querySelectorAll('[data-solved-text]').forEach((el) => I18n.set(el, 'progress', { n, total: TOTAL }));
    document.querySelectorAll('[data-level-count]').forEach((el) => {
      const lv = Number(el.dataset.levelCount);
      const all = EX.filter((e) => e.level === lv);
      el.textContent = `${all.filter((e) => solved.has(e.id)).length} / ${all.length}`;
    });
  }

  /* ----- Clicks ----- */
  document.addEventListener('click', (e) => {
    const el = e.target instanceof Element ? e.target : null;
    if (!el) return;
    const act = el.closest('[data-act]');
    if (act) {
      const a = act.dataset.act;
      if (a === 'next') next();
      else if (a === 'prev') prev();
      else if (a === 'menu') openMenu();
      else if (a === 'close') closeMenu();
      else if (a === 'full') toggleFullscreen();
      else if (a === 'lang') I18n.toggle();
      return;
    }
    const jump = el.closest('[data-go-slide]');
    if (jump) { closeMenu(); go(jump.dataset.goSlide); return; }
    const done = el.closest('[data-done]');
    if (done) {
      const id = EX[Number(done.dataset.i)].id;
      if (solved.has(id)) solved.delete(id); else solved.add(id);
      saveSolved();
      paintSolved();
      return;
    }
    const slide = el.closest('.slide');
    if (!slide) return;
    const hint = el.closest('[data-hint]');
    if (hint) {
      const box = slide.querySelector('[data-hint-box]');
      box.hidden = !box.hidden;
      hint.setAttribute('aria-expanded', String(!box.hidden));
      return;
    }
    const tbtn = el.closest('[data-t], [data-min]');
    if (tbtn) {
      if (tbtn.dataset.min) resetTimer(slide, Number(tbtn.dataset.min) * 60000);
      else if (tbtn.dataset.t === 'reset') resetTimer(slide);
      else if (timerOf(slide).tick) pauseTimer(slide);
      else startTimer(slide);
      return;
    }
    if (el.closest('[data-run]')) { runSlide(slide); return; }
    if (el.closest('[data-sample]')) {
      slide.querySelector('[data-inputs]').value = EX[Number(slide.dataset.i)].sample;
      runSlide(slide);
      return;
    }
    const tab = el.closest('[data-tab]');
    if (tab) { showTab(slide, tab.dataset.tab); return; }
    const btn = el.closest('[data-go]');
    if (btn) {
      const s = state.get(slide);
      if (!s) return;
      const g = btn.dataset.go;
      if (g === 'play') { play(slide); return; }
      stop(slide);
      step(slide, g === 'first' ? 0 : g === 'last' ? s.r.rows.length - 1 : s.pos + (g === 'next' ? 1 : -1));
      return;
    }
    const tr = el.closest('tr[data-k]');
    if (tr) { stop(slide); step(slide, Number(tr.dataset.k)); }
  });

  document.addEventListener('change', (e) => {
    if (e.target.matches('[data-why]')) e.target.closest('.slide').classList.toggle('hide-why', !e.target.checked);
  });

  // Pointing at a loop line shows where it jumps back to.
  slidesEl.addEventListener('mouseover', (e) => {
    const slide = e.target.closest('.slide--sol');
    if (!slide) return;
    slide.querySelectorAll('.alg__step.is-target').forEach((li) => li.classList.remove('is-target'));
    const loop = e.target.closest('.alg__step.is-loop');
    if (loop) {
      const to = slide.querySelector(`.alg__step[data-step="${loop.dataset.to}"]`);
      if (to) to.classList.add('is-target');
    }
  });

  /* ----- Keys: → / ← move the slides (or the player, while it has focus) ----- */
  document.addEventListener('keydown', (e) => {
    if (!menu.hidden) {
      if (e.key === 'Escape') { e.preventDefault(); closeMenu(); }
      return;
    }
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const tgt = e.target instanceof Element ? e.target : document.body;
    if (tgt.matches('input, textarea, select')) {
      if (e.key === 'Enter' && tgt.matches('[data-inputs]')) { e.preventDefault(); runSlide(tgt.closest('.slide')); }
      if (e.key === 'Escape') tgt.blur();
      return;
    }
    const slide = slides[index];
    if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && tgt.closest('.sol__side') && state.has(slide)) {
      e.preventDefault();
      stop(slide);
      step(slide, state.get(slide).pos + (e.key === 'ArrowRight' ? 1 : -1));
      return;
    }
    const onButton = tgt.matches('button, summary, label');
    switch (e.key) {
      case 'ArrowRight': case 'PageDown': next(); break;
      case 'ArrowLeft': case 'PageUp': prev(); break;
      case ' ': if (onButton) return; next(); break;
      case 'Home': go(0); break;
      case 'End': go(slides.length - 1); break;
      case 'm': case 'M': openMenu(); break;
      case 'f': case 'F': toggleFullscreen(); break;
      case 'l': case 'L': I18n.toggle(); break;
      default: return;
    }
    e.preventDefault();
  });

  /* ----- Swipe left / right on phones (not inside boxes that scroll sideways) ----- */
  let touch = null;
  function scrollsSideways(el) {
    for (let n = el; n && n !== slidesEl; n = n.parentElement) {
      if (n.scrollWidth > n.clientWidth + 1 && /auto|scroll/.test(getComputedStyle(n).overflowX)) return true;
    }
    return false;
  }
  slidesEl.addEventListener('touchstart', (e) => {
    const p = e.touches[0];
    touch = e.touches.length === 1 && !e.target.closest('input') && !scrollsSideways(e.target) ? { x: p.clientX, y: p.clientY } : null;
  }, { passive: true });
  slidesEl.addEventListener('touchend', (e) => {
    if (!touch) return;
    const p = e.changedTouches[0];
    const dx = p.clientX - touch.x;
    const dy = p.clientY - touch.y;
    touch = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.6) (dx < 0 ? next : prev)();
  }, { passive: true });

  /* ----- Start ----- */
  I18n.onChange(() => {
    state.forEach((s, slide) => render(slide));
    timers.forEach((tm, slide) => paintTimer(slide));
    paintBar();
  });
  I18n.apply();
  paintSolved();
  const fromHash = () => {
    const h = decodeURIComponent(location.hash.slice(1));
    if (/^\d+$/.test(h)) return Number(h) - 1;
    const k = slides.findIndex((s) => s.id === `s-${h}`);
    return k < 0 ? 0 : k;
  };
  window.addEventListener('hashchange', () => go(fromHash()));
  go(fromHash());
})();
