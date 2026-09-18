/* =========================================================
   GOOGLE APPS SCRIPT
   ========================================================= */

const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzvxIYU63ttbgPl5JinEPN8btZB4he2D6rtVoAS6IqZmTfuSPco5opBoqGXL04PW2mY/exec';


/* =========================================================
   ОСНОВНЫЕ ПЕРЕМЕННЫЕ
   ========================================================= */

const screens =
  [...document.querySelectorAll('.screen')];

const choices =
  [...document.querySelectorAll('.choice')];

let selected = '';

let ambientTimer = null;

const $ = id =>
  document.getElementById(id);


/* =========================================================
   ПЕРЕКЛЮЧЕНИЕ ЭКРАНОВ
   ========================================================= */

function show(id){

  screens.forEach(screen => {

    screen.classList.toggle(
      'active',
      screen.id === id
    );

  });

  /*
    Не используем smooth scroll здесь.
    На некоторых браузерах он может давать
    ощущение дёргания при смене экранов.
  */

  window.scrollTo({
    top:0,
    behavior:'auto'
  });

  requestAnimationFrame(() => {

    sparkleBurst(5);

  });

}


/* =========================================================
   КНОПКА "ОТКРЫТЬ"
   ========================================================= */

document
  .querySelectorAll('[data-next]')
  .forEach(button => {

    button.onclick = () => {

      show(
        button.dataset.next
      );

    };

  });


/* =========================================================
   ДАТА + ВРЕМЯ
   ========================================================= */

$('toChoice').onclick = () => {

  const date =
    $('dateInput').value;

  const time =
    $('timeInput').value;


  if(!date || !time){

    $('dateValidation').textContent =
      'Выбери, пожалуйста, и дату, и время ❤️';

    sparkleBurst(4);

    return;

  }


  $('dateValidation').textContent = '';

  show('choice');

};


/* =========================================================
   ВЫБОР ВЕЧЕРА
   ========================================================= */

choices.forEach(button => {

  button.onclick = () => {

    choices.forEach(item => {

      item.classList.remove(
        'selected'
      );

    });


    button.classList.add(
      'selected'
    );


    selected =
      button.dataset.choice;


    $('toMessage')
      .classList
      .remove('hidden');


    /*
      Небольшой всплеск,
      а не десятки объектов.
    */

    burstHearts(5);

    sparkleBurst(6);

  };

});


/* =========================================================
   КНОПКА ДАЛЬШЕ
   ========================================================= */

$('toMessage').onclick = () => {

  show('message');

};


/* =========================================================
   СЧЁТЧИК СИМВОЛОВ
   ========================================================= */

$('wish').oninput = () => {

  $('count').textContent =
    $('wish').value.length;

};


/* =========================================================
   КНОПКА НАЗАД
   ========================================================= */

document
  .querySelectorAll('[data-back]')
  .forEach(button => {

    button.onclick = () => {

      show(
        button.dataset.back
      );

    };

  });


/* =========================================================
   ОТПРАВКА
   ========================================================= */

$('send').onclick = async () => {

  if(!selected){

    showError(
      'Сначала выбери вариант вечера ❤️'
    );

    show('choice');

    return;

  }


  const date =
    $('dateInput').value;

  const time =
    $('timeInput').value;


  if(!date || !time){

    showError(
      'Сначала выбери дату и время ❤️'
    );

    show('date');

    return;

  }


  const sendButton =
    $('send');


  sendButton.disabled =
    true;


  sendButton.textContent =
    'Отправляю твой ответ… ♥';


  const payload = {

    date:
      date,

    time:
      time,

    choice:
      selected,

    wish:
      $('wish')
        .value
        .trim()

  };


  try{

    if(!GOOGLE_SCRIPT_URL){

      throw new Error(
        'Google Script URL отсутствует'
      );

    }


    await fetch(
      GOOGLE_SCRIPT_URL,
      {
        method:'POST',

        mode:'no-cors',

        headers:{
          'Content-Type':
            'text/plain;charset=utf-8'
        },

        body:
          JSON.stringify(payload)
      }
    );


    const [
      year,
      month,
      day
    ] =
      date.split('-');


    $('finalDate').textContent =
      `${day}.${month}.${year} в ${time}`;


    $('finalChoice').textContent =
      selected;


    show('success');


    /*
      Финальная красивая реакция.
      Ограничено 14 сердечками.
    */

    burstHearts(14);

    sparkleBurst(10);


  }catch(error){

    showError(
      'Не получилось отправить ответ. Проверь подключение Google Apps Script.'
    );


    sendButton.disabled =
      false;


    sendButton.innerHTML =
      'Отправить мой ответ <span>♥</span>';

  }

};


/* =========================================================
   ОШИБКИ
   ========================================================= */

function showError(text){

  const error =
    $('error');


  error.textContent =
    text;


  error.style.display =
    'block';


  clearTimeout(
    showError.timer
  );


  showError.timer =
    setTimeout(() => {

      error.style.display =
        'none';

    },4500);

}


/* =========================================================
   ЛЕТАЮЩИЕ СЕРДЕЧКИ
   =========================================================

   ВАЖНО:

   Здесь стоит ограничение количества элементов.

   Старый вариант мог постоянно добавлять
   новые элементы.

   Теперь максимум примерно 18 одновременно.

   Поэтому даже при слабом компьютере
   браузер не должен захлёбываться.
   ========================================================= */

function burstHearts(count = 5){

  const root =
    $('hearts');


  const existing =
    root.children.length;


  const available =
    Math.max(
      0,
      18 - existing
    );


  count =
    Math.min(
      count,
      available
    );


  for(let i = 0; i < count; i++){

    const heart =
      document.createElement('div');


    heart.className =
      'float-heart';


    heart.textContent =
      Math.random() > .22
        ? '♥'
        : '♡';


    heart.style.left =
      (8 + Math.random() * 84)
      + '%';


    heart.style.bottom =
      (3 + Math.random() * 18)
      + '%';


    heart.style.animationDelay =
      (Math.random() * .25)
      + 's';


    heart.style.fontSize =
      (13 + Math.random() * 15)
      + 'px';


    heart.style.setProperty(
      '--drift',
      (-45 + Math.random() * 90)
      + 'px'
    );


    root.appendChild(
      heart
    );


    /*
      Удаляем элемент точно после завершения
      его анимации.
    */

    heart.addEventListener(
      'animationend',
      () => heart.remove(),
      {once:true}
    );

  }

}


/* =========================================================
   ИСКРЫ
   ========================================================= */

function sparkleBurst(count = 5){

  const root =
    $('sparkles');


  const existing =
    root.children.length;


  const available =
    Math.max(
      0,
      10 - existing
    );


  count =
    Math.min(
      count,
      available
    );


  for(let i = 0; i < count; i++){

    const spark =
      document.createElement('div');


    spark.className =
      'spark';


    spark.textContent =
      Math.random() > .5
        ? '✦'
        : '✧';


    spark.style.left =
      (12 + Math.random() * 76)
      + '%';


    spark.style.top =
      (18 + Math.random() * 60)
      + '%';


    spark.style.animationDelay =
      (Math.random() * .16)
      + 's';


    spark.style.setProperty(
      '--sx',
      (-20 + Math.random() * 40)
      + 'px'
    );


    root.appendChild(
      spark
    );


    spark.addEventListener(
      'animationend',
      () => spark.remove(),
      {once:true}
    );

  }

}


/* =========================================================
   ФОНОВЫЕ СЕРДЕЧКИ
   =========================================================

   Каждые ~1.6 секунды появляется одно маленькое
   сердечко.

   Это намного легче, чем постоянный поток.
   ========================================================= */

function ambientHeart(){

  if(
    !ambientOn ||
    document.hidden
  ){

    return;

  }


  const root =
    $('hearts');


  if(root.children.length < 10){

    burstHearts(1);

  }

}


/* =========================================================
   ЗАПУСК ФОНОВОЙ АНИМАЦИИ
   ========================================================= */

function startAmbient(){

  clearInterval(
    ambientTimer
  );


  ambientTimer =
    setInterval(
      ambientHeart,
      1600
    );

}


startAmbient();


/* =========================================================
   ЛЁГКИЕ ЛЕПЕСТКИ
   =========================================================

   Очень редко.
   Максимум 5 элементов.
   ========================================================= */

function petals(){

  const root =
    $('petals');


  if(root.children.length >= 5){

    return;

  }


  for(let i = 0; i < 2; i++){

    const petal =
      document.createElement('div');


    petal.className =
      'petal';


    petal.textContent =
      Math.random() > .5
        ? '♡'
        : '·';


    petal.style.left =
      (Math.random() * 100)
      + '%';


    petal.style.animationDelay =
      (Math.random() * 1.5)
      + 's';


    petal.style.setProperty(
      '--x',
      (-70 + Math.random() * 140)
      + 'px'
    );


    root.appendChild(
      petal
    );


    petal.addEventListener(
      'animationend',
      () => petal.remove(),
      {once:true}
    );

  }

}


/* =========================================================
   НЕ ЗАПУСКАЕМ ФОНОВУЮ АНИМАЦИЮ,
   КОГДА ВКЛАДКА СКРЫТА
   ========================================================= */

document.addEventListener(
  'visibilitychange',
  () => {

    if(!document.hidden){

      ambientHeart();

    }

  }
);


/* =========================================================
   ЛЕПЕСТКИ РАЗ В 6.5 СЕКУНД
   ========================================================= */

setInterval(
  () => {

    if(!document.hidden){

      petals();

    }

  },
  6500
);
