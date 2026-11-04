/* English / Arabic switch. English is the default on every visit.
   Any text that changes with the language carries data-i18n="key"
   (and data-i18n-label="key" for its aria-label). The English for keys
   written in index.html is read from the page itself; everything else
   lives in STRINGS. Concepts (Algorithm, Loop, Print, New line, mod, Trace,
   Output), code, characters and numbers stay in English in both languages. */
(function () {
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  // Code and maths inside an Arabic sentence must keep reading left to right.
  const L = (s) => `<bdi dir="ltr">${esc(s)}</bdi>`;

  const STRINGS = {
    en: {
      'lang.switch': 'العربية',
      'lang.label': 'Show the slides in Arabic',
      'sol.kicker': 'Example {n} <span>· Solution</span>',
      'trace.title': 'Trace it',
      'trace.speed': 'Run speed',
      'trace.step': 'Step',
      'trace.run': 'Run',
      'trace.pause': 'Pause',
      'trace.reset': 'Reset',
      'trace.hint': 'Press → to show the next step.',
      'trace.log': 'Print log',
      'trace.prints': 'Prints',
      'trace.yes': 'yes',
      'trace.no': 'no',
      'trace.empty': 'Press Step to start. Every time the algorithm prints, a row is added here.',
      'code.removed': 'removed',
      'code.changed': 'changed',
      'mod.oddShort': 'odd',
      'mod.evenShort': 'even',
      'p.from': 'From Example {n} · one line changed',
      'y.warm': 'Warm-up',
      'y.core': 'Core',
      'y.challenge': 'Challenge',
      'y.hide': 'Hide solution',
      'l.row': 'Row',
      'l.triangle': 'Triangle',
      'l.stairs': 'Stairs',
      'l.length': 'Length (n)',
      'l.rows': 'Rows (n)',
      'l.odd': 'Odd places',
      'l.even': 'Even places',
      'l.char': 'Character',
      'l.fill': 'Fill',
      'l.end': 'End of row',
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
    },
    ar: {
      'lang.switch': 'English',
      'lang.label': 'اعرض الشرائح بالإنجليزية',

      // Bottom bar
      'nav.prev': 'الشريحة السابقة',
      'nav.next': 'التالي',
      'nav.full': 'ملء الشاشة',

      // Cover
      'cover.kicker': 'المحاضرة 3 · كتابة الـ Algorithms',
      'cover.lead': 'نطبع رمزًا، ثم ننتقل إلى سطر جديد، ونكرر. أربعة أمثلة محلولة، وثلاثة أنشطة صفية، ولعبة للفرق، واستراحة Memes.',
      'cover.keys': '<kbd>→</kbd> التالي <kbd>←</kbd> السابق <kbd>F</kbd> ملء الشاشة',

      // Goals
      'goals.kicker': 'أهداف اليوم',
      'goals.title': 'ماذا سنتعلم اليوم؟',
      'goals.remindTag': 'تذكير سريع',
      'goals.remindTitle': 'Print و New line',
      'goals.remindText': 'Print يضع رمزًا واحدًا على الشاشة. New line ينزل إلى بداية السطر التالي.',
      'goals.1title': 'رسم سطر',
      'goals.1text': 'نطبع عدة مرات باستخدام Loop واحد، ونرسم الخطوات كـ Flowchart.',
      'goals.2title': 'اختيار الرمز',
      'goals.2text': 'نستخدم <code>i mod 2</code> للاختيار بين <code>"*"</code> و <code>"@"</code>.',
      'goals.3title': 'رسم أسطر وأعمدة',
      'goals.3text': 'نستخدم Loop داخل Loop: <code>i</code> لرقم السطر، و <code>j</code> للمكان داخل السطر.',

      // Tool 1: mod
      'mod.kicker': 'الأداة 1',
      'mod.title': '<code>mod</code> يعطي باقي القسمة',
      'mod.lead': '<code>i mod 2</code> هو ما يبقى بعد قسمة <code>i</code> على 2.',
      'mod.odd': 'عدد فردي',
      'mod.even': 'عدد زوجي',
      'mod.oddShort': 'فردي',
      'mod.evenShort': 'زوجي',

      // Tool 2: flowcharts
      'flow.kicker': 'الأداة 2',
      'flow.title': 'الـ Flowchart',
      'flow.lead': 'الـ Flowchart يعرض خطوات الـ Algorithm كأشكال تربطها أسهم. ابدأ من <b>Start</b> واتبع الأسهم.',
      'flow.termTitle': 'Start / End',
      'flow.termText': 'المكان الذي يبدأ فيه الـ Algorithm والمكان الذي يتوقف فيه.',
      'flow.procTitle': 'Process <span class="gloss">(عملية)</span>',
      'flow.procText': 'خطوة ننفّذها، مثل إعطاء قيمة لمتغيّر: <code>i = 1</code> أو <code>i = i + 1</code>.',
      'flow.ioTitle': 'Print <span class="gloss">(إخراج)</span>',
      'flow.ioText': 'يعرض شيئًا على الشاشة.',
      'flow.decTitle': 'Decision <span class="gloss">(قرار)</span>',
      'flow.decText': 'سؤال جوابه نعم أو لا. يخرج منه سهمان: <b>Yes</b> و <b>No</b>.',
      'flow.arrow': 'الأسهم تبيّن الخطوة التالية. السهم الذي يرجع إلى الأعلى يصنع Loop.',

      // Tool 3: rows and columns
      'rows.kicker': 'الأداة 3',
      'rows.title': 'الأسطر والأعمدة',
      'rows.lead': 'نرسم الشكل سطرًا بعد سطر، من الأعلى إلى الأسفل.',
      'rows.i': '<b>i</b> هو رقم السطر. الـ <b>Outer loop</b> ينزل من سطر إلى سطر.',
      'rows.j': '<b>j</b> هو المكان داخل السطر. الـ <b>Inner loop</b> يتحرك على طول السطر الواحد.',
      'rows.nl': '<b>New line</b> و <code>j = 1</code> يبدآن السطر التالي من أول مكان.',

      // Question slides
      'q.kicker1': 'المثال 1 <span>من 4</span>',
      'q.kicker2': 'المثال 2 <span>من 4</span>',
      'q.kicker3': 'المثال 3 <span>من 4</span>',
      'q.kicker4': 'المثال 4 <span>من 4</span>',
      'q.write': 'اكتب Algorithm يرسم هذا الشكل',
      'q.writeFlow': 'ارسم Flowchart يطبع هذا',
      'q.look': 'لاحظ جيدًا',
      'q.hint': 'اعرض تلميحًا',
      'q.check1': '7 رموز على سطر واحد. الأماكن 1 و 3 و 5 و 7 فيها <code>*</code>، والأماكن 2 و 4 و 6 فيها <code>@</code>.',
      'q.hint1': 'عُدّ باستخدام <code>i</code> من 1 إلى 7. استخدم <code>i mod 2</code> لاختيار الرمز.',
      'q.check2': 'الأرقام من 1 إلى 5 على سطر واحد. كل رقم هو قيمة <code>i</code>.',
      'q.hint2': 'ابدأ بـ <code>i = 1</code>. اطبع <code>i</code>، ثم <code>i = i + 1</code>. اسأل <code>i &lt;= 5 ?</code> إذا كانت الإجابة Yes ارجع إلى Print، وإذا كانت No اذهب إلى End.',
      'q.check3': '4 أسطر. السطر 1 فيه نجمة واحدة، والسطر 2 فيه نجمتان… والسطر <code>i</code> فيه <code>i</code> نجوم.',
      'q.hint3': 'استخدم <code>i</code> لرقم السطر و <code>j</code> للنجمة داخل السطر. بعد كل سطر: New line ثم <code>j = 1</code>.',
      'q.check4': '5 أسطر من الأرقام 1 إلى 5. في كل سطر رقم واحد مكانه <code>A</code>، و <code>A</code> تتحرك مكانًا واحدًا إلى اليسار في كل سطر.',
      'q.hint4': 'استخدم <code>r</code> للسطر و <code>c</code> للعمود. عند كل <code>A</code> يكون <code>r + c = 6</code>. اطبع <code>"A"</code> هناك، وإلا اطبع <code>c</code>.',

      // Solution slides and trace panel
      'sol.kicker': 'المثال {n} <span>· الحل</span>',
      'trace.title': 'اعمل Trace',
      'trace.speed': 'سرعة التشغيل',
      'trace.step': 'خطوة',
      'trace.run': 'تشغيل',
      'trace.pause': 'إيقاف مؤقت',
      'trace.reset': 'إعادة',
      'trace.hint': 'اضغط → لعرض الخطوة التالية.',
      'trace.log': 'سجل الطباعة',
      'trace.prints': 'يطبع',
      'trace.yes': 'نعم',
      'trace.no': 'لا',
      'trace.empty': 'اضغط «خطوة» للبدء. في كل مرة يطبع فيها الـ Algorithm يُضاف سطر هنا.',
      'code.removed': 'محذوف',
      'code.changed': 'تغيّر',

      // Activity 1: Predict
      'p.kicker': 'النشاط 1 · توقّع',
      'p.title': 'ماذا سيرسم؟',
      'p.lead': 'كل Algorithm هنا غيّر سطرًا واحدًا من أحد الأمثلة (باللون الأصفر). ارسم إجابتك على الورق، ثم اضغط <b>ارسمه</b>.',
      'p.rounds': 'الجولات',
      'p.from': 'من المثال {n} · تغيّر سطر واحد',
      'p.draw': 'ارسمه',
      'p.clear': 'امسح',

      // Activity 2: Your turn
      'y.kicker': 'النشاط 2 · دورك',
      'y.title': 'اكتب الـ Algorithm',
      'y.lead': 'اختر شكلًا واكتب الـ Algorithm الخاص به على الورق، ثم قارنه بالحل.',
      'y.shapes': 'الأشكال',
      'y.show': 'اعرض الحل',
      'y.hide': 'أخفِ الحل',
      'y.run': 'شغّله',
      'y.wait': 'اكتب الـ Algorithm على الورق أولًا، ثم اضغط «اعرض الحل».',
      'y.warm': 'تمهيد',
      'y.core': 'أساسي',
      'y.challenge': 'تحدٍّ',

      // Activity 3: Pattern Lab
      'l.kicker': 'النشاط 3 · Pattern Lab',
      'l.title': 'ماذا لو…؟',
      'l.lead': 'اسأل الطلاب: ماذا لو غيّرنا الحجم أو الرموز؟ غيّرها هنا وتحقّقوا من الرسم معًا.',
      'l.shape': 'الشكل',
      'l.row': 'سطر',
      'l.triangle': 'مثلث',
      'l.stairs': 'درج',
      'l.length': 'الطول (n)',
      'l.rows': 'عدد الأسطر (n)',
      'l.odd': 'الأماكن الفردية',
      'l.even': 'الأماكن الزوجية',
      'l.char': 'الرمز',
      'l.fill': 'التعبئة',
      'l.end': 'نهاية السطر',
      'l.less': 'أقل',
      'l.more': 'أكثر',

      // Wrap-up
      'recap.kicker': 'الخلاصة',
      'recap.title': 'أربعة أشياء يجب تذكّرها',
      'recap.1title': 'Print و New line',
      'recap.1text': 'Print يضيف رمزًا واحدًا. New line يبدأ السطر التالي.',
      'recap.2title': 'mod يختار الرمز',
      'recap.2text': '<code>i mod 2</code> يساوي 0 للأعداد الزوجية و 1 للأعداد الفردية.',
      'recap.3title': 'Loop داخل Loop يرسم الشكل',
      'recap.3text': 'الـ Outer loop <code>(i)</code> ينزل عبر الأسطر. الـ Inner loop <code>(j)</code> يتحرك على طول السطر الواحد.',
      'recap.4title': 'ابدأ كل سطر من جديد',
      'recap.4text': 'بعد New line أرجِع <code>j = 1</code>.',
      'recap.next': 'التالي: <b>Pattern Party</b>، لعبة الفرق. <kbd>→</kbd>',

      // Game slide
      'gs.kicker': 'لعبة نهاية المحاضرة',
      'gs.rule1': '12 سؤالًا سهلًا عن أشكال اليوم.',
      'gs.rule2': 'الفرق تتناوب، ولكل دور 30 ثانية.',
      'gs.rule3': 'الإجابة الصحيحة تعطي 100 نقطة، وحتى 50 نقطة إضافية للسرعة.',
      'gs.rule4': 'إذا أخطأ الفريق، يمكن للفريق التالي أن يسرق السؤال مقابل 50 نقطة.',
      'gs.teams': 'كم عدد الفرق؟',
      'gs.start': 'ابدأ اللعبة',
      'gs.resume': 'استأنف اللعبة',

      // Meme break
      'm.kicker': 'استراحة Memes',
      'm.title': 'قبل أن تذهب…',
      'm.hint': 'اضغط <kbd>→</kbd> لرؤية الـ Meme التالي.',
      'm.1top': 'عندما تنسى New line',
      'm.expect': 'المتوقَّع',
      'm.reality': 'الواقع',
      'm.2no': 'كتابة <code>*@*@*@*</code> باليد',
      'm.2yes': 'ترك <code>i mod 2</code> يقرّر',
      'm.3top': 'أنا: أرسم مثلثًا',
      'm.3bottom': 'وأنا أيضًا: أنسى <code>j = 1</code>',

      // Thinking timer
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

      // Game
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
