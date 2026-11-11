/* English / Arabic switch. English is the default on every visit.
   Text that changes with the language carries data-i18n="key" (and
   data-i18n-label="key" for its aria-label). The English for keys written in
   index.html is read from the page itself; everything else lives in STRINGS.
   Concept words (Algorithm, Input, Output, Print, If, Loop, Trace, mod),
   the algorithm steps and numbers stay in English in both languages. */
(function () {
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  // Code and maths inside an Arabic sentence must keep reading left to right.
  const L = (s) => `<bdi dir="ltr">${esc(s)}</bdi>`;

  const STRINGS = {
    en: {
      'lang.switch': 'العربية',
      'lang.label': 'Show the page in Arabic',
      'lvl.all': 'All',
      'lvl.word': 'Level {n}',
      'lvl.1': 'One step after another',
      'lvl.2': 'Decisions with If',
      'lvl.3': 'Loops',
      'lvl.4': 'Loops with If',
      'lvl.5': 'Challenge',
      'lvl.6': 'Digits of a number',
      'lvl.7': 'Loop inside a loop',
      'lvl.count': '{n} examples',
      'lvl.allBtn': 'Show all {n}',
      'progress': '{n} / {total} solved',
      'count': 'Showing {n} of {total}',
      'ex.example': 'Example',
      'ex.input': 'Input',
      'ex.output': 'Output',
      'ex.hint': 'Hint',
      'ex.show': 'Show solution',
      'ex.hide': 'Hide solution',
      'ex.solved': 'Solved',
      'ex.mark': 'Mark example {n} as solved',
      'ex.note': 'Good to know',
      'ex.idea': 'The idea',
      'sol.alg': 'The algorithm, line by line',
      'sol.why': 'Explain each line',
      'sol.run': 'Watch it run',
      'why.start': 'The algorithm begins here.',
      'why.declare': 'Name the variables (the boxes) this algorithm uses.',
      'why.end': 'The algorithm stops here.',
      'run.input': 'Input',
      'run.order': 'In this order: {order}',
      'run.go': 'Run',
      'run.sample': 'Example values',
      'run.step': 'Step {n}',
      'run.first': 'Go to the start',
      'run.back': 'Back',
      'run.next': 'Next',
      'run.play': 'Play',
      'run.pause': 'Pause',
      'run.last': 'Go to the end',
      'run.vars': 'Variables',
      'run.screen': 'Output',
      'run.empty': 'Nothing printed yet.',
      'run.was': 'was {v}',
      'nar.start': 'The algorithm starts.',
      'nar.declare': 'The variables {list} are ready. They have no values yet.',
      'nar.end': 'The algorithm ends. The output is below.',
      'nar.ask': 'Is {cond}?',
      'nar.nums': 'With the numbers:',
      'nar.yes': 'Yes',
      'nar.no': 'No',
      'nar.back': 'Yes, so go back to step {n}.',
      'nar.on': 'No, so go on to step {n}.',
      'nar.same': 'It stays on the same line.',
      'nar.space': 'a space',
      'nar.newline': 'Go down to a new line.',
      'nar.skip': 'The answer is no, so this line does nothing.',
      'nar.else': 'All the answers are no, so the else part runs.',
      'tr.title': 'Trace table',
      'tr.sub': 'One row for every step that runs. Click a row to see it in the player.',
      'tr.step': 'Step',
      'tr.output': 'Output',
      'tr.legend': '<b>↩ 5</b> the answer is yes: go back to step 5. <b>↓</b> the answer is no: go on to the next step.',
      'tr.bad': 'Use numbers only, with spaces between them.',
      'tr.missing': 'The algorithm needs more input values. It stopped at <b>Input {name}</b>.',
      'tr.extra': 'Some input values were not used: {n}.',
      'tr.stopped': 'Stopped after 3000 steps. Try smaller numbers.',
    },
    ar: {
      'lang.switch': 'English',
      'lang.label': 'اعرض الصفحة بالإنجليزية',
      'top.brand': 'تدريب على الـ Algorithms',
      'hero.kicker': 'تدريب للـ Midterm',
      'hero.title': '30 Algorithm،<br><span>من السهل إلى الصعب</span>',
      'hero.lead': 'يبدأ كل مثال بسيطًا ثم يكبر خطوة بخطوة. جرّبه على الورق أولًا، ثم افتح التلميح والحل: كل سطر مشروح، ويمكنك أن تشاهد الـ Algorithm يعمل خطوة بخطوة بأعدادك أنت.',
      'mock.says': 'الآن',
      'how.1': 'اقرأ المسألة والمثال.',
      'how.2': 'اكتب الـ Algorithm على الورق.',
      'how.3': 'علِقت؟ افتح التلميح.',
      'how.4': 'افتح الحل وشاهده يعمل خطوة بخطوة.',
      'levels.title': 'اختر مستوى',
      'levels.sub': 'كل درجة أصعب قليلًا من التي قبلها.',
      'levels.filter': 'اختر مستوى',
      'rules.title': 'كيف نكتب الـ Algorithm',
      'rules.sub': 'الكلمات والرموز التي تحتاجها في الـ Midterm. افتحها مرة واحدة قبل أن تبدأ.',
      'rules.start': 'أول خطوة وآخر خطوة.',
      'rules.declare': 'نذكر أسماء المتغيّرات التي سنستخدمها.',
      'rules.input': 'نقرأ القيم من المستخدم، بهذا الترتيب.',
      'rules.print': 'نعرض القيم. النص يُكتب بين علامتي تنصيص: <code>Print "even"</code>.',
      'rules.assign': '<code>=</code> يعطي قيمة للمتغيّر الذي على يساره.',
      'rules.compare': 'نقارن بين قيمتين، والإجابة نعم أو لا.',
      'rules.mod': 'باقي القسمة: <code>7 mod 2 = 1</code> و <code>8 mod 2 = 0</code>.',
      'rules.andor': '<code>and</code>: يجب أن يكون الاثنان صحيحين. <code>or</code>: يكفي واحد.',
      'rules.if': 'قرار: جزء واحد فقط من الجزأين يُنفَّذ.',
      'rules.loop': 'Loop: ما دامت الإجابة نعم نرجع ونكرر. غيّر العدّاد (<code>i = i + 1</code>) قبل هذا السطر، وإلا فلن ينتهي الـ Loop أبدًا.',
      'rules.newline': 'ينزل إلى السطر التالي. في أمثلة الرسم (المستوى 7) يبقى الـ Print على نفس السطر حتى نكتب Print new line، مثل المحاضرة 3.',
      'filter.hide': 'أخفِ الأمثلة التي حللتها',
      'filter.empty': 'لا يوجد شيء هنا. اختر مستوى آخر، أو أظهر الأمثلة المحلولة مرة أخرى.',
      'foot.luck': 'بالتوفيق في الـ Midterm!',
      'lvl.all': 'الكل',
      'lvl.word': 'المستوى {n}',
      'lvl.1': 'خطوة بعد خطوة',
      'lvl.2': 'القرارات مع If',
      'lvl.3': 'الـ Loops',
      'lvl.4': 'Loops مع If',
      'lvl.5': 'تحدٍّ',
      'lvl.6': 'أرقام العدد',
      'lvl.7': 'Loop داخل Loop',
      'lvl.count': 'عدد الأمثلة: {n}',
      'lvl.allBtn': 'اعرض الكل ({n})',
      'progress': 'حللت {n} من {total}',
      'count': 'المعروض: {n} من {total}',
      'ex.example': 'مثال',
      'ex.input': 'Input',
      'ex.output': 'Output',
      'ex.hint': 'تلميح',
      'ex.show': 'اعرض الحل',
      'ex.hide': 'أخفِ الحل',
      'ex.solved': 'حللته',
      'ex.mark': 'علّم المثال {n} كمحلول',
      'ex.note': 'معلومة مفيدة',
      'ex.idea': 'الفكرة',
      'sol.alg': 'الـ Algorithm سطرًا سطرًا',
      'sol.why': 'اشرح كل سطر',
      'sol.run': 'شاهده يعمل',
      'why.start': 'هنا يبدأ الـ Algorithm.',
      'why.declare': 'نذكر المتغيّرات (الصناديق) التي يستخدمها هذا الـ Algorithm.',
      'why.end': 'هنا ينتهي الـ Algorithm.',
      'run.input': 'Input',
      'run.order': 'بهذا الترتيب: {order}',
      'run.go': 'شغّل',
      'run.sample': 'قيم المثال',
      'run.step': 'الخطوة {n}',
      'run.first': 'اذهب إلى البداية',
      'run.back': 'السابق',
      'run.next': 'التالي',
      'run.play': 'تشغيل',
      'run.pause': 'إيقاف مؤقت',
      'run.last': 'اذهب إلى النهاية',
      'run.vars': 'المتغيّرات',
      'run.screen': 'Output',
      'run.empty': 'لم يُطبع شيء بعد.',
      'run.was': 'كان {v}',
      'nar.start': 'يبدأ الـ Algorithm.',
      'nar.declare': 'المتغيّرات {list} جاهزة، وليس لها قيم بعد.',
      'nar.end': 'انتهى الـ Algorithm. الـ Output في الأسفل.',
      'nar.ask': 'هل {cond}؟',
      'nar.nums': 'بالأعداد:',
      'nar.yes': 'نعم',
      'nar.no': 'لا',
      'nar.back': 'نعم، إذن ارجع إلى الخطوة {n}.',
      'nar.on': 'لا، إذن انتقل إلى الخطوة {n}.',
      'nar.same': 'يبقى على نفس السطر.',
      'nar.space': 'مسافة',
      'nar.newline': 'انزل إلى سطر جديد.',
      'nar.skip': 'الإجابة لا، لذلك لا يفعل هذا السطر شيئًا.',
      'nar.else': 'كل الإجابات لا، لذلك يُنفَّذ جزء else.',
      'tr.title': 'جدول الـ Trace',
      'tr.sub': 'سطر لكل خطوة تُنفَّذ. اضغط على أي سطر لتراه في المشغّل.',
      'tr.step': 'الخطوة',
      'tr.output': 'Output',
      'tr.legend': '<b>↩ 5</b> الإجابة نعم: ارجع إلى الخطوة 5. <b>↓</b> الإجابة لا: انتقل إلى الخطوة التالية.',
      'tr.bad': 'استخدم أرقامًا فقط، وضع مسافة بين كل رقم والآخر.',
      'tr.missing': 'الـ Algorithm يحتاج قيمًا أكثر. توقف عند <b><bdi dir="ltr">Input {name}</bdi></b>.',
      'tr.extra': 'بعض قيم الـ Input لم تُستخدم: {n}.',
      'tr.stopped': 'توقف بعد 3000 خطوة. جرّب أعدادًا أصغر.',
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
    if (label) {
      // aria-label is plain text: fill in {n} without any markup.
      const vars = el.dataset.i18nVars ? JSON.parse(el.dataset.i18nVars) : {};
      const str = STRINGS[lang][label] ?? STRINGS.en[label] ?? label;
      el.setAttribute('aria-label', str.replace(/\{(\w+)\}/g, (m, name) => (name in vars ? String(vars[name]) : m)));
    }
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
