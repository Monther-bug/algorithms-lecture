/* The 20 practice algorithms, from the easiest to the hardest.
   Each one is written in the course's style (Start, Declare, Input, Print,
   If … then … else, "If … then go to step N", mod) and can also be run:
     input: names read, in order, from the student's input values
     set:   (v) => changes the variables
     print: (v) => values printed on one output line
     loop + when: "If … then go to step N" (loop is the 1-based step number)
   Text fields are [English, Arabic]; algorithm steps stay in English. */
(function () {
  const L = window.I18n.ltr;

  window.EXAMPLES = [
    /* ---------- Level 1: one step after another ---------- */
    {
      level: 1,
      title: ['Sum and average of three numbers', 'مجموع ومعدل ثلاثة أعداد'],
      task: ['Read three numbers. Print their sum and their average.', 'اقرأ ثلاثة أعداد، ثم اطبع مجموعها ومعدلها.'],
      hint: ['Add the three numbers into sum. The average is sum divided by 3.', 'اجمع الأعداد الثلاثة في sum. المعدل هو sum مقسومًا على 3.'],
      skills: ['Input', 'Print', '+  /'],
      vars: ['a', 'b', 'c', 'sum', 'avg'],
      order: 'a b c',
      sample: '4 7 1',
      steps: [
        { t: 'Start' },
        { t: 'Declare a, b, c, sum, avg' },
        { t: 'Input a, b, c', input: ['a', 'b', 'c'] },
        { t: 'sum = a + b + c', set: (v) => { v.sum = v.a + v.b + v.c; } },
        { t: 'avg = sum / 3', set: (v) => { v.avg = v.sum / 3; } },
        { t: 'Print sum, avg', print: (v) => [v.sum, v.avg] },
        { t: 'End' },
      ],
    },
    {
      level: 1,
      title: ['Area and perimeter of a rectangle', 'مساحة ومحيط مستطيل'],
      task: ['Read the length and the width of a rectangle. Print its area and its perimeter.', 'اقرأ طول المستطيل وعرضه، ثم اطبع مساحته ومحيطه.'],
      hint: [`area = length × width, and perimeter = 2 × (length + width).`, `${L('area = length × width')}، و ${L('perimeter = 2 × (length + width)')}.`],
      skills: ['Input', 'Print', '*  ( )'],
      vars: ['L', 'W', 'area', 'per'],
      order: 'L W',
      sample: '6 4',
      steps: [
        { t: 'Start' },
        { t: 'Declare L, W, area, per' },
        { t: 'Input L, W', input: ['L', 'W'] },
        { t: 'area = L * W', set: (v) => { v.area = v.L * v.W; } },
        { t: 'per = 2 * (L + W)', set: (v) => { v.per = 2 * (v.L + v.W); } },
        { t: 'Print area, per', print: (v) => [v.area, v.per] },
        { t: 'End' },
      ],
    },
    {
      level: 1,
      title: ['Celsius to Fahrenheit', 'من Celsius إلى Fahrenheit'],
      task: ['Read a temperature in Celsius and print it in Fahrenheit. F = C × 9 / 5 + 32.', `اقرأ درجة حرارة بالـ Celsius واطبعها بالـ Fahrenheit: ${L('F = C × 9 / 5 + 32')}.`],
      hint: ['One line does the work: just write the formula with * for ×.', 'سطر واحد يكفي: اكتب المعادلة واستخدم * بدل ×.'],
      skills: ['Input', 'Print', 'Formula'],
      vars: ['c', 'f'],
      order: 'c',
      sample: '37',
      steps: [
        { t: 'Start' },
        { t: 'Declare c, f' },
        { t: 'Input c', input: ['c'] },
        { t: 'f = c * 9 / 5 + 32', set: (v) => { v.f = (v.c * 9) / 5 + 32; } },
        { t: 'Print f', print: (v) => [v.f] },
        { t: 'End' },
      ],
    },
    {
      level: 1,
      title: ['Swap two numbers', 'تبديل عددين'],
      task: ['Read two numbers a and b. Swap their values, then print a and b.', 'اقرأ عددين a و b. بدّل قيمتيهما، ثم اطبع a و b.'],
      hint: ['Like swapping the drinks in two cups: you need a third, empty cup. Keep a in temp first.', 'مثل تبديل عصير بين كوبين: تحتاج كوبًا ثالثًا فارغًا. احفظ a في temp أولًا.'],
      note: ['Without temp, a = b would lose the old value of a.', `بدون temp، فإن ${L('a = b')} ستُضيّع القيمة القديمة لـ a.`],
      skills: ['Input', 'Print', 'Swap'],
      vars: ['a', 'b', 'temp'],
      order: 'a b',
      sample: '5 9',
      steps: [
        { t: 'Start' },
        { t: 'Declare a, b, temp' },
        { t: 'Input a, b', input: ['a', 'b'] },
        { t: 'temp = a', set: (v) => { v.temp = v.a; } },
        { t: 'a = b', set: (v) => { v.a = v.b; } },
        { t: 'b = temp', set: (v) => { v.b = v.temp; } },
        { t: 'Print a, b', print: (v) => [v.a, v.b] },
        { t: 'End' },
      ],
    },

    /* ---------- Level 2: decisions with If ---------- */
    {
      level: 2,
      title: ['Even or odd', 'زوجي أم فردي'],
      task: ['Read a whole number. Print "even" if it is even, otherwise print "odd".', 'اقرأ عددًا صحيحًا. اطبع "even" إذا كان زوجيًا، وإلا اطبع "odd".'],
      hint: ['n mod 2 is the remainder after dividing by 2. It is 0 for even numbers.', `${L('n mod 2')} هو باقي القسمة على 2، ويساوي 0 للأعداد الزوجية.`],
      skills: ['If … else', 'mod'],
      vars: ['n'],
      order: 'n',
      sample: '7',
      steps: [
        { t: 'Start' },
        { t: 'Declare n' },
        { t: 'Input n', input: ['n'] },
        { t: 'If n mod 2 == 0 then Print "even"\nelse Print "odd"', print: (v) => [v.n % 2 === 0 ? 'even' : 'odd'] },
        { t: 'End' },
      ],
    },
    {
      level: 2,
      title: ['The greater of two numbers', 'الأكبر بين عددين'],
      task: ['Read two numbers and print the greater one.', 'اقرأ عددين واطبع الأكبر بينهما.'],
      hint: ['Ask one question: is a bigger than b?', 'اسأل سؤالًا واحدًا: هل a أكبر من b؟'],
      note: ['If the two numbers are equal, it prints b, which is also the greater value.', 'إذا كان العددان متساويين فإنه يطبع b، وهي أيضًا القيمة الأكبر.'],
      skills: ['If … else', '>'],
      vars: ['a', 'b'],
      order: 'a b',
      sample: '12 30',
      steps: [
        { t: 'Start' },
        { t: 'Declare a, b' },
        { t: 'Input a, b', input: ['a', 'b'] },
        { t: 'If a > b then Print a\nelse Print b', print: (v) => [v.a > v.b ? v.a : v.b] },
        { t: 'End' },
      ],
    },
    {
      level: 2,
      title: ['Positive, negative or zero', 'موجب أم سالب أم صفر'],
      task: ['Read a number. Print "positive", "negative" or "zero".', 'اقرأ عددًا، ثم اطبع "positive" أو "negative" أو "zero".'],
      hint: ['There are three answers, so you need two questions: is it > 0? If not, is it < 0?', 'هناك ثلاث إجابات، لذلك تحتاج سؤالين: هل هو أكبر من 0؟ وإن لم يكن، هل هو أصغر من 0؟'],
      skills: ['Nested if'],
      vars: ['n'],
      order: 'n',
      sample: '-4',
      steps: [
        { t: 'Start' },
        { t: 'Declare n' },
        { t: 'Input n', input: ['n'] },
        { t: 'If n > 0 then Print "positive"\nelse if n < 0 then Print "negative"\nelse Print "zero"', print: (v) => [v.n > 0 ? 'positive' : v.n < 0 ? 'negative' : 'zero'] },
        { t: 'End' },
      ],
    },
    {
      level: 2,
      title: ['Who has the greater total?', 'من صاحب المجموع الأكبر؟'],
      task: ['Two students each have three marks. Read the marks of student 1, then of student 2. Print which student has the greater total, and that total. If the totals are the same, print "equal".', 'لكل طالب من طالبين ثلاث علامات. اقرأ علامات الطالب 1 ثم علامات الطالب 2. اطبع أي طالب مجموعه أكبر، ومعه المجموع. وإذا تساوى المجموعان اطبع "equal".'],
      hint: ['First find t1 and t2. Then compare them, like "the greater of two numbers", with one more case for equal.', 'أوجد t1 و t2 أولًا. ثم قارن بينهما مثل «الأكبر بين عددين»، مع حالة إضافية للتساوي.'],
      skills: ['Input', 'Nested if'],
      vars: ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 't1', 't2'],
      order: 'a1 a2 a3 b1 b2 b3',
      sample: '70 80 90 85 75 60',
      steps: [
        { t: 'Start' },
        { t: 'Declare a1, a2, a3, b1, b2, b3, t1, t2' },
        { t: 'Input a1, a2, a3, b1, b2, b3', input: ['a1', 'a2', 'a3', 'b1', 'b2', 'b3'] },
        { t: 't1 = a1 + a2 + a3', set: (v) => { v.t1 = v.a1 + v.a2 + v.a3; } },
        { t: 't2 = b1 + b2 + b3', set: (v) => { v.t2 = v.b1 + v.b2 + v.b3; } },
        { t: 'If t1 > t2 then Print "student 1", t1\nelse if t2 > t1 then Print "student 2", t2\nelse Print "equal"', print: (v) => (v.t1 > v.t2 ? ['student 1', v.t1] : v.t2 > v.t1 ? ['student 2', v.t2] : ['equal']) },
        { t: 'End' },
      ],
    },
    {
      level: 2,
      title: ['The largest of three numbers', 'الأكبر بين ثلاثة أعداد'],
      task: ['Read three numbers and print the largest one.', 'اقرأ ثلاثة أعداد واطبع الأكبر بينها.'],
      hint: ['Say a is the largest for now (max = a). Then look at b: is it bigger than max? Then look at c the same way.', `افترض أن a هو الأكبر الآن ${L('(max = a)')}. ثم انظر إلى b: هل هو أكبر من max؟ ثم انظر إلى c بنفس الطريقة.`],
      note: ['Two small questions are easier than one long one. The same idea finds the largest of 100 numbers in example 16.', 'سؤالان صغيران أسهل من سؤال واحد طويل. ونفس الفكرة تجد الأكبر بين 100 عدد في المثال 16.'],
      skills: ['If', 'max'],
      vars: ['a', 'b', 'c', 'max'],
      order: 'a b c',
      sample: '4 9 2',
      steps: [
        { t: 'Start' },
        { t: 'Declare a, b, c, max' },
        { t: 'Input a, b, c', input: ['a', 'b', 'c'] },
        { t: 'max = a', set: (v) => { v.max = v.a; } },
        { t: 'If b > max then max = b', set: (v) => { if (v.b > v.max) v.max = v.b; } },
        { t: 'If c > max then max = c', set: (v) => { if (v.c > v.max) v.max = v.c; } },
        { t: 'Print max', print: (v) => [v.max] },
        { t: 'End' },
      ],
    },
    {
      level: 2,
      title: ['Mark to grade letter', 'تحويل العلامة إلى تقدير'],
      task: ['Read a mark out of 100 and print its grade: A for 85 and up, B for 75 and up, C for 65 and up, D for 50 and up, F below 50.', 'اقرأ علامة من 100 واطبع تقديرها: A من 85 فأكثر، و B من 75 فأكثر، و C من 65 فأكثر، و D من 50 فأكثر، و F لما دون 50.'],
      hint: ['Check from the top: 85 first, then 75, 65 and 50. The first true condition wins.', 'افحص من الأعلى: 85 أولًا، ثم 75 ثم 65 ثم 50. أول شرط صحيح هو الذي يُطبَّق.'],
      note: ['The order matters. If you test mark >= 50 first, 90 would print D.', `الترتيب مهم. إذا فحصت ${L('mark >= 50')} أولًا فإن 90 ستطبع D.`],
      skills: ['Nested if', '>='],
      vars: ['mark'],
      order: 'mark',
      sample: '78',
      steps: [
        { t: 'Start' },
        { t: 'Declare mark' },
        { t: 'Input mark', input: ['mark'] },
        {
          t: 'If mark >= 85 then Print "A"\nelse if mark >= 75 then Print "B"\nelse if mark >= 65 then Print "C"\nelse if mark >= 50 then Print "D"\nelse Print "F"',
          print: (v) => [v.mark >= 85 ? 'A' : v.mark >= 75 ? 'B' : v.mark >= 65 ? 'C' : v.mark >= 50 ? 'D' : 'F'],
        },
        { t: 'End' },
      ],
    },

    /* ---------- Level 3: loops ---------- */
    {
      level: 3,
      title: ['Print the numbers from 1 to N', 'اطبع الأعداد من 1 إلى N'],
      task: ['Read N and print the numbers 1, 2, 3, …, N.', 'اقرأ N واطبع الأعداد 1، 2، 3، …، N.'],
      hint: ['Start a counter i at 1. Print i, add 1, and go back while i <= n.', `ابدأ عدّادًا i من 1. اطبع i، ثم أضف 1، وارجع ما دام ${L('i <= n')}.`],
      skills: ['Loop', 'Counter'],
      vars: ['n', 'i'],
      order: 'n',
      sample: '5',
      steps: [
        { t: 'Start' },
        { t: 'Declare n, i' },
        { t: 'Input n', input: ['n'] },
        { t: 'i = 1', set: (v) => { v.i = 1; } },
        { t: 'Print i', print: (v) => [v.i] },
        { t: 'i = i + 1', set: (v) => { v.i += 1; } },
        { t: 'If i <= n then go to step 5', loop: 5, when: (v) => v.i <= v.n },
        { t: 'End' },
      ],
    },
    {
      level: 3,
      title: ['Sum of the numbers from 1 to N', 'مجموع الأعداد من 1 إلى N'],
      task: ['Read N. Print 1 + 2 + 3 + … + N.', `اقرأ N، ثم اطبع ${L('1 + 2 + 3 + … + N')}.`],
      hint: ['Same loop as before, but instead of printing i, add it to sum. Print once, after the loop.', 'نفس الـ Loop السابق، لكن بدل طباعة i أضِفها إلى sum. واطبع مرة واحدة بعد الـ Loop.'],
      note: ['sum starts at 0, because adding 0 changes nothing.', 'يبدأ sum من 0، لأن إضافة 0 لا تغيّر شيئًا.'],
      skills: ['Loop', 'Sum'],
      vars: ['n', 'i', 'sum'],
      order: 'n',
      sample: '10',
      steps: [
        { t: 'Start' },
        { t: 'Declare n, i, sum' },
        { t: 'Input n', input: ['n'] },
        { t: 'sum = 0, i = 1', set: (v) => { v.sum = 0; v.i = 1; } },
        { t: 'sum = sum + i', set: (v) => { v.sum += v.i; } },
        { t: 'i = i + 1', set: (v) => { v.i += 1; } },
        { t: 'If i <= n then go to step 5', loop: 5, when: (v) => v.i <= v.n },
        { t: 'Print sum', print: (v) => [v.sum] },
        { t: 'End' },
      ],
    },
    {
      level: 3,
      title: ['Multiplication table of any number', 'جدول الضرب لأي عدد'],
      task: ['Read a number n and print its multiplication table from n × 1 to n × 10.', `اقرأ عددًا n واطبع جدول ضربه من ${L('n × 1')} إلى ${L('n × 10')}.`],
      hint: ['The loop counter i goes from 1 to 10. Each time, print n, "x", i, "=", n * i.', `عدّاد الـ Loop وهو i يذهب من 1 إلى 10. في كل مرة اطبع ${L('n, "x", i, "=", n * i')}.`],
      skills: ['Loop', 'Print'],
      vars: ['n', 'i', 'r'],
      order: 'n',
      sample: '7',
      steps: [
        { t: 'Start' },
        { t: 'Declare n, i, r' },
        { t: 'Input n', input: ['n'] },
        { t: 'i = 1', set: (v) => { v.i = 1; } },
        { t: 'r = n * i', set: (v) => { v.r = v.n * v.i; } },
        { t: 'Print n, "x", i, "=", r', print: (v) => [v.n, 'x', v.i, '=', v.r] },
        { t: 'i = i + 1', set: (v) => { v.i += 1; } },
        { t: 'If i <= 10 then go to step 5', loop: 5, when: (v) => v.i <= 10 },
        { t: 'End' },
      ],
    },
    {
      level: 3,
      title: ['Factorial of N', 'مضروب N'],
      task: ['Read N and print N! = 1 × 2 × 3 × … × N.', `اقرأ N واطبع ${L('N! = 1 × 2 × 3 × … × N')}.`],
      hint: ['Like the sum, but multiply: f = f * i. Start f at 1, not 0.', `مثل المجموع لكن بالضرب: ${L('f = f * i')}. ابدأ f من 1 وليس 0.`],
      note: ['f starts at 1. If it started at 0, every product would be 0.', 'يبدأ f من 1. لو بدأ من 0 لكان كل ناتج ضرب يساوي 0.'],
      skills: ['Loop', 'Factorial'],
      vars: ['n', 'i', 'f'],
      order: 'n',
      sample: '5',
      steps: [
        { t: 'Start' },
        { t: 'Declare n, i, f' },
        { t: 'Input n', input: ['n'] },
        { t: 'f = 1, i = 1', set: (v) => { v.f = 1; v.i = 1; } },
        { t: 'f = f * i', set: (v) => { v.f *= v.i; } },
        { t: 'i = i + 1', set: (v) => { v.i += 1; } },
        { t: 'If i <= n then go to step 5', loop: 5, when: (v) => v.i <= v.n },
        { t: 'Print f', print: (v) => [v.f] },
        { t: 'End' },
      ],
    },

    /* ---------- Level 4: loops with decisions ---------- */
    {
      level: 4,
      title: ['Sum of the even numbers from 1 to N', 'مجموع الأعداد الزوجية من 1 إلى N'],
      task: ['Read N. Print the sum of the even numbers between 1 and N.', 'اقرأ N، ثم اطبع مجموع الأعداد الزوجية بين 1 و N.'],
      hint: ['Loop i from 1 to n. Inside the loop, add i only if i mod 2 == 0.', `اجعل i يذهب من 1 إلى n. داخل الـ Loop أضف i فقط إذا كان ${L('i mod 2 == 0')}.`],
      note: ['Another way: start i at 2 and add 2 each time. Then no If is needed.', 'طريقة أخرى: ابدأ i من 2 وأضف 2 في كل مرة، وعندها لا تحتاج If.'],
      skills: ['Loop', 'If', 'mod'],
      vars: ['n', 'i', 'sum'],
      order: 'n',
      sample: '10',
      steps: [
        { t: 'Start' },
        { t: 'Declare n, i, sum' },
        { t: 'Input n', input: ['n'] },
        { t: 'sum = 0, i = 1', set: (v) => { v.sum = 0; v.i = 1; } },
        { t: 'If i mod 2 == 0 then sum = sum + i', set: (v) => { if (v.i % 2 === 0) v.sum += v.i; } },
        { t: 'i = i + 1', set: (v) => { v.i += 1; } },
        { t: 'If i <= n then go to step 5', loop: 5, when: (v) => v.i <= v.n },
        { t: 'Print sum', print: (v) => [v.sum] },
        { t: 'End' },
      ],
    },
    {
      level: 4,
      title: ['The largest of N numbers', 'الأكبر بين N من الأعداد'],
      task: ['Read N, then read N numbers. Print the largest of them.', 'اقرأ N، ثم اقرأ N من الأعداد. اطبع الأكبر بينها.'],
      hint: ['Start max at a very small number. Read the numbers one by one: any number bigger than max becomes the new max.', 'ابدأ max بعدد صغير جدًا. اقرأ الأعداد واحدًا واحدًا: أي عدد أكبر من max يصبح هو max الجديد.'],
      note: ['max starts at −999999, so the first number is always bigger and becomes max.', `يبدأ max من ${L('−999999')}، لذلك يكون أول عدد أكبر منه دائمًا ويصبح هو max.`],
      skills: ['Loop', 'If', 'max'],
      vars: ['n', 'i', 'x', 'max'],
      order: 'n, then the n numbers',
      sample: '5 3 9 2 7 4',
      steps: [
        { t: 'Start' },
        { t: 'Declare n, i, x, max' },
        { t: 'Input n', input: ['n'] },
        { t: 'max = -999999, i = 1', set: (v) => { v.max = -999999; v.i = 1; } },
        { t: 'Input x', input: ['x'] },
        { t: 'If x > max then max = x', set: (v) => { if (v.x > v.max) v.max = v.x; } },
        { t: 'i = i + 1', set: (v) => { v.i += 1; } },
        { t: 'If i <= n then go to step 5', loop: 5, when: (v) => v.i <= v.n },
        { t: 'Print max', print: (v) => [v.max] },
        { t: 'End' },
      ],
    },
    {
      level: 4,
      title: ['Average of N marks and how many passed', 'معدل N من العلامات وعدد الناجحين'],
      task: ['Read N, then N marks. Print the average of the marks and how many marks are 50 or more.', 'اقرأ N، ثم N من العلامات. اطبع معدل العلامات وعدد العلامات التي تساوي 50 أو أكثر.'],
      hint: ['Two things in one loop: add every mark to sum, and add 1 to pass when mark >= 50. Divide after the loop.', `شيئان في Loop واحد: أضف كل علامة إلى sum، وأضف 1 إلى pass عندما ${L('mark >= 50')}. واقسم بعد الـ Loop.`],
      skills: ['Loop', 'If', 'Counter'],
      vars: ['n', 'i', 'mark', 'sum', 'pass', 'avg'],
      order: 'n, then the n marks',
      sample: '4 70 45 80 30',
      steps: [
        { t: 'Start' },
        { t: 'Declare n, i, mark, sum, pass, avg' },
        { t: 'Input n', input: ['n'] },
        { t: 'sum = 0, pass = 0, i = 1', set: (v) => { v.sum = 0; v.pass = 0; v.i = 1; } },
        { t: 'Input mark', input: ['mark'] },
        { t: 'sum = sum + mark', set: (v) => { v.sum += v.mark; } },
        { t: 'If mark >= 50 then pass = pass + 1', set: (v) => { if (v.mark >= 50) v.pass += 1; } },
        { t: 'i = i + 1', set: (v) => { v.i += 1; } },
        { t: 'If i <= n then go to step 5', loop: 5, when: (v) => v.i <= v.n },
        { t: 'avg = sum / n', set: (v) => { v.avg = v.sum / v.n; } },
        { t: 'Print avg, pass', print: (v) => [v.avg, v.pass] },
        { t: 'End' },
      ],
    },

    /* ---------- Level 5: challenge ---------- */
    {
      level: 5,
      title: ['Is the number prime?', 'هل العدد أولي؟'],
      task: ['Read a whole number n. Print whether it is prime: a prime number can only be divided by 1 and by itself.', 'اقرأ عددًا صحيحًا n. اطبع هل هو أولي: العدد الأولي لا يقبل القسمة إلا على 1 وعلى نفسه.'],
      hint: ['Count how many numbers from 1 to n divide n with no remainder (n mod i == 0). A prime number has exactly 2 of them: 1 and itself.', `عُدّ كم عددًا من 1 إلى n يقسم n بدون باقٍ ${L('(n mod i == 0)')}. العدد الأولي له اثنان فقط: 1 ونفسه.`],
      note: ['7 is divided only by 1 and 7, so count = 2: prime. 9 is divided by 1, 3 and 9, so count = 3: not prime. 1 has count = 1: not prime.', 'العدد 7 يقبل القسمة على 1 و 7 فقط، إذن count = 2: أولي. والعدد 9 يقبل القسمة على 1 و 3 و 9، إذن count = 3: ليس أوليًا. والعدد 1 له count = 1: ليس أوليًا.'],
      skills: ['Loop', 'If', 'mod', 'Counter'],
      vars: ['n', 'i', 'count'],
      order: 'n',
      sample: '7',
      steps: [
        { t: 'Start' },
        { t: 'Declare n, i, count' },
        { t: 'Input n', input: ['n'] },
        { t: 'count = 0, i = 1', set: (v) => { v.count = 0; v.i = 1; } },
        { t: 'If n mod i == 0 then count = count + 1', set: (v) => { if (v.n % v.i === 0) v.count += 1; } },
        { t: 'i = i + 1', set: (v) => { v.i += 1; } },
        { t: 'If i <= n then go to step 5', loop: 5, when: (v) => v.i <= v.n },
        { t: 'If count == 2 then Print n, "is prime"\nelse Print n, "is not prime"', print: (v) => [v.n, v.count === 2 ? 'is prime' : 'is not prime'] },
        { t: 'End' },
      ],
    },
    {
      level: 5,
      title: ['The three largest numbers in a set', 'أكبر ثلاثة أعداد في مجموعة'],
      task: ['Read N, then N numbers. Print the three largest numbers, from the biggest down.', 'اقرأ N، ثم N من الأعداد. اطبع أكبر ثلاثة أعداد، من الأكبر إلى الأصغر.'],
      hint: ['Think of a podium with three places: first, second and third. When a new number beats first, the old first moves to second and the old second moves to third.', 'تخيّل منصة تتويج فيها ثلاثة أماكن: first و second و third. عندما يتفوق عدد جديد على first، ينزل first القديم إلى second، وينزل second القديم إلى third.'],
      note: ['The order of the moves matters: move third first, then second, then put x in first. The three places start at −999999, so the first real numbers always beat them.', `ترتيب النقل مهم: انقل third أولًا، ثم second، ثم ضع x في first. وتبدأ الأماكن الثلاثة من ${L('−999999')}، لذلك أول الأعداد الحقيقية تتفوق عليها دائمًا.`],
      skills: ['Loop', 'Nested if', 'Podium'],
      vars: ['n', 'i', 'x', 'first', 'second', 'third'],
      order: 'n, then the n numbers',
      sample: '6 5 12 8 20 3 15',
      steps: [
        { t: 'Start' },
        { t: 'Declare n, i, x, first, second, third' },
        { t: 'Input n', input: ['n'] },
        { t: 'first = -999999, second = -999999, third = -999999', set: (v) => { v.first = -999999; v.second = -999999; v.third = -999999; } },
        { t: 'i = 1', set: (v) => { v.i = 1; } },
        { t: 'Input x', input: ['x'] },
        {
          t: 'If x > first then\n    third = second\n    second = first\n    first = x\nelse if x > second then\n    third = second\n    second = x\nelse if x > third then\n    third = x',
          set: (v) => {
            if (v.x > v.first) { v.third = v.second; v.second = v.first; v.first = v.x; } else if (v.x > v.second) { v.third = v.second; v.second = v.x; } else if (v.x > v.third) v.third = v.x;
          },
        },
        { t: 'i = i + 1', set: (v) => { v.i += 1; } },
        { t: 'If i <= n then go to step 6', loop: 6, when: (v) => v.i <= v.n },
        { t: 'Print first, second, third', print: (v) => [v.first, v.second, v.third] },
        { t: 'End' },
      ],
    },
    {
      level: 5,
      title: ['Sum of the factorials: 1! + 2! + … + N!', 'مجموع المضروبات: !1 + !2 + … + !N'],
      task: ['Read N. Print y = 1! + 2! + 3! + … + N!.', `اقرأ N، ثم اطبع ${L('y = 1! + 2! + 3! + … + N!')}.`],
      hint: ['Each factorial comes from the one before it: 4! = 3! × 4. So keep f, multiply it by i to get i!, then add f to y.', `كل مضروب يأتي من الذي قبله: ${L('4! = 3! × 4')}. لذلك احتفظ بـ f، واضربه في i لتحصل على !i، ثم أضف f إلى y.`],
      note: ['After step 5, f is exactly i!: 1, then 2, 6, 24… In the lecture we used a loop inside a loop. This one loop gives the same answer and is easier to trace.', 'بعد الخطوة 5 يكون f هو !i تمامًا: 1 ثم 2 و 6 و 24… في المحاضرة استخدمنا Loop داخل Loop، وهذا الـ Loop الواحد يعطي نفس الإجابة وهو أسهل في الـ Trace.'],
      skills: ['Loop', 'Factorial', 'Sum'],
      vars: ['n', 'i', 'f', 'y'],
      order: 'n',
      sample: '4',
      steps: [
        { t: 'Start' },
        { t: 'Declare n, i, f, y' },
        { t: 'Input n', input: ['n'] },
        { t: 'y = 0, f = 1, i = 1', set: (v) => { v.y = 0; v.f = 1; v.i = 1; } },
        { t: 'f = f * i', set: (v) => { v.f *= v.i; } },
        { t: 'y = y + f', set: (v) => { v.y += v.f; } },
        { t: 'i = i + 1', set: (v) => { v.i += 1; } },
        { t: 'If i <= n then go to step 5', loop: 5, when: (v) => v.i <= v.n },
        { t: 'Print y', print: (v) => [v.y] },
        { t: 'End' },
      ],
    },
  ];

  /* Run an algorithm with the given input values. Returns every executed step
     (with the variables after it) and the printed lines. */
  window.runAlgorithm = function (ex, inputs, limit = 600) {
    const v = {};
    const rows = [];
    const output = [];
    let k = 0;
    let pc = 0;
    let stopped = false;
    while (pc < ex.steps.length) {
      if (rows.length >= limit) { stopped = true; break; }
      const s = ex.steps[pc];
      let next = pc + 1;
      let printed = null;
      let jump = null;
      if (s.input) {
        for (const name of s.input) {
          if (k >= inputs.length) return { rows, output, missing: name };
          v[name] = inputs[k++];
        }
      }
      if (s.set) s.set(v);
      if (s.print) {
        printed = s.print(v).map(window.fmtValue).join(' ');
        output.push(printed);
      }
      if (s.loop != null) {
        jump = s.when(v);
        if (jump) next = s.loop - 1;
      }
      rows.push({ step: pc + 1, vars: { ...v }, printed, jump, loop: s.loop });
      pc = next;
    }
    return { rows, output, stopped, extra: inputs.length - k };
  };

  // Whole numbers as they are; others rounded to 4 decimal places.
  window.fmtValue = (x) => {
    if (typeof x !== 'number') return String(x);
    if (Number.isInteger(x)) return String(x);
    return String(Math.round(x * 10000) / 10000);
  };
})();
