document.addEventListener("DOMContentLoaded",()=>{


let selectedDate = "";
let selectedTime = "";
let selectedChoice = "";



const screens = document.querySelectorAll(".screen");



function openScreen(id){

    screens.forEach(screen=>{
        screen.classList.remove("active");
    });


    const target =
    document.getElementById(id);


    if(target){

        target.classList.add("active");

        window.scrollTo({
            top:0,
            behavior:"smooth"
        });

    }

}




/* =========================
   ПЕРЕХОДЫ
========================= */


document.querySelectorAll(".next")
.forEach(button=>{


button.addEventListener("click",()=>{


let target =
button.dataset.target;



if(target==="choice"){


if(!selectedDate || !selectedTime){


document.getElementById("dateError")
.textContent =
"Сначала выбери дату и время ❤️";


return;


}


}



if(target==="message"){


if(!selectedChoice){

return;

}


}



openScreen(target);



});


});






/* =========================
   ДАТА
========================= */


const dateInput =
document.getElementById("dateInput");



dateInput.addEventListener("change",()=>{


selectedDate =
dateInput.value;


document.getElementById("dateError")
.textContent="";


});








/* =========================
   ВРЕМЯ
========================= */


document.querySelectorAll(".time-btn")
.forEach(button=>{


button.addEventListener("click",()=>{


document.querySelectorAll(".time-btn")
.forEach(btn=>{

btn.classList.remove("active");

});



button.classList.add("active");



selectedTime =
button.dataset.time;



});



});









/* =========================
   ВЫБОР ВЕЧЕРА
========================= */


const choices =
document.querySelectorAll(".choice");



const choiceNext =
document.getElementById("choiceNext");



choices.forEach(choice=>{


choice.addEventListener("click",()=>{


choices.forEach(c=>{

c.classList.remove("selected");

});



choice.classList.add("selected");



selectedChoice =
choice.dataset.choice;



choiceNext.classList.remove("hidden");



createBurst(choice);



});


});









/* =========================
   ТЕКСТ
========================= */


const wish =
document.getElementById("wish");


const count =
document.getElementById("count");



wish.addEventListener("input",()=>{


count.textContent =
wish.value.length;



});









/* =========================
   ОТПРАВКА
========================= */


document
.getElementById("send")
.addEventListener("click",()=>{


document.getElementById("resultDate")
.textContent =
selectedDate+" "+selectedTime;



document.getElementById("resultChoice")
.textContent =
selectedChoice;



openScreen("success");



celebrate();



});









/* =========================
   СЕРДЕЧКИ
========================= */


function createHeart(){


const heart =
document.createElement("div");


heart.innerHTML =
Math.random()>0.5
?
"♥"
:
"♡";



heart.style.position="fixed";


heart.style.left =
Math.random()*100+"vw";


heart.style.bottom="-30px";


heart.style.fontSize =
(15+Math.random()*30)+"px";


heart.style.color="#e76b92";


heart.style.zIndex="10";


heart.style.pointerEvents="none";



document.body.appendChild(heart);




const move =
(Math.random()-0.5)*200;



heart.animate([

{

transform:
"translateY(0) rotate(0deg)",

opacity:1

},

{

transform:
`translate(${move}px,-110vh) rotate(360deg)`,

opacity:0

}

],{


duration:
5000+Math.random()*4000,


easing:"ease-out"


});




setTimeout(()=>{

heart.remove();

},9000);



}



setInterval(createHeart,800);









function createBurst(element){


const rect =
element.getBoundingClientRect();



for(let i=0;i<8;i++){


let heart =
document.createElement("div");


heart.textContent="♥";


heart.style.position="fixed";


heart.style.left =
rect.left+
rect.width/2+
"px";


heart.style.top =
rect.top+
20+
"px";


heart.style.color="#e76b92";


heart.style.zIndex=20;



document.body.appendChild(heart);



let x =
(Math.random()-0.5)*150;


let y =
(Math.random()-0.5)*150;




heart.animate([

{
transform:"scale(0)"
},

{

transform:
`translate(${x}px,${y}px) scale(1)`

}

],{


duration:700

});



setTimeout(()=>heart.remove(),800);



}



}






function celebrate(){


for(let i=0;i<50;i++){


setTimeout(createHeart,i*40);


}



}










/* =========================
   CANVAS
========================= */


const canvas =
document.getElementById("magicCanvas");


const ctx =
canvas.getContext("2d");



let particles=[];



function resize(){


canvas.width =
window.innerWidth;


canvas.height =
window.innerHeight;


}


resize();


window.addEventListener(
"resize",
resize
);




for(let i=0;i<80;i++){


particles.push({

x:Math.random()*window.innerWidth,

y:Math.random()*window.innerHeight,

size:Math.random()*2+1,

speed:Math.random()*0.5+0.1

});


}





function animate(){


ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);



particles.forEach(p=>{


p.y-=p.speed;



if(p.y<0){

p.y=canvas.height;

}



ctx.beginPath();


ctx.arc(
p.x,
p.y,
p.size,
0,
Math.PI*2
);



ctx.fillStyle=
"rgba(255,255,255,.8)";



ctx.fill();



});



requestAnimationFrame(animate);



}


animate();



});
