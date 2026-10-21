/* Game questions, all about the three examples in this lecture.
   type: 'mcq' (answer = index of the right option), 'tf' (answer = true/false)
   or 'order' (items are listed in the right order and shuffled on screen). */
(function () {
  const lines = (n) => window.EXAMPLES[n].steps.map((s, i) => `${i + 1}- ${s.text}`);

  window.QUESTIONS = [
    {
      kind: 'Trace it', type: 'mcq',
      q: 'The user enters n = 4. What does the factorial algorithm print?',
      code: lines(1),
      options: ['16', '24', '10', '120'], answer: 1,
      why: '1 × 2 × 3 × 4 = 24.',
    },
    {
      kind: 'Think about it', type: 'mcq',
      q: 'Why does fact start at 1 and not at 0?',
      options: ['Multiplying by 0 would make every answer 0', 'Because i also starts at 1', 'Computers cannot store 0', 'It makes the loop shorter'], answer: 0,
      why: 'fact is multiplied on every pass. If it started at 0 it would stay 0.',
    },
    {
      kind: 'Loops', type: 'mcq',
      q: 'Which step makes the factorial algorithm repeat?',
      code: lines(1),
      options: ['3- Input n', '5- i = i + 1', '7- Print fact', '6- If i <= n then go to step 4'], answer: 3,
      why: 'Step 6 jumps back to step 4, so steps 4 to 6 run again.',
    },
    {
      kind: 'Count it', type: 'mcq',
      q: 'The user enters n = 5. How many times does step 4 (fact = fact * i) run?',
      options: ['4', '6', '5', '1'], answer: 2,
      why: 'It runs once for each i from 1 to 5.',
    },
    {
      kind: 'Trace table', type: 'mcq',
      q: 'n = 3. What are i and fact after the second pass through the loop?',
      code: lines(1),
      options: ['i = 2, fact = 2', 'i = 3, fact = 6', 'i = 3, fact = 2', 'i = 2, fact = 1'], answer: 2,
      why: 'Pass 1: fact = 1, i = 2. Pass 2: fact = 2, i = 3.',
    },
    {
      kind: 'Put it in order', type: 'order',
      q: 'Put the steps of the factorial algorithm in the right order.',
      items: window.EXAMPLES[1].steps.map((s) => s.text),
      why: 'Declare, input, then loop: multiply, count, check. Print after the loop ends.',
    },
    {
      kind: 'Trace it', type: 'mcq',
      q: 'In Example 2 the loop ends with fact = 24 and i = 4. What is y?',
      code: ['6- y = fact * (fact * (i + 1))'],
      options: ['144', '600', '2880', '120'], answer: 2,
      why: '24 × (24 × 5) = 24 × 120 = 2880.',
    },
    {
      kind: 'Think about it', type: 'mcq',
      q: 'Why does fact * (fact * 5) give 4! × 5!?',
      options: ['Because 4! and 5! are equal', 'Because i + 1 = 4', 'Because the loop runs 5 times', 'Because 5! = 5 × 4!'], answer: 3,
      why: 'fact holds 4! = 24, and fact × 5 = 120, which is 5!.',
    },
    {
      kind: 'True or false', type: 'tf',
      q: 'If step 6 used i < n instead of i <= n, the algorithm would still print n!.',
      answer: false,
      why: 'The loop would stop one pass early and print (n − 1)! instead.',
    },
    {
      kind: 'Trace it', type: 'mcq',
      q: 'X = 3 and Z = 4. What does Example 3 print for y = 4X! + Z²?',
      code: ['7- y = (4 * Factx) + (Z^2)'],
      options: ['40', '28', '32', '22'], answer: 0,
      why: '3! = 6, so y = 4 × 6 + 4² = 24 + 16 = 40.',
    },
    {
      kind: 'Spot the bug', type: 'mcq',
      q: 'Someone wrote "Declare n, i = 1, fact = 0". What does it print for n = 5?',
      options: ['120', '5', '0', '1'], answer: 2,
      why: '0 times anything is 0, so fact stays 0 the whole time.',
    },
    {
      kind: 'True or false', type: 'tf',
      q: 'If the user enters n = 0, the factorial algorithm prints 1.',
      answer: true,
      why: 'The loop runs once with i = 1, so fact = 1. That matches 0! = 1.',
    },
  ];
})();
