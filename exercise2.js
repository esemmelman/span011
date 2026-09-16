let sentences = [];
let currentIndex = 0;
let correctCount = 0;
let selectedWords = [null, null, null];
const columns = ['subject', 'verb', 'complement'];
const bank = document.querySelector('.word-bank');
const sentenceArea = document.querySelector('#sentences');
const score = document.querySelector('#score');
const checkButton = document.querySelector('#check');
const nextButton = document.querySelector('#next');

function choicesFor(columnIndex) {
  const question = sentences[currentIndex];
  const answer = question.words[columnIndex];
  if (columnIndex === 1) {
    const serCount = currentIndex % 2 === 0 ? 3 : 2;
    const counts = { ser: serCount, estar: 5 - serCount };
    const choices = ['ser', 'estar'].flatMap(verb => {
      const included = question.verb === verb ? [answer] : [];
      const others = SpanishSentences.shuffle(sentences.filter(sentence => sentence.verb === verb && sentence.words[1] !== answer).map(sentence => sentence.words[1]));
      return [...included, ...others.slice(0, counts[verb] - included.length)];
    });
    return SpanishSentences.shuffle(choices);
  }
  const others = SpanishSentences.shuffle([...new Set(sentences.map(sentence => sentence.words[columnIndex]))].filter(word => word !== answer));
  return SpanishSentences.shuffle([answer, ...others.slice(0, 4)]);
}

function renderQuestion() {
  selectedWords = [null, null, null];
  checkButton.hidden = false;
  nextButton.hidden = true;
  score.textContent = '';
  sentenceArea.replaceChildren();
  const heading = document.createElement('h2');
  heading.tabIndex = -1;
  heading.textContent = sentences[currentIndex].english;
  const feedback = document.createElement('output');
  feedback.className = 'feedback';
  feedback.setAttribute('aria-live', 'polite');
  sentenceArea.append(heading, feedback);

  columns.forEach((column, index) => {
    const list = bank.querySelector(`[data-column="${column}"] .word-list`);
    list.replaceChildren();
    choicesFor(index).forEach(word => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'word';
      button.textContent = word;
      button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', () => {
        if (checkButton.hidden) return;
        feedback.textContent = '';
        feedback.className = 'feedback';
        const previous = selectedWords[index];
        if (previous) {
          previous.classList.remove('selected');
          previous.setAttribute('aria-pressed', 'false');
        }
        selectedWords[index] = previous === button ? null : button;
        if (selectedWords[index]) {
          button.classList.add('selected');
          button.setAttribute('aria-pressed', 'true');
        }
      });
      list.append(button);
    });
  });
}

function start() {
  sentences = SpanishSentences.get('exercise2', true);
  currentIndex = 0;
  correctCount = 0;
  bank.hidden = false;
  renderQuestion();
}

checkButton.addEventListener('click', () => {
  const feedback = sentenceArea.querySelector('.feedback');
  if (selectedWords.some(button => !button)) {
    feedback.className = 'feedback prompt';
    feedback.textContent = 'Select one word in each column before scoring.';
    return;
  }
  const question = sentences[currentIndex];
  const right = selectedWords.every((button, index) => button.textContent === question.words[index]);
  sentenceArea.querySelector('h2').classList.add(right ? 'correct' : 'incorrect');
  columns.forEach((column, index) => {
    const list = bank.querySelector(`[data-column="${column}"] .word-list`);
    const correctButton = [...list.children].find(button => button.textContent === question.words[index]);
    correctButton.classList.add('answer');
    if (selectedWords[index] !== correctButton) selectedWords[index].classList.add('incorrect');
  });
  feedback.className = `feedback ${right ? 'correct' : 'incorrect'}`;
  feedback.textContent = right ? `Correct: ${question.verb} for ${question.reason.toLowerCase()}.` : `Incorrect\n${question.words.join(' ')}.\n${question.verb}: ${question.reason.toLowerCase()}.`;
  if (right) correctCount++;
  checkButton.hidden = true;
  nextButton.hidden = false;
  nextButton.textContent = currentIndex === sentences.length - 1 ? 'See Score' : 'Next Sentence';
  score.textContent = `Score: ${correctCount} out of ${currentIndex + 1}`;
});

nextButton.addEventListener('click', () => {
  currentIndex++;
  if (currentIndex < sentences.length) {
    renderQuestion();
    sentenceArea.querySelector('h2').focus();
  } else {
    bank.hidden = true;
    sentenceArea.replaceChildren();
    nextButton.hidden = true;
    score.textContent = `Final score: ${correctCount} out of ${sentences.length}`;
  }
});
document.querySelector('#reset').addEventListener('click', start);
start();
