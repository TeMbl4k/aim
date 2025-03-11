const gameArea = document.getElementById('game-area');
const startModal = document.getElementById('start-modal');
const endModal = document.getElementById('end-modal');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const stopBtn = document.getElementById('stop-btn');
const difficultySelect = document.getElementById('difficulty');
const difficultyEndSelect = document.getElementById('difficulty-end');
const areaSizeInput = document.getElementById('area-size');
const areaSizeEndInput = document.getElementById('area-size-end');
const circleSizeInput = document.getElementById('circle-size');
const circleSizeEndInput = document.getElementById('circle-size-end');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const finalScoreDisplay = document.getElementById('final-score');

let score = 0;
let gameTime = 30;
let gameInterval;
let circleInterval;

// Показываем стартовое окно при загрузке страницы
window.onload = () => {
    startModal.style.display = 'block';
};

// Начало игры
startBtn.addEventListener('click', () => {
    startModal.style.display = 'none';
    startGame();
});

// Перезапуск игры
restartBtn.addEventListener('click', () => {
    endModal.style.display = 'none';

    // Обновляем значения сложности, площади и размера кружков из окна завершения
    difficultySelect.value = difficultyEndSelect.value;
    areaSizeInput.value = areaSizeEndInput.value;
    circleSizeInput.value = circleSizeEndInput.value;

    startGame();
});

// Остановка игры
stopBtn.addEventListener('click', () => {
    endGame();
});

function startGame() {
    score = 0;
    gameTime = 30;
    scoreDisplay.textContent = 'Очки: 0';
    timerDisplay.textContent = 'Время: 30';
    gameArea.innerHTML = '';
    clearInterval(gameInterval);
    clearInterval(circleInterval);

    const circleSpeed = parseInt(difficultySelect.value);
    const areaSize = parseInt(areaSizeInput.value) / 100;
    const circleSize = parseInt(circleSizeInput.value);

    circleInterval = setInterval(() => createCircle(areaSize, circleSize), circleSpeed);

    gameInterval = setInterval(() => {
        gameTime--;
        timerDisplay.textContent = `Время: ${gameTime}`;
        if (gameTime <= 0) {
            endGame();
        }
    }, 1000);

    stopBtn.disabled = false; // Активируем кнопку "Стоп"
}

function createCircle(areaSize, circleSize) {
    const circle = document.createElement('div');
    circle.classList.add('circle');
    const size = circleSize;

    // Получаем размеры игрового поля
    const gameAreaRect = gameArea.getBoundingClientRect();
    const maxX = gameAreaRect.width * areaSize - size;
    const maxY = gameAreaRect.height * areaSize - size;

    // Позиционируем кружки внутри игрового поля
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    circle.style.backgroundColor = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;

    circle.addEventListener('click', () => {
        score++;
        scoreDisplay.textContent = `Очки: ${score}`;
        circle.remove();
    });

    gameArea.appendChild(circle);
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(circleInterval);
    gameArea.innerHTML = '';
    stopBtn.disabled = true; // Деактивируем кнопку "Стоп"

    // Обновляем значения в окне завершения игры
    finalScoreDisplay.textContent = `Ваш счет: ${score}`;
    difficultyEndSelect.value = difficultySelect.value;
    areaSizeEndInput.value = areaSizeInput.value;
    circleSizeEndInput.value = circleSizeInput.value;
    endModal.style.display = 'block';
}