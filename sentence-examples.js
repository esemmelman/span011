const reference = document.querySelector('.sentence-list');
SpanishSentences.get('reference', true).forEach(sentence => {
  const article = document.createElement('article');
  const heading = document.createElement('h1');
  heading.lang = 'es';
  const mark = document.createElement('mark');
  mark.textContent = sentence.words[1];
  const usage = document.createElement('span');
  usage.lang = 'en';
  usage.textContent = `(${sentence.verb === 'ser' ? 'Ser' : 'Estar'}: ${sentence.reason})`;
  heading.append(`${sentence.words[0]} `, mark, ` ${sentence.words[2]}.`, usage);
  const translation = document.createElement('p');
  translation.textContent = sentence.english;
  article.append(heading, translation);
  reference.append(article);
});
