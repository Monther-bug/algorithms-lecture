/* Game questions: short and easy, about today's lecture.
   type: 'mcq' (answer = index of the right option), 'tf' (answer = true/false)
   or 'order' (items are listed in the right order and shuffled on screen;
   `from` is the step number of the first item).
   `ar` holds the Arabic text; options without an Arabic list stay as they are. */
(function () {
  const L = window.I18n.ltr;

  window.QUESTIONS = [
    {
      kind: 'Factorials', type: 'mcq',
      q: 'What is 3!?',
      options: ['3', '6', '9', '1'], answer: 1,
      why: '3! = 1 × 2 × 3 = 6.',
      ar: { kind: 'Factorials', q: `كم يساوي ${L('3!')}؟`, why: `${L('3! = 1 × 2 × 3 = 6')}.` },
    },
    {
      kind: 'Factorials', type: 'mcq',
      q: 'What is 4!?',
      options: ['24', '16', '10', '12'], answer: 0,
      why: '4! = 1 × 2 × 3 × 4 = 24.',
      ar: { kind: 'Factorials', q: `كم يساوي ${L('4!')}؟`, why: `${L('4! = 1 × 2 × 3 × 4 = 24')}.` },
    },
    {
      kind: 'True or false', type: 'tf',
      q: '5! = 1 × 2 × 3 × 4 × 5',
      answer: true,
      why: 'A factorial multiplies all the numbers from 1 up to the number.',
      ar: { kind: 'صح أم خطأ', q: L('5! = 1 × 2 × 3 × 4 × 5'), why: 'الـ Factorial يضرب كل الأعداد من 1 حتى العدد نفسه.' },
    },
    {
      kind: 'Think about it', type: 'mcq',
      q: 'What number should fact start at?',
      options: ['0', '10', '1', 'Any number'], answer: 2,
      why: 'We multiply fact every time. If it started at 0, the answer would always be 0.',
      ar: {
        kind: 'فكّر فيها', q: 'بأي عدد يجب أن يبدأ fact؟',
        options: ['0', '10', '1', 'أي عدد'],
        why: 'نضرب fact في كل مرة. لو بدأ من 0 لكانت الإجابة دائمًا 0.',
      },
    },
    {
      kind: 'Loops', type: 'mcq',
      q: 'Which loop finds one factorial?',
      options: ['The outer loop', 'The inner loop', 'Both loops', 'No loop'], answer: 1,
      why: 'The inner loop multiplies 1 × 2 × 3 … to build one factorial.',
      ar: {
        kind: 'Loops', q: 'أي Loop يحسب Factorial واحدًا؟',
        options: ['الـ Outer loop', 'الـ Inner loop', 'الاثنان معًا', 'بدون Loop'],
        why: `الـ Inner loop يضرب ${L('1 × 2 × 3 …')} ليحسب Factorial واحدًا.`,
      },
    },
    {
      kind: 'Loops', type: 'mcq',
      q: 'Which loop moves to the next number: 8, then 6, then 4?',
      options: ['The inner loop', 'The Print step', 'The Start step', 'The outer loop'], answer: 3,
      why: 'The outer loop changes i to the next number.',
      ar: {
        kind: 'Loops', q: 'أي Loop ينتقل إلى العدد التالي: 8، ثم 6، ثم 4؟',
        options: ['الـ Inner loop', 'خطوة Print', 'خطوة Start', 'الـ Outer loop'],
        why: 'الـ Outer loop يغيّر i إلى العدد التالي.',
      },
    },
    {
      kind: 'True or false', type: 'tf',
      q: 'Before the next factorial, we set fact back to 1.',
      answer: true,
      why: 'Every factorial must start fresh from 1.',
      ar: { kind: 'صح أم خطأ', q: 'قبل الـ Factorial التالي، نُرجع fact إلى 1.', why: 'كل Factorial يجب أن يبدأ من جديد من 1.' },
    },
    {
      kind: 'Example 1', type: 'mcq',
      q: 'In Example 1, i goes 8, 6, 4. How much does i go down each time?',
      options: ['1', '2', '3', '4'], answer: 1,
      why: 'i = i − 2, so i goes 8, 6, 4.',
      ar: {
        kind: 'المثال 1', q: 'في المثال 1، i يأخذ القيم 8، 6، 4. بكم ينقص i في كل مرة؟',
        why: `${L('i = i − 2')}، لذلك i يأخذ القيم 8، 6، 4.`,
      },
    },
    {
      kind: 'Example 2', type: 'mcq',
      q: 'What is 6!/5!?',
      options: ['1', '30', '720', '6'], answer: 3,
      why: '6!/5! = 720 / 120 = 6.',
      ar: { kind: 'المثال 2', q: `كم يساوي ${L('6!/5!')}؟`, why: `${L('6!/5! = 720 / 120 = 6')}.` },
    },
    {
      kind: 'Example 3', type: 'mcq',
      q: 'In Example 3, i goes 2, 5, 8. How much do we add to i each time?',
      options: ['1', '2', '3', '5'], answer: 2,
      why: 'i = i + 3, so i goes 2, 5, 8.',
      ar: {
        kind: 'المثال 3', q: 'في المثال 3، i يأخذ القيم 2، 5، 8. كم نضيف إلى i في كل مرة؟',
        why: `${L('i = i + 3')}، لذلك i يأخذ القيم 2، 5، 8.`,
      },
    },
    {
      kind: 'Example 4', type: 'tf',
      q: 'In Example 4, we work out x! only once.',
      answer: true,
      why: 'x! is the same in every term, so we do not need to work it out again.',
      ar: {
        kind: 'المثال 4', q: `في المثال 4، نحسب ${L('x!')} مرة واحدة فقط.`,
        why: `${L('x!')} هو نفسه في كل Term، لذلك لا نحتاج لحسابه مرة أخرى.`,
      },
    },
    {
      kind: 'Algorithms', type: 'mcq',
      q: 'Which step shows the answer on the screen?',
      options: ['Start', 'Input x', 'Print y', 'End'], answer: 2,
      why: 'Print shows the value of y on the screen.',
      ar: { kind: 'Algorithms', q: 'أي خطوة تعرض الإجابة على الشاشة؟', why: 'خطوة Print تعرض قيمة y على الشاشة.' },
    },
  ];
})();
