class AimGameElement extends HTMLElement {
  connectedCallback() {
    const gameArea = document.createElement('div');
    gameArea.classList.add('game-area');
    this.appendChild(gameArea);

    const startModal = document.createElement('div');
    startModal.classList.add('start-modal');
    this.appendChild(startModal);

    const stopBtn = document.createElement('button');
    stopBtn.textContent = 'Стоп';
    stopBtn.disabled = true;
    stopBtn.classList.add('stop-btn', 'stop-btn-top');
    gameArea.appendChild(stopBtn);

    const scoreDisplay = document.createElement('div');
    scoreDisplay.textContent = 'Очки: 0';
    scoreDisplay.classList.add('score-corner');
    this.appendChild(scoreDisplay);

    const timerDisplay = document.createElement('div');
    timerDisplay.textContent = 'Время: 30';
    timerDisplay.classList.add('timer-corner');
    this.appendChild(timerDisplay);

    // --- Модальное окно выбора параметров ---
    startModal.innerHTML = '';
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    startModal.appendChild(modalContent);

    const h2 = document.createElement('h2');
    h2.textContent = 'Тренировка';
    modalContent.appendChild(h2);

    const labelTime = document.createElement('label');
    labelTime.textContent = 'Время (сек):';
    labelTime.setAttribute('for', 'game-time');
    modalContent.appendChild(labelTime);
    
    const timeValueSpan = document.createElement('span');
    timeValueSpan.classList.add('range-value');
    timeValueSpan.textContent = '30';
    modalContent.appendChild(timeValueSpan);
    
    const inputTime = document.createElement('input');
    inputTime.type = 'range';
    inputTime.min = 5;
    inputTime.max = 300;
    inputTime.value = 30;
    inputTime.step = 5;
    inputTime.id = 'game-time';
    inputTime.addEventListener('input', () => {
      timeValueSpan.textContent = inputTime.value;
    });
    modalContent.appendChild(inputTime);

    const labelCircleSize = document.createElement('label');
    labelCircleSize.textContent = 'Размер кружка (px):';
    labelCircleSize.setAttribute('for', 'circle-size');
    modalContent.appendChild(labelCircleSize);
    
    const circleSizeValueSpan = document.createElement('span');
    circleSizeValueSpan.classList.add('range-value');
    circleSizeValueSpan.textContent = '30';
    modalContent.appendChild(circleSizeValueSpan);
    
    const inputCircleSize = document.createElement('input');
    inputCircleSize.type = 'range';
    inputCircleSize.min = 10;
    inputCircleSize.max = 100;
    inputCircleSize.value = 30;
    inputCircleSize.step = 5;
    inputCircleSize.id = 'circle-size';
    inputCircleSize.addEventListener('input', () => {
      circleSizeValueSpan.textContent = inputCircleSize.value;
    });
    modalContent.appendChild(inputCircleSize);

    const labelSpeed = document.createElement('label');
    labelSpeed.textContent = 'Скорость появления (мс):';
    labelSpeed.setAttribute('for', 'circle-speed');
    modalContent.appendChild(labelSpeed);
    
    const speedValueSpan = document.createElement('span');
    speedValueSpan.classList.add('range-value');
    speedValueSpan.textContent = '500';
    modalContent.appendChild(speedValueSpan);
    
    const inputSpeed = document.createElement('input');
    inputSpeed.type = 'range';
    inputSpeed.min = 200;
    inputSpeed.max = 1000;
    inputSpeed.value = 500;
    inputSpeed.step = 10;
    inputSpeed.id = 'circle-speed';
    inputSpeed.addEventListener('input', () => {
      speedValueSpan.textContent = inputSpeed.value;
    });
    modalContent.appendChild(inputSpeed);

    const startBtn = document.createElement('button');
    startBtn.textContent = 'Начать игру';
    modalContent.appendChild(startBtn);
    startModal.style.display = 'block';

    // --- END Модальное окно выбора параметров ---

    // При открытии модального окна параметры берутся из data-атрибутов, если есть
    if (this.dataset.circleSize) inputCircleSize.value = this.dataset.circleSize;
    if (this.dataset.circleSpeed) inputSpeed.value = this.dataset.circleSpeed;
    if (this.dataset.time) inputTime.value = this.dataset.time;

    let score = 0;
    let gameTime = parseInt(inputTime.value, 10);
    let gameInterval;
    let circleInterval;
    let circleSpeed = parseInt(inputSpeed.value, 10);
    let circleSize = parseInt(inputCircleSize.value, 10);
    let lastScore = 0;
    let isEnd = false;
    let restartBtn = null;
    let resultMsg = null;

    function showStartModal(withResult = false) {
      startModal.classList.add('active');
      startModal.style.display = '';
      stopBtn.style.display = 'none';
      if (withResult) {
        if (!resultMsg) {
          resultMsg = document.createElement('div');
          resultMsg.className = 'result-msg';
          modalContent.insertBefore(resultMsg, h2.nextSibling);
        }
        resultMsg.textContent = `Ваш результат: ${lastScore} очков`;
        startBtn.style.display = 'none';
        if (!restartBtn) {
          restartBtn = document.createElement('button');
          restartBtn.textContent = 'Сыграть ещё раз';
          restartBtn.className = 'restart-btn';
          modalContent.appendChild(restartBtn);
        }
        restartBtn.style.display = '';
      } else {
        if (resultMsg) resultMsg.textContent = '';
        startBtn.style.display = '';
        if (restartBtn) restartBtn.style.display = 'none';
      }
    }
    function hideStartModal() {
      startModal.classList.remove('active');
      startModal.style.display = 'none';
    }
    showStartModal();

    startBtn.addEventListener('click', () => {
      hideStartModal();
      gameTime = parseInt(inputTime.value, 10);
      circleSpeed = parseInt(inputSpeed.value, 10);
      circleSize = parseInt(inputCircleSize.value, 10);
      startGame();
    });

    function restartGame() {
      hideStartModal();
      score = 0;
      gameTime = parseInt(inputTime.value, 10);
      circleSpeed = parseInt(inputSpeed.value, 10);
      circleSize = parseInt(inputCircleSize.value, 10);
      startGame();
    }

    // Кнопка 'Сыграть ещё раз'
    if (!restartBtn) {
      restartBtn = document.createElement('button');
      restartBtn.textContent = 'Сыграть ещё раз';
      restartBtn.className = 'restart-btn';
      restartBtn.style.display = 'none';
      modalContent.appendChild(restartBtn);
    }
    restartBtn.addEventListener('click', restartGame);

    stopBtn.addEventListener('click', () => {
      endGame();
    });

    function startGame() {
      score = 0;
      scoreDisplay.textContent = 'Очки: 0';
      timerDisplay.textContent = `Время: ${gameTime}`;
      gameArea.innerHTML = '';
      gameArea.appendChild(stopBtn);
      gameArea.appendChild(scoreDisplay);
      gameArea.appendChild(timerDisplay);
      clearInterval(gameInterval);
      clearInterval(circleInterval);
      stopBtn.disabled = false;
      stopBtn.style.display = '';
      circleInterval = setInterval(() => createCircle(circleSize), circleSpeed);
      gameInterval = setInterval(() => {
        gameTime--;
        timerDisplay.textContent = `Время: ${gameTime}`;
        if (gameTime <= 0) {
          endGame();
        }
      }, 1000);
    }

    function createCircle(size) {
      const circle = document.createElement('div');
      circle.classList.add('circle');

      const gameAreaRect = gameArea.getBoundingClientRect();
      const gameAreaWidth = gameAreaRect.width;
      const gameAreaHeight = gameAreaRect.height;

      const areaWidth = gameAreaWidth * 0.8;
      const areaHeight = gameAreaHeight * 0.8;

      const offsetX = (gameAreaWidth - areaWidth) / 2;
      const offsetY = (gameAreaHeight - areaHeight) / 2;

      const x = Math.random() * areaWidth + offsetX;
      const y = Math.random() * areaHeight + offsetY;

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
      stopBtn.disabled = true;
      stopBtn.style.display = 'none';
      lastScore = score;
      showStartModal(true);
    }
  }
}

customElements.define('aim-game', AimGameElement);