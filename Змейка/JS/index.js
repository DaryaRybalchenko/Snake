const canvas = document.querySelector('.ground');
const ctx = canvas.getContext("2d");
const currentScore = document.querySelector('.info__current-score');
const bestScore = document.querySelector('.info__best-score');
const playButton = document.querySelector('.play__button');
const mainMenu = document.querySelector('.play__menu');
const loseMenu = document.querySelector('.lose');
const playAgainButton = document.querySelector('.lose__button');
const finallyScore = document.querySelector('.lose__title');

const grid = 20;
const FPS = 10; 
let colorChitin = 1;
let playerCurrentScore = 0;
let playerBestScore = 0;
let interval;

const player = {
    dx: 0, // направление движения по оси OX
    dy: grid, // направление движения по оси OY
    currentX: (canvas.clientWidth) / 2, // Координата X
    currentY: (canvas.clientHeight) / 2, // Координата Y

    tail: [], // Хвост змейки
    tailLength: 3 // Длина хвоста змейки
};
const fruit = {
    fruitX: (canvas.clientWidth) / 2,
    fruitY: (canvas.clientHeight) / 2 - 100
};

const DrawBegin = () => {
    // очистка поля canvas
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    // обновляем надпись с текущим счётом
    currentScore.textContent = `Текущий счёт: ${playerCurrentScore}`;
    // возвращаем змейку в исходное состояние
    player.dx = 0;
    player.dy = -grid;
    player.currentX = (canvas.clientWidth) / 2;
    player.currentY = (canvas.clientHeight) / 2;

    player.tail = [];
    player.tailLength = 2;
};
const Draw = () => {
    // очищаем предыдущий кадр
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    // рисуем новый кадр
    move();
};

// функция для перемещения змейки
const move = () => {
    // меняем координаты в зависимости от направления движения
    player.currentX += player.dx;
    player.currentY += player.dy;

    // добавляем новую ячейку в начало хвоста
    player.tail.unshift({
        x: player.currentX,
        y: player.currentY
    });

    // если длина хвоста превышает заданную, удаляем последнюю ячейку
    if (player.tail.length > player.tailLength) {
        player.tail.pop();
    }
    
    // отрисовываем каждую ячейку хвоста
    player.tail.forEach((cell, i) => {
        if ((i % 2) == 0) {
            ctx.fillStyle = `rgb(110, 246, 221)`;
        }
        if ((i % 2) != 0) {
          ctx.fillStyle = `rgb(203, 133, 239)`;
        }
        colorChitin += 1;
        //ctx.fillStyle = `rgb(${10 + i * 6}, ${150 + i * 30}, ${10 + i * 4})`;
        ctx.fillRect(cell.x, cell.y, grid - 1, grid - 1);
        eatFruit(cell.x, cell.y);
        crash(cell.x, cell.y, i);
    });
};

// функция для проверки столкновений
const crash = (x, y, index) => {
    // проверяем, не столкнулась ли змейка с самой собой
    for (let i = index + 1; i < player.tailLength; i++) {
        if (player.tail[i].x === x && player.tail[i].y === y) {
            // если да, показываем экран проигрыша
            loseMenu.classList.add('inlose');
            // убираем класс режима игры
            playButton.classList.remove('inplay');
            // обновляем финальный счет
            finallyScore.textContent = `Ваш счёт: ${playerCurrentScore}`;
            // обновляем рекорд, если необходимо
            if (playerCurrentScore > playerBestScore) {
                playerBestScore = playerCurrentScore;
            }
            bestScore.textContent = `Ваш рекорд: ${playerBestScore}`;
            playerCurrentScore = 0;
            Start();
        }
    }
};

const eatFruit = (x, y) => {
    if (x === fruit.fruitX && y === fruit.fruitY) {
        // Увеличиваем длину хвоста змейки
        player.tailLength++;
        // Увеличиваем текущий счёт
        playerCurrentScore += 10;
        currentScore.textContent = `Текущий счёт: ${playerCurrentScore}`;

        // Перемещаем фрукт на новое случайное место
        fruit.fruitX = getRandomInt(0, canvas.clientWidth / grid) * grid;
        fruit.fruitY = getRandomInt(0, canvas.clientHeight / grid) * grid;
    }

    // Отрисовываем фрукт
    drawFruit();
};

// Вспомогательная функция для получения случайного целого числа в заданном диапазоне
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
};

// Функция для отрисовки фрукта
const drawFruit = () => {
    ctx.fillStyle = ' red';
    ctx.fillRect(fruit.fruitX, fruit.fruitY, grid, grid);
};

// Функция для старта игры
const Start = () => {
    if (playButton.classList.contains('inplay') && !loseMenu.classList.contains('inlose')) {
        DrawBegin();
        interval = setInterval(Update, 1000 / FPS);
    } else {
        DrawBegin();
        clearInterval(interval);
    }
};

// Функция для обновления состояния игры
function Update() {
    Draw();
    teleport();
};

const teleport = () => {
    if (player.currentX < 0 && player.dx === -grid) {
        player.currentX = canvas.clientWidth;
    } else if (player.currentX > canvas.clientWidth - grid && player.dx === grid) {
        player.currentX = -grid;
    }

    if (player.currentY < 0 && player.dy === -grid) {
        player.currentY = canvas.clientHeight;
    } else if (player.currentY > canvas.clientHeight - grid && player.dy === grid) {
        player.currentY = -grid;
    }

    if (player.currentX === -grid && player.dx === 0) {
        player.currentX = 0;
    }

    if (player.currentX === canvas.clientWidth && player.dx === 0) {
        player.currentX = canvas.clientWidth - grid;
    }

    if (player.currentY === -grid && player.dy === 0) {
        player.currentY = 0;
    }

    if (player.currentY === canvas.clientHeight && player.dy === 0) {
        player.currentY = 0;
    }
};

const changeDirection = key => {
    // Проверяем текущее направление
    if ((key === 'KeyW' && player.dy === grid) || 
        (key === 'KeyS' && player.dy === -grid) || 
        (key === 'KeyA' && player.dx === grid) || 
        (key === 'KeyD' && player.dx === -grid)) 
        return;
    switch (key) {
        case 'KeyW':
            player.dx = 0;
            player.dy = -grid;
            break;
        case 'KeyS':
            player.dx = 0;
            player.dy = grid;
            break;
        case 'KeyA':
            player.dx = -grid;
            player.dy = 0;
            break;
        case 'KeyD':
            player.dx = grid;
            player.dy = 0;
            break;
    } 
};

// функция срабатывает при нажатии клавиши на клавиатуре 
document.addEventListener('keydown', e => {
    changeDirection(e.code);
});

// функция срабатывает при загрузке документа
document.addEventListener('load', () => {
    playerCurrentScore = 0;
    playerBestScore = 0;

    playButton.classList.remove('inplay');
    mainMenu.classList.add('inplay');
    loseMenu.classList.remove('inlose');

    Start();
});

// функция срабатывает при нажатии клавиши на клавиатуре 
document.addEventListener('keydown', e => {
    changeDirection(e.code);
});

// функция срабатывает при загрузке документа
document.addEventListener('load', () => {
    playerCurrentScore = 0;
    playerBestScore = 0;

    playButton.classList.remove('inplay');
    mainMenu.classList.add('inplay');
    loseMenu.classList.remove('inlose');

    Start();
});

// функция срабатывает при нажатии мышкой по кнопке играть
playButton.addEventListener('click', () => {
    playButton.classList.add('inplay');
    mainMenu.classList.add('inplay');

    Start();
});

// функция срабатывает при нажатии мышкой по кнопке играть снова
playAgainButton.addEventListener('click', () => {
    playButton.classList.add('inplay');
    loseMenu.classList.remove('inlose');

    Start();
});