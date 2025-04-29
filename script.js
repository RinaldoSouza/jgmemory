const board = document.getElementById('board');
const timerElement = document.getElementById('timer');
const restartBtn = document.getElementById('restart-btn');
const changeThemeBtn = document.getElementById('change-theme-btn');
const rankingList = document.getElementById('ranking-list');
const themeTitle = document.getElementById('theme-title');
const message = document.getElementById('message');

let currentTheme = 1;
let images = generateImages(currentTheme);
let cards = [...images, ...images];

let flippedCards = [];
let lockBoard = false;
let matched = 0;
let timer = 0;
let timerInterval;
let isTimerRunning = false;

function generateImages(theme) {
  return Array.from({ length: 8 }, (_, i) => `image${theme}/${i + 1}.png`);
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

function createBoard() {
  board.innerHTML = '';
  cards = [...images, ...images];
  shuffle(cards);

  cards.forEach(src => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.image = src;

    const front = document.createElement('div');
    front.classList.add('front');
    const img = document.createElement('img');
    img.src = src;
    front.appendChild(img);

    const back = document.createElement('div');
    back.classList.add('back');

    card.appendChild(front);
    card.appendChild(back);

    card.addEventListener('click', flipCard);
    board.appendChild(card);
  });

  preReveal();
}

// Mostra todas as cartas por 1s no começo
function preReveal() {
  const allCards = document.querySelectorAll('.card');
  allCards.forEach(card => card.classList.add('flipped'));
  lockBoard = true;

  setTimeout(() => {
    allCards.forEach(card => card.classList.remove('flipped'));
    lockBoard = false;
  }, 1000);
}

function flipCard() {
  if (lockBoard) return;
  if (this.classList.contains('flipped')) return;

  if (!isTimerRunning) {
    isTimerRunning = true;
    startTimer();
  }

  this.classList.add('flipped');
  flippedCards.push(this);

  if (flippedCards.length === 2) {
    checkMatch();
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  if (card1.dataset.image === card2.dataset.image) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    flippedCards = [];
    matched += 2;
    if (matched === cards.length) {
      endGame();
    }
  } else {
    lockBoard = true;
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      flippedCards = [];
      lockBoard = false;
    }, 600);
  }
}

function startTimer() {
  timerInterval = setInterval(() => {
    timer++;
    timerElement.textContent = `Tempo: ${timer}s`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function endGame() {
  stopTimer();
  message.textContent = `🏆 Parabéns! Você terminou em ${timer}s!`;
  message.style.display = 'block';
  
  setTimeout(() => {
    const name = prompt(`Digite seu nome para o ranking:`);
    if (name) {
      saveScore(name, timer);
    }
    message.style.display = 'none';
  }, 1000);
}

function saveScore(name, time) {
  const scores = JSON.parse(localStorage.getItem('ranking')) || [];
  scores.push({ name, time });
  scores.sort((a, b) => a.time - b.time);
  const top5 = scores.slice(0, 5);
  localStorage.setItem('ranking', JSON.stringify(top5));
  updateRanking();
}

function updateRanking() {
  const scores = JSON.parse(localStorage.getItem('ranking')) || [];
  rankingList.innerHTML = '';
  scores.forEach(score => {
    const li = document.createElement('li');
    li.textContent = `${score.name} - ${score.time}s`;
    rankingList.appendChild(li);
  });
}

restartBtn.addEventListener('click', resetGame);

changeThemeBtn.addEventListener('click', () => {
  currentTheme = currentTheme === 1 ? 2 : 1;
  images = generateImages(currentTheme);
  resetGame();
  updateThemeTitle();
});

function resetGame() {
  stopTimer();
  timer = 0;
  isTimerRunning = false;
  matched = 0;
  flippedCards = [];
  timerElement.textContent = `Tempo: 0s`;
  createBoard();
}

function updateThemeTitle() {
  themeTitle.textContent = currentTheme === 1 ? "Grupos IURD" : "Tribos FJU";
}

createBoard();
updateRanking();
updateThemeTitle();