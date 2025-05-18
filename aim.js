class AimGameElement extends HTMLElement {
  constructor() {
    super();
    this.score = 0;
    this.gameTime = 30;
    this.circleSpeed = 500;
    this.circleSize = 30;
    this.lastScore = 0;
    this.isEnd = false;
    this.gameInterval = null;
    this.circleInterval = null;
    
    // Создаем элементы
    this.gameArea = document.createElement('div');
    this.gameArea.classList.add('game-area');
    
    this.startModal = document.createElement('div');
    this.startModal.classList.add('start-modal');
    
    this.stopBtn = document.createElement('button');
    this.stopBtn.textContent = 'Стоп';
    this.stopBtn.disabled = true;
    this.stopBtn.classList.add('stop-btn', 'stop-btn-top');
    
    this.scoreDisplay = document.createElement('div');
    this.scoreDisplay.textContent = 'Очки: 0';
    this.scoreDisplay.classList.add('score-corner');
    
    this.timerDisplay = document.createElement('div');
    this.timerDisplay.textContent = 'Время: 30';
    this.timerDisplay.classList.add('timer-corner');
    
    // Инициализируем модальное окно
    this.initModal();
    
    // Добавляем стили
    this.addStyles();
  }

  connectedCallback() {
    this.appendChild(this.gameArea);
    this.appendChild(this.startModal);
    this.gameArea.appendChild(this.stopBtn);
    this.appendChild(this.scoreDisplay);
    this.appendChild(this.timerDisplay);
    
    this.showStartModal();
    this.setupEventListeners();
  }

  initModal() {
    this.startModal.innerHTML = '';
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    this.startModal.appendChild(modalContent);

    this.h2 = document.createElement('h2');
    this.h2.textContent = 'Тренировка';
    modalContent.appendChild(this.h2);

    // Время игры
    this.labelTime = document.createElement('label');
    this.labelTime.textContent = 'Время (сек):';
    this.labelTime.setAttribute('for', 'game-time');
    modalContent.appendChild(this.labelTime);
    
    this.timeValueSpan = document.createElement('span');
    this.timeValueSpan.classList.add('range-value');
    this.timeValueSpan.textContent = '30';
    modalContent.appendChild(this.timeValueSpan);
    
    this.inputTime = document.createElement('input');
    this.inputTime.type = 'range';
    this.inputTime.min = 5;
    this.inputTime.max = 300;
    this.inputTime.value = 30;
    this.inputTime.step = 5;
    this.inputTime.id = 'game-time';
    modalContent.appendChild(this.inputTime);

    // Размер кружка
    this.labelCircleSize = document.createElement('label');
    this.labelCircleSize.textContent = 'Размер кружка (px):';
    this.labelCircleSize.setAttribute('for', 'circle-size');
    modalContent.appendChild(this.labelCircleSize);
    
    this.circleSizeValueSpan = document.createElement('span');
    this.circleSizeValueSpan.classList.add('range-value');
    this.circleSizeValueSpan.textContent = '30';
    modalContent.appendChild(this.circleSizeValueSpan);
    
    this.inputCircleSize = document.createElement('input');
    this.inputCircleSize.type = 'range';
    this.inputCircleSize.min = 10;
    this.inputCircleSize.max = 100;
    this.inputCircleSize.value = 30;
    this.inputCircleSize.step = 5;
    this.inputCircleSize.id = 'circle-size';
    modalContent.appendChild(this.inputCircleSize);

    // Скорость появления
    this.labelSpeed = document.createElement('label');
    this.labelSpeed.textContent = 'Скорость появления (мс):';
    this.labelSpeed.setAttribute('for', 'circle-speed');
    modalContent.appendChild(this.labelSpeed);
    
    this.speedValueSpan = document.createElement('span');
    this.speedValueSpan.classList.add('range-value');
    this.speedValueSpan.textContent = '500';
    modalContent.appendChild(this.speedValueSpan);
    
    this.inputSpeed = document.createElement('input');
    this.inputSpeed.type = 'range';
    this.inputSpeed.min = 200;
    this.inputSpeed.max = 1000;
    this.inputSpeed.value = 500;
    this.inputSpeed.step = 10;
    this.inputSpeed.id = 'circle-speed';
    modalContent.appendChild(this.inputSpeed);

    // Кнопки
    this.startBtn = document.createElement('button');
    this.startBtn.textContent = 'Начать игру';
    modalContent.appendChild(this.startBtn);
    
    this.restartBtn = document.createElement('button');
    this.restartBtn.textContent = 'Сыграть ещё раз';
    this.restartBtn.className = 'restart-btn';
    this.restartBtn.style.display = 'none';
    modalContent.appendChild(this.restartBtn);
    
    this.resultMsg = document.createElement('div');
    this.resultMsg.className = 'result-msg';
    modalContent.insertBefore(this.resultMsg, this.h2.nextSibling);
    
    this.startModal.style.display = 'block';
  }

  addStyles() {
    const link = document.createElement('link');
    if (!document.querySelector('link[href="aim.css"]')) {
      link.rel = "stylesheet";
      link.href = "aim.css";
      document.head.appendChild(link);
    }
  }

  setupEventListeners() {
    // Обработчики для ползунков
    this.inputTime.addEventListener('input', () => {
      this.timeValueSpan.textContent = this.inputTime.value;
    });
    
    this.inputCircleSize.addEventListener('input', () => {
      this.circleSizeValueSpan.textContent = this.inputCircleSize.value;
    });
    
    this.inputSpeed.addEventListener('input', () => {
      this.speedValueSpan.textContent = this.inputSpeed.value;
    });

    // Кнопки
    this.startBtn.addEventListener('click', () => {
      this.hideStartModal();
      this.gameTime = parseInt(this.inputTime.value, 10);
      this.circleSpeed = parseInt(this.inputSpeed.value, 10);
      this.circleSize = parseInt(this.inputCircleSize.value, 10);
      this.startGame();
    });

    this.restartBtn.addEventListener('click', () => this.restartGame());
    this.stopBtn.addEventListener('click', () => this.endGame());
  }

  showStartModal(withResult = false) {
    this.startModal.classList.add('active');
    this.startModal.style.display = '';
    this.stopBtn.style.display = 'none';
    
    if (withResult) {
      this.resultMsg.textContent = `Ваш результат: ${this.lastScore} очков`;
      this.startBtn.style.display = 'none';
      this.restartBtn.style.display = '';
    } else {
      this.resultMsg.textContent = '';
      this.startBtn.style.display = '';
      this.restartBtn.style.display = 'none';
    }
  }

  hideStartModal() {
    this.startModal.classList.remove('active');
    this.startModal.style.display = 'none';
  }

  restartGame() {
    this.hideStartModal();
    this.score = 0;
    this.gameTime = parseInt(this.inputTime.value, 10);
    this.circleSpeed = parseInt(this.inputSpeed.value, 10);
    this.circleSize = parseInt(this.inputCircleSize.value, 10);
    this.startGame();
  }

  startGame() {
    this.score = 0;
    this.scoreDisplay.textContent = 'Очки: 0';
    this.timerDisplay.textContent = `Время: ${this.gameTime}`;
    this.gameArea.innerHTML = '';
    this.gameArea.appendChild(this.stopBtn);
    this.gameArea.appendChild(this.scoreDisplay);
    this.gameArea.appendChild(this.timerDisplay);
    
    clearInterval(this.gameInterval);
    clearInterval(this.circleInterval);
    
    this.stopBtn.disabled = false;
    this.stopBtn.style.display = '';
    
    this.circleInterval = setInterval(() => this.createCircle(), this.circleSpeed);
    
    this.gameInterval = setInterval(() => {
      this.gameTime--;
      this.timerDisplay.textContent = `Время: ${this.gameTime}`;
      if (this.gameTime <= 0) {
        this.endGame();
      }
    }, 1000);
  }

  createCircle() {
    const circle = document.createElement('div');
    circle.classList.add('circle');

    const gameAreaRect = this.gameArea.getBoundingClientRect();
    const gameAreaWidth = gameAreaRect.width;
    const gameAreaHeight = gameAreaRect.height;

    const areaWidth = gameAreaWidth * 0.8;
    const areaHeight = gameAreaHeight * 0.8;

    const offsetX = (gameAreaWidth - areaWidth) / 2;
    const offsetY = (gameAreaHeight - areaHeight) / 2;

    const x = Math.random() * areaWidth + offsetX;
    const y = Math.random() * areaHeight + offsetY;

    circle.style.width = `${this.circleSize}px`;
    circle.style.height = `${this.circleSize}px`;
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    circle.style.backgroundColor = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;

    circle.addEventListener('click', () => {
      this.score++;
      this.scoreDisplay.textContent = `Очки: ${this.score}`;
      circle.remove();
    });

    this.gameArea.appendChild(circle);
  }

  endGame() {
    clearInterval(this.gameInterval);
    clearInterval(this.circleInterval);
    this.gameArea.innerHTML = '';
    this.stopBtn.disabled = true;
    this.stopBtn.style.display = 'none';
    this.lastScore = this.score;
    this.showStartModal(true);
  }
}

customElements.define('aim-game', AimGameElement);