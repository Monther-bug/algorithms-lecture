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
      'lvl.count': '{n} examples',
      'progress': '{n} / 20 solved',
      'count': 'Showing {n} of 20',
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
      'tr.title': 'Trace it with your own numbers',
      'tr.order': 'Input order: {order}',
      'tr.run': 'Trace',
      'tr.reset': 'Example values',
      'tr.step': 'Step',
      'tr.output': 'Output',
      'tr.legend': '<b>↩ 5</b> the answer is yes: go back to step 5. <b>↓</b> the answer is no: go on to the next step.',
      'tr.bad': 'Use numbers only, with spaces between them.',
      'tr.missing': 'The algorithm needs more input values. It stopped at <b>Input {name}</b>.',
      'tr.extra': 'Some input values were not used: {n}.',
      'tr.stopped': 'Stopped after 600 steps. Try smaller numbers.',
      'tr.nothing': 'Nothing was printed.',
    },
    ar: {
      'lang.switch': 'English',
      'lang.label': 'اعرض الصفحة بالإنجليزية',
      'top.brand': 'تدريب على الـ Algorithms',
      'hero.kicker': 'تدريب للـ Midterm',
      'hero.title': '20 Algorithm،<br><span>من السهل إلى الصعب</span>',
      'hero.lead': 'يبدأ كل مثال بسيطًا ثم يكبر خطوة بخطوة. جرّبه على الورق أولًا، ثم افتح التلميح والحل، وجدول الـ Trace بأعدادك أنت.',
      'how.1': 'اقرأ المسألة والمثال.',
      'how.2': 'اكتب الـ Algorithm على الورق.',
      'how.3': 'علِقت؟ افتح التلميح.',
      'how.4': 'قارن بالحل، ثم اعمل Trace.',
      'levels.title': 'المستويات',
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
      'lvl.count': 'عدد الأمثلة: {n}',
      'progress': 'حللت {n} من 20',
      'count': 'المعروض: {n} من 20',
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
      'tr.title': 'اعمل Trace بأعدادك أنت',
      'tr.order': 'ترتيب الـ Input: {order}',
      'tr.run': 'Trace',
      'tr.reset': 'قيم المثال',
      'tr.step': 'الخطوة',
      'tr.output': 'Output',
      'tr.legend': '<b>↩ 5</b> الإجابة نعم: ارجع إلى الخطوة 5. <b>↓</b> الإجابة لا: انتقل إلى الخطوة التالية.',
      'tr.bad': 'استخدم أرقامًا فقط، وضع مسافة بين كل رقم والآخر.',
      'tr.missing': 'الـ Algorithm يحتاج قيمًا أكثر. توقف عند <b><bdi dir="ltr">Input {name}</bdi></b>.',
      'tr.extra': 'بعض قيم الـ Input لم تُستخدم: {n}.',
      'tr.stopped': 'توقف بعد 600 خطوة. جرّب أعدادًا أصغر.',
      'tr.nothing': 'لم يُطبع شيء.',
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
