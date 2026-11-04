/* Game questions: short and easy, about today's four examples.
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
      kind: 'True or false', type: 'tf',
      q: 'In Example 1, when i is even, the algorithm prints "@".',
      answer: true,
      why: 'Even numbers give i mod 2 = 0, and then it prints "@".',
      ar: { kind: 'صح أم خطأ', q: `في المثال 1، عندما يكون i زوجيًا يطبع الـ Algorithm ${L('"@"')}.`, why: `الأعداد الزوجية تعطي ${L('i mod 2 = 0')}، وعندها يطبع ${L('"@"')}.` },
    },
    {
      kind: 'Flowchart', type: 'mcq',
      q: 'In a flowchart, which shape asks a yes/no question?',
      options: ['Oval', 'Rectangle', 'Diamond', 'Parallelogram'], answer: 2,
      why: 'A diamond is a decision. It has a Yes arrow and a No arrow.',
      ar: {
        kind: 'Flowchart', q: 'في الـ Flowchart، أي شكل يطرح سؤالًا جوابه نعم أو لا؟',
        options: ['شكل بيضاوي', 'مستطيل', 'معيّن', 'متوازي أضلاع'],
        why: 'المعيّن هو Decision، ويخرج منه سهم Yes وسهم No.',
      },
    },
    {
      kind: 'Example 2', type: 'mcq',
      q: 'What does the flowchart in Example 2 print?',
      options: ['1234', '12345', '11111', '123456'], answer: 1,
      why: 'i starts at 1, Print i shows it, and the Yes arrow repeats until i = 5.',
      ar: { kind: 'المثال 2', q: 'ماذا يطبع الـ Flowchart في المثال 2؟', why: `i يبدأ من 1، و ${L('Print i')} يعرضه، وسهم Yes يكرر حتى ${L('i = 5')}.` },
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
      options: ['12A45', '123A5', '1234A', '12345'], answer: 1,
      why: 'In row 2, r + c = 6 when c = 4, so place 4 is "A" and the other places print c.',
      ar: { kind: 'المثال 4', q: 'ماذا يطبع السطر 2 في المثال 4؟', why: `في السطر 2 يكون ${L('r + c = 6')} عندما ${L('c = 4')}، لذلك المكان 4 هو ${L('"A"')} وباقي الأماكن تطبع ${L('c')}.` },
    },
    {
      kind: 'Example 4', type: 'mcq',
      q: 'In Example 4, when is "A" printed?',
      options: ['When c = 1', 'When r + c = 6', 'Always', 'When r = 5'], answer: 1,
      why: 'The condition is "If r + c == 6". Every other place prints the number c.',
      ar: {
        kind: 'المثال 4', q: `في المثال 4، متى يُطبع ${L('"A"')}؟`,
        options: ['عندما c = 1', 'عندما r + c = 6', 'دائمًا', 'عندما r = 5'],
        why: `الشرط هو ${L('If r + c == 6')}. باقي الأماكن تطبع الرقم ${L('c')}.`,
      },
    },
    {
      kind: 'True or false', type: 'tf',
      q: 'If we forget New line, all the stars are printed on one line.',
      answer: true,
      why: 'Without New line nothing moves the drawing down, so it stays on one line.',
      ar: { kind: 'صح أم خطأ', q: 'إذا نسينا New line، تُطبع كل النجوم على سطر واحد.', why: 'بدون New line لا شيء ينقل الرسم إلى الأسفل، لذلك يبقى على سطر واحد.' },
    },
  ];
})();
