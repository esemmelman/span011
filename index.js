const reference = document.querySelector('.sentence-list');
SpanishSentences.get('reference', true).forEach(sentence => {
  const article = document.createElement('article');
  const heading = document.createElement('h1');
  heading.lang = 'es';
  const mark = document.createElement('mark');
  mark.textContent = sentence.words[1];
  heading.append(`${sentence.words[0]} `, mark, ` ${sentence.words[2]}.`);
  const translation = document.createElement('p');
  translation.textContent = sentence.english;
  const reason = document.createElement('small');
  reason.textContent = `${sentence.verb}: ${sentence.reason.toLowerCase()}`;
  article.append(heading, translation, reason);
  reference.append(article);
});
