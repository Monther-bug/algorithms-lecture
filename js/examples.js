/* The three worked examples.
   Each solution is written as a list of steps. Steps with `run` change the
   variables; steps with `loop` are the "If ... go to step" checks: they
   return true to jump back, and each check adds a row to the trace table. */
(function () {
  window.EXAMPLES = {
    1: {
      question: 'Write an algorithm to calculate the factorial of any number N the user enters.',
      inputs: [{ key: 'n', value: 5, min: 0, max: 10 }],
      vars: ['n', 'i', 'fact'],
      table: [['fact', 'fact'], ['i', 'i']],
      check: 'i <= n ?',
      steps: [
        { text: 'Start' },
        { text: 'Declare n, i = 1, fact = 1', run: (v) => { v.n = '?'; v.i = 1; v.fact = 1; } },
        { text: 'Input n', run: (v, input) => { v.n = input.n; } },
        { text: 'fact = fact * i', run: (v) => { v.fact *= v.i; } },
        { text: 'i = i + 1', run: (v) => { v.i += 1; } },
        { text: 'If i <= n then go to step 4', loop: 3, run: (v) => v.i <= v.n },
        { text: 'Print fact', run: (v) => { v.out = v.fact; } },
        { text: 'End' },
      ],
    },

    2: {
      question: 'Write an algorithm that calculates y = 4! × 5!',
      inputs: [],
      fixed: 'No input needed: the algorithm sets i = 4 itself.',
      vars: ['y', 'fact', 'c', 'i'],
      table: [['fact', 'fact'], ['c', 'c']],
      check: 'c <= i ?',
      note: 'The loop finds 4! = 24. Since 5! = 5 × 4!, step 6 gets 5! as fact × (i + 1) without a second loop.',
      steps: [
        { text: 'Start' },
        { text: 'Declare y, fact = 1, c = 1, i = 4', run: (v) => { v.y = '?'; v.fact = 1; v.c = 1; v.i = 4; } },
        { text: 'fact = fact * c', run: (v) => { v.fact *= v.c; } },
        { text: 'c = c + 1', run: (v) => { v.c += 1; } },
        { text: 'If c <= i then go to step 3', loop: 2, run: (v) => v.c <= v.i },
        { text: 'y = fact * (fact * (i + 1))', run: (v) => { v.y = v.fact * (v.fact * (v.i + 1)); } },
        { text: 'Print y', run: (v) => { v.out = v.y; } },
        { text: 'End' },
      ],
    },

    3: {
      question: 'Write an algorithm to calculate y = 4X! + Z², where the user enters X and Z.',
      inputs: [{ key: 'X', value: 2, min: 0, max: 10 }, { key: 'Z', value: 3, min: -99, max: 99 }],
      vars: ['X', 'Z', 'Factx', 'i', 'y'],
      table: [['Factx', 'Factx'], ['i', 'i']],
      check: 'i <= X ?',
      steps: [
        { text: 'Start' },
        { text: 'y = 0, Factx = 1, i = 1', run: (v) => { v.y = 0; v.Factx = 1; v.i = 1; } },
        { text: 'Input X, Z', run: (v, input) => { v.X = input.X; v.Z = input.Z; } },
        { text: 'Factx = Factx * i', run: (v) => { v.Factx *= v.i; } },
        { text: 'i = i + 1', run: (v) => { v.i += 1; } },
        { text: 'If i <= X then go to step 4', loop: 3, run: (v) => v.i <= v.X },
        { text: 'y = (4 * Factx) + (Z^2)', run: (v) => { v.y = 4 * v.Factx + v.Z * v.Z; } },
        { text: 'Print y', run: (v) => { v.out = v.y; } },
        { text: 'End' },
      ],
    },
  };

  /* Runs an example from start to end and records every step as a frame,
     so the trace panel can step forwards and backwards freely. */
  window.runExample = function (ex, input) {
    const v = {};
    const frames = [];
    let pc = 0;
    let pass = 0;
    while (pc < ex.steps.length && frames.length < 400) {
      const step = ex.steps[pc];
      let next = pc + 1;
      let row = null;
      let jumped = false;
      if (step.loop != null) {
        const again = step.run(v);
        pass += 1;
        row = { pass, check: again };
        for (const [key] of ex.table) row[key] = v[key];
        if (again) { next = step.loop; jumped = true; }
      } else if (step.run) {
        step.run(v, input);
      }
      frames.push({ pc, vars: { ...v }, row, jumped });
      pc = next;
    }
    return frames;
  };
})();
