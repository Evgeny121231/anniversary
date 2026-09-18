const GOOGLE_SCRIPT_URL = 'anniversary_invitation_ready';

const screens = [...document.querySelectorAll('.screen')];
const choices = [...document.querySelectorAll('.choice')];
const toMessage = document.getElementById('toMessage');
const wish = document.getElementById('wish');
const nameInput = document.getElementById('name');
const count = document.getElementById('count');
const send = document.getElementById('send');
const errorBox = document.getElementById('error');
const finalChoice = document.getElementById('finalChoice');

let selectedChoice = '';

function show(id){
  screens.forEach(s => s.classList.toggle('active', s.id === id));
  window.scrollTo({top:0,behavior:'smooth'});
}

document.querySelectorAll('[data-next]').forEach(btn => {
  btn.addEventListener('click', () => show(btn.dataset.next));
});

document.querySelectorAll('[data-back]').forEach(btn => {
  btn.addEventListener('click', () => show(btn.dataset.back));
});

choices.forEach(btn => {
  btn.addEventListener('click', () => {
    choices.forEach(c => c.classList.remove('selected'));
    btn.classList.add('selected');
    selectedChoice = btn.dataset.choice;
    toMessage.classList.remove('hidden');
    burstHearts(7);
  });
});

toMessage.addEventListener('click', () => show('message'));

wish.addEventListener('input', () => count.textContent = wish.value.length);

send.addEventListener('click', async () => {
  if(!selectedChoice){
    showError('Сначала выбери вариант вечера ❤️');
    show('choice');
    return;
  }

  send.disabled = true;
  send.innerHTML = 'Отправляю твой ответ… ♥';

  const payload = {
    choice: selectedChoice,
    wish: wish.value.trim(),
    name: nameInput.value.trim()
  };

  try {
    if (typeof GOOGLE_SCRIPT_URL === 'undefined' || !GOOGLE_SCRIPT_URL) {
      throw new Error('Сайт ещё не подключён к Google Apps Script.');
    }

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {'Content-Type':'text/plain;charset=utf-8'},
      body: JSON.stringify(payload)
    });

    finalChoice.textContent = selectedChoice;
    show('success');
    burstHearts(24);
  } catch (e) {
    showError('Не получилось отправить ответ. Проверь подключение сайта к Google Apps Script.');
    send.disabled = false;
    send.innerHTML = 'Отправить мой ответ <span>♡</span>';
  }
});

function showError(text){
  errorBox.textContent = text;
  errorBox.style.display = 'block';
  setTimeout(() => errorBox.style.display = 'none', 4500);
}

function burstHearts(n){
  const box = document.getElementById('hearts');
  for(let i=0;i<n;i++){
    const el = document.createElement('div');
    el.className='float-heart';
    el.textContent = Math.random() > .25 ? '♥' : '♡';
    el.style.left = (10 + Math.random()*80) + '%';
    el.style.bottom = (8 + Math.random()*20) + '%';
    el.style.animationDelay = (Math.random()*.5) + 's';
    el.style.fontSize = (14 + Math.random()*18) + 'px';
    box.appendChild(el);
    setTimeout(()=>el.remove(),6500);
  }
}
