/* Says what one executed step of an algorithm did, with the real numbers,
   for the "Watch it run" player:
     sum = a + b + c = 4 + 7 + 1 = 12
     Is b > max?  9 > 4  → Yes
     Is n mod i == 0?  7 mod 3 == 0  →  1 == 0  → No
   It reads the algorithm text itself (the same text the student sees), so the
   numbers it shows always match the line. The tests check that what it works
   out is the same as what runAlgorithm did.

   narrate(ex, rows, k) → { parts, env }
     parts: what to show, in order (see the "k" values below)
     env:   the variables after the step, as worked out from the text */
(function () {
  const fmt = (x) => window.fmtValue(x);
  const WORD = /[A-Za-z_]\w*/g;
  const OPS = { mod: '%', and: '&&', or: '||' };
  const CMP = /^(.*?)\s*(==|!=|>=|<=|>|<)\s*(.*)$/;
  const cache = new Map();

  // Turn "a mod i == 0 and b > 2" into a small function of the variables.
  function compile(expr, names) {
    const key = `${names.join(',')}|${expr}`;
    if (!cache.has(key)) {
      const js = expr.replace(WORD, (w) => {
        if (w in OPS) return OPS[w];
        if (names.includes(w)) return `v[${JSON.stringify(w)}]`;
        throw new Error(`Unknown name "${w}" in "${expr}"`);
      });
      cache.set(key, new Function('v', `return (${js});`));
    }
    return cache.get(key);
  }
  const evaluate = (expr, env, names) => compile(expr, names)(env);
  // Put the values in place of the names: "sum + i" → "10 + 5".
  const substitute = (expr, env, names) => expr.replace(WORD, (w) => (names.includes(w) && env[w] !== undefined ? fmt(env[w]) : w));

  /* ----- Reading the algorithm lines ----- */
  function assigns(text) {
    return text.split(/,\s*(?=[A-Za-z_]\w*\s*=[^=])/).map((a) => {
      const m = a.trim().match(/^([A-Za-z_]\w*)\s*=\s*(.+)$/);
      if (!m) throw new Error(`Not an assignment: "${a}"`);
      return { name: m[1], expr: m[2].trim() };
    });
  }
  function branches(text) {
    const out = [];
    text.split('\n').forEach((raw) => {
      const line = raw.trim();
      let m = line.match(/^(?:If|else if) (.+?) then(?: (.*))?$/);
      if (m) { out.push({ cond: m[1], act: m[2] ? [m[2]] : [] }); return; }
      m = line.match(/^else (.*)$/);
      if (m) { out.push({ cond: null, act: [m[1]] }); return; }
      out[out.length - 1].act.push(line);
    });
    return out;
  }
  function parse(step) {
    const t = step.t;
    if (t === 'Start') return { kind: 'start' };
    if (t === 'End') return { kind: 'end' };
    if (/^Declare /.test(t)) return { kind: 'declare', names: t.slice(8).split(/,\s*/) };
    if (step.input) return { kind: 'read' };
    if (step.newline) return { kind: 'newline' };
    if (step.loop != null) return { kind: 'loop', cond: t.match(/^If (.+) then go to step \d+$/)[1] };
    if (/^If /.test(t)) return { kind: 'if', branches: branches(t) };
    if (/^Print /.test(t)) return { kind: 'print' };
    return { kind: 'calc', assigns: assigns(t) };
  }
  const parsed = new WeakMap();
  function lines(ex) {
    if (!parsed.has(ex)) parsed.set(ex, ex.steps.map(parse));
    return parsed.get(ex);
  }

  /* ----- One step, in words and numbers ----- */
  function calc(a, env, names) {
    const sub = substitute(a.expr, env, names);
    const val = evaluate(a.expr, env, names);
    const chain = [a.name, a.expr];
    if (sub !== a.expr) chain.push(sub);
    if (fmt(val) !== chain[chain.length - 1]) chain.push(fmt(val));
    env[a.name] = val;
    return { k: 'calc', code: chain.join(' = ') };
  }

  function ask(cond, env, names) {
    const ans = Boolean(evaluate(cond, env, names));
    const sub = substitute(cond, env, names);
    const pieces = cond.split(/\s+(and|or)\s+/); // conditions at even places, and/or between
    // Work out each side that is more than one number: 7 mod 3 == 0 → 1 == 0
    const red = pieces.map((p, i) => {
      if (i % 2) return p;
      const m = p.match(CMP);
      if (!m) return substitute(p, env, names);
      const side = (s) => fmt(evaluate(s, env, names));
      return `${side(m[1])} ${m[2]} ${side(m[3])}`;
    }).join(' ');
    // With and/or, show the answer of each small condition: yes and no
    const each = pieces.length > 1
      ? pieces.map((p, i) => (i % 2 ? p : Boolean(evaluate(p, env, names))))
      : null;
    return { k: 'ask', cond, sub, red: red !== sub ? red : null, each, ans };
  }

  function printed(row, code, sameLine) {
    if (row.printed == null) return { k: 'skip' };
    return { k: 'out', code, text: row.printed, same: sameLine };
  }

  function narrate(ex, rows, k) {
    const row = rows[k];
    const step = ex.steps[row.step - 1];
    const p = lines(ex)[row.step - 1];
    const names = ex.vars;
    const sameLine = ex.steps.some((s) => s.newline);
    const env = { ...(k ? rows[k - 1].vars : {}) };
    const parts = [];
    switch (p.kind) {
      case 'start':
      case 'end':
      case 'newline':
        parts.push({ k: p.kind });
        break;
      case 'declare':
        parts.push({ k: 'declare', names: p.names });
        break;
      case 'read':
        step.input.forEach((n) => { env[n] = row.vars[n]; });
        parts.push({ k: 'read', code: step.input.map((n) => `${n} = ${fmt(row.vars[n])}`).join(', ') });
        break;
      case 'print':
        parts.push(printed(row, step.t, sameLine));
        break;
      case 'calc':
        p.assigns.forEach((a) => parts.push(calc(a, env, names)));
        break;
      case 'loop': {
        const q = ask(p.cond, env, names);
        parts.push(q, { k: 'jump', yes: q.ans, to: q.ans ? step.loop : row.step + 1 });
        break;
      }
      case 'if': {
        let chosen = null;
        for (const b of p.branches) {
          if (b.cond == null) { chosen = b; parts.push({ k: 'else' }); break; }
          const q = ask(b.cond, env, names);
          parts.push(q);
          if (q.ans) { chosen = b; break; }
        }
        if (!chosen) parts.push({ k: 'skip' });
        else if (/^Print\b/.test(chosen.act[0])) parts.push(printed(row, chosen.act.join('\n'), sameLine));
        else chosen.act.forEach((line) => assigns(line).forEach((a) => parts.push(calc(a, env, names))));
        break;
      }
      default:
        break;
    }
    return { parts, env };
  }

  window.Explain = { narrate, evaluate, substitute, lines };
})();
