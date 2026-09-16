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
    { ser: [['estudiante', 'a student', 'Identity'], ['de México', 'from Mexico', 'Origin'], ['artista', 'an artist', 'Identity']], estar: [['en casa', 'at home', 'Location'], ['aquí', 'here', 'Location'], ['bien', 'well', 'Condition']] },
    { ser: [['estudiante', 'a student', 'Identity'], ['de Perú', 'from Peru', 'Origin'], ['artista', 'an artist', 'Identity']], estar: [['en la escuela', 'at school', 'Location'], ['aquí', 'here', 'Location'], ['bien', 'well', 'Condition']] },
    { ser: [['estudiante', 'a student', 'Identity'], ['de Chile', 'from Chile', 'Origin'], ['doctora', 'a doctor', 'Identity']], estar: [['en el parque', 'in the park', 'Location'], ['aquí', 'here', 'Location'], ['bien', 'well', 'Condition']] },
    { ser: [['estudiantes', 'students', 'Identity'], ['de Colombia', 'from Colombia', 'Origin'], ['artistas', 'artists', 'Identity']], estar: [['en clase', 'in class', 'Location'], ['aquí', 'here', 'Location'], ['bien', 'well', 'Condition']] },
    { ser: [['estudiantes', 'students', 'Identity'], ['de España', 'from Spain', 'Origin'], ['artistas', 'artists', 'Identity']], estar: [['en la biblioteca', 'in the library', 'Location'], ['aquí', 'here', 'Location'], ['bien', 'well', 'Condition']] }
  ];
  const all = subjects.flatMap((subject, person) => ['ser', 'estar'].flatMap(verb =>
    examples[person][verb].map(([complement, english, reason], variant) => ({
      id: `${person}-${verb}-${variant}`, verb, reason,
      words: [subject.es, subject[verb], complement],
      english: `${subject.en} ${subject.am} ${english}.`
    }))));
  const sectionsKey = 'span011-sections-v1';
  const historyKey = 'span011-history-v1';
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
      const serPeople = new Set(shuffle([0, 1, 2, 3, 4]).slice(0, 2 + Math.floor(Math.random() * 2)));
      const picked = subjects.map((_, person) => {
        const verb = serPeople.has(person) ? 'ser' : 'estar';
        return shuffle(all.filter(item => item.id.startsWith(`${person}-${verb}-`) && !excluded.has(item.id)))[0];
      });
      if (picked.every(Boolean) && new Set(picked.map(item => item.words[2])).size === 5) return shuffle(picked);
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
