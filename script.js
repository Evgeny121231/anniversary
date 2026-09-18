/* =========================================================
   💗 LOVE INVITATION — CINEMATIC ENGINE
   ========================================================= */

const GOOGLE_SCRIPT_URL =
'https://script.google.com/macros/s/AKfycbzvxIYU63ttbgPl5JinEPN8btZB4he2D6rtVoAS6IqZmTfuSPco5opBoqGXL04PW2mY/exec';


/* =========================================================
   APP
   ========================================================= */

const screens =
    [...document.querySelectorAll('.screen')];

const choices =
    [...document.querySelectorAll('.choice')];

const $ =
    id => document.getElementById(id);

let selected = '';



/* =========================================================
   SCREEN TRANSITIONS
   ========================================================= */

function show(id){

    screens.forEach(screen => {

        screen.classList.toggle(
            'active',
            screen.id === id
        );

    });

    window.scrollTo({
        top:0,
        behavior:'smooth'
    });

    setTimeout(() => {

        magicBurst(
            window.innerWidth < 600
                ? 35
                : 65
        );

    },120);
}



/* =========================================================
   NAVIGATION
   ========================================================= */

document
    .querySelectorAll('[data-next]')
    .forEach(button => {

        button.onclick = () => {

            show(button.dataset.next);

            magicBurst(55);
        };

    });



/* =========================================================
   DATE
   ========================================================= */

$('toChoice').onclick = () => {

    if(
        !$('dateInput').value ||
        !$('timeInput').value
    ){

        $('dateValidation').textContent =
            'Выбери, пожалуйста, и дату, и время ❤️';

        magicBurst(12);

        return;
    }

    $('dateValidation').textContent = '';

    show('choice');

    magicBurst(70);
};



/* =========================================================
   CHOICES
   ========================================================= */

choices.forEach(button => {

    button.onclick = () => {

        choices.forEach(item =>
            item.classList.remove('selected')
        );

        button.classList.add('selected');

        selected =
            button.dataset.choice;

        $('toMessage')
            .classList
            .remove('hidden');

        /*
           Большой красивый взрыв
        */

        magicBurst(
            window.innerWidth < 600
                ? 55
                : 100
        );

        heartExplosion();
    };

});



/* =========================================================
   MESSAGE
   ========================================================= */

$('toMessage').onclick = () => {

    show('message');

    magicBurst(70);
};


$('wish').oninput = () => {

    $('count').textContent =
        $('wish').value.length;

};



/* =========================================================
   SEND
   ========================================================= */

$('send').onclick = async () => {

    if(!selected){

        showError(
            'Сначала выбери вариант вечера ❤️'
        );

        show('choice');

        return;
    }


    if(
        !$('dateInput').value ||
        !$('timeInput').value
    ){

        showError(
            'Сначала выбери дату и время ❤️'
        );

        show('date');

        return;
    }


    const button =
        $('send');


    button.disabled = true;

    button.textContent =
        'Отправляю твой ответ… ♥';


    const payload = {

        date:
            $('dateInput').value,

        time:
            $('timeInput').value,

        choice:
            selected,

        wish:
            $('wish').value.trim()

    };


    try{

        if(!GOOGLE_SCRIPT_URL)
            throw new Error();


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
            $('dateInput')
                .value
                .split('-');


        $('finalDate').textContent =
            `${day}.${month}.${year} в ${$('timeInput').value}`;


        $('finalChoice').textContent =
            selected;


        show('success');


        /*
           ФИНАЛЬНЫЙ САЛЮТ
        */

        setTimeout(
            () => magicBurst(180),
            200
        );


        setTimeout(
            () => heartExplosion(55),
            650
        );


    }catch(error){

        showError(
            'Не получилось отправить ответ. Проверь подключение Google Apps Script.'
        );

        button.disabled = false;

        button.innerHTML =
            'Отправить мой ответ <span>♥</span>';
    }

};



/* =========================================================
   ERROR
   ========================================================= */

function showError(text){

    const error =
        $('error');

    error.textContent =
        text;

    error.style.display =
        'block';


    setTimeout(
        () => {
            error.style.display =
                'none';
        },
        4500
    );
}



/* =========================================================
   MAGIC CANVAS
   ========================================================= */

const canvas =
    $('magicCanvas');

const ctx =
    canvas.getContext('2d', {
        alpha:true
    });


let W = 0;
let H = 0;
let DPR = 1;


/* =========================================================
   DEVICE PERFORMANCE
   ========================================================= */

const isMobile =
    window.matchMedia(
        '(max-width:600px)'
    ).matches;


const prefersReduced =
    window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;


/*
   Не создаём тысячу частиц.
*/

const PARTICLE_COUNT =
    prefersReduced
        ? 0
        : isMobile
            ? 65
            : 120;


const particles = [];

const bursts = [];

const hearts = [];

const ripples = [];



/* =========================================================
   RESIZE
   ========================================================= */

function resizeCanvas(){

    DPR =
        Math.min(
            window.devicePixelRatio || 1,
            1.7
        );

    W =
        window.innerWidth;

    H =
        window.innerHeight;


    canvas.width =
        Math.floor(W * DPR);

    canvas.height =
        Math.floor(H * DPR);


    canvas.style.width =
        W + 'px';

    canvas.style.height =
        H + 'px';


    ctx.setTransform(
        DPR,
        0,
        0,
        DPR,
        0,
        0
    );
}


resizeCanvas();

window.addEventListener(
    'resize',
    resizeCanvas,
    {
        passive:true
    }
);



/* =========================================================
   POINTER PARALLAX
   ========================================================= */

let mouseX = .5;
let mouseY = .5;

let targetMouseX = .5;
let targetMouseY = .5;


window.addEventListener(
    'pointermove',
    event => {

        targetMouseX =
            event.clientX / W;

        targetMouseY =
            event.clientY / H;

    },
    {
        passive:true
    }
);



/* =========================================================
   RANDOM
   ========================================================= */

function random(min,max){

    return (
        Math.random() *
        (max - min)
    ) + min;

}



/* =========================================================
   PARTICLES
   ========================================================= */

function createParticle(){

    return {

        x:
            random(0,W),

        y:
            random(0,H),

        size:
            random(.7,2.2),

        speed:
            random(.08,.35),

        drift:
            random(-.18,.18),

        alpha:
            random(.12,.55),

        phase:
            random(0,Math.PI*2),

        twinkle:
            random(.008,.025)

    };

}


for(
    let i=0;
    i<PARTICLE_COUNT;
    i++
){

    particles.push(
        createParticle()
    );

}



/* =========================================================
   HEARTS
   ========================================================= */

function createHeart(
    x = random(0,W),
    y = H + 30,
    power = 1
){

    hearts.push({

        x,

        y,

        vx:
            random(-.35,.35)
            * power,

        vy:
            random(-.65,-1.35)
            * power,

        size:
            random(9,21)
            * power,

        rotation:
            random(-.35,.35),

        rotationSpeed:
            random(-.01,.01),

        alpha:
            random(.25,.72),

        life:
            1,

        wobble:
            random(0,Math.PI*2),

        wobbleSpeed:
            random(.01,.025)

    });

}



/* =========================================================
   AUTOMATIC HEART SPAWN
   ========================================================= */

let lastHeart =
    performance.now();


function automaticHearts(now){

    if(
        now - lastHeart >
        (isMobile ? 1150 : 780)
    ){

        createHeart();

        lastHeart =
            now;
    }

}



/* =========================================================
   HEART EXPLOSION
   ========================================================= */

function heartExplosion(
    count =
        isMobile ? 18 : 32
){

    const cx =
        W / 2;

    const cy =
        H * .42;


    for(
        let i=0;
        i<count;
        i++
    ){

        const angle =
            Math.random() *
            Math.PI *
            2;

        const speed =
            random(.7,2.4);


        hearts.push({

            x:cx,

            y:cy,

            vx:
                Math.cos(angle)
                * speed,

            vy:
                Math.sin(angle)
                * speed,

            size:
                random(9,19),

            rotation:
                random(-.5,.5),

            rotationSpeed:
                random(-.03,.03),

            alpha:
                random(.45,.9),

            life:1,

            wobble:
                random(0,Math.PI*2),

            wobbleSpeed:
                random(.015,.035),

            explosion:true

        });

    }

}



/* =========================================================
   MAGIC BURST
   ========================================================= */

function magicBurst(
    count = 60,
    x = W/2,
    y = H/2
){

    for(
        let i=0;
        i<count;
        i++
    ){

        const angle =
            Math.random()
            * Math.PI
            * 2;

        const speed =
            random(.3,2.5);


        bursts.push({

            x,

            y,

            vx:
                Math.cos(angle)
                * speed,

            vy:
                Math.sin(angle)
                * speed,

            size:
                random(.8,2.8),

            life:1,

            decay:
                random(.008,.022),

            type:
                Math.random() > .78
                    ? 'heart'
                    : 'spark'

        });

    }


    /*
       Ripple
    */

    ripples.push({

        x,

        y,

        radius:5,

        life:1

    });

}



/* =========================================================
   DRAW HEART
   ========================================================= */

function drawHeart(
    x,
    y,
    size,
    rotation,
    alpha
){

    ctx.save();

    ctx.translate(
        x,
        y
    );

    ctx.rotate(
        rotation
    );

    ctx.globalAlpha =
        alpha;

    ctx.fillStyle =
        '#d76888';

    ctx.shadowBlur =
        12;

    ctx.shadowColor =
        'rgba(214,103,136,.45)';


    ctx.beginPath();

    const s =
        size;

    ctx.moveTo(
        0,
        s * .85
    );

    ctx.bezierCurveTo(
        -s * 1.25,
        s * .05,
        -s * .65,
        -s * .9,
        0,
        -s * .35
    );

    ctx.bezierCurveTo(
        s * .65,
        -s * .9,
        s * 1.25,
        s * .05,
        0,
        s * .85
    );

    ctx.fill();

    ctx.restore();

}



/* =========================================================
   DRAW SPARK
   ========================================================= */

function drawSpark(
    x,
    y,
    size,
    alpha
){

    ctx.save();

    ctx.translate(
        x,
        y
    );

    ctx.globalAlpha =
        alpha;

    ctx.fillStyle =
        '#eaa1b4';

    ctx.shadowBlur =
        14;

    ctx.shadowColor =
        'rgba(235,150,174,.65)';


    ctx.beginPath();

    ctx.moveTo(
        0,
        -size * 2
    );

    ctx.lineTo(
        size * .45,
        -size * .45
    );

    ctx.lineTo(
        size * 2,
        0
    );

    ctx.lineTo(
        size * .45,
        size * .45
    );

    ctx.lineTo(
        0,
        size * 2
    );

    ctx.lineTo(
        -size * .45,
        size * .45
    );

    ctx.lineTo(
        -size * 2,
        0
    );

    ctx.lineTo(
        -size * .45,
        -size * .45
    );

    ctx.closePath();

    ctx.fill();

    ctx.restore();

}



/* =========================================================
   DRAW RIPPLE
   ========================================================= */

function drawRipple(
    ripple
){

    ctx.save();

    ctx.globalAlpha =
        ripple.life * .25;

    ctx.strokeStyle =
        '#df7f9b';

    ctx.lineWidth =
        1.5;

    ctx.beginPath();

    ctx.arc(
        ripple.x,
        ripple.y,
        ripple.radius,
        0,
        Math.PI * 2
    );

    ctx.stroke();

    ctx.restore();

}



/* =========================================================
   BACKGROUND PARTICLES
   ========================================================= */

function updateParticles(){

    particles.forEach(p => {

        p.phase += p.twinkle;

        p.y -= p.speed;

        p.x +=
            p.drift +
            Math.sin(p.phase)
            * .08;


        if(
            p.y < -10
        ){

            p.y =
                H + 10;

            p.x =
                random(0,W);
        }


        if(
            p.x < -10
        )
            p.x = W + 10;

        if(
            p.x > W + 10
        )
            p.x = -10;

    });

}



/* =========================================================
   DRAW PARTICLES
   ========================================================= */

function drawParticles(){

    particles.forEach(p => {

        const shimmer =
            .65 +
            Math.sin(p.phase) * .35;


        const px =
            p.x +
            (mouseX - .5)
            * 20;


        const py =
            p.y +
            (mouseY - .5)
            * 12;


        ctx.beginPath();

        ctx.arc(
            px,
            py,
            p.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(211,110,139,${p.alpha * shimmer})`;

        ctx.fill();

    });

}



/* =========================================================
   UPDATE BURSTS
   ========================================================= */

function updateBursts(){

    for(
        let i=bursts.length-1;
        i>=0;
        i--
    ){

        const p =
            bursts[i];


        p.x +=
            p.vx;

        p.y +=
            p.vy;


        p.vx *=
            .985;

        p.vy *=
            .985;

        p.vy +=
            .006;


        p.life -=
            p.decay;


        if(
            p.life <= 0
        ){

            bursts.splice(
                i,
                1
            );

            continue;
        }


        if(
            p.type === 'heart'
        ){

            drawHeart(
                p.x,
                p.y,
                p.size,
                0,
                p.life
            );

        }else{

            drawSpark(
                p.x,
                p.y,
                p.size,
                p.life
            );

        }

    }

}



/* =========================================================
   UPDATE HEARTS
   ========================================================= */

function updateHearts(){

    for(
        let i=hearts.length-1;
        i>=0;
        i--
    ){

        const h =
            hearts[i];


        h.wobble +=
            h.wobbleSpeed;


        h.x +=
            h.vx +
            Math.sin(h.wobble)
            * .25;


        h.y +=
            h.vy;


        h.vy -=
            .002;


        h.rotation +=
            h.rotationSpeed;


        if(
            !h.explosion
        ){

            h.life -=
                .0012;

        }else{

            h.life -=
                .009;

        }


        drawHeart(
            h.x,
            h.y,
            h.size,
            h.rotation,
            h.alpha * h.life
        );


        if(
            h.y < -60 ||
            h.life <= 0
        ){

            hearts.splice(
                i,
                1
            );

        }

    }

}



/* =========================================================
   UPDATE RIPPLES
   ========================================================= */

function updateRipples(){

    for(
        let i=ripples.length-1;
        i>=0;
        i--
    ){

        const r =
            ripples[i];


        r.radius +=
            2.3;

        r.life -=
            .018;


        drawRipple(r);


        if(
            r.life <= 0
        ){

            ripples.splice(
                i,
                1
            );

        }

    }

}



/* =========================================================
   MOUSE GLOW
   ========================================================= */

function drawMouseGlow(){

    const x =
        mouseX * W;

    const y =
        mouseY * H;


    const gradient =
        ctx.createRadialGradient(
            x,
            y,
            0,
            x,
            y,
            230
        );


    gradient.addColorStop(
        0,
        'rgba(255,178,201,.12)'
    );

    gradient.addColorStop(
        .4,
        'rgba(239,139,170,.045)'
    );

    gradient.addColorStop(
        1,
        'rgba(239,139,170,0)'
    );


    ctx.fillStyle =
        gradient;

    ctx.fillRect(
        0,
        0,
        W,
        H
    );

}



/* =========================================================
   MAIN LOOP
   ========================================================= */

let lastFrame =
    performance.now();


function animate(now){

    /*
       плавно следуем за мышью
    */

    mouseX +=
        (targetMouseX - mouseX)
        * .055;

    mouseY +=
        (targetMouseY - mouseY)
        * .055;


    /*
       очистка
    */

    ctx.clearRect(
        0,
        0,
        W,
        H
    );


    /*
       фон
    */

    drawMouseGlow();

    updateParticles();

    drawParticles();


    /*
       эффекты
    */

    updateBursts();

    updateHearts();

    updateRipples();


    /*
       автоматические сердечки
    */

    automaticHearts(now);


    /*
       ограничитель безопасности
       если вдруг очень много эффектов
    */

    if(
        hearts.length > 100
    ){

        hearts.splice(
            0,
            hearts.length - 100
        );

    }


    if(
        bursts.length > 350
    ){

        bursts.splice(
            0,
            bursts.length - 350
        );

    }


    lastFrame =
        now;


    requestAnimationFrame(
        animate
    );
}


requestAnimationFrame(
    animate
);



/* =========================================================
   CLICK MAGIC
   ========================================================= */

window.addEventListener(
    'pointerdown',
    event => {

        /*
           Не взрываем всё на каждый
           клик по тексту.
        */

        magicBurst(
            isMobile ? 8 : 14,
            event.clientX,
            event.clientY
        );

    },
    {
        passive:true
    }
);



/* =========================================================
   BUTTON HOVER MAGIC
   ========================================================= */

document
    .querySelectorAll(
        '.primary,.secondary,.choice'
    )
    .forEach(element => {

        element.addEventListener(
            'pointerenter',
            event => {

                if(
                    isMobile
                )
                    return;


                magicBurst(
                    7,
                    event.clientX,
                    event.clientY
                );

            },
            {
                passive:true
            }
        );

    });



/* =========================================================
   CARD PARALLAX
   ========================================================= */

if(!isMobile){

    const cards =
        document.querySelectorAll(
            '.card'
        );


    window.addEventListener(
        'pointermove',
        event => {

            const mx =
                event.clientX /
                window.innerWidth;

            const my =
                event.clientY /
                window.innerHeight;


            cards.forEach(card => {

                /*
                   очень маленький наклон.
                   Никаких дёрганий.
                */

                const rotateY =
                    (mx - .5)
                    * 3;

                const rotateX =
                    (.5 - my)
                    * 3;


                card.style.transform =
                    `perspective(1200px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)
                     translateZ(0)`;

            });

        },
        {
            passive:true
        }
    );

}



/* =========================================================
   INITIAL ATMOSPHERE
   ========================================================= */

setTimeout(
    () => magicBurst(90),
    400
);

setTimeout(
    () => magicBurst(45),
    1500
);

setTimeout(
    () => heartExplosion(12),
    2300
);
