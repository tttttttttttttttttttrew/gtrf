 // Поле, на котором всё будет происходить, — тоже как бы переменная
    var canvas = document.getElementById('game');
    // Классическая змейка — двухмерная, сделаем такую же
    var context = canvas.getContext('2d');
    // Размер одной клеточки на поле — 16 пикселей
    var grid = 16;
    // Служебная переменная, которая отвечает за скорость змейки
    var count = 0;
    // А вот и сама змейка
    var snake = {
      // Начальные координаты
      x: 160,
      y: 160,
      // Скорость змейки — в каждом новом кадре змейка смещается по оси Х или У. На старте будет двигаться горизонтально, поэтому скорость по игреку равна нулю.
      dx: grid,
      dy: 0,
      // Тащим за собой хвост, который пока пустой
      cells: [],
      // Стартовая длина змейки — 4 клеточки
      maxCells: 4
    };
    // А это — еда. Представим, что это красные яблоки.
    var apple = {
      // Начальные координаты яблока
      x: 320,
      y: 320
    };
    // Делаем генератор случайных чисел в заданном диапазоне
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }
    // Игровой цикл — основной процесс, внутри которого будет всё происходить
    function loop() {
      // Хитрая функция, которая замедляет скорость игры с 60 кадров в секунду до 15 (60/15 = 4)
      requestAnimationFrame(loop);
      // Игровой код выполнится только один раз из четырёх, в этом и суть замедления кадров, а пока переменная count меньше четырёх, код выполняться не будет
      if (++count < 4) {
        return;
      }
      // Обнуляем переменную скорости
      count = 0;
      // Очищаем игровое поле
      context.clearRect(0, 0, canvas.width, canvas.height);
      // Двигаем змейку с нужной скоростью
      snake.x += snake.dx;
      snake.y += snake.dy;
      // Если змейка достигла края поля по горизонтали — продолжаем её движение с противоположной строны
      if (snake.x < 0) {
        snake.x = canvas.width - grid;
      }
      else if (snake.x >= canvas.width) {
        snake.x = 0;
      }
      // Делаем то же самое для движения по вертикали
      if (snake.y < 0) {
        snake.y = canvas.height - grid;
      }
      else if (snake.y >= canvas.height) {
        snake.y = 0;
      }
      // Продолжаем двигаться в выбранном направлении. Голова всегда впереди, поэтому добавляем её координаты в начало массива, который отвечает за всю змейку
      snake.cells.unshift({ x: snake.x, y: snake.y });
      // Сразу после этого удаляем последний элемент из массива змейки, потому что она движется и постоянно освобождает клетки после себя
      if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
      }
      // Рисуем еду — красное яблоко
      context.fillStyle = 'red';
      context.fillRect(apple.x, apple.y, grid - 1, grid - 1);
      // Одно движение змейки — один новый нарисованный квадратик 
      context.fillStyle = 'green';
      // Обрабатываем каждый элемент змейки
      snake.cells.forEach(function (cell, index) {
        // Чтобы создать эффект клеточек, делаем зелёные квадратики меньше на один пиксель, чтобы вокруг них образовалась чёрная граница
        context.fillRect(cell.x, cell.y, grid - 1, grid - 1);
        // Если змейка добралась до яблока...
        if (cell.x === apple.x && cell.y === apple.y) {
          // увеличиваем длину змейки
          snake.maxCells++;
          // Рисуем новое яблочко
          // Помним, что размер холста у нас 400x400, при этом он разбит на ячейки — 25 в каждую сторону
          apple.x = getRandomInt(0, 25) * grid;
          apple.y = getRandomInt(0, 25) * grid;
        }
        // Проверяем, не столкнулась ли змея сама с собой
        // Для этого перебираем весь массив и смотрим, есть ли у нас в массиве змейки две клетки с одинаковыми координатами 
        for (var i = index + 1; i < snake.cells.length; i++) {
          // Если такие клетки есть — начинаем игру заново
          if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
            // Створюємо змінну із вікном про закінчення гри
            var endGamePopup = document.querySelector('.end-game');
            // Створюємо змінну із довжиною змійки
            var spanGameResult = document.querySelector('.game-result');
            // Створюємо змінну із кнопкою нової гри
            var newGameButton = document.getElementById('new-game-button');
            // Забираємо з вікна про закінчення гри клас .hide, який приховує це вікно
            endGamePopup.classList.remove('hide');
            // Записуємо та виводимо довжину змійки
            var gameResult = snake.cells.length;
            spanGameResult.textContent = gameResult;
            // Задаём стартовые параметры основным переменным
            snake.x = 160;
            snake.y = 160;
            snake.cells = [];
            // Робимо змійку невидимою (забираємо у неї розмір)
            snake.maxCells = 0;
            // end Робимо змійку невидимою
            snake.dx = grid;
            snake.dy = 0;
            // Не створюємо нового яблука
            apple.x = undefined;
            apple.y = undefined;
            // При натисканні на кнопку "Почати нову гру" починати нову гру
            newGameButton.onclick  = function() {
              // Надаємо розмір змійці
              snake.maxCells = 4;
              // Розміщуємо яблуко
              apple.x = getRandomInt(0, 25) * grid;
              apple.y = getRandomInt(0, 25) * grid;
              // Закриваємо вікно про закінчення гри
              endGamePopup.classList.add('hide');
            }
          }
        }
      });
    }

    // Запускаем игру
    requestAnimationFrame(loop);