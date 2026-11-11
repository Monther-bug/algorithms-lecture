/* The interactive parts outside the solution slides:
   - "Try it" on the input() slide: type anything, see what input(), int()
     and float() give back.
   - Activity 1, Spot the bug: six programs with one mistake each. Run shows
     Python's real message, then "Show the fix" corrects the line.
   - Activity 2, Your turn: three tasks to write in VS Code, each with a
     sample run and a solution that can be run here. */
(function () {
  const { I18n, Editor, Py } = window;
  const esc = I18n.esc;

  /* ----- input() / int() / float() ----- */
  function inputDemo(box) {
    const field = box.querySelector('[data-try]');
    const rows = box.querySelector('[data-rows]');
    const ways = [
      { code: 'input("...")', cast: 'str' },
      { code: 'int(input("..."))', cast: 'int' },
      { code: 'float(input("..."))', cast: 'float' },
    ];
    function render() {
      rows.innerHTML = ways.map((w) => {
        let result;
        try {
          const val = Py.cast(w.cast, field.value);
          result = `<code class="try__val">${esc(Py.literal(val))}</code><span class="var__type t-${val.t}">${val.t}</span>`;
        } catch (e) {
          result = `<code class="try__err">${esc(e.type)}</code>`;
        }
        return `<div class="try__row"><code class="try__code">${Editor.codeLine(w.code)}</code><span class="try__arrow" aria-hidden="true">→</span>${result}</div>`;
      }).join('');
    }
    field.addEventListener('input', render);
    render();
  }

  /* ----- Activity 1: Spot the bug ----- */
  function bugs(act) {
    const BUGS = window.BUGS;
    BUGS.forEach((b, i) => {
      I18n.add(`bug${i}.title`, esc(b.title[0]), b.title[1]);
      I18n.add(`bug${i}.why`, b.why[0], b.why[1]);
    });
    const rounds = act.querySelector('.rounds');
    const title = act.querySelector('[data-title]');
    const edBox = act.querySelector('[data-editor]');
    const term = act.querySelector('[data-term]');
    const why = act.querySelector('[data-why]');
    const runBtn = act.querySelector('[data-run]');
    const fixBtn = act.querySelector('[data-fix]');
    let cur = 0;
    let state = 'fresh';

    rounds.innerHTML = BUGS.map((b, i) => `<button type="button" aria-pressed="${i === 0}" data-round="${i}">${i + 1}</button>`).join('');

    function cmd(file) { return Editor.termHTML([`${Editor.PROMPT}python ${file}`], 't-cmd'); }

    function show(i) {
      cur = i;
      state = 'fresh';
      const b = BUGS[i];
      rounds.querySelectorAll('button').forEach((x, k) => x.setAttribute('aria-pressed', k === i ? 'true' : 'false'));
      I18n.set(title, 'b.round', { n: i + 1, name: { key: `bug${i}.title`, bdi: true } });
      edBox.innerHTML = Editor.editor(b.file, b.code);
      term.innerHTML = `${Editor.termHTML([Editor.PROMPT], 't-cmd')}`;
      why.hidden = true;
      runBtn.disabled = false;
      fixBtn.disabled = true;
    }

    function run() {
      const b = BUGS[cur];
      // Syntax and indentation errors stop Python before the first line runs.
      const errAt = b.term.findIndex((l) => /^ {2}File |^Traceback/.test(l));
      const lines = errAt < 0 ? b.term : b.term.slice(0, errAt);
      const errs = errAt < 0 ? [] : b.term.slice(errAt);
      term.innerHTML = cmd(b.file) + Editor.termHTML(lines, 't-out') + Editor.termHTML(errs, 't-err');
      if (b.quiet) term.lastElementChild.classList.add('t-wrong');
      Object.keys(b.fix).forEach((k) => edBox.querySelectorAll('.ed__line')[k].classList.add('is-error'));
      state = 'ran';
      fixBtn.disabled = false;
    }

    function fix() {
      const b = BUGS[cur];
      const items = edBox.querySelectorAll('.ed__line');
      Object.entries(b.fix).forEach(([k, text]) => {
        const li = items[k];
        li.classList.remove('is-error');
        li.classList.add('is-fixed');
        li.querySelector('.ed__code').innerHTML = Editor.codeLine(text);
      });
      term.innerHTML += cmd(b.file) + Editor.termHTML(b.fixed, 't-out');
      term.scrollTop = term.scrollHeight;
      I18n.set(why, `bug${cur}.why`);
      why.hidden = false;
      runBtn.disabled = true;
      fixBtn.disabled = true;
      state = 'fixed';
    }

    rounds.addEventListener('click', (e) => {
      const b = e.target.closest('[data-round]');
      if (b) show(Number(b.dataset.round));
    });
    runBtn.addEventListener('click', run);
    fixBtn.addEventListener('click', fix);
    show(0);
    return { pause() {}, get state() { return state; } };
  }

  /* ----- Activity 2: Your turn ----- */
  function yourTurn(act) {
    const TASKS = window.PRACTICE;
    TASKS.forEach((t, i) => {
      I18n.add(`t${i}.title`, esc(t.title[0]), t.title[1]);
      I18n.add(`t${i}.task`, t.task[0], t.task[1]);
      I18n.add(`t${i}.from`, esc(t.from[0]), t.from[1]);
      I18n.add(`t${i}.tip`, t.tip[0], t.tip[1]);
    });
    const picks = act.querySelector('[data-picks]');
    const from = act.querySelector('[data-from]');
    const title = act.querySelector('[data-title]');
    const task = act.querySelector('[data-task]');
    const tip = act.querySelector('[data-tip]');
    const sample = act.querySelector('[data-sample-box]');
    const solBox = act.querySelector('[data-solution]');
    const waitMsg = act.querySelector('[data-wait]');
    const showBtn = act.querySelector('[data-show]');
    let cur = 0;
    let runner = null;

    picks.innerHTML = TASKS.map((t, i) => `
      <button type="button" class="pick" aria-pressed="${i === 0}" data-pick="${i}">
        <span class="pick__level pick__level--${t.level}" data-i18n="y.${t.level}"></span>
        <span class="pick__title" data-i18n="t${i}.title"></span>
      </button>`).join('');
    I18n.apply(picks);

    function hideSolution() {
      if (runner) runner.stop();
      runner = null;
      solBox.innerHTML = '';
      solBox.hidden = true;
      waitMsg.hidden = false;
      I18n.set(showBtn, 'y.show');
    }

    function select(i) {
      cur = i;
      const t = TASKS[i];
      picks.querySelectorAll('[data-pick]').forEach((b, k) => b.setAttribute('aria-pressed', k === i ? 'true' : 'false'));
      I18n.set(from, `t${i}.from`);
      I18n.set(title, `t${i}.title`);
      I18n.set(task, `t${i}.task`);
      I18n.set(tip, `t${i}.tip`);
      sample.innerHTML = `<div class="mini-term">${Editor.termHTML([`${Editor.PROMPT}python ${t.file}`], 't-cmd')}${Editor.termHTML(Editor.transcript(t))}</div>`;
      hideSolution();
    }

    function showSolution() {
      const t = TASKS[cur];
      solBox.innerHTML = `
        ${Editor.editor(t.file, t.code, { cls: 'win--compact' })}
        ${Editor.terminal({ cls: 'win--compact', buttons: `
          <button type="button" class="btn btn--run" data-run><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg><span data-i18n="run.run"></span></button>` })}`;
      I18n.apply(solBox);
      solBox.hidden = false;
      waitMsg.hidden = true;
      const runBtn = solBox.querySelector('[data-run]');
      runner = new Editor.Runner({
        prog: t,
        root: solBox,
        onState(st) {
          I18n.set(runBtn.querySelector('span'), st === 'done' ? 'run.again' : 'run.run');
          runBtn.disabled = st === 'running';
        },
      });
      runBtn.addEventListener('click', () => runner.run());
      I18n.set(showBtn, 'y.hide');
    }

    picks.addEventListener('click', (e) => {
      const b = e.target.closest('[data-pick]');
      if (b) select(Number(b.dataset.pick));
    });
    showBtn.addEventListener('click', () => (solBox.hidden ? showSolution() : hideSolution()));
    select(0);
    return { pause() { if (runner) runner.stop(); } };
  }

  window.Activities = {};
  const demo = document.getElementById('input-demo');
  if (demo) inputDemo(demo);
  const bugAct = document.getElementById('bugs');
  if (bugAct) window.Activities.bugs = bugs(bugAct);
  const turnAct = document.getElementById('turn');
  if (turnAct) window.Activities.turn = yourTurn(turnAct);
})();
