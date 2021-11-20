document.addEventListener('DOMContentLoaded', function() {

  createCoupleGame(document.querySelector('#container'));

  function createCoupleGame(container) {

    // создание и добавление HTML элементов
    const gameTitle = document.createElement('h1');
    gameTitle.textContent = 'Игра пары';
    gameTitle.classList.add('header');

    const form = document.createElement('form');
    form.classList.add('form');

    const label = document.createElement('label');
    label.textContent = 'Введите размер поля по горизонтали/вертикали четное число от 2 до 10. Время игры 1 минута.';
    label.classList.add('label');

    const input = document.createElement('input');
    input.classList.add('input');
    input.type = 'number'
    input.min = '2';
    input.max = '10';
    input.placeholder = 'Введите число';
    input.required = true;

    const playBtn = document.createElement('button');
    playBtn.textContent = 'Начать игру';
    playBtn.classList.add('btn', 'btn-play');

    const replayBtn = document.createElement('button');
    replayBtn.textContent = 'Сыграть еще';
    replayBtn.classList.add('btn', 'btn-replay', 'btn_hidden');

    // реплей
    replayBtn.addEventListener('click', () => {
      form.classList.remove('form_play');
      document.querySelectorAll('.card').forEach( (el) => {
        el.remove();
      });
      replayBtn.classList.add('btn_hidden');
    });

    const cardList = document.createElement('ul');
    cardList.classList.add('card-list');

    label.append(input);
    form.append(label, playBtn);
    container.append(gameTitle, form, cardList, replayBtn);

    let timeoutID;

    // алгоритм Фишера-Йетса
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      };
    };

    // создание массива значений для карточек и их перетасовка
    function createArrCards (numberOfCards, arrCards) {
      for (let i = 1; i <= (numberOfCards/2); i++) {
        arrCards.push(i);
        arrCards.push(i);
      };
      shuffle(arrCards);
    };

    // создание карточки
    function createCard (fieldSize) {

      if ((fieldSize % 2) === 1) {
        fieldSize = 4;
      }

      let numberOfCards = Math.pow(fieldSize, 2);
      let arrCards =[];

      createArrCards (numberOfCards, arrCards);

      for (let i = 0; i < (numberOfCards); i++) {

        let card = document.createElement('li');
        card.classList.add('card', 'card_closed', `card_${fieldSize}`);
        card.textContent = arrCards[0];
        arrCards.splice(0, 1);

        // проверка значений вскрытых карточек
        card.addEventListener('click', () => {

          if (!card.classList.contains('card_closed')) {
            return;
          };

          let card1 = document.querySelector('.card_open-1');
          let card2 = document.querySelector('.card_open-2');

          if (card.classList.contains('card_open')) {
            return;
          } else if (card2) {
            card1.classList.remove('card_open', 'card_open-1');
            card2.classList.remove('card_open', 'card_open-2');
            card.classList.add('card_open', 'card_open-1');
          } else if (card1) {

            card.classList.add('card_open', 'card_open-2');
            if (card.textContent === card1.textContent) {
              card1.classList.remove('card_open', 'card_closed', 'card_open-1');
              card.classList.remove('card_open', 'card_closed', 'card_open-2');
              numberOfCards = numberOfCards - 2;

              // определение конца игры
              if (numberOfCards === 0) {
                clearTimeout(timeoutID);
                alert('Вы выиграли!');
                replayBtn.classList.remove('btn_hidden')
              };
            };
          } else {
            card.classList.add('card_open', 'card_open-1');
          };

        });

        cardList.append(card);
      };      
    };

    const gameover = () => {
      alert('Вы проиграли!');
      replayBtn.classList.remove('btn_hidden');
      document.querySelectorAll('.card_closed').forEach( (el) => {
        el.classList.remove('card_closed');
      });
      clearTimeout(timeoutID);
    };

    // запуск игры
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      if (!input.value) {
        return;
      };

      createCard(input.value);

      input.value = '';
      form.classList.add('form_play');
      timeoutID = setTimeout(gameover, 60000);
    });
  };
});
