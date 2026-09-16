const SpanishSentences = (() => {
  const subjects = [
    { es: 'Yo', en: 'I', ser: 'soy', estar: 'estoy', am: 'am' },
    { es: 'Tú', en: 'You', ser: 'eres', estar: 'estás', am: 'are' },
    { es: 'Ella', en: 'She', ser: 'es', estar: 'está', am: 'is' },
    { es: 'Nosotros', en: 'We', ser: 'somos', estar: 'estamos', am: 'are' },
    { es: 'Ellos', en: 'They', ser: 'son', estar: 'están', am: 'are' }
  ];
  // Each row is [Spanish complement, English complement, reason].
  const examples = [
    {
      ser: [['estudiante', 'a student', 'Identity'], ['artista', 'an artist', 'Identity'], ['de México', 'from Mexico', 'Origin'], ['paciente', 'patient', 'Characteristic'], ['optimista', 'optimistic', 'Characteristic']],
      estar: [['en casa', 'at home', 'Location'], ['en el museo', 'in the museum', 'Location'], ['feliz', 'happy', 'Feeling'], ['triste', 'sad', 'Feeling'], ['bien', 'well', 'Condition']]
    },
    {
      ser: [['estudiante', 'a student', 'Identity'], ['guía', 'a guide', 'Identity'], ['de Perú', 'from Peru', 'Origin'], ['amable', 'kind', 'Characteristic'], ['inteligente', 'intelligent', 'Characteristic']],
      estar: [['en la escuela', 'at school', 'Location'], ['en el mercado', 'at the market', 'Location'], ['de buen humor', 'in a good mood', 'Feeling'], ['de mal humor', 'in a bad mood', 'Feeling'], ['mal', 'unwell', 'Condition']]
    },
    {
      ser: [['doctora', 'a doctor', 'Identity'], ['maestra', 'a teacher', 'Identity'], ['de Chile', 'from Chile', 'Origin'], ['curiosa', 'curious', 'Characteristic'], ['generosa', 'generous', 'Characteristic']],
      estar: [['en el parque', 'in the park', 'Location'], ['en la oficina', 'at the office', 'Location'], ['contenta', 'happy', 'Feeling'], ['preocupada', 'worried', 'Feeling'], ['cansada', 'tired', 'Condition']]
    },
    {
      ser: [['estudiantes', 'students', 'Identity'], ['artistas', 'artists', 'Identity'], ['de Colombia', 'from Colombia', 'Origin'], ['responsables', 'responsible', 'Characteristic'], ['creativos', 'creative', 'Characteristic']],
      estar: [['en clase', 'in class', 'Location'], ['en la playa', 'at the beach', 'Location'], ['felices', 'happy', 'Feeling'], ['tristes', 'sad', 'Feeling'], ['ocupados', 'busy', 'Condition']]
    },
    {
      ser: [['médicos', 'doctors', 'Identity'], ['músicos', 'musicians', 'Identity'], ['de España', 'from Spain', 'Origin'], ['altos', 'tall', 'Characteristic'], ['simpáticos', 'friendly', 'Characteristic']],
      estar: [['en la biblioteca', 'in the library', 'Location'], ['en el restaurante', 'at the restaurant', 'Location'], ['contentos', 'happy', 'Feeling'], ['preocupados', 'worried', 'Feeling'], ['agotados', 'exhausted', 'Condition']]
    }
  ];
  const all = subjects.flatMap((subject, person) => ['ser', 'estar'].flatMap(verb =>
    examples[person][verb].map(([complement, english, reason], variant) => ({
      id: `${person}-${verb}-${variant}`, verb, reason,
      words: [subject.es, subject[verb], complement],
      english: `${subject.en} ${subject.am} ${english}.`
    }))));
  const sectionsKey = 'span011-sections-v3';
  const historyKey = 'span011-history-v3';
  let memory = {};
  let memoryHistory = [];

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
  function read(key, fallback) {
    try { return JSON.parse((key === sectionsKey ? sessionStorage : localStorage).getItem(key)) || fallback; }
    catch { return fallback; }
  }
  function save(key, value) {
    try { (key === sectionsKey ? sessionStorage : localStorage).setItem(key, JSON.stringify(value)); }
    catch { /* Keep the in-memory copy. */ }
  }
  function makeSet(excluded) {
    for (let attempt = 0; attempt < 100; attempt++) {
      const usedEndings = new Set();
      const serReasons = shuffle(['Identity', 'Identity', 'Origin', 'Characteristic', 'Characteristic']);
      const estarReasons = shuffle(['Location', 'Location', 'Feeling', 'Feeling', 'Condition']);
      const tasks = shuffle(subjects.flatMap((_, person) => [
        { person, verb: 'ser', reason: serReasons[person] },
        { person, verb: 'estar', reason: estarReasons[person] }
      ]));
      const picked = tasks.map(({ person, verb, reason }) => {
        const item = shuffle(all.filter(candidate => candidate.id.startsWith(`${person}-${verb}-`) && candidate.reason === reason && !excluded.has(candidate.id) && !usedEndings.has(candidate.words[2])))[0];
        if (item) usedEndings.add(item.words[2]);
        return item;
      });
      if (picked.every(Boolean)) return shuffle(picked);
    }
    return null;
  }
  function get(section, refresh = false) {
    const sections = read(sectionsKey, memory);
    if (!refresh && sections[section]) return sections[section].map(id => all.find(item => item.id === id));
    const elsewhere = new Set(Object.entries(sections).filter(([name]) => name !== section).flatMap(([, ids]) => ids));
    const history = read(historyKey, memoryHistory);
    const picked = makeSet(new Set([...elsewhere, ...history])) || makeSet(elsewhere) || makeSet(new Set());
    sections[section] = picked.map(item => item.id);
    memory = sections;
    save(sectionsKey, sections);
    memoryHistory = [...history, ...sections[section]].slice(-60);
    save(historyKey, memoryHistory);
    return picked;
  }
  return { get, shuffle, verbs: ['soy', 'eres', 'es', 'somos', 'son', 'estoy', 'estás', 'está', 'estamos', 'están'] };
})();
