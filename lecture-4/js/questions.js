/* Game questions: short and easy, about today's Python basics.
   type: 'mcq' (answer = index of the right option) or 'tf' (answer = true/false).
   code: optional lines shown under the question. `ar` holds the Arabic text;
   options without an Arabic list (code, numbers) stay as they are. */
(function () {
  const L = window.I18n.ltr;

  window.QUESTIONS = [
    {
      kind: 'Data types', type: 'mcq',
      q: 'What is the type of 7?',
      options: ['int', 'float', 'str', 'bool'], answer: 0,
      why: 'A whole number is an int.',
      ar: { kind: 'أنواع البيانات', q: 'ما نوع القيمة 7؟', why: 'العدد الصحيح نوعه int.' },
    },
    {
      kind: 'Data types', type: 'mcq',
      q: 'What is the type of 3.5?',
      options: ['int', 'float', 'str', 'bool'], answer: 1,
      why: 'A number with a decimal point is a float.',
      ar: { kind: 'أنواع البيانات', q: 'ما نوع القيمة 3.5؟', why: 'العدد الذي فيه فاصلة عشرية نوعه float.' },
    },
    {
      kind: 'Data types', type: 'mcq',
      q: 'What is the type of "5"?',
      options: ['int', 'float', 'str', 'bool'], answer: 2,
      why: 'It is in quotes, so it is text: a str.',
      ar: { kind: 'أنواع البيانات', q: `ما نوع القيمة ${L('"5"')}؟`, why: 'القيمة بين علامتي تنصيص، إذن هي نص: str.' },
    },
    {
      kind: 'input()', type: 'tf',
      q: 'input() always gives text (a str), even when the user types a number.',
      answer: true,
      why: 'That is why we write int(input(...)) or float(input(...)).',
      ar: { kind: 'input()', q: `${L('input()')} يعطي نصًا (str) دائمًا، حتى لو كتب المستخدم عددًا.`, why: `لهذا نكتب ${L('int(input(...))')} أو ${L('float(input(...))')}.` },
    },
    {
      kind: 'input()', type: 'mcq',
      q: 'What does this program print?',
      code: ['a = "5"', 'b = "3"', 'print(a + b)'],
      options: ['8', '53', '35', 'Error'], answer: 1,
      why: 'Both are text, so + joins them: 53.',
      ar: { kind: 'input()', q: 'ماذا يطبع هذا البرنامج؟', why: 'القيمتان نصّان، لذلك + يلصقهما: 53.' },
    },
    {
      kind: 'Operators', type: 'mcq',
      q: 'What is 7 % 2?',
      options: ['3', '3.5', '1', '0'], answer: 2,
      why: '7 ÷ 2 = 3, and 1 is left over. % gives what is left over.',
      ar: { kind: 'العمليات', q: `كم يساوي ${L('7 % 2')}؟`, why: `${L('7 ÷ 2 = 3')} ويبقى 1. الرمز % يعطي الباقي.` },
    },
    {
      kind: 'Operators', type: 'mcq',
      q: 'What does print(10 / 2) show?',
      options: ['5', '5.0', '"5"', '2'], answer: 1,
      why: '/ always gives a float.',
      ar: { kind: 'العمليات', q: `ماذا يعرض ${L('print(10 / 2)')}؟`, why: 'الرمز / يعطي float دائمًا.' },
    },
    {
      kind: 'if', type: 'mcq',
      q: 'Which line is correct Python?',
      options: ['if n > 5', 'if n > 5:', 'if n > 5 then', 'If n > 5:'], answer: 1,
      why: 'if is written in small letters, and the line ends with a colon.',
      ar: { kind: 'if', q: 'أي سطر صحيح في Python؟', why: 'نكتب if بحروف صغيرة، والسطر ينتهي بنقطتين.' },
    },
    {
      kind: 'Indentation', type: 'tf',
      q: 'In Python, the spaces at the start of a line matter.',
      answer: true,
      why: 'They show which lines belong to if and which belong to else.',
      ar: { kind: 'Indentation', q: 'في Python، المسافات في بداية السطر مهمة.', why: 'هي التي تبيّن أي الأسطر تابعة لـ if وأيها تابعة لـ else.' },
    },
    {
      kind: 'Operators', type: 'mcq',
      q: 'Which sign asks "are they equal?"',
      options: ['=', '==', '=>', '!='], answer: 1,
      why: '= gives a value to a variable. == compares two values.',
      ar: { kind: 'العمليات', q: 'أي رمز يسأل «هل هما متساويان؟»', why: '= يعطي قيمة لمتغيّر، و == يقارن بين قيمتين.' },
    },
    {
      kind: 'VS Code', type: 'mcq',
      q: 'Which file is a Python program?',
      options: ['lab1.txt', 'lab1.py', 'lab1.doc', 'lab1.html'], answer: 1,
      why: 'Python files end with .py.',
      ar: { kind: 'VS Code', q: 'أي ملف هو برنامج Python؟', why: `ملفات Python تنتهي بـ ${L('.py')}.` },
    },
    {
      kind: 'if', type: 'mcq',
      q: 'What does this program print?',
      code: ['n = 7', 'if n % 2 == 0:', '    print("even")', 'else:', '    print("odd")'],
      options: ['even', 'odd', '7', 'Error'], answer: 1,
      why: '7 % 2 is 1, not 0, so the else line runs.',
      ar: { kind: 'if', q: 'ماذا يطبع هذا البرنامج؟', why: `${L('7 % 2')} يساوي 1 وليس 0، لذلك يعمل سطر else.` },
    },
  ];
})();
