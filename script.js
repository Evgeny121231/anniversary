document.addEventListener("DOMContentLoaded",()=>{

const GOOGLE_SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbzvxIYU63ttbgPl5JinEPN8btZB4he2D6rtVoAS6IqZmTfuSPco5opBoqGXL04PW2mY/exec";


const screens =
[...document.querySelectorAll(".screen")];

const choices =
[...document.querySelectorAll(".choice")];

const $ =
id => document.getElementById(id);

let selected = "";


/* =========================
   ПЕРЕХОДЫ
========================= */

function show(id){

screens.forEach(screen=>{

screen.classList.toggle(
"active",
screen.id === id
);

});

window.scrollTo({
top:0,
behavior:"smooth"
});

}


/* =========================
   КНОПКИ NEXT
========================= */

document
.querySelectorAll("[data-next]")
.forEach(button=>{

button.addEventListener("click",()=>{

show(button.dataset.next);

});

});


/* =========================
   ДАТА + ВРЕМЯ
========================= */

$("toChoice").addEventListener(
"click",
()=>{

const date =
$("dateInput").value;

const time =
$("timeInput").value;


if(!date || !time){

$("dateValidation").textContent =
"Выбери, пожалуйста, и дату, и время ❤️";

return;

}


$("dateValidation").textContent = "";

show("choice");

});



/* =========================
   ВЫБОР ВАРИАНТА
========================= */

choices.forEach(button=>{

button.addEventListener("click",()=>{

choices.forEach(item=>{

item.classList.remove("selected");

});

button.classList.add("selected");

selected =
button.dataset.choice;

$("toMessage")
.classList.remove("hidden");


sparkleBurst(3);

});

});


/* =========================
   ПЕРЕХОД К СООБЩЕНИЮ
========================= */

$("toMessage").addEventListener(
"click",
()=>{

if(!selected){

showError(
"Сначала выбери вариант вечера ❤️"
);

return;

}

show("message");

});


/* =========================
   КНОПКА НАЗАД
========================= */

document
.querySelectorAll("[data-back]")
.forEach(button=>{

button.addEventListener("click",()=>{

show(button.dataset.back);

});

});


/* =========================
   СЧЁТЧИК
========================= */

$("wish").addEventListener(
"input",
()=>{

$("count").textContent =
$("wish").value.length;

});


/* =========================
   ОТПРАВКА
========================= */

$("send").addEventListener(
"click",
async()=>{


if(!selected){

showError(
"Сначала выбери вариант вечера ❤️"
);

show("choice");

return;

}


if(
!$("dateInput").value ||
!$("timeInput").value
){

showError(
"Сначала выбери дату и время ❤️"
);

show("date");

return;

}


const sendButton =
$("send");


sendButton.disabled = true;

sendButton.innerHTML =
"Отправляю твой ответ… ♥";


const payload = {

date:
$("dateInput").value,

time:
$("timeInput").value,

choice:
selected,

wish:
$("wish").value.trim()

};


try{


if(!GOOGLE_SCRIPT_URL){

throw new Error(
"Google Script URL отсутствует"
);

}


await fetch(
GOOGLE_SCRIPT_URL,
{

method:"POST",

mode:"no-cors",

headers:{
"Content-Type":
"text/plain;charset=utf-8"
},

body:
JSON.stringify(payload)

}
);


/* =========================
   ПОКАЗ РЕЗУЛЬТАТА
========================= */

const [
year,
month,
day
] =
$("dateInput")
.value
.split("-");


$("finalDate").textContent =
`${day}.${month}.${year} в ${$("timeInput").value}`;


$("finalChoice").textContent =
selected;


show("success");


/*
   Небольшая финальная анимация,
   а не огромный поток сердечек
*/

burstHearts(7);

sparkleBurst(5);


}catch(error){

console.error(
"Ошибка отправки:",
error
);

showError(
"Не получилось отправить ответ. Проверь подключение."
);

sendButton.disabled = false;

sendButton.innerHTML =
'Отправить мой ответ <span>♥</span>';

}

});


/* =========================
   ОШИБКИ
========================= */

function showError(text){

const error =
$("error");

error.textContent =
text;

error.style.display =
"block";


setTimeout(()=>{

error.style.display =
"none";

},4500);

}


/* =========================
   НЕБОЛЬШИЕ СЕРДЕЧКИ
========================= */

function createHeart(){

const heart =
document.createElement("div");

heart.className =
"float-heart";

heart.textContent =
Math.random() > .25
? "♥"
: "♡";


heart.style.left =
(10 + Math.random()*80) + "%";

heart.style.bottom =
"0px";

heart.style.fontSize =
(13 + Math.random()*12) + "px";


$("hearts").appendChild(
heart
);


setTimeout(()=>{

heart.remove();

},7000);

}


/*
   Было слишком много.
   Теперь только одно сердце примерно
   каждые 2.5 секунды.
*/

setInterval(
createHeart,
2500
);


/* =========================
   СЕРДЕЧКИ ПРИ ВЫБОРЕ
========================= */

function burstHearts(count=4){

for(let i=0;i<count;i++){

setTimeout(()=>{

const heart =
document.createElement("div");

heart.className =
"float-heart";

heart.textContent =
Math.random() > .3
? "♥"
: "♡";

heart.style.left =
(25 + Math.random()*50) + "%";

heart.style.bottom =
(15 + Math.random()*20) + "%";

heart.style.fontSize =
(13 + Math.random()*10) + "px";


$("hearts").appendChild(
heart
);


setTimeout(()=>{

heart.remove();

},7000);

},i*100);

}

}


/* =========================
   ИСКРЫ
========================= */

function sparkleBurst(count=3){

for(let i=0;i<count;i++){

setTimeout(()=>{

const spark =
document.createElement("div");

spark.className =
"spark";

spark.textContent =
Math.random() > .5
? "✦"
: "✧";

spark.style.left =
(20 + Math.random()*60) + "%";

spark.style.top =
(20 + Math.random()*60) + "%";


$("sparkles").appendChild(
spark
);


setTimeout(()=>{

spark.remove();

},2200);

},i*80);

}

}

});
