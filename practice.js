const form = document.querySelector('#practice-form');
const questionsElement = document.querySelector('#questions');
const scoreElement = document.querySelector('#score');
let currentQuestions = [];

function fitSelectWidth(select) {
  const style = getComputedStyle(select);
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return;
  context.font = style.font;
  const textWidth = Math.max(...[...select.options].map(option => context.measureText(option.textContent).width));
  const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
  const arrowSpace = parseFloat(style.fontSize) * 1.1;
  select.style.width = `${Math.ceil(textWidth + padding + arrowSpace + 8)}px`;
}

function fitAllSelects() {
  questionsElement.querySelectorAll('select').forEach(fitSelectWidth);
}

function renderNewSet() {
  currentQuestions = SpanishSentences.get('exercise1', true);
  questionsElement.replaceChildren();
  scoreElement.textContent = '';
  currentQuestions.forEach((question, index) => {
    const article = document.createElement('article');
    const label = document.createElement('label');
    label.lang = 'es';
    label.htmlFor = `answer-${index}`;
    label.append(`${question.words[0]} `);
    const select = document.createElement('select');
    select.id = label.htmlFor;
    select.name = select.id;
    select.setAttribute('aria-label', `Missing verb in sentence ${index + 1}`);
    select.add(new Option('', ''));
    const person = ['Yo', 'Tú', 'Ella', 'Nosotros', 'Ellos'].indexOf(question.words[0]);
    SpanishSentences.shuffle([SpanishSentences.verbs[person], SpanishSentences.verbs[person + 5]]).forEach(verb => select.add(new Option(verb, verb)));
    label.append(select, ` ${question.words[2]}.`);
    const translation = document.createElement('p');
    translation.textContent = question.english;
    const feedback = document.createElement('output');
    feedback.className = 'feedback';
    article.append(label, translation, feedback);
    questionsElement.append(article);
    fitSelectWidth(select);
  });
  questionsElement.querySelector('select').focus();
}

form.addEventListener('submit', event => {
  event.preventDefault();
  let correct = 0;
  currentQuestions.forEach((question, index) => {
    const article = questionsElement.children[index];
    const select = article.querySelector('select');
    const feedback = article.querySelector('output');
    const right = select.value === question.words[1];
    select.className = right ? 'correct' : 'incorrect';
    feedback.className = `feedback ${right ? 'correct' : 'incorrect'}`;
    feedback.textContent = right ? `Correct: ${question.verb} for ${question.reason.toLowerCase()}.` : `Correct answer: ${question.words[1]} (${question.verb}: ${question.reason.toLowerCase()}).`;
    if (right) correct++;
  });
  scoreElement.textContent = `Score: ${correct} out of ${currentQuestions.length}`;
  scoreElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

document.querySelector('#new-set').addEventListener('click', () => {
  renderNewSet();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
window.addEventListener('displaychange', fitAllSelects);
document.fonts?.ready.then(fitAllSelects);
renderNewSet();
