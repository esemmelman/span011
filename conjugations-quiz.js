const form = document.querySelector('#quiz-form');
const questionsElement = document.querySelector('#questions');
const scoreElement = document.querySelector('#score');
let currentQuestions = [];

function renderNewSet() {
  currentQuestions = SpanishSentences.shuffle(['ser', 'estar'].flatMap(verb =>
    SpanishSentences.subjects.map((subject, person) => ({ verb, subject, person }))));
  questionsElement.replaceChildren();
  scoreElement.textContent = '';
  currentQuestions.forEach((question, index) => {
    const article = document.createElement('article');
    const label = document.createElement('label');
    label.htmlFor = `answer-${index}`;
    label.append(`${question.subject.es} + ${question.verb} = `);
    const select = document.createElement('select');
    select.id = label.htmlFor;
    select.name = select.id;
    select.setAttribute('aria-label', `Choose the ${question.verb} form for ${question.subject.es}`);
    select.add(new Option('', ''));
    const offset = question.verb === 'ser' ? 0 : 5;
    SpanishSentences.shuffle(SpanishSentences.verbs.slice(offset, offset + 5)).forEach(verb => select.add(new Option(verb, verb)));
    label.append(select);
    const feedback = document.createElement('output');
    feedback.className = 'feedback';
    article.append(label, feedback);
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
    const answer = SpanishSentences.verbs[question.person + (question.verb === 'ser' ? 0 : 5)];
    const right = select.value === answer;
    select.className = right ? 'correct' : 'incorrect';
    feedback.className = `feedback ${right ? 'correct' : 'incorrect'}`;
    feedback.textContent = right ? 'Correct.' : `Correct answer: ${answer}`;
    if (right) correct++;
  });
  scoreElement.textContent = `Score: ${correct} out of ${currentQuestions.length}`;
  scoreElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

document.querySelector('#new-set').addEventListener('click', () => {
  renderNewSet();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
renderNewSet();
