/* English / Arabic switch. English is the default on every visit.
   Any text that changes with the language carries data-i18n="key"
   (and data-i18n-label="key" for its aria-label). The English for keys
   written in index.html is read from the page itself; everything else
   lives in STRINGS. Concepts (Factorial, Loop, Algorithm, Term, Trace,
   Input, Output), code and formulas stay in English in both languages. */
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
      'trace.check': 'Check',
      'trace.yes': 'yes',
      'trace.no': 'no',
      'trace.empty': 'Press Step to start. A row is added every time a loop checks its condition.',
      'trace.err': 'Enter a whole number from {min} to {max} for {key}.',
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
      'cover.kicker': 'المحاضرة 2 · كتابة الـ Algorithms',
      'cover.lead': 'Loop واحد يحسب كل Factorial، و Loop ثانٍ يجمع الـ Terms. أربعة أمثلة محلولة، ثم لعبة للفرق.',
      'cover.keys': '<kbd>→</kbd> التالي <kbd>←</kbd> السابق <kbd>F</kbd> ملء الشاشة',

      // Goals
      'goals.kicker': 'أهداف اليوم',
      'goals.title': 'ماذا سنتعلم اليوم؟',
      'goals.remindTag': 'تذكير سريع',
      'goals.remindTitle': 'ما هو الـ Factorial؟',
      'goals.remindText': 'نضرب كل الأعداد من 1 حتى العدد نفسه.',
      'goals.remindNote': 'في المحاضرة 1 حسبنا Factorial <b>واحدًا</b> باستخدام Loop. اليوم نحسب <b>عدة</b> Factorials ونجمعها.',
      'goals.1title': 'جمع الـ Factorials معًا',
      'goals.1text': `نحسب مجاميع مثل ${L('8! + 6! + 4!')}، جزءًا بعد جزء.`,
      'goals.2title': 'استخدام Loop داخل Loop',
      'goals.2text': 'Loop يحسب الـ Factorial، و Loop ثانٍ ينتقل إلى الـ Factorial التالي.',
      'goals.3title': 'البدء من جديد في كل مرة',
      'goals.3text': 'قبل الـ Factorial التالي، نُرجع <code>fact</code> إلى 1.',

      // The big idea
      'idea.kicker': 'الفكرة الأساسية',
      'idea.title': 'Loop داخل Loop',
      'idea.lead': `لحساب <b dir="ltr">y = 8! + 6! + 4!</b>، نكرر نفس الشيء لكل عدد:`,
      'idea.tag': `الـ Outer loop: ${L('i = 8')}، ثم 6، ثم 4`,
      'idea.add': 'أضِفه إلى y',
      'idea.inner': `الـ <b>Inner loop</b> يضرب ${L('1 × 2 × 3 …')} ليحسب Factorial واحدًا.`,
      'idea.outer': `الـ <b>Outer loop</b> ينتقل إلى العدد التالي ويبدأ من جديد بـ ${L('fact = 1')}.`,

      // Question slides
      'q.kicker1': 'المثال 1 <span>من 4</span>',
      'q.kicker2': 'المثال 2 <span>من 4</span>',
      'q.kicker3': 'المثال 3 <span>من 4</span>',
      'q.kicker4': 'المثال 4 <span>من 4</span>',
      'q.write': 'اكتب Algorithm لحساب',
      'q.test': 'اختبر إجابتك',
      'q.hint': 'اعرض تلميحًا',
      'q.check1': `المستخدم يُدخل x. عندما ${L('x = 2')} يجب أن يطبع <b dir="ltr">20,532</b>.`,
      'q.check2': 'لا يوجد Input هذه المرة. يجب أن يطبع <b dir="ltr">13</b>.',
      'q.check3': 'لا يوجد Input هذه المرة. يجب أن يطبع <b dir="ltr">146,313,820,848</b>.',
      'q.check4': `المستخدم يُدخل x، و ${L('7x!')} تعني ${L('7 × x!')}. عندما ${L('x = 7')} يجب أن يطبع <b dir="ltr">6,093</b>.`,
      'q.hint1': `استخدم الـ Loop الخاص بالـ Factorial من المحاضرة 1 لكل Term. بعد إضافة ${L('fact / x')} إلى y، أنقِص i بمقدار 2 وأعِد fact و c إلى 1.`,
      'q.hint2': `أول ثلاثة Terms كلها على شكل ${L('x! / (x − 1)!')} حيث ${L('x = 6, 4, 2')}. و ${L('x! / x')} يساوي ${L('(x − 1)!')}.`,
      'q.hint3': `كل Term هو ${L('i! × (i + 2)!')} حيث ${L('i = 2, 5, 8')}. بعد أن تحسب ${L('i!')}، اضربه في ${L('(i + 1)')} و ${L('(i + 2)')} لتحصل على ${L('(i + 2)!')}.`,
      'q.hint4': `${L('x!')} هو نفسه في كل Term، لذلك احسبه مرة واحدة فقط. ثم اعمل Loop على ${L('d = 3, 5, 7')} بينما المعامل يأخذ القيم ${L('7, 5, 3')}.`,

      // Wrap-up
      'recap.kicker': 'الخلاصة',
      'recap.title': 'أربعة أشياء يجب تذكّرها',
      'recap.1title': 'الـ Inner loop يحسب الـ Factorial',
      'recap.1text': '<code>fact = fact * c</code>، <code>c = c + 1</code>، ونكرر طالما <code>c &lt;= i</code>.',
      'recap.2title': 'الـ Outer loop ينتقل إلى الـ Term التالي',
      'recap.2text': 'غيّر العدّاد، ثم أعِد <code>fact = 1</code> و <code>c = 1</code> قبل الـ Factorial التالي.',
      'recap.3title': 'مقدار الخطوة يتبع الـ Series',
      'recap.3text': `<code>i − 2</code> للقيم ${L('8, 6, 4')} · <code>i + 3</code> للقيم ${L('2, 5, 8')} · <code>d + 2</code> للقيم ${L('3, 5, 7')}.`,
      'recap.4title': 'استفِد مما حسبته من قبل',
      'recap.4text': `${L('(i + 2)!')} نحصل عليه من ${L('i!')} في المثال 3. و ${L('x!')} يُحسب مرة واحدة فقط في المثال 4.`,
      'recap.next': 'التالي: <b>Series Showdown</b>، لعبة الفرق. <kbd>→</kbd>',

      // Game slide
      'gs.kicker': 'لعبة نهاية المحاضرة',
      'gs.rule1': '12 سؤالًا سهلًا عن محاضرة اليوم.',
      'gs.rule2': 'الفرق تتناوب، ولكل دور 30 ثانية.',
      'gs.rule3': 'الإجابة الصحيحة تعطي 100 نقطة، وحتى 50 نقطة إضافية للسرعة.',
      'gs.rule4': 'إذا أخطأ الفريق، يمكن للفريق التالي أن يسرق السؤال مقابل 50 نقطة.',
      'gs.teams': 'كم عدد الفرق؟',
      'gs.start': 'ابدأ اللعبة',
      'gs.resume': 'استأنف اللعبة',

      // Solution slides and trace panel
      'sol.kicker': 'المثال {n} <span>· الحل</span>',
      'trace.title': 'اعمل Trace',
      'trace.speed': 'سرعة التشغيل',
      'trace.step': 'خطوة',
      'trace.run': 'تشغيل',
      'trace.pause': 'إيقاف مؤقت',
      'trace.reset': 'إعادة',
      'trace.hint': 'اضغط → لعرض الخطوة التالية.',
      'trace.check': 'الشرط',
      'trace.yes': 'نعم',
      'trace.no': 'لا',
      'trace.empty': 'اضغط «خطوة» للبدء. يُضاف سطر في كل مرة يتحقق فيها الـ Loop من شرطه.',
      'trace.err': 'أدخل عددًا صحيحًا من {min} إلى {max} لـ {key}.',

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
