/* Game questions: short and easy, about today's four shapes.
   type: 'mcq' (answer = index of the right option) or 'tf' (answer = true/false).
   `ar` holds the Arabic text; Arabic options are plain text, and options
   without an Arabic list stay as they are. */
(function () {
  const L = window.I18n.ltr;

  window.QUESTIONS = [
    {
      kind: 'Example 1', type: 'mcq',
      q: 'What does Example 1 draw?',
      options: ['*@*@*@', '*******', '*@*@*@*', '@*@*@*@'], answer: 2,
      why: 'Odd places print * and even places print @, for i = 1 to 7.',
      ar: { kind: 'المثال 1', q: 'ماذا يرسم المثال 1؟', why: `الأماكن الفردية تطبع ${L('*')} والأماكن الزوجية تطبع ${L('@')}، من ${L('i = 1')} إلى ${L('i = 7')}.` },
    },
    {
      kind: 'mod', type: 'mcq',
      q: 'What is 4 mod 2?',
      options: ['2', '0', '1', '4'], answer: 1,
      why: '4 ÷ 2 = 2 with nothing left over, so 4 mod 2 = 0.',
      ar: { kind: 'mod', q: `كم يساوي ${L('4 mod 2')}؟`, why: `${L('4 ÷ 2 = 2')} ولا يبقى شيء، لذلك ${L('4 mod 2 = 0')}.` },
    },
    {
      kind: 'mod', type: 'mcq',
      q: 'What is 5 mod 2?',
      options: ['1', '0', '2', '5'], answer: 0,
      why: '5 ÷ 2 = 2 with 1 left over, so 5 mod 2 = 1.',
      ar: { kind: 'mod', q: `كم يساوي ${L('5 mod 2')}؟`, why: `${L('5 ÷ 2 = 2')} ويبقى 1، لذلك ${L('5 mod 2 = 1')}.` },
    },
    {
      kind: 'True or false', type: 'tf',
      q: 'In Example 1, when i is even, the algorithm prints "@".',
      answer: true,
      why: 'Even numbers give i mod 2 = 0, and then it prints "@".',
      ar: { kind: 'صح أم خطأ', q: `في المثال 1، عندما يكون i زوجيًا يطبع الـ Algorithm ${L('"@"')}.`, why: `الأعداد الزوجية تعطي ${L('i mod 2 = 0')}، وعندها يطبع ${L('"@"')}.` },
    },
    {
      kind: 'Example 3', type: 'mcq',
      q: 'Which step moves the drawing down to the next row?',
      options: ['Print "*"', 'j = j + 1', 'New line', 'End'], answer: 2,
      why: 'New line starts the next row.',
      ar: { kind: 'المثال 3', q: 'أي خطوة تنقل الرسم إلى السطر التالي؟', why: 'خطوة New line تبدأ السطر التالي.' },
    },
    {
      kind: 'Example 3', type: 'mcq',
      q: 'How many stars are in row 3 of the triangle?',
      options: ['1', '2', '4', '3'], answer: 3,
      why: 'Row i has i stars, so row 3 has 3 stars.',
      ar: { kind: 'المثال 3', q: 'كم نجمة في السطر 3 من المثلث؟', why: 'السطر i فيه i نجوم، لذلك السطر 3 فيه 3 نجوم.' },
    },
    {
      kind: 'Loops', type: 'tf',
      q: 'In Example 3, the inner loop (j) prints the stars of one row.',
      answer: true,
      why: 'j moves along one row, and i moves down to the next row.',
      ar: { kind: 'Loops', q: `في المثال 3، الـ Inner loop ${L('(j)')} يطبع نجوم سطر واحد.`, why: 'j يتحرك داخل السطر الواحد، و i ينتقل إلى السطر التالي.' },
    },
    {
      kind: 'Think about it', type: 'mcq',
      q: 'Why do we set j = 1 again after each row?',
      options: ['To end the algorithm', 'So the next row starts from its first place', 'To print a 5', 'To make i bigger'], answer: 1,
      why: 'Every new row must start counting from place 1.',
      ar: {
        kind: 'فكّر فيها', q: `لماذا نُرجع ${L('j = 1')} بعد كل سطر؟`,
        options: ['لإنهاء الـ Algorithm', 'حتى يبدأ السطر التالي من أول مكان', 'لطباعة 5', 'لزيادة قيمة i'],
        why: 'كل سطر جديد يجب أن يبدأ العدّ من المكان 1.',
      },
    },
    {
      kind: 'Example 4', type: 'mcq',
      q: 'What does row 2 of Example 4 print?',
      options: ['5*', '*5', '55', '**'], answer: 1,
      why: 'In row 2, j = 1 prints "*" and j = 2 = i prints "5".',
      ar: { kind: 'المثال 4', q: 'ماذا يطبع السطر 2 في المثال 4؟', why: `في السطر 2: عندما ${L('j = 1')} يُطبع ${L('"*"')}، وعندما ${L('j = 2 = i')} يُطبع ${L('"5"')}.` },
    },
    {
      kind: 'Example 4', type: 'mcq',
      q: 'In Example 4, when is "5" printed?',
      options: ['When j = 1', 'Always', 'Never', 'When i = j'], answer: 3,
      why: 'The condition is "If i = j", and that is the last place of each row.',
      ar: {
        kind: 'المثال 4', q: `في المثال 4، متى يُطبع ${L('"5"')}؟`,
        options: ['عندما j = 1', 'دائمًا', 'أبدًا', 'عندما i = j'],
        why: `الشرط هو ${L('If i = j')}، وهذا آخر مكان في كل سطر.`,
      },
    },
    {
      kind: 'True or false', type: 'tf',
      q: 'If we forget New line, all the stars are printed on one line.',
      answer: true,
      why: 'Without New line nothing moves the drawing down, so it stays on one line.',
      ar: { kind: 'صح أم خطأ', q: 'إذا نسينا New line، تُطبع كل النجوم على سطر واحد.', why: 'بدون New line لا شيء ينقل الرسم إلى الأسفل، لذلك يبقى على سطر واحد.' },
    },
    {
      kind: 'Example 2', type: 'mcq',
      q: 'How many "#" does Example 2 print?',
      options: ['1', '4', '5', '6'], answer: 2,
      why: 'The loop runs for i = 1 to 5, and each time it prints one "#".',
      ar: { kind: 'المثال 2', q: `كم ${L('"#"')} يطبع المثال 2؟`, why: `الـ Loop يعمل من ${L('i = 1')} إلى ${L('i = 5')}، وفي كل مرة يطبع ${L('"#"')} واحدًا.` },
    },
  ];
})();
