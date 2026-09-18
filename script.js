document.addEventListener("DOMContentLoaded",()=>{


/* ===============================
   VARIABLES
================================ */

const screens =
document.querySelectorAll(".screen");


let chosenDate="";
let chosenTime="";
let chosenChoice="";



/* ===============================
   SCREEN SWITCH
================================ */


function showScreen(id){

    screens.forEach(screen=>{
        screen.classList.remove("active");
    });


    const next =
    document.getElementById(id);


    if(next){

        setTimeout(()=>{

            next.classList.add("active");

        },100);

    }

}




document.querySelectorAll(".next")
.forEach(btn=>{


btn.addEventListener("click",()=>{


const target =
btn.dataset.screen;


if(target==="choice"){


if(!chosenDate || !chosenTime){

document.getElementById("dateError")
.textContent =
"Выбери дату и время ❤️";


return;

}


}


if(target==="message"){


if(!chosenChoice){

return;

}


}



showScreen(target);


});


});





/* ===============================
   DATE
================================ */


const datePicker =
document.getElementById("datePicker");


const dateInput =
document.getElementById("dateInput");


const dateDisplay =
document.getElementById("dateDisplay");



datePicker.addEventListener("click",()=>{


dateInput.click();


});





dateInput.addEventListener("change",()=>{


chosenDate =
dateInput.value;



if(chosenDate){


const d =
new Date(chosenDate);


dateDisplay.textContent =
d.toLocaleDateString(
"ru-RU",
{
day:"numeric",
month:"long",
year:"numeric"
}
);


}



});





/* ===============================
   TIME
================================ */


document.querySelectorAll("[data-time]")
.forEach(button=>{


button.addEventListener("click",()=>{


document
.querySelectorAll("[data-time]")
.forEach(b=>{

b.classList.remove("active");

});



button.classList.add("active");


chosenTime =
button.dataset.time;



});



});






/* ===============================
   CHOICE
================================ */


const choices =
document.querySelectorAll(".choice");


const messageButton =
document.getElementById("messageButton");



choices.forEach(choice=>{


choice.addEventListener("click",()=>{


choices.forEach(c=>{

c.classList.remove("selected");

});



choice.classList.add("selected");


chosenChoice =
choice.dataset.choice;



messageButton.classList.remove(
"hidden"
);



heartBurst(choice);



});


});






/* ===============================
   TEXT COUNTER
================================ */


const textarea =
document.getElementById("wish");


const counter =
document.getElementById("count");



textarea.addEventListener("input",()=>{


counter.textContent =
textarea.value.length;


});







/* ===============================
   SEND
================================ */


document
.getElementById("send")
.addEventListener("click",()=>{


document.getElementById("finalDate")
.textContent =
`${chosenDate} ${chosenTime}`;



document.getElementById("finalChoice")
.textContent =
chosenChoice;



showScreen("success");


celebrate();



});







/* ===============================
   HEART EFFECTS
================================ */


function createHeart(){


const heart =
document.createElement("div");


heart.textContent =
Math.random()>0.5
?
"♥"
:
"♡";



heart.style.position="fixed";

heart.style.left =
Math.random()*100+"vw";


heart.style.bottom =
"-20px";


heart.style.fontSize =
15+
Math.random()*30+
"px";


heart.style.color =
"#e86f96";


heart.style.zIndex=10;


heart.style.pointerEvents="none";


document.body.appendChild(heart);



const x =
(Math.random()-0.5)*200;



heart.animate([

{
transform:
"translate(0,0) rotate(0deg)",
opacity:1
},


{
transform:
`translate(${x}px,-110vh) rotate(360deg)`,
opacity:0
}


],
{

duration:
5000+
Math.random()*4000,

easing:
"ease-out"

});



setTimeout(()=>{

heart.remove();

},9000);



}



setInterval(createHeart,900);






function heartBurst(el){


const rect =
el.getBoundingClientRect();



for(let i=0;i<10;i++){


const h =
document.createElement("div");


h.textContent="♥";


h.style.position="fixed";


h.style.left =
rect.left+
rect.width/2+
"px";


h.style.top =
rect.top+
20+
"px";


h.style.color="#e86f96";


h.style.zIndex=20;


document.body.appendChild(h);



const x =
(Math.random()-0.5)*150;


const y =
(Math.random()-0.5)*150;



h.animate([

{
transform:"scale(0)"
},

{
transform:
`translate(${x}px,${y}px) scale(1)`
}

],
{

duration:700

});



setTimeout(()=>h.remove(),800);


}



}




function celebrate(){


for(let i=0;i<60;i++){


setTimeout(
createHeart,
i*40
);


}



}








/* ===============================
   CANVAS PARTICLES
================================ */


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

x:
Math.random()*innerWidth,

y:
Math.random()*innerHeight,

r:
Math.random()*2+1,

speed:
Math.random()+0.2,

opacity:
Math.random()

});


}






function draw(){


ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);



particles.forEach(p=>{


p.y-=p.speed;


if(p.y<0){

p.y=
canvas.height;

}



ctx.beginPath();


ctx.arc(
p.x,
p.y,
p.r,
0,
Math.PI*2
);



ctx.fillStyle =
`rgba(255,255,255,${p.opacity})`;


ctx.fill();



});



requestAnimationFrame(draw);


}


draw();






});
