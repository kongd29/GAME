const board = document.getElementById('game-board');
const restartBtn = document.getElementById('restart-btn');
const shareBtn = document.getElementById('share-btn');
const shareLink = document.getElementById('share-link');
const leaderboard = document.getElementById('leaderboard');
const viralDesc = document.getElementById('viral-desc');

const levelSizes = [2, 3, 4, 5, 6, 8]; // 4, 9, 16, 25, 36, 64
let level = 0;
let timer = null;
let timeLeft = 5;
let answerIndex = -1;
let canSelect = true;
let score = 0;

function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return {r, g, b};
}
function colorToStr({r, g, b}) {
    return `rgb(${r}, ${g}, ${b})`;
}
function getSimilarColor(base, diff=30) {
    let r = base.r, g = base.g, b = base.b;
    const channel = Math.floor(Math.random() * 3);
    if (channel === 0) r = Math.max(0, Math.min(255, r + diff * (Math.random() < 0.5 ? 1 : -1)));
    if (channel === 1) g = Math.max(0, Math.min(255, g + diff * (Math.random() < 0.5 ? 1 : -1)));
    if (channel === 2) b = Math.max(0, Math.min(255, b + diff * (Math.random() < 0.5 ? 1 : -1)));
    return {r, g, b};
}

function setupGame() {
    level = 0;
    score = 0;
    restartBtn.style.display = 'none';
    setupLevel();
}

function setupLevel() {
    board.innerHTML = '';
    canSelect = true;
    timeLeft = 5;
    updateTimer();
    if (viralDesc) viralDesc.textContent = `Level ${level+1} / ${levelSizes.length}`;
    const size = levelSizes[level];
    board.style.gridTemplateColumns = `repeat(${size}, 60px)`;
    const total = size * size;
    // baseColor 1개, similarColor 1개(정답), 나머지 baseColor
    const baseColor = getRandomColor();
    const similarColor = getSimilarColor(baseColor, Math.max(30 - level*3, 10));
    answerIndex = Math.floor(Math.random() * total);
    for (let i = 0; i < total; i++) {
        const tile = document.createElement('div');
        tile.className = 'color-tile';
        tile.style.background = (i === answerIndex) ? colorToStr(similarColor) : colorToStr(baseColor);
        tile.addEventListener('click', () => selectTile(i));
        board.appendChild(tile);
    }
    startTimer();
}

function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
            clearInterval(timer);
            gameOver('시간 초과! Game Over');
        }
    }, 1000);
}
function updateTimer() {
    let timerEl = document.getElementById('timer');
    if (!timerEl) {
        timerEl = document.createElement('div');
        timerEl.id = 'timer';
        board.parentNode.insertBefore(timerEl, board);
    }
    timerEl.textContent = `남은 시간: ${timeLeft}초`;
}

function selectTile(idx) {
    if (!canSelect) return;
    canSelect = false;
    clearInterval(timer);
    if (idx === answerIndex) {
        score++;
        if (level < levelSizes.length - 1) {
            level++;
            setTimeout(setupLevel, 600);
        } else {
            setTimeout(() => {
                alert('축하합니다! 모든 레벨을 깼어요!');
                restartBtn.style.display = 'block';
            }, 400);
        }
    } else {
        gameOver('틀렸어요! Game Over');
    }
}

function gameOver(msg) {
    canSelect = false;
    alert(msg);
    restartBtn.style.display = 'block';
}

restartBtn.addEventListener('click', setupGame);

// 최초 시작
setupGame();
