/* Game questions, all about the four examples in this lecture.
   type: 'mcq' (answer = index of the right option), 'tf' (answer = true/false)
   or 'order' (items are listed in the right order and shuffled on screen;
   `from` is the step number of the first item). */
(function () {
  const steps = (n) => window.EXAMPLES[n].steps;
  const lines = (n) => steps(n).map((s, i) => `${i + 1}- ${s.text}`);

  window.QUESTIONS = [
    {
      kind: 'Trace it', type: 'mcq',
      q: 'The user enters x = 4. What does Example 1 print?',
      code: lines(1),
      options: ['20532', '10266', '41064', '10260'], answer: 1,
      why: '8! + 6! + 4! = 40320 + 720 + 24 = 41064, and 41064 / 4 = 10266.',
    },
    {
      kind: 'Think about it', type: 'mcq',
      q: 'In Example 1, why does step 8 set fact = 1 and c = 1 again?',
      options: ['To end the algorithm', 'So the next factorial starts from scratch', 'Because x has changed', 'To print the answer'], answer: 1,
      why: 'Without the reset, fact would still hold 8! and the next term would be wrong.',
    },
    {
      kind: 'Loops', type: 'mcq',
      q: 'Which step moves Example 1 on to the next term of the series?',
      code: lines(1),
      options: ['4- fact = fact * c', '6- If c <= i go to step 4', '8- i = i - 2, fact = 1, c = 1', '10- Print y'], answer: 2,
      why: 'i goes 8, 6, 4: one value for each term.',
    },
    {
      kind: 'Count it', type: 'mcq',
      q: 'How many times does Example 1 check i >= 4 in step 9?',
      options: ['2', '3', '4', '18'], answer: 1,
      why: 'Once after each term: i = 6 (yes), i = 4 (yes), i = 2 (no, so it prints y).',
    },
    {
      kind: 'Put it in order', type: 'order',
      q: 'Put steps 4 to 9 of Example 1 in the right order.',
      items: steps(1).slice(3, 9).map((s) => s.text),
      from: 4,
      why: 'Build the factorial (4–6), add the term (7), move to the next term (8), then check (9).',
    },
    {
      kind: 'Trace it', type: 'mcq',
      q: 'What does Example 2 print?',
      code: lines(2),
      options: ['12', '13', '720', '10'], answer: 1,
      why: '6!/5! + 4!/3! + 2! + 1! = 6 + 4 + 2 + 1 = 13.',
    },
    {
      kind: 'Think about it', type: 'mcq',
      q: 'In Example 2, what is fact / (fact / x) equal to?',
      code: ['6- y = y + (fact / (fact / x))'],
      options: ['fact', '1', 'x', 'x!'], answer: 2,
      why: 'fact / x is (x − 1)!, and x! / (x − 1)! = x. So the terms add 6, 4 and 2.',
    },
    {
      kind: 'True or false', type: 'tf',
      q: 'In Example 2, step 9 (y = y + 1) adds the 1! term.',
      answer: true,
      why: 'The loop stops at x = 0, so 1! = 1 is added on its own after the loop.',
    },
    {
      kind: 'Trace it', type: 'mcq',
      q: 'In Example 3 the first loop ends with i = 2 and fact = 2. What does step 6 add to y?',
      code: ['6- y = y + fact * (fact * (i + 1) * (i + 2))'],
      options: ['24', '8', '48', '12'], answer: 2,
      why: '2 × (2 × 3 × 4) = 2 × 24 = 48, which is 2! × 4!.',
    },
    {
      kind: 'Spot the pattern', type: 'mcq',
      q: 'Which values does i take in Example 3?',
      code: ['2- Declare y = 0, i = 2, fact = 1, c = 1', '7- i = i + 3, fact = 1, c = 1', '8- If i <= 8 then go to step 3'],
      options: ['2, 4, 6, 8', '2, 5, 8', '2, 5, 8, 11', '1, 4, 7'], answer: 1,
      why: 'i starts at 2 and step 7 adds 3. At i = 11 the check i <= 8 fails, so 11 is never used.',
    },
    {
      kind: 'Trace it', type: 'mcq',
      q: 'In Example 4 the user enters x = 7, so x! = 5040. What is the first term, 7x!/3!?',
      options: ['840', '5040', '35280', '5880'], answer: 3,
      why: '7 × 5040 = 35280, and 35280 / 3! = 35280 / 6 = 5880.',
    },
    {
      kind: 'True or false', type: 'tf',
      q: 'In Example 4, the loop in steps 4 to 6 runs again for every term.',
      answer: false,
      why: 'x! is the same in every term, so steps 4 to 6 run only once. Step 12 jumps back to step 7, not step 4.',
    },
  ];
})();
