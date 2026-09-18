/* =========================================================
   LOVE INVITATION SCRIPT
   Cinematic animations + logic
========================================================= */


document.addEventListener("DOMContentLoaded",()=>{


const screens =
document.querySelectorAll(".screen");


const heartsContainer =
document.getElementById("hearts");


let selectedChoice = "";
let selectedDate = "";
let selectedTime = "";



/* ==========================
   SCREEN SWITCH
========================== */


function openScreen(id){

    screens.forEach(s=>{

        s.classList.remove("active");

    });


    const target =
    document.getElementById(id);


    if(target){

        setTimeout(()=>{

            target.classList.add("active");

            window.scrollTo({
                top:0,
                behavior:"smooth"
            });


        },120);

    }

}




document.querySelectorAll("[data-next]")
.forEach(btn=>{


btn.addEventListener("click",()=>{


openScreen(
btn.dataset.next
);


});


});




document.querySelectorAll("[data-back]")
.forEach(btn=>{


btn.addEventListener("click",()=>{


openScreen(
btn.dataset.back
);


});


});





/* ==========================
   DATE PICKER
========================== */


const datePicker =
document.getElementById("datePicker");


const dateInput =
document.getElementById("dateInput");


const dateDisplay =
document.getElementById("dateDisplay");



datePicker.addEventListener("click",()=>{


dateInput.showPicker
?
dateInput.showPicker()
:
dateInput.click();



});



dateInput.addEventListener("change",()=>{


selectedDate =
dateInput.value;



if(selectedDate){


let d =
new Date(selectedDate);



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





/* ==========================
   TIME SELECT
========================== */


document.querySelectorAll(".time-grid button")
.forEach(btn=>{


btn.addEventListener("click",()=>{


document
.querySelectorAll(".time-grid button")
.forEach(b=>
b.classList.remove("active")
);



btn.classList.add("active");


selectedTime =
btn.dataset.time;


document.getElementById(
"timeInput"
).value =
selectedTime;



});


});






/* ==========================
   NEXT TO CHOICE
========================== */


document
.getElementById("toChoice")
.addEventListener("click",()=>{


const validation =
document.getElementById(
"dateValidation"
);



if(!selectedDate ||
!selectedTime){


validation.textContent =
"Сначала выбери дату и время ❤️";


validation.style.display="block";


return;


}



validation.textContent="";


openScreen("choice");


});





/* ==========================
   CHOICES
========================== */


const choiceButtons =
document.querySelectorAll(".choice");


const toMessage =
document.getElementById("toMessage");



choiceButtons.forEach(btn=>{


btn.addEventListener("click",()=>{


choiceButtons.forEach(b=>
b.classList.remove("selected")
);



btn.classList.add("selected");


selectedChoice =
btn.dataset.choice;



toMessage.classList.remove(
"hidden"
);



heartBurst(
btn
);



});


});






toMessage.addEventListener("click",()=>{


openScreen(
"message"
);


});







/* ==========================
   TEXT COUNTER
========================== */


const wish =
document.getElementById("wish");


const count =
document.getElementById("count");



wish.addEventListener("input",()=>{


count.textContent =
wish.value.length;


});







/* ==========================
   SEND
========================== */


document
.getElementById("send")
.addEventListener("click",()=>{


const finalDate =
document.getElementById(
"finalDate"
);


const finalChoice =
document.getElementById(
"finalChoice"
);



finalDate.textContent =
`${selectedDate} ${selectedTime}`;



finalChoice.textContent =
selectedChoice;



openScreen(
"success"
);



celebrate();



});








/* =========================================================
   HEART PARTICLES
========================================================= */



function createHeart(){


const heart =
document.createElement("div");


heart.innerHTML =
Math.random()>.5
?
"♥"
:
"♡";



heart.style.position="fixed";

heart.style.left =
Math.random()*100+"vw";


heart.style.bottom =
"-30px";


heart.style.fontSize =
(
15+
Math.random()*35
)
+"px";


heart.style.color =
[
"#ff8fab",
"#ffb3c6",
"#d86b8a",
"#ffffff"
]
[
Math.floor(
Math.random()*4
)
];



heart.style.opacity =
0.5+
Math.random()*0.5;



heart.style.pointerEvents="none";


heart.style.zIndex="3";



document.body.appendChild(
heart
);



const duration =
6000+
Math.random()*7000;



const drift =
-100+
Math.random()*200;



heart.animate([

{
transform:
"translate(0,0) rotate(0deg)"
},

{
transform:
`translate(${drift}px,-120vh) rotate(360deg)`
}

],
{

duration:duration,

easing:
"ease-out"

}
);



setTimeout(()=>{

heart.remove();

},duration);


}



setInterval(
createHeart,
600
);







/* ==========================
   HEART CLICK BURST
========================== */


function heartBurst(el){


const rect =
el.getBoundingClientRect();



for(let i=0;i<8;i++){


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


h.style.color="#e47796";


h.style.zIndex=20;


document.body.appendChild(h);



let x =
(Math.random()-0.5)*200;


let y =
(Math.random()-0.5)*200;



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
duration:700,
easing:"cubic-bezier(.2,.8,.2,1)"
}

);



setTimeout(()=>
h.remove(),
800
);


}


}








/* ==========================
   SUCCESS EFFECT
========================== */


function celebrate(){


for(let i=0;i<80;i++){


setTimeout(
createHeart,
i*30
);


}


}








/* =========================================================
   CANVAS MAGIC BACKGROUND
========================================================= */


const canvas =
document.getElementById(
"magicCanvas"
);


const ctx =
canvas.getContext(
"2d"
);



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





for(let i=0;i<90;i++){


particles.push({

x:
Math.random()*canvas.width,

y:
Math.random()*canvas.height,


r:
Math.random()*2+1,


speed:
Math.random()*0.4+0.1,


alpha:
Math.random()

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


p.y -= p.speed;



if(p.y<0)
p.y =
canvas.height;



ctx.beginPath();


ctx.arc(
p.x,
p.y,
p.r,
0,
Math.PI*2
);



ctx.fillStyle =
`rgba(255,255,255,${p.alpha})`;



ctx.fill();


});



requestAnimationFrame(
animate
);


}


animate();







/* ==========================
   MOUSE GLASS EFFECT
========================== */


document.querySelectorAll(".card")
.forEach(card=>{


card.addEventListener(
"mousemove",
e=>{


const r =
card.getBoundingClientRect();


const x =
(e.clientX-r.left)/
r.width-.5;


const y =
(e.clientY-r.top)/
r.height-.5;



card.style.transform =
`
perspective(900px)
rotateX(${-y*5}deg)
rotateY(${x*5}deg)
`;



});


card.addEventListener(
"mouseleave",
()=>{


card.style.transform="";

});


});



});
