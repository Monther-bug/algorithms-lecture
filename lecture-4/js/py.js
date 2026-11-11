/* A tiny model of Python, just enough for the lab programs: the values int,
   float, str and bool; the operators the programs use; what print() writes;
   int() / float() with Python's own error messages; a runner that steps
   through a program line by line; and VS Code style colouring for code. */
(function () {
  const esc = window.I18n.esc;

  class PyError extends Error {
    constructor(type, message) { super(message); this.type = type; }
  }

  const int = (v) => ({ t: 'int', v });
  const float = (v) => ({ t: 'float', v });
  const str = (v) => ({ t: 'str', v });
  const bool = (v) => ({ t: 'bool', v });

  // Python writes whole floats with ".0" (5.0); other values print the same in JS and Python.
  function fmtFloat(x) {
    if (Number.isInteger(x) && Math.abs(x) < 1e16) return x.toFixed(1);
    return String(x);
  }
  // What print() writes for a value.
  function show(val) {
    if (val.t === 'str') return val.v;
    if (val.t === 'float') return fmtFloat(val.v);
    if (val.t === 'bool') return val.v ? 'True' : 'False';
    return String(val.v);
  }
  // How a value looks in code (text keeps its quotes).
  const literal = (val) => (val.t === 'str' ? `"${val.v}"` : show(val));

  const isNum = (a) => a.t === 'int' || a.t === 'float' || a.t === 'bool';

  function op(sym, a, b) {
    if (sym === '+' && a.t === 'str' && b.t === 'str') return str(a.v + b.v);
    if (!isNum(a) || !isNum(b)) {
      if (sym === '+' && a.t === 'str') throw new PyError('TypeError', `can only concatenate str (not "${b.t}") to str`);
      throw new PyError('TypeError', `unsupported operand type(s) for ${sym}: '${a.t}' and '${b.t}'`);
    }
    const x = Number(a.v);
    const y = Number(b.v);
    const wrap = a.t === 'float' || b.t === 'float' ? float : int;
    switch (sym) {
      case '+': return wrap(x + y);
      case '-': return wrap(x - y);
      case '*': return wrap(x * y);
      case '/':
        if (y === 0) throw new PyError('ZeroDivisionError', 'division by zero');
        return float(x / y);
      case '%':
        if (y === 0) throw new PyError('ZeroDivisionError', wrap === int ? 'integer modulo by zero' : 'float modulo');
        return wrap(x - y * Math.floor(x / y));
      case '**': return wrap(x ** y);
      default: throw new Error(`unknown operator ${sym}`);
    }
  }

  function cmp(sym, a, b) {
    const x = a.v;
    const y = b.v;
    switch (sym) {
      case '==': return bool(x === y);
      case '!=': return bool(x !== y);
      case '>': return bool(x > y);
      case '<': return bool(x < y);
      case '>=': return bool(x >= y);
      case '<=': return bool(x <= y);
      default: throw new Error(`unknown comparison ${sym}`);
    }
  }

  // int(text) and float(text), as Python does them (spaces around the number are fine).
  function cast(type, text) {
    const t = text.trim();
    if (type === 'int') {
      if (/^[+-]?\d+$/.test(t)) return int(parseInt(t, 10));
      throw new PyError('ValueError', `invalid literal for int() with base 10: '${text}'`);
    }
    if (type === 'float') {
      if (/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(t)) return float(parseFloat(t));
      throw new PyError('ValueError', `could not convert string to float: '${text}'`);
    }
    return str(text);
  }

  /* A program is a list of steps. Each step names the code line it runs
     (0-based; a step without one is invisible) and does one thing:
       input: { name, prompt, cast }   name = cast(input(prompt))
       set:   (env) => ({ name: value, ... })
       print: (env) => [value, ...]    joined with spaces, like print(a, b)
       test:  (env) => bool, with else: step index to go to when it is False
       goto:  step index (ends the if-block and jumps over else)
     execute() is a generator: the page answers each 'input' event with the
     typed text through next(text). */
  function* execute(steps) {
    const env = {};
    let pc = 0;
    try {
      while (pc < steps.length) {
        const s = steps[pc];
        let next = pc + 1;
        if (s.line != null) yield { type: 'line', line: s.line, env };
        if (s.input) {
          const text = yield { type: 'input', prompt: s.input.prompt, line: s.line };
          yield { type: 'echo', prompt: s.input.prompt, text };
          env[s.input.name] = cast(s.input.cast || 'str', text);
          yield { type: 'set', names: [s.input.name], env };
        } else if (s.set) {
          const changes = s.set(env);
          Object.assign(env, changes);
          yield { type: 'set', names: Object.keys(changes), env };
        } else if (s.print) {
          yield { type: 'out', text: s.print(env).map(show).join(' ') };
        } else if (s.test) {
          const ok = s.test(env).v;
          yield { type: 'test', line: s.line, ok };
          if (!ok) next = s.else;
        } else if (s.goto != null) {
          next = s.goto;
        }
        pc = next;
      }
      yield { type: 'end', env };
    } catch (e) {
      if (!(e instanceof PyError)) throw e;
      yield { type: 'error', error: e, line: steps[pc].line, env };
    }
  }

  /* ----- VS Code "Dark+" colours for Python ----- */
  const TOKEN = /(#.*$)|("[^"]*"?|'[^']*'?)|\b(if|elif|else|and|or|not|in|for|while|def|return)\b|\b(True|False|None)\b|\b(print|input)\b(?=\s*\()|\b(int|float|str|bool|type)\b|\b(\d+(?:\.\d+)?)\b|([A-Za-z_]\w*)/g;
  function highlight(line) {
    let out = '';
    let last = 0;
    line.replace(TOKEN, (m, com, s, kw, cons, fn, typ, num, name, at) => {
      out += esc(line.slice(last, at));
      const cls = com ? 'c-com' : s ? 'c-str' : kw ? 'c-kw' : cons ? 'c-const' : fn ? 'c-fn' : typ ? 'c-type' : num ? 'c-num' : 'c-var';
      out += `<span class="${cls}">${esc(m)}</span>`;
      last = at + m.length;
      return m;
    });
    return out + esc(line.slice(last));
  }

  window.Py = { PyError, int, float, str, bool, op, cmp, cast, show, literal, execute, highlight };
})();
