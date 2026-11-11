/* Solution slides: the program appears one line per → with a plain-English
   explanation of that line; one more → shows the idea behind it. ▶ Run runs
   it in the terminal (you type the input), and the explanation follows the
   line that is running. */
(function () {
  const { I18n, Editor } = window;

  window.Steppers = window.Steppers || new Map();

  function build(root) {
    const id = root.dataset.example;
    const ex = window.EXAMPLES[id];
    ex.explain.forEach(([en, ar], k) => I18n.add(`ex${id}.l${k}`, en, ar));
    I18n.add(`ex${id}.note`, I18n.esc(ex.note[0]), ex.note[1]);
    const total = ex.code.length + 1;

    root.innerHTML = `
      <header class="sol__head">
        <p class="kicker" data-i18n="sol.kicker" data-i18n-vars='{"n":${id}}'></p>
        <p class="sol__task" data-i18n="q.title${id}"></p>
      </header>
      <div class="sol__grid">
        <div class="sol__left">
          ${Editor.editor(ex.file, ex.code)}
          <div class="explain" aria-live="polite">
            <p class="explain__tag" data-tag></p>
            <p class="explain__text" data-text></p>
          </div>
        </div>
        <div class="sol__right">
          ${Editor.terminal({ buttons: `
            <button type="button" class="btn btn--run" data-run><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg><span data-i18n="run.run"></span></button>
            <button type="button" class="btn btn--ghost" data-reset data-i18n="run.reset"></button>` })}
          <div class="vars-box">
            <p class="vars__title" data-i18n="run.vars"></p>
            <div class="vars" data-vars></div>
          </div>
        </div>
      </div>`;
    I18n.apply(root);

    const lines = [...root.querySelectorAll('.ed__line')];
    const tag = root.querySelector('[data-tag]');
    const text = root.querySelector('[data-text]');
    const runBtn = root.querySelector('[data-run]');
    let shown = 0;

    // The box under the editor: a hint, one line's explanation, or the idea.
    function explain(k) {
      if (k == null) {
        I18n.set(tag, 'sol.hint');
        text.innerHTML = '';
        delete text.dataset.i18n;
      } else if (k >= ex.code.length) {
        I18n.set(tag, 'sol.idea');
        I18n.set(text, `ex${id}.note`);
      } else {
        I18n.set(tag, 'sol.line', { n: k + 1 });
        I18n.set(text, `ex${id}.l${k}`);
      }
      root.querySelector('.explain').classList.toggle('is-idea', k != null && k >= ex.code.length);
    }

    function reveal(n) {
      shown = Math.max(0, Math.min(total, n));
      lines.forEach((li, i) => {
        li.classList.toggle('is-shown', i < shown);
        li.classList.toggle('is-latest', i === shown - 1 && shown <= ex.code.length);
      });
      explain(shown === 0 ? null : shown - 1);
    }

    const runner = new Editor.Runner({
      prog: ex,
      root,
      onState(state) {
        I18n.set(runBtn.querySelector('span'), state === 'done' ? 'run.again' : 'run.run');
        runBtn.disabled = state === 'running';
        if (state === 'done') explain(ex.code.length);
      },
    });
    runner.onLine = (line) => { if (line != null) explain(line); };

    runBtn.addEventListener('click', () => {
      reveal(total);
      lines.forEach((li) => li.classList.remove('is-latest'));
      runner.run();
    });
    root.querySelector('[data-reset]').addEventListener('click', () => { runner.reset(); reveal(total); });

    reveal(0);
    return {
      get total() { return total; },
      get shown() { return shown; },
      reveal,
      showAll() { reveal(total); },
      reset() { runner.reset(); reveal(0); },
      pause() { runner.stop(); },
    };
  }

  document.querySelectorAll('.sol[data-example]').forEach((root) => {
    window.Steppers.set(root.closest('.slide'), build(root));
  });
})();
