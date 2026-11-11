/* The VS Code look: an editor window with line numbers, and a terminal that
   runs a program from programs.js the way VS Code does. It asks for each
   input (with the sample value ready to send), highlights the line that runs,
   shows True / False on if lines, lists the variables with their types and
   prints Python's own error messages. */
(function () {
  const { Py, I18n } = window;
  const esc = I18n.esc;
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const PROMPT = 'PS C:\\lab1> ';

  /* ----- Code ----- */
  // One line of code: leading spaces get their own span so the indent can be drawn.
  function codeLine(text) {
    const m = text.match(/^ +/);
    const lead = m ? m[0] : '';
    return `${lead ? `<span class="ed__ws">${lead}</span>` : ''}${Py.highlight(text.slice(lead.length))}`;
  }

  const PY_ICON = '<svg class="py-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M11.9 2C7 2 7.3 4.1 7.3 4.1v2.2h4.7V7H5.5S2 6.6 2 11.9s3.1 5.1 3.1 5.1H7v-2.5s-.1-3.1 3-3.1h5.1s2.9 0 2.9-2.8V4.9S18.5 2 11.9 2zM9.3 3.5a.9.9 0 110 1.8.9.9 0 010-1.8z" fill="#3776ab"/><path d="M12.1 22c4.9 0 4.6-2.1 4.6-2.1v-2.2H12V17h6.5s3.5.4 3.5-4.9-3.1-5.1-3.1-5.1H17v2.5s.1 3.1-3 3.1H8.9S6 12.6 6 15.4v3.7S5.5 22 12.1 22zm2.6-1.5a.9.9 0 110-1.8.9.9 0 010 1.8z" fill="#ffd43b"/></svg>';

  function editor(file, lines, o = {}) {
    return `
      <div class="win win--editor${o.cls ? ` ${o.cls}` : ''}">
        <div class="win__bar">
          <span class="win__dots" aria-hidden="true"><i></i><i></i><i></i></span>
          <span class="win__tab">${PY_ICON}${esc(file)}</span>
          <span class="win__play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>
        </div>
        <ol class="ed" aria-label="${esc(file)}">
          ${lines.map((l, i) => `<li class="ed__line" data-i="${i}"><span class="ed__n">${i + 1}</span><code class="ed__code">${codeLine(l)}</code><span class="ed__badge"></span></li>`).join('')}
        </ol>
      </div>`;
  }

  function terminal(o = {}) {
    return `
      <div class="win win--term${o.cls ? ` ${o.cls}` : ''}">
        <div class="term__bar">
          <span class="term__tab">TERMINAL</span>
          ${o.buttons ? `<div class="term__btns">${o.buttons}</div>` : ''}
        </div>
        <div class="term__body" data-term></div>
      </div>`;
  }

  /* Terminal text. ⟦…⟧ marks what the user typed. */
  function termHTML(lines, cls = '') {
    return lines.map((l) => `<div class="t-line${cls ? ` ${cls}` : ''}">${esc(l).replace(/⟦(.*?)⟧/g, '<span class="t-in">$1</span>') || '&nbsp;'}</div>`).join('');
  }

  // Run a program at once with the given inputs, for the "Sample run" boxes.
  function transcript(prog, inputs = prog.sample) {
    const gen = Py.execute(prog.steps);
    const out = [];
    let k = 0;
    let r = gen.next();
    while (!r.done) {
      const ev = r.value;
      let answer;
      if (ev.type === 'input') answer = inputs[k++];
      if (ev.type === 'echo') out.push(`${ev.prompt}⟦${ev.text}⟧`);
      if (ev.type === 'out') out.push(ev.text);
      if (ev.type === 'error') out.push(`${ev.error.type}: ${ev.error.message}`);
      r = gen.next(answer);
    }
    return out;
  }

  /* ----- Runner: one program, its editor lines, a terminal and a variables list ----- */
  class Runner {
    constructor({ prog, root, onState }) {
      this.prog = prog;
      this.lines = [...root.querySelectorAll('.ed__line')];
      this.body = root.querySelector('[data-term]');
      this.varsBox = root.querySelector('[data-vars]');
      this.onState = onState || (() => {});
      this.onLine = null;
      this.token = 0;
      this.delay = 560;
      this.reset();
    }

    reset() {
      this.token += 1;
      // A run waiting for input gives up quietly.
      if (this.cancelAsk) {
        const cancel = this.cancelAsk;
        this.cancelAsk = null;
        cancel();
      }
      this.mark(null);
      this.lines.forEach((li) => {
        li.classList.remove('is-error');
        li.querySelector('.ed__badge').className = 'ed__badge';
        li.querySelector('.ed__badge').textContent = '';
      });
      this.body.innerHTML = `<div class="t-line t-cmd">${esc(PROMPT)}<span class="t-cursor"></span></div>`;
      if (this.varsBox) this.varsBox.innerHTML = `<p class="vars__empty" data-i18n="run.noVars">${esc(I18n.t('run.noVars'))}</p>`;
      this.state = 'idle';
      this.onState('idle');
    }

    stop() {
      if (this.state === 'running') this.reset();
    }

    mark(line) {
      this.lines.forEach((li, i) => li.classList.toggle('is-current', i === line));
      if (this.onLine) this.onLine(line);
    }

    write(html) {
      this.body.querySelectorAll('.t-cursor').forEach((c) => c.remove());
      this.body.insertAdjacentHTML('beforeend', html);
      this.body.scrollTop = this.body.scrollHeight;
    }

    ask(prompt, preset, token) {
      return new Promise((resolve) => {
        this.write(`<div class="t-line t-ask">${esc(prompt)}<input class="t-input" type="text" spellcheck="false" autocomplete="off" value="${esc(preset)}" size="${Math.max(4, preset.length + 2)}" aria-label="${esc(prompt.replace(/\s*:\s*$/, ''))}"><span class="t-enter">↵ Enter</span></div>`);
        const row = this.body.lastElementChild;
        const field = row.querySelector('input');
        field.focus({ preventScroll: true });
        field.select();
        field.addEventListener('input', () => { field.size = Math.max(4, field.value.length + 2); });
        field.addEventListener('keydown', (e) => {
          if (e.key !== 'Enter') return;
          e.preventDefault();
          e.stopPropagation();
          if (token !== this.token) return resolve(null);
          const text = field.value;
          row.innerHTML = `${esc(prompt)}<span class="t-in">${esc(text)}</span>`;
          resolve(text);
        });
        this.cancelAsk = () => resolve(null);
      });
    }

    showVars(env, changed) {
      if (!this.varsBox) return;
      this.varsBox.innerHTML = Object.entries(env).map(([name, val]) => `
        <div class="var${changed.includes(name) ? ' is-new' : ''}">
          <code class="var__name">${esc(name)}</code>
          <code class="var__val">${esc(Py.literal(val))}</code>
          <span class="var__type t-${val.t}">${val.t}</span>
        </div>`).join('');
    }

    badge(line, ok) {
      const b = this.lines[line] && this.lines[line].querySelector('.ed__badge');
      if (!b) return;
      b.className = `ed__badge is-${ok ? 'true' : 'false'}`;
      b.textContent = ok ? 'True' : 'False';
    }

    traceback(ev) {
      const n = ev.line + 1;
      const src = this.prog.code[ev.line].trim();
      this.write(termHTML([
        'Traceback (most recent call last):',
        `  File "${this.prog.file}", line ${n}, in <module>`,
        `    ${src}`,
        `${ev.error.type}: ${ev.error.message}`,
      ], 't-err'));
      if (this.lines[ev.line]) this.lines[ev.line].classList.add('is-error');
    }

    async run() {
      this.reset();
      const token = this.token;
      this.state = 'running';
      this.onState('running');
      this.body.innerHTML = '';
      this.write(`<div class="t-line t-cmd">${esc(PROMPT)}<span class="t-typed">python ${esc(this.prog.file)}</span></div>`);
      await wait(this.delay * 0.6);
      const gen = Py.execute(this.prog.steps);
      let k = 0;
      let r = gen.next();
      while (!r.done) {
        if (token !== this.token) return;
        const ev = r.value;
        let answer;
        if (ev.type === 'line') {
          this.mark(ev.line);
          await wait(this.delay);
        } else if (ev.type === 'input') {
          answer = await this.ask(ev.prompt, this.prog.sample[k++] ?? '', token);
          if (answer == null || token !== this.token) return;
        } else if (ev.type === 'set') {
          this.showVars(ev.env, ev.names);
        } else if (ev.type === 'out') {
          this.write(termHTML([ev.text], 't-out'));
        } else if (ev.type === 'test') {
          this.badge(ev.line, ev.ok);
          await wait(this.delay);
        } else if (ev.type === 'error') {
          this.traceback(ev);
        }
        r = gen.next(answer);
      }
      if (token !== this.token) return;
      this.mark(null);
      this.write(`<div class="t-line t-cmd">${esc(PROMPT)}<span class="t-cursor"></span></div>`);
      this.state = 'done';
      this.onState('done');
    }
  }

  /* ----- Static pieces on the page ----- */
  // Highlight hand-written code: <code data-py> and <pre data-py>.
  document.querySelectorAll('[data-py]').forEach((el) => {
    el.innerHTML = el.textContent.split('\n').map(codeLine).join('\n');
  });
  // "Sample run" boxes on the question slides.
  document.querySelectorAll('[data-sample]').forEach((el) => {
    const prog = window.EXAMPLES[el.dataset.sample];
    if (!prog) return;
    el.insertAdjacentHTML('beforeend', `<div class="mini-term">${termHTML([`${PROMPT}python ${prog.file}`], 't-cmd')}${termHTML(transcript(prog))}</div>`);
  });

  window.Editor = { editor, terminal, termHTML, transcript, codeLine, Runner, PROMPT, PY_ICON };
})();
