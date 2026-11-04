/* Every algorithm in the lecture, and the runner that "prints" them.
   A step with `run` changes the variables and may print; a step with `loop`
   is an "If ... go to step" check that returns true to jump back. The output
   is a list of rows: print adds to the last row and New line starts a new one.
   `log` lists the columns of the print log, read at the moment of each print. */
(function () {
  const L = window.I18n.ltr;

  window.EXAMPLES = {
    1: {
      shape: ['*@*@*@*'],
      vars: ['i'],
      log: [['i', (v) => v.i], ['i mod 2', (v) => v.i % 2]],
      note: 'i mod 2 is 0 when i is even, so the even places get "@" and the odd places get "*".',
      ar: { note: `${L('i mod 2')} يساوي 0 عندما يكون i زوجيًا، لذلك الأماكن الزوجية تأخذ ${L('"@"')} والأماكن الفردية تأخذ ${L('"*"')}.` },
      steps: [
        { text: 'Start' },
        { text: 'Declare i = 1', run: (v) => { v.i = 1; } },
        { text: 'If i mod 2 == 0 then print "@" else print "*"', run: (v, out) => out.print(v.i % 2 === 0 ? '@' : '*') },
        { text: 'i = i + 1', run: (v) => { v.i += 1; } },
        { text: 'If i <= 7 then go to step 3', loop: 2, run: (v) => v.i <= 7 },
        { text: 'End' },
      ],
    },

    2: {
      shape: ['12345'],
      vars: ['i'],
      log: [['i', (v) => v.i]],
      note: 'The diamond asks "i <= 5 ?". Yes goes back up to Print i, so i is printed 5 times. No goes to End.',
      ar: { note: `المعيّن يسأل ${L('i <= 5 ?')}. سهم Yes يرجع إلى ${L('Print i')}، لذلك تُطبع i خمس مرات. سهم No يذهب إلى End.` },
      steps: [
        { text: 'Start' },
        { text: 'Declare i = 1', run: (v) => { v.i = 1; } },
        { text: 'Print i', run: (v, out) => out.print(v.i) },
        { text: 'i = i + 1', run: (v) => { v.i += 1; } },
        { text: 'If i <= 5 then go to step 3', loop: 2, run: (v) => v.i <= 5 },
        { text: 'End' },
      ],
      /* Shown as a flowchart: one node per step (same order), then the arrows.
         kind: term = Start/End, proc = process, io = Print, dec = decision.
         An arrow appears once step `at` is on screen; `loop` marks the Yes arrow back up. */
      flow: {
        size: [700, 566],
        nodes: [
          { kind: 'term', x: 200, y: 6, w: 180, h: 60, label: 'Start' },
          { kind: 'proc', x: 170, y: 104, w: 240, h: 66, label: 'i = 1' },
          { kind: 'io', x: 160, y: 208, w: 260, h: 66, label: 'Print i' },
          { kind: 'proc', x: 170, y: 312, w: 240, h: 66, label: 'i = i + 1' },
          { kind: 'dec', x: 140, y: 416, w: 300, h: 140, label: 'i <= 5 ?' },
          { kind: 'term', x: 530, y: 456, w: 150, h: 60, label: 'End' },
        ],
        edges: [
          { at: 1, pts: [[290, 66], [290, 104]] },
          { at: 2, pts: [[290, 170], [290, 208]] },
          { at: 3, pts: [[290, 274], [290, 312]] },
          { at: 4, pts: [[290, 378], [290, 416]] },
          { at: 4, loop: true, pts: [[140, 486], [40, 486], [40, 241], [173, 241]], label: 'Yes', lx: 90, ly: 466 },
          { at: 5, pts: [[440, 486], [530, 486]], label: 'No', lx: 485, ly: 466 },
        ],
      },
    },

    3: {
      shape: ['*', '**', '***', '****'],
      vars: ['i', 'j'],
      log: [['i', (v) => v.i], ['j', (v) => v.j]],
      note: 'The inner loop (j) prints the stars of one row. The outer loop (i) moves to the next row, with New line and j = 1.',
      ar: { note: `الـ Inner loop ${L('(j)')} يطبع نجوم سطر واحد. الـ Outer loop ${L('(i)')} ينتقل إلى السطر التالي باستخدام New line و ${L('j = 1')}.` },
      steps: [
        { text: 'Start' },
        { text: 'Declare i = 1, j = 1', run: (v) => { v.i = 1; v.j = 1; } },
        { text: 'Print "*"', run: (v, out) => out.print('*') },
        { text: 'j = j + 1', run: (v) => { v.j += 1; } },
        { text: 'If j <= i then go to step 3', loop: 2, run: (v) => v.j <= v.i },
        { text: 'i = i + 1, j = 1', run: (v) => { v.i += 1; v.j = 1; } },
        { text: 'New line', run: (v, out) => out.newline() },
        { text: 'If i <= 4 then go to step 3', loop: 2, run: (v) => v.i <= 4 },
        { text: 'End' },
      ],
    },

    4: {
      shape: ['1234A', '123A5', '12A45', '1A345', 'A2345'],
      vars: ['r', 'c'],
      log: [['r', (v) => v.r], ['c', (v) => v.c], ['r + c', (v) => v.r + v.c]],
      note: 'Every row prints c = 1 to 5. The place where r + c = 6 gets "A" instead of its number, so the A moves one place left on every row.',
      ar: { note: `كل سطر يطبع ${L('c')} من 1 إلى 5. المكان الذي فيه ${L('r + c = 6')} يأخذ ${L('"A"')} بدل رقمه، لذلك تتحرك ${L('A')} مكانًا واحدًا إلى اليسار في كل سطر.` },
      steps: [
        { text: 'Start' },
        { text: 'Declare r = 1, c = 1', run: (v) => { v.r = 1; v.c = 1; } },
        { text: 'If r + c == 6 then print "A" else print c', run: (v, out) => out.print(v.r + v.c === 6 ? 'A' : String(v.c)) },
        { text: 'c = c + 1', run: (v) => { v.c += 1; } },
        { text: 'If c <= 5 then go to step 3', loop: 2, run: (v) => v.c <= 5 },
        { text: 'Print new line', run: (v, out) => out.newline() },
        { text: 'r = r + 1, c = 1', run: (v) => { v.r += 1; v.c = 1; } },
        { text: 'If r <= 5 then go to step 3', loop: 2, run: (v) => v.r <= 5 },
        { text: 'End' },
      ],
    },
  };

  /* Activity 1: each round changes one line of an example (shown highlighted).
     A step marked `removed` stays on screen, crossed out, and does nothing. */
  const swap = (base, i, step) => window.EXAMPLES[base].steps.map((s, k) => (k === i ? { ...step, changed: true } : s));
  window.PREDICT = [
    {
      base: 1,
      steps: swap(1, 4, { text: 'If i <= 5 then go to step 3', loop: 2, run: (v) => v.i <= 5 }),
      why: 'The loop stops after i = 5, so only 5 characters are printed.',
      ar: { why: `الـ Loop يتوقف بعد ${L('i = 5')}، لذلك تُطبع 5 رموز فقط.` },
    },
    {
      base: 1,
      steps: swap(1, 2, { text: 'If i mod 3 == 0 then print "@" else print "*"', run: (v, out) => out.print(v.i % 3 === 0 ? '@' : '*') }),
      why: 'Only 3 and 6 divide by 3 with no remainder, so "@" is printed at places 3 and 6.',
      ar: { why: `العددان 3 و 6 فقط يقبلان القسمة على 3 بدون باقٍ، لذلك يُطبع ${L('"@"')} في المكانين 3 و 6.` },
    },
    {
      base: 3,
      steps: swap(3, 6, { text: 'New line', removed: true }),
      why: 'Without New line, every star stays on the same line: 1 + 2 + 3 + 4 = 10 stars.',
      ar: { why: `بدون New line تبقى كل النجوم على نفس السطر: ${L('1 + 2 + 3 + 4 = 10')} نجوم.` },
    },
    {
      base: 3,
      steps: swap(3, 5, { text: 'i = i + 1', run: (v) => { v.i += 1; } }),
      why: 'j is never set back to 1. Every row starts with j = i, so each row gets only one star.',
      ar: { why: `لا يعود j إلى 1 أبدًا. كل سطر يبدأ و ${L('j = i')}، لذلك يحصل كل سطر على نجمة واحدة فقط.` },
    },
    {
      base: 4,
      steps: swap(4, 2, { text: 'If r == c then print "A" else print c', run: (v, out) => out.print(v.r === v.c ? 'A' : String(v.c)) }),
      why: 'Now "A" is printed where r = c: place 1 in row 1, place 2 in row 2… so the A line goes the other way.',
      ar: { why: `الآن يُطبع ${L('"A"')} حيث ${L('r = c')}: المكان 1 في السطر 1، والمكان 2 في السطر 2… لذلك يميل خط ${L('A')} في الاتجاه الآخر.` },
    },
  ];

  /* Activity 2: students write these; the solution is revealed on request. */
  window.CHALLENGES = [
    {
      level: 'warm',
      shape: ['@*@*@*@'],
      steps: [
        { text: 'Start' },
        { text: 'Declare i = 1', run: (v) => { v.i = 1; } },
        { text: 'If i mod 2 == 0 then print "*" else print "@"', run: (v, out) => out.print(v.i % 2 === 0 ? '*' : '@') },
        { text: 'i = i + 1', run: (v) => { v.i += 1; } },
        { text: 'If i <= 7 then go to step 3', loop: 2, run: (v) => v.i <= 7 },
        { text: 'End' },
      ],
    },
    {
      level: 'core',
      shape: ['****', '***', '**', '*'],
      steps: [
        { text: 'Start' },
        { text: 'Declare i = 4, j = 1', run: (v) => { v.i = 4; v.j = 1; } },
        { text: 'Print "*"', run: (v, out) => out.print('*') },
        { text: 'j = j + 1', run: (v) => { v.j += 1; } },
        { text: 'If j <= i then go to step 3', loop: 2, run: (v) => v.j <= v.i },
        { text: 'i = i - 1, j = 1', run: (v) => { v.i -= 1; v.j = 1; } },
        { text: 'New line', run: (v, out) => out.newline() },
        { text: 'If i >= 1 then go to step 3', loop: 2, run: (v) => v.i >= 1 },
        { text: 'End' },
      ],
    },
    {
      level: 'challenge',
      shape: ['1', '12', '123', '1234'],
      steps: [
        { text: 'Start' },
        { text: 'Declare i = 1, j = 1', run: (v) => { v.i = 1; v.j = 1; } },
        { text: 'Print j', run: (v, out) => out.print(v.j) },
        { text: 'j = j + 1', run: (v) => { v.j += 1; } },
        { text: 'If j <= i then go to step 3', loop: 2, run: (v) => v.j <= v.i },
        { text: 'i = i + 1, j = 1', run: (v) => { v.i += 1; v.j = 1; } },
        { text: 'New line', run: (v, out) => out.newline() },
        { text: 'If i <= 4 then go to step 3', loop: 2, run: (v) => v.i <= 4 },
        { text: 'End' },
      ],
    },
  ];

  /* Activity 3, Pattern Lab: the same three shapes with numbers and characters the class picks.
     «…» marks the values the class changed, so the code can highlight them. */
  window.LAB = {
    row: (o) => [
      { text: 'Start' },
      { text: 'Declare i = 1', run: (v) => { v.i = 1; } },
      { text: `If i mod 2 == 0 then print "«${o.b}»" else print "«${o.a}»"`, run: (v, out) => out.print(v.i % 2 === 0 ? o.b : o.a) },
      { text: 'i = i + 1', run: (v) => { v.i += 1; } },
      { text: `If i <= «${o.n}» then go to step 3`, loop: 2, run: (v) => v.i <= o.n },
      { text: 'End' },
    ],
    triangle: (o) => [
      { text: 'Start' },
      { text: 'Declare i = 1, j = 1', run: (v) => { v.i = 1; v.j = 1; } },
      { text: `Print "«${o.a}»"`, run: (v, out) => out.print(o.a) },
      { text: 'j = j + 1', run: (v) => { v.j += 1; } },
      { text: 'If j <= i then go to step 3', loop: 2, run: (v) => v.j <= v.i },
      { text: 'i = i + 1, j = 1', run: (v) => { v.i += 1; v.j = 1; } },
      { text: 'New line', run: (v, out) => out.newline() },
      { text: `If i <= «${o.n}» then go to step 3`, loop: 2, run: (v) => v.i <= o.n },
      { text: 'End' },
    ],
    stairs: (o) => [
      { text: 'Start' },
      { text: 'Declare i = 1, j = 1', run: (v) => { v.i = 1; v.j = 1; } },
      { text: `If i = j then print "«${o.b}»" else print "«${o.a}»"`, run: (v, out) => out.print(v.i === v.j ? o.b : o.a) },
      { text: 'j = j + 1', run: (v) => { v.j += 1; } },
      { text: 'If j <= i then go to step 3', loop: 2, run: (v) => v.j <= v.i },
      { text: 'i = i + 1, j = 1', run: (v) => { v.i += 1; v.j = 1; } },
      { text: 'New line', run: (v, out) => out.newline() },
      { text: `If i <= «${o.n}» then go to step 3`, loop: 2, run: (v) => v.i <= o.n },
      { text: 'End' },
    ],
  };

  /* Loop lanes for the arrows: a loop that contains another loop is drawn
     one lane further out (lane 0 = inner or single loop, lane 1 = outer). */
  window.laneSteps = function (steps) {
    const loops = steps.map((s, i) => ({ s, from: i, to: s.loop })).filter((l) => l.to != null && !l.s.removed);
    const laneOf = (l) => {
      const inside = loops.filter((m) => m !== l && m.to >= l.to && m.from < l.from);
      return inside.length ? 1 + Math.max(...inside.map(laneOf)) : 0;
    };
    loops.forEach((l) => { l.s.lane = laneOf(l); });
    return steps;
  };
  Object.values(window.EXAMPLES).forEach((ex) => window.laneSteps(ex.steps));
  window.PREDICT.forEach((p) => window.laneSteps(p.steps));
  window.CHALLENGES.forEach((c) => window.laneSteps(c.steps));

  /* Runs a list of steps from start to end. Every step becomes a frame (with
     a copy of the variables and the output so far), so the trace can move freely.
     A frame's `event` says what that step printed, if anything. */
  window.runSteps = function (steps, log = []) {
    const v = {};
    const rows = [''];
    const frames = [];
    let event = null;
    const out = {
      print(ch) {
        event = { type: 'print', ch: String(ch), cols: log.map(([, get]) => get(v)) };
        rows[rows.length - 1] += String(ch);
      },
      newline() {
        event = { type: 'nl' };
        rows.push('');
      },
    };
    let pc = 0;
    while (pc < steps.length && frames.length < 3000) {
      const step = steps[pc];
      let next = pc + 1;
      let jumped = false;
      event = null;
      if (!step.removed && step.loop != null) {
        if (step.run(v)) { next = step.loop; jumped = true; }
      } else if (!step.removed && step.run) {
        step.run(v, out);
      }
      frames.push({ pc, vars: { ...v }, rows: rows.slice(), event, jumped });
      pc = next;
    }
    return frames;
  };

  /* The finished drawing, without the empty row a final New line leaves behind. */
  window.drawShape = function (steps) {
    const frames = window.runSteps(steps);
    const rows = frames[frames.length - 1].rows.slice();
    while (rows.length > 1 && rows[rows.length - 1] === '') rows.pop();
    return rows;
  };
})();
