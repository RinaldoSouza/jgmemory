const board = document.getElementById('board');
const timerElement = document.getElementById('timer');
const restartBtn = document.getElementById('restart-btn');
const changeThemeBtn = document.getElementById('change-theme-btn');
const rankingList = document.getElementById('ranking-list');
const themeTitle = document.getElementById('theme-title');

let currentTheme = 1; // começa na pasta "image1"
let images = generateImages(currentTheme);
let cards = [...images, ...images];

let flippedCards = [];
let lockBoard = false;
let matched = 0;
let timer = 0;
let timerInterval;
let isTimerRunning = false; // O cronômetro começa "não rodando"

// Função para gerar as imagens baseado no tema
function generateImages(theme) {
  return Array.from({ length: 8 }, (_, i) => `image${theme}/${i + 1}.png`);
}

// Função para embaralhar
function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

// Função para criar o tabuleiro
function createBoard() {
  shuffle(cards);
  cards.forEach(src => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.image = src;

    const img = document.createElement('img');
    img.src = src;
    card.appendChild(img);

    card.addEventListener('click', flipCard);
    board.appendChild(card);
  });
}

// Função de virar carta
function flipCard() {
  if (lockBoard) return;
  if (this.classList.contains('flipped')) return;

  // Começa o cronômetro no primeiro clique
  if (!isTimerRunning) {
    isTimerRunning = true;
    startTimer(); // Inicia o cronômetro
  }

  this.classList.add('flipped');
  flippedCards.push(this);

  if (flippedCards.length === 2) {
    checkMatch();
  }
}

// Verifica se as cartas combinam
function checkMatch() {
  const [card1, card2] = flippedCards;
  if (card1.dataset.image === card2.dataset.image) {
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
    }, 400);
  }
}

// Funções de Timer
function startTimer() {
  timerInterval = setInterval(() => {
    timer++;
    timerElement.textContent = `Tempo: ${timer}s`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

// Quando o jogo termina
function endGame() {
  stopTimer();
  setTimeout(() => {
    const name = prompt(`Parabéns! Seu tempo foi ${timer}s.\nDigite seu nome:`);
    if (name) {
      saveScore(name, timer);
    }
  }, 500);
}

// Salvar pontuação no localStorage (limitado a 5)
function saveScore(name, time) {
  const scores = JSON.parse(localStorage.getItem('ranking')) || [];
  scores.push({ name, time });
  scores.sort((a, b) => a.time - b.time);
  const top5 = scores.slice(0, 5);
  localStorage.setItem('ranking', JSON.stringify(top5));
  updateRanking();
}

// Atualizar ranking
function updateRanking() {
  const scores = JSON.parse(localStorage.getItem('ranking')) || [];
  rankingList.innerHTML = '';
  scores.forEach(score => {
    const li = document.createElement('li');
    li.textContent = `${score.name} - ${score.time}s`;
    rankingList.appendChild(li);
  });
}

// Botão de reiniciar
restartBtn.addEventListener('click', () => {
  resetGame();
});

// Botão de trocar tema
changeThemeBtn.addEventListener('click', () => {
  currentTheme = currentTheme === 1 ? 2 : 1;
  images = generateImages(currentTheme);
  resetGame();
  updateThemeTitle(); // Atualiza a frase do tema
});

// Função para resetar o jogo
function resetGame() {
  board.innerHTML = '';
  flippedCards = [];
  lockBoard = false;
  matched = 0;
  timer = 0;
  timerElement.textContent = `Tempo: 0s`;
  stopTimer();
  cards = [...images, ...images];
  createBoard();
  isTimerRunning = false; // Reseta o controle do timer
}

// Atualizar título do tema
function updateThemeTitle() {
  if (currentTheme === 1) {
    themeTitle.textContent = "Grupos IURD";
  } else {
    themeTitle.textContent = "Tribos FJU";
  }
}

// Inicializa o jogo
createBoard();
updateRanking();
updateThemeTitle();