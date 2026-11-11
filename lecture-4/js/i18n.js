/* English / Arabic switch. English is the default on every visit.
   Any text that changes with the language carries data-i18n="key"
   (and data-i18n-label="key" for its aria-label). The English for keys
   written in index.html is read from the page itself; everything else
   lives in STRINGS. Concepts (Python, Algorithm, Variable names, input,
   print, if, else, int, float, str, bool, Terminal, Error), code and
   numbers stay in English in both languages. */
(function () {
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  // Code and maths inside an Arabic sentence must keep reading left to right.
  const L = (s) => `<bdi dir="ltr">${esc(s)}</bdi>`;

  const STRINGS = {
    en: {
      'lang.switch': 'العربية',
      'lang.label': 'Show the slides in Arabic',
      'timer.thinking': 'Thinking time',
      'timer.up': 'Time is up',
      'timer.start': 'Start timer',
      'timer.pause': 'Pause',
      'timer.resume': 'Resume',
      'timer.again': 'Start again',
      'timer.reset': 'Reset',
      'timer.length': 'Timer length',
      'timer.3': '3 min',
      'timer.5': '5 min',
      'timer.10': '10 min',
      'timer.15': '15 min',
      'g.team': 'Team {n}',
      'g.teamName': 'Team {n} name',
      'g.count': 'Question {n} of {total}',
      'g.final': 'Final scores',
      'g.turn': '{team}, your turn',
      'g.steal': '{team}, steal it for 50 points!',
      'g.callOut': 'Call out your answer. The instructor clicks it.',
      'g.tapSteps': 'Tap the steps in order. Tap a placed step to send it back.',
      'g.tapStep': 'Tap a step',
      'g.checkOrder': 'Check the order',
      'g.true': 'True',
      'g.false': 'False',
      'g.correct': '<b>Correct! +{points} for {team}.</b> {why}',
      'g.notQuite': 'Not quite.',
      'g.timeUp': 'Time is up.',
      'g.placed': '{n} of {total} in the right place.',
      'g.canSteal': '<b>{lead}</b> {team} can steal it now.',
      'g.rightOrder': '<b>{lead} Here is the right order.</b> {why}',
      'g.answerIs': '<b>{lead} The answer is {answer}.</b> {why}',
      'g.next': 'Next question',
      'g.seeScores': 'See the final scores',
      'g.tie': 'It is a tie between',
      'g.winner': 'The winner is',
      'g.again': 'Play again',
      'g.back': 'Back to slides',
      'g.mute': 'Mute sounds',
      'g.unmute': 'Turn sounds on',
      'sol.kicker': 'Example {n} <span>· Solution</span>',
      'sol.hint': 'Press → to show the next line.',
      'sol.line': 'Line {n}',
      'sol.idea': 'The idea',
      'run.again': 'Run again',
      'run.reset': 'Reset',
      'run.vars': 'Variables',
      'run.noVars': 'Variables appear here when the program runs.',
      'b.round': 'Bug {n} · {name}',
      'y.hide': 'Hide solution',
      'y.warm': 'Warm-up',
      'y.core': 'Core',
      'y.challenge': 'Challenge',
    },
    ar: {
      'lang.switch': 'English',
      'lang.label': 'اعرض الشرائح بالإنجليزية',
      'nav.prev': 'الشريحة السابقة',
      'nav.next': 'التالي',
      'nav.full': 'ملء الشاشة',
      'cover.keys': '<kbd>→</kbd> التالي <kbd>←</kbd> السابق <kbd>F</kbd> ملء الشاشة',
      'gs.rule2': 'الفرق تتناوب، ولكل دور 30 ثانية.',
      'gs.rule3': 'الإجابة الصحيحة تعطي 100 نقطة، وحتى 50 نقطة إضافية للسرعة.',
      'gs.rule4': 'إذا أخطأ الفريق، يمكن للفريق التالي أن يسرق السؤال مقابل 50 نقطة.',
      'gs.teams': 'كم عدد الفرق؟',
      'gs.start': 'ابدأ اللعبة',
      'gs.resume': 'استأنف اللعبة',
      'm.kicker': 'استراحة Memes',
      'm.title': 'قبل أن تذهب…',
      'm.hint': 'اضغط <kbd>→</kbd> لرؤية الـ Meme التالي.',
      'm.expect': 'المتوقَّع',
      'm.reality': 'الواقع',
      'timer.thinking': 'وقت التفكير',
      'timer.up': 'انتهى الوقت',
      'timer.start': 'ابدأ المؤقت',
      'timer.pause': 'إيقاف مؤقت',
      'timer.resume': 'استئناف',
      'timer.again': 'ابدأ من جديد',
      'timer.reset': 'إعادة',
      'timer.length': 'مدة المؤقت',
      'timer.3': '3 دقائق',
      'timer.5': '5 دقائق',
      'timer.10': '10 دقائق',
      'timer.15': '15 دقيقة',
      'g.team': 'الفريق {n}',
      'g.teamName': 'اسم الفريق {n}',
      'g.count': 'السؤال {n} من {total}',
      'g.final': 'النتائج النهائية',
      'g.turn': '{team}، دورك',
      'g.steal': '{team}، اسرق السؤال مقابل 50 نقطة!',
      'g.callOut': 'قولوا إجابتكم بصوت عالٍ، والمدرّس يضغط عليها.',
      'g.tapSteps': 'اضغط على الخطوات بالترتيب. اضغط على خطوة وُضعت لإرجاعها.',
      'g.tapStep': 'اضغط على خطوة',
      'g.checkOrder': 'تحقّق من الترتيب',
      'g.true': 'صح',
      'g.false': 'خطأ',
      'g.correct': '<b>إجابة صحيحة! +{points} لفريق {team}.</b> {why}',
      'g.notQuite': 'إجابة غير صحيحة.',
      'g.timeUp': 'انتهى الوقت.',
      'g.placed': '{n} من {total} في المكان الصحيح.',
      'g.canSteal': '<b>{lead}</b> يمكن لفريق {team} أن يسرق السؤال الآن.',
      'g.rightOrder': '<b>{lead} هذا هو الترتيب الصحيح.</b> {why}',
      'g.answerIs': '<b>{lead} الإجابة الصحيحة هي {answer}.</b> {why}',
      'g.next': 'السؤال التالي',
      'g.seeScores': 'اعرض النتائج النهائية',
      'g.tie': 'تعادل بين',
      'g.winner': 'الفائز هو',
      'g.again': 'العب مرة أخرى',
      'g.back': 'العودة إلى الشرائح',
      'g.mute': 'كتم الأصوات',
      'g.unmute': 'تشغيل الأصوات',
      'cover.kicker': 'المعمل 1 · Python',
      'cover.lead': 'الـ Algorithms التي كتبتها تصبح برامج حقيقية. نتذكّر الأساسيات، ونحل خمسة أمثلة معًا في VS Code، ثم تتدرّب وحدك.',
      'goals.kicker': 'اليوم',
      'goals.title': 'ماذا سنفعل اليوم؟',
      'goals.1title': 'نتذكّر الأساسيات',
      'goals.1text': 'الـ Indentation، وأنواع البيانات، و <code>input()</code>، و <code>print()</code>، والعمليات، و <code>if</code> / <code>else</code>.',
      'goals.2title': 'نحل 5 أمثلة معًا',
      'goals.2text': 'Algorithms تعرفها مسبقًا. أكتب الكود في VS Code، وأنت تتابع على جهازك.',
      'goals.3title': 'تتدرّب وحدك',
      'goals.3text': 'تجد ستة أخطاء، ثم تكتب ثلاثة برامج صغيرة بنفسك.',
      'goals.readyTag': 'قبل أن نبدأ',
      'goals.ready1': 'برنامج VS Code مفتوح.',
      'goals.ready2': 'لديك مجلد لليوم: <code>lab1</code>.',
      'goals.ready3': 'الـ Python يعمل. اكتب هذا في الـ Terminal:',
      'goals.readyNote': 'قد يكون رقم الإصدار عندك مختلفًا. أي Python 3 مناسب.',
      'vs.kicker': 'في المعمل',
      'vs.title': 'كيف نعمل في VS Code',
      'vs.1t': 'افتح المجلد',
      'vs.1p': 'من القائمة: <bdi dir="ltr">File → Open Folder → <code>lab1</code></bdi>',
      'vs.2t': 'أنشئ ملفًا جديدًا',
      'vs.2p': 'سمّه <code>sum.py</code>. النهاية <code>.py</code> مهمة.',
      'vs.3t': 'اكتب الكود واحفظه',
      'vs.3p': 'احفظ بـ <bdi dir="ltr"><kbd>Ctrl</kbd> + <kbd>S</kbd></bdi> كلما غيّرت شيئًا.',
      'vs.4t': 'شغّله',
      'vs.4p': 'اضغط ▶ في أعلى اليمين، أو اكتب <code>python sum.py</code> في الـ Terminal.',
      'vs.5t': 'اكتب الـ Input',
      'vs.5p': 'الـ Terminal ينتظرك. اكتب القيمة واضغط <kbd>Enter</kbd>.',
      'map.kicker': 'تذكّر <span>· 1</span>',
      'map.title': 'من الـ Algorithm إلى Python',
      'map.lead': 'أنت تعرف الخطوات مسبقًا. الـ Python يكتبها فقط بطريقته الخاصة.',
      'map.alg': 'Algorithm',
      'map.py': 'Python',
      'map.r1': 'لا نكتب شيئًا. الـ Python ينفّذ الأسطر من الأعلى إلى الأسفل.',
      'map.r2': 'لا نكتب شيئًا. المتغيّر يُنشأ عندما نعطيه قيمة.',
      'map.shows': 'يعرض <code>sum = 12</code>: الفاصلة تضيف مسافة واحدة',
      'types.kicker': 'تذكّر <span>· 2</span>',
      'types.title': 'أنواع البيانات (Data types)',
      'types.lead': 'لكل قيمة نوع. الـ Python يعرف النوع من طريقة كتابة القيمة.',
      'types.int': 'أعداد صحيحة',
      'types.float': 'أعداد فيها فاصلة عشرية',
      'types.str': 'نص، دائمًا بين علامتي تنصيص',
      'types.bool': 'True أو False',
      'types.tip': '<code>5</code> و <code>"5"</code> ليسا نفس الشيء. الأول عدد، والثاني نص بسبب علامتي التنصيص.',
      'inp.kicker': 'تذكّر <span>· 3</span>',
      'inp.title': '<code>input()</code> يعطي نصًا دائمًا',
      'inp.lead': 'مهما كتب المستخدم، يعيده <code>input()</code> على شكل <code>str</code>. حوّله إلى عدد قبل أن تحسب.',
      'inp.whole': 'أعداد صحيحة',
      'inp.dec': 'أعداد فيها فاصلة عشرية',
      'inp.text': 'نص، مثل الاسم',
      'inp.try': 'جرّب',
      'inp.types': 'المستخدم يكتب',
      'inp.hint': 'جرّب <code>7</code>، ثم <code>7.5</code>، ثم <code>Ali</code>.',
      'inp.warn': 'إذا نسيت <code>int()</code> فإن <code>"5" + "3"</code> تعطي <code>"53"</code> وليس <code>8</code>.',
      'ops.kicker': 'تذكّر <span>· 4</span>',
      'ops.title': 'العمليات (Operators)',
      'ops.maths': 'الحساب',
      'ops.add': 'جمع',
      'ops.sub': 'طرح',
      'ops.mul': 'ضرب',
      'ops.div': 'قسمة',
      'ops.mod': 'باقي القسمة (mod)',
      'ops.pow': 'أُس',
      'ops.note': '<code>/</code> يعطي float دائمًا: <code>6 / 2</code> تساوي <code>3.0</code>.',
      'ops.compare': 'المقارنة: الإجابة True أو False',
      'ops.eq': 'يساوي',
      'ops.ne': 'لا يساوي',
      'ops.gt': 'أكبر من',
      'ops.lt': 'أصغر من',
      'ops.ge': 'أكبر من أو يساوي',
      'ops.le': 'أصغر من أو يساوي',
      'ops.and': '<code>and</code>: يجب أن يكون الاثنان True. <code>or</code>: يكفي واحد.',
      'ops.warn': '<code>=</code> يعطي قيمة: <code>x = 5</code>. و <code>==</code> يطرح سؤالًا: <code>x == 5</code>.',
      'ind.kicker': 'تذكّر <span>· 5</span>',
      'ind.title': 'الـ Indentation (المسافة البادئة)',
      'ind.lead': 'المسافات في بداية السطر تخبر الـ Python أي الأسطر تنتمي إلى بعضها.',
      'ind.n1': 'ينتهي بـ :',
      'ind.n2': '4 مسافات: تابع لـ if',
      'ind.n3': 'رجوع إلى اليسار',
      'ind.n4': '4 مسافات: تابع لـ else',
      'ind.r1': 'السطر الذي ينتهي بنقطتين <code>:</code> يبدأ مجموعة.',
      'ind.r2': 'أسطر المجموعة تتحرك 4 مسافات إلى اليمين. في VS Code اضغط <kbd>Tab</kbd>.',
      'ind.r3': 'عندما تنتهي المجموعة، ارجع إلى اليسار.',
      'ind.r4': 'لا تضف مسافات في أي مكان آخر. حتى مسافة واحدة زائدة تسبب Error:',
      'if.kicker': 'تذكّر <span>· 6</span>',
      'if.title': '<code>if</code> و <code>else</code>',
      'if.lead': '<code>if</code> يطرح سؤالًا. الـ Python ينفّذ مجموعة من الأسطر عندما تكون الإجابة True، والمجموعة الأخرى عندما تكون False.',
      'if.elif': 'أكثر من اختيارين؟ ضع <code>elif</code> بين <code>if</code> و <code>else</code>:',
      'q.kicker1': 'المثال 1 <span>من 5</span>',
      'q.kicker2': 'المثال 2 <span>من 5</span>',
      'q.kicker3': 'المثال 3 <span>من 5</span>',
      'q.kicker4': 'المثال 4 <span>من 5</span>',
      'q.kicker5': 'المثال 5 <span>من 5</span>',
      'q.title1': 'مجموع عددين',
      'q.title2': 'مساحة ومحيط مستطيل',
      'q.title3': 'من Fahrenheit إلى Celsius',
      'q.title4': 'زوجي أم فردي',
      'q.title5': 'المعدل و Pass / Fail',
      'q.text1': 'اكتب برنامجًا يقرأ عددين صحيحين ويطبع مجموعهما.',
      'q.text2': 'اكتب برنامجًا يقرأ طول المستطيل وعرضه، ثم يطبع مساحته ومحيطه.',
      'q.text3': 'اكتب برنامجًا يقرأ درجة حرارة بالـ Fahrenheit ويطبعها بالـ Celsius: <bdi dir="ltr">c = 5/9 (f − 32)</bdi>.',
      'q.text4': 'اكتب برنامجًا يقرأ عددًا صحيحًا ويطبع هل هو زوجي أم فردي.',
      'q.text5': 'اكتب برنامجًا يقرأ ثلاث علامات ويطبع معدلها. ثم يطبع Pass إذا كان المعدل 50 أو أكثر، وإلا يطبع Fail.',
      'q.sample': 'مثال على التشغيل',
      'q.fromTag': 'حللته من قبل كـ Algorithm',
      'q.from1': 'الـ Flowcharts، المثال 1',
      'q.from2': 'الكتيّب، الـ Algorithm رقم 3',
      'q.from3': 'الكتيّب، الـ Algorithm رقم 4',
      'q.from4': 'الـ Flowcharts، المثال 4',
      'q.from5': 'الـ Flowcharts، المثال 6',
      'q.hint': 'اعرض تلميحًا',
      'q.hint1': 'اقرأ كل عدد بـ <code>int(input(...))</code>. اجمعهما، ثم <code>print("sum =", total)</code>.',
      'q.hint2': '<code>area = length * width</code> و <code>perimeter = 2 * (length + width)</code>.',
      'q.hint3': 'درجة الحرارة قد تكون 98.6، لذلك استخدم <code>float(input(...))</code>. واكتب <code>*</code>: <code>(5 / 9) * (f - 32)</code>.',
      'q.hint4': 'العدد زوجي عندما يكون <code>n % 2 == 0</code>. استخدم <code>if</code> و <code>else</code>، ولا تنسَ <code>:</code> والمسافات الأربع.',
      'q.hint5': '<code>average = (m1 + m2 + m3) / 3</code>. ثم <code>if average &gt;= 50:</code> … <code>else:</code> …',
      'sol.kicker': 'المثال {n} <span>· الحل</span>',
      'sol.hint': 'اضغط → لعرض السطر التالي.',
      'sol.line': 'السطر {n}',
      'sol.idea': 'الفكرة',
      'run.run': 'تشغيل',
      'run.again': 'شغّل مرة أخرى',
      'run.reset': 'إعادة',
      'run.vars': 'المتغيّرات (Variables)',
      'run.noVars': 'تظهر المتغيّرات هنا عندما يعمل البرنامج.',
      'b.kicker': 'النشاط 1 · اكتشف الخطأ',
      'b.title': 'جد الخطأ',
      'b.lead': 'في كل برنامج خطأ واحد. ابحثوا عنه معًا أولًا، ثم اضغط <b>تشغيل</b> لترى ماذا يقول الـ Python.',
      'b.rounds': 'الأخطاء',
      'b.fix': 'اعرض التصحيح',
      'b.round': 'الخطأ {n} · {name}',
      'y.kicker': 'النشاط 2 · دورك',
      'y.title': 'اكتبه في VS Code',
      'y.lead': 'اختر مهمة، واكتب البرنامج على جهازك وشغّله. ثم قارنه بالحل.',
      'y.tasks': 'المهام',
      'y.solution': 'الحل',
      'y.show': 'اعرض الحل',
      'y.hide': 'أخفِ الحل',
      'y.wait': 'اكتب برنامجك أولًا، ثم اضغط «اعرض الحل».',
      'y.warm': 'تمهيد',
      'y.core': 'أساسي',
      'y.challenge': 'تحدٍّ',
      'recap.kicker': 'الخلاصة',
      'recap.title': 'أربعة أشياء تتذكّرها',
      'recap.1title': '<code>input()</code> يعطي نصًا',
      'recap.1text': 'استخدم <code>int()</code> للأعداد الصحيحة و <code>float()</code> للأعداد التي فيها فاصلة عشرية.',
      'recap.2title': 'النقطتان والمسافات الأربع',
      'recap.2text': 'الأسطر تحت <code>if</code> و <code>else</code> تتحرك 4 مسافات إلى اليمين.',
      'recap.3title': '<code>=</code> ليس <code>==</code>',
      'recap.3text': '<code>=</code> يعطي قيمة. <code>==</code> يسأل: هل هما متساويان؟',
      'recap.4title': 'اكتب <code>*</code>',
      'recap.4text': '<code>2 * (a + b)</code> وليس <code>2(a + b)</code>.',
      'recap.next': 'التالي: <b>Python Party</b>، لعبة الفرق. <kbd>→</kbd>',
      'gs.kicker': 'لعبة نهاية المعمل',
      'gs.rule1': '12 سؤالًا سهلًا عن Python اليوم.',
      'm.1top': 'عندما تضيف مسافة واحدة زائدة',
      'm.3top': 'أنا: <code>if n % 2 = 0:</code>',
      'm.3bottom': 'الـ Python: «ربما تقصد <code>==</code>؟»',
    },
  };

  let lang = 'en';
  const listeners = [];

  /* Placeholders: a plain value is escaped and isolated (team names, numbers),
     { key, vars } inserts another string (isolated too with bdi: true),
     { html } inserts markup as is. */
  function value(v) {
    if (v && typeof v === 'object') {
      if (!v.key) return v.html;
      return v.bdi ? `<bdi>${t(v.key, v.vars)}</bdi>` : t(v.key, v.vars);
    }
    return `<bdi>${esc(v)}</bdi>`;
  }
  function t(key, vars) {
    const str = STRINGS[lang][key] ?? STRINGS.en[key] ?? key;
    return vars ? str.replace(/\{(\w+)\}/g, (m, name) => (name in vars ? value(vars[name]) : m)) : str;
  }

  function render(el) {
    const key = el.dataset.i18n;
    if (key) el.innerHTML = t(key, el.dataset.i18nVars ? JSON.parse(el.dataset.i18nVars) : null);
    const label = el.dataset.i18nLabel;
    if (label) el.setAttribute('aria-label', t(label));
  }
  function set(el, key, vars) {
    el.dataset.i18n = key;
    if (vars) el.dataset.i18nVars = JSON.stringify(vars);
    else delete el.dataset.i18nVars;
    render(el);
  }
  function label(el, key) {
    el.dataset.i18nLabel = key;
    render(el);
  }
  function apply(root = document) {
    root.querySelectorAll('[data-i18n], [data-i18n-label]').forEach(render);
  }

  // English for the keys written in index.html comes from the page itself.
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    if (!(el.dataset.i18n in STRINGS.en)) STRINGS.en[el.dataset.i18n] = el.innerHTML.trim();
  });
  document.querySelectorAll('[data-i18n-label]').forEach((el) => {
    if (!(el.dataset.i18nLabel in STRINGS.en)) STRINGS.en[el.dataset.i18nLabel] = el.getAttribute('aria-label');
  });

  function setLang(next) {
    lang = next;
    document.documentElement.lang = next;
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
    apply();
    listeners.forEach((fn) => fn(lang));
  }

  window.I18n = {
    get lang() { return lang; },
    t, set, label, apply, esc,
    ltr: L,
    add(key, en, ar) { STRINGS.en[key] = en; if (ar != null) STRINGS.ar[key] = ar; },
    toggle() { setLang(lang === 'en' ? 'ar' : 'en'); },
    onChange(fn) { listeners.push(fn); },
  };
})();
