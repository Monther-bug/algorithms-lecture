/* The four worked examples from the lecture notes.
   Each solution is a list of steps. Steps with `run` change the variables;
   steps with `loop` are the "If ... go to step" checks: they return true to
   jump back, and each check adds a row to the trace table. Steps marked
   `term` add one term of the series to y. */
(function () {
  const frac = (top, bottom) => `<span class="frac"><span>${top}</span><span>${bottom}</span></span>`;
  const x = '<i>x</i>';
  const y = '<i>y</i>';
  // Arabic notes keep code and maths left to right inside the sentence.
  const L = window.I18n.ltr;

  window.EXAMPLES = {
    1: {
      formula: `${y} = ${frac('8!', x)} + ${frac('6!', x)} + ${frac('4!', x)}`,
      inputs: [{ key: 'x', value: 2, min: 1, max: 99 }],
      vars: ['x', 'y', 'i', 'c', 'fact'],
      table: ['i', 'c', 'fact', 'y'],
      terms: ['8!/x', '6!/x', '4!/x'],
      note: 'The inner loop (steps 4–6) builds one factorial. The outer loop (steps 8–9) moves i to the next term and resets fact and c.',
      ar: {
        note: `الـ Inner loop (الخطوات ${L('4–6')}) يحسب Factorial واحدًا. الـ Outer loop (الخطوات ${L('8–9')}) ينقل i إلى الـ Term التالي ويُعيد fact و c إلى 1.`,
      },
      steps: [
        { text: 'Start' },
        { text: 'Input x', run: (v, input) => { v.x = input.x; } },
        { text: 'y = 0, i = 8, fact = 1, c = 1', run: (v) => { v.y = 0; v.i = 8; v.fact = 1; v.c = 1; } },
        { text: 'fact = fact * c', run: (v) => { v.fact *= v.c; } },
        { text: 'c = c + 1', run: (v) => { v.c += 1; } },
        { text: 'If c <= i go to step 4', loop: 3, check: 'c <= i', run: (v) => v.c <= v.i },
        { text: 'y = y + (fact / x)', term: true, run: (v) => { v.y += v.fact / v.x; } },
        { text: 'i = i - 2, fact = 1, c = 1', run: (v) => { v.i -= 2; v.fact = 1; v.c = 1; } },
        { text: 'If i >= 4 go to step 4', loop: 3, check: 'i >= 4', run: (v) => v.i >= 4 },
        { text: 'Print y', run: (v) => { v.out = v.y; } },
        { text: 'End' },
      ],
    },

    2: {
      formula: `${y} = ${frac('6!', '5!')} + ${frac('4!', '3!')} + 2! + 1!`,
      inputs: [],
      fixed: 'No input needed: the algorithm starts with x = 6 itself.',
      vars: ['y', 'x', 'c', 'fact'],
      table: ['x', 'c', 'fact', 'y'],
      terms: ['6!/5!', '4!/3!', '2!', '1!'],
      note: 'fact / x is (x − 1)!, so step 6 divides x! by (x − 1)!. The loop stops at x = 0, so step 9 adds 1! = 1 on its own.',
      ar: {
        fixed: `لا حاجة لـ Input: الـ Algorithm يبدأ بـ ${L('x = 6')} بنفسه.`,
        note: `${L('fact / x')} يساوي ${L('(x − 1)!')}، لذلك الخطوة 6 تقسم ${L('x!')} على ${L('(x − 1)!')}. الـ Loop يتوقف عند ${L('x = 0')}، لذلك الخطوة 9 تضيف ${L('1! = 1')} وحدها.`,
      },
      steps: [
        { text: 'Start' },
        { text: 'Declare y = 0, x = 6, fact = 1, c = 1', run: (v) => { v.y = 0; v.x = 6; v.fact = 1; v.c = 1; } },
        { text: 'fact = fact * c', run: (v) => { v.fact *= v.c; } },
        { text: 'c = c + 1', run: (v) => { v.c += 1; } },
        { text: 'If c <= x then go to step 3', loop: 2, check: 'c <= x', run: (v) => v.c <= v.x },
        { text: 'y = y + (fact / (fact / x))', term: true, run: (v) => { v.y += v.fact / (v.fact / v.x); } },
        { text: 'x = x - 2, fact = 1, c = 1', run: (v) => { v.x -= 2; v.fact = 1; v.c = 1; } },
        { text: 'If x >= 2 then go to step 3', loop: 2, check: 'x >= 2', run: (v) => v.x >= 2 },
        { text: 'y = y + 1', term: true, run: (v) => { v.y += 1; } },
        { text: 'Print y', run: (v) => { v.out = v.y; } },
        { text: 'End' },
      ],
    },

    3: {
      formula: `${y} = 2!·4! + 5!·7! + 8!·10!`,
      inputs: [],
      fixed: 'No input needed: i starts at 2 and goes up by 3.',
      vars: ['y', 'i', 'c', 'fact'],
      table: ['i', 'c', 'fact', 'y'],
      terms: ['2!·4!', '5!·7!', '8!·10!'],
      note: 'The loop finds i!. Since (i + 2)! = i! × (i + 1) × (i + 2), step 6 gets the second factorial without another loop.',
      ar: {
        fixed: 'لا حاجة لـ Input: i يبدأ من 2 ويزيد بمقدار 3.',
        note: `الـ Loop يحسب ${L('i!')}. وبما أن ${L('(i + 2)! = i! × (i + 1) × (i + 2)')}، فالخطوة 6 تحصل على الـ Factorial الثاني بدون Loop آخر.`,
      },
      steps: [
        { text: 'Start' },
        { text: 'Declare y = 0, i = 2, fact = 1, c = 1', run: (v) => { v.y = 0; v.i = 2; v.fact = 1; v.c = 1; } },
        { text: 'fact = fact * c', run: (v) => { v.fact *= v.c; } },
        { text: 'c = c + 1', run: (v) => { v.c += 1; } },
        { text: 'If c <= i then go to step 3', loop: 2, check: 'c <= i', run: (v) => v.c <= v.i },
        { text: 'y = y + fact * (fact * (i + 1) * (i + 2))', term: true, run: (v) => { v.y += v.fact * (v.fact * (v.i + 1) * (v.i + 2)); } },
        { text: 'i = i + 3, fact = 1, c = 1', run: (v) => { v.i += 3; v.fact = 1; v.c = 1; } },
        { text: 'If i <= 8 then go to step 3', loop: 2, check: 'i <= 8', run: (v) => v.i <= 8 },
        { text: 'Print y', run: (v) => { v.out = v.y; } },
        { text: 'End' },
      ],
    },

    4: {
      formula: `${y} = ${frac(`7${x}!`, '3!')} + ${frac(`5${x}!`, '5!')} + ${frac(`3${x}!`, '7!')}`,
      inputs: [{ key: 'x', value: 7, min: 0, max: 12 }],
      vars: ['x', 'y', 'c', 'factx', 'i', 'd', 'cd', 'factd'],
      table: ['c', 'factx', 'd', 'cd', 'factd', 'y'],
      terms: ['7x!/3!', '5x!/5!', '3x!/7!'],
      note: 'x! is the same in every term, so steps 4–6 work it out once. Then d goes 3, 5, 7 while the multiplier i goes 7, 5, 3.',
      ar: {
        note: `${L('x!')} هو نفسه في كل Term، لذلك الخطوات ${L('4–6')} تحسبه مرة واحدة. ثم d يأخذ القيم ${L('3, 5, 7')} بينما المعامل i يأخذ ${L('7, 5, 3')}.`,
      },
      steps: [
        { text: 'Start' },
        { text: 'Declare y = 0, x, factx = 1, c = 1, i = 7, d = 3, factd = 1, cd = 1', run: (v) => { v.y = 0; v.x = '?'; v.factx = 1; v.c = 1; v.i = 7; v.d = 3; v.factd = 1; v.cd = 1; } },
        { text: 'Input x', run: (v, input) => { v.x = input.x; } },
        { text: 'factx = factx * c', run: (v) => { v.factx *= v.c; } },
        { text: 'c = c + 1', run: (v) => { v.c += 1; } },
        { text: 'If c <= x then go to step 4', loop: 3, check: 'c <= x', run: (v) => v.c <= v.x },
        { text: 'factd = factd * cd', run: (v) => { v.factd *= v.cd; } },
        { text: 'cd = cd + 1', run: (v) => { v.cd += 1; } },
        { text: 'If cd <= d then go to step 7', loop: 6, check: 'cd <= d', run: (v) => v.cd <= v.d },
        { text: 'y = y + (i * factx / factd)', term: true, run: (v) => { v.y += v.i * v.factx / v.factd; } },
        { text: 'd = d + 2, i = i - 2, factd = 1, cd = 1', run: (v) => { v.d += 2; v.i -= 2; v.factd = 1; v.cd = 1; } },
        { text: 'If d <= 7 then go to step 7', loop: 6, check: 'd <= 7', run: (v) => v.d <= 7 },
        { text: 'Print y', run: (v) => { v.out = v.y; } },
        { text: 'End' },
      ],
    },
  };

  /* Loop lanes for the arrows: a loop that contains another loop is drawn
     one lane further out. Lane 0 is an inner (or single) loop, lane 1 an outer one. */
  for (const ex of Object.values(window.EXAMPLES)) {
    const loops = ex.steps.map((s, i) => ({ s, from: i, to: s.loop })).filter((l) => l.to != null);
    const laneOf = (l) => {
      const inside = loops.filter((m) => m !== l && m.to >= l.to && m.from < l.from);
      return inside.length ? 1 + Math.max(...inside.map(laneOf)) : 0;
    };
    loops.forEach((l) => { l.s.lane = laneOf(l); });
  }

  /* Numbers as people read them: 40,320 and at most four decimals. */
  window.fmt = function (value) {
    if (value === undefined) return '–';
    if (typeof value !== 'number' || !Number.isFinite(value)) return String(value);
    return value.toLocaleString('en-US', { maximumFractionDigits: 4 });
  };

  /* Runs an example from start to end and records every step as a frame,
     so the trace panel can step forwards and backwards freely. */
  window.runExample = function (ex, input) {
    const v = {};
    const frames = [];
    let pc = 0;
    let checks = 0;
    let terms = 0;
    while (pc < ex.steps.length && frames.length < 2000) {
      const step = ex.steps[pc];
      let next = pc + 1;
      let row = null;
      let term = null;
      let jumped = false;
      if (step.loop != null) {
        const again = step.run(v);
        checks += 1;
        row = { n: checks, check: step.check, again, lane: step.lane };
        for (const key of ex.table) row[key] = v[key];
        if (again) { next = step.loop; jumped = true; }
      } else if (step.run) {
        const before = v.y;
        step.run(v, input);
        if (step.term) { term = { index: terms, value: v.y - before }; terms += 1; }
      }
      frames.push({ pc, vars: { ...v }, row, term, jumped });
      pc = next;
    }
    return frames;
  };
})();
