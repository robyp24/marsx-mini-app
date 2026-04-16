// ═══════════════════════════════════════════
//  MarsX — script.js
// ═══════════════════════════════════════════

const API_URL = 'https://humbly-petunia-customs.ngrok-free.dev'; // <-- замени на свой URL

// ── Состояние игры ──
const G = {
  tgUser: null,
  tgId: null,
  fuel: 0,
  fuelMax: 800,
  gc: 0,
  ci: 0,
  passiveIncome: 0,
  crewCount: 0,
  tapPower: 1,
  comboCount: 0,
  comboTimer: null,
  lastTap: 0,
  inFlight: false,
  currentPlanet: null,
  bonusAsteroids: 0,
};

// ── Конфиг планет ──
const PLANETS = [
  { key:'moon',       name:'Луна',          emoji:'🌙', duration:60,   reward:12,  ci:5,   risk:0.08, riskClass:'risk-low',    riskLabel:'8%',  fuelCost:50,  minCI:0    },
  { key:'mars',       name:'Марс',          emoji:'🔴', duration:120,  reward:25,  ci:15,  risk:0.34, riskClass:'risk-med',    riskLabel:'34%', fuelCost:100, minCI:0    },
  { key:'jupiter',    name:'Юпитер',        emoji:'🟠', duration:180,  reward:50,  ci:30,  risk:0.71, riskClass:'risk-high',   riskLabel:'71%', fuelCost:200, minCI:50   },
  { key:'saturn',     name:'Сатурн',        emoji:'🪐', duration:300,  reward:120, ci:60,  risk:0.85, riskClass:'risk-high',   riskLabel:'85%', fuelCost:350, minCI:150  },
  { key:'neptune',    name:'Нептун',        emoji:'🔵', duration:480,  reward:250, ci:120, risk:0.95, riskClass:'risk-high',   riskLabel:'95%', fuelCost:600, minCI:400  },
  { key:'alpha',      name:'Alpha Centauri',emoji:'⭐', duration:900,  reward:500, ci:300, risk:0.98, riskClass:'risk-legend', riskLabel:'98%', fuelCost:750, minCI:1000 },
];

const RANKS = [
  {min:0,    name:'Новобранец'},
  {min:50,   name:'Пилот'},
  {min:200,  name:'Лейтенант'},
  {min:500,  name:'Командор'},
  {min:1500, name:'Адмирал'},
  {min:5000, name:'Легенда'},
];

function getRank(ci){
  let r = RANKS[0];
  for(const rk of RANKS){ if(ci >= rk.min) r = rk; }
  return r.name;
}

// ══════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════
window.onload = () => {
  createStarsBg();
  initTelegram();
  renderPlanets();
  setInterval(passiveTick, 1000);
  setInterval(saveFuel, 10000);
};

async function saveFuel(){
  if(!G.tgId || G.fuel <= 0) return;
  await apiPost("/save_fuel", { fuel: Math.floor(G.fuel) });
}

function initTelegram(){
  if(!window.Telegram?.WebApp){
    G.tgUser = { first_name:'Тест', id:12345 };
    G.tgId = 12345;
    applyUserUI();
    loadUserData();
    return;
  }
  const tg = window.Telegram.WebApp;
  tg.expand();
  tg.setHeaderColor('#090e1a');
  tg.setBackgroundColor('#090e1a');
  G.tgUser = tg.initDataUnsafe?.user || { first_name:'Командор', id:0 };
  G.tgId = G.tgUser.id;
  applyUserUI();
  loadUserData();
}

function applyUserUI(){
  const name = G.tgUser.first_name || 'Командор';
  document.getElementById('player-name').textContent = name;
  const initials = name.slice(0,2).toUpperCase();
  document.getElementById('avatar-initials').textContent = initials;
  const refLink = `https://t.me/MarsXRocketBot?start=ref_${G.tgId}`;
  document.getElementById('ref-link-text').textContent = refLink;
}

// ══════════════════════════════════════════
//  API
// ══════════════════════════════════════════
async function apiPost(path, body){
  try{
    const r = await fetch(API_URL + path, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ telegram_id: G.tgId, ...body })
    });
    return await r.json();
  } catch(e){ console.error(path, e); return null; }
}

async function apiGet(path){
  try{
    const r = await fetch(API_URL + path + `?telegram_id=${G.tgId}`);
    return await r.json();
  } catch(e){ console.error(path, e); return null; }
}

async function loadUserData(){
  const res = await apiGet('/user_data');
  if(res?.status === 'success'){
    const d = res.data;
    G.fuel    = d.fuel ?? 0;
    G.gc      = d.gc_balance ?? 0;
    G.ci      = d.ci_score ?? 0;
    G.passiveIncome = d.passive_income_per_minute ?? 0;
    G.crewCount = d.referrals_count ?? 0;
    G.inFlight = (d.state === 'in_flight');
    updateMainUI();
  }
}

// ══════════════════════════════════════════
//  MAIN UI
// ══════════════════════════════════════════
function updateMainUI(){
  document.getElementById('stat-fuel').innerHTML = `${Math.floor(G.fuel)} <span>F</span>`;
  document.getElementById('stat-gc').innerHTML   = `${Math.floor(G.gc)} <span>GC</span>`;
  document.getElementById('stat-ci').innerHTML   = `${Math.floor(G.ci)} <span>CI</span>`;
  document.getElementById('player-rank').textContent = getRank(G.ci);

  const pct = Math.min(100, (G.fuel / G.fuelMax) * 100);
  document.getElementById('fuel-fill').style.width = pct + '%';
  document.getElementById('fuel-pct').textContent  = Math.floor(pct) + '%';

  // Crew
  document.getElementById('crew-count').textContent = G.crewCount;
  const crewBonus = Math.min(30, G.crewCount * 2);
  document.getElementById('crew-bonus-fill').style.width = (crewBonus / 30 * 100) + '%';
  document.getElementById('crew-bonus-label').textContent = `+${crewBonus}% к добыче топлива`;
}

function passiveTick(){
  if(G.passiveIncome > 0){
    G.fuel = Math.min(G.fuelMax, G.fuel + G.passiveIncome / 60);
    updateMainUI();
  }
}

// ══════════════════════════════════════════
//  TAP MECHANIC
// ══════════════════════════════════════════
document.getElementById('reactor-tap').addEventListener('click', onTap);
document.getElementById('reactor-tap').addEventListener('touchstart', e => { e.preventDefault(); onTap(e.touches[0]); }, {passive:false});

function onTap(e){
  const now = Date.now();
  if(now - G.lastTap < 300) G.comboCount++;
  else G.comboCount = 1;
  G.lastTap = now;

  clearTimeout(G.comboTimer);
  G.comboTimer = setTimeout(() => { G.comboCount = 0; }, 1500);

  let mult = 1;
  if(G.comboCount >= 10) mult = 3;
  else if(G.comboCount >= 5) mult = 2;

  const crewBonus = 1 + Math.min(30, G.crewCount * 2) / 100;
  const earned = G.tapPower * mult * crewBonus;
  G.fuel = Math.min(G.fuelMax, G.fuel + earned);

  spawnFloatNum(e, `+${earned.toFixed(1)} F`, mult >= 3 ? '#f5c518' : '#4f8ef7');
  showCombo(mult, G.comboCount);
  updateMainUI();

  // Haptic
  if(window.Telegram?.WebApp?.HapticFeedback){
    mult >= 3
      ? Telegram.WebApp.HapticFeedback.notificationOccurred('success')
      : Telegram.WebApp.HapticFeedback.impactOccurred('light');
  }
}

function showCombo(mult, count){
  const el = document.getElementById('combo-display');
  if(mult >= 2){
    el.textContent = mult >= 3 ? `×3 COMBO!` : `×2 COMBO`;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 900);
  }
}

function spawnFloatNum(e, text, color){
  const el = document.createElement('div');
  el.className = 'float-num';
  el.style.color = color;
  el.style.left = (e.clientX || window.innerWidth/2) - 20 + 'px';
  el.style.top  = (e.clientY || window.innerHeight/2) - 20 + 'px';
  el.textContent = text;
  document.body.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}

// ══════════════════════════════════════════
//  PLANET LIST
// ══════════════════════════════════════════
function renderPlanets(){
  const list = document.getElementById('planets-list');
  list.innerHTML = '';
  PLANETS.forEach(p => {
    const locked = G.ci < p.minCI;
    const div = document.createElement('div');
    div.className = `planet-item ${locked ? 'locked' : ''}`;
    div.innerHTML = `
      <div class="planet-emoji">${p.emoji}</div>
      <div class="planet-info">
        <div class="planet-name">${p.name}</div>
        <div class="planet-stats">
          <div class="pstat">⏱ ${p.duration < 60 ? p.duration+'с' : p.duration/60+'м'}</div>
          <div class="pstat">💰 ${p.reward} GC</div>
          <div class="pstat">⬆️ +${p.ci} CI</div>
        </div>
        <div class="fuel-cost">${locked ? '🔒 CI ' + p.minCI : '⛽ ' + p.fuelCost + ' F'}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
        <span class="risk-pill ${p.riskClass}">риск ${p.riskLabel}</span>
        <span class="planet-arrow">${locked ? '🔒' : '›'}</span>
      </div>`;
    if(!locked) div.onclick = () => launchFlight(p);
    list.appendChild(div);
  });
}

// ══════════════════════════════════════════
//  FLIGHT
// ══════════════════════════════════════════
let flightInterval = null;
let flightCanvas, flightCtx;
let stars = [], particles = [], asteroids = [];
let shipX, shipY, frame = 0;

async function launchFlight(planet){
  if(G.inFlight){
    alert('Вы уже в полёте!'); return;
  }
  if(G.fuel < planet.fuelCost){
    alert(`Недостаточно топлива! Нужно ${planet.fuelCost} F`); return;
  }

  await saveFuel();

  const res = await apiPost('/start_flight', { planet_key: planet.key });
  if(res && res.status !== 'success'){
    alert(res.message || 'Ошибка запуска'); return;
  }

  G.fuel -= planet.fuelCost;
  G.inFlight = true;
  G.currentPlanet = planet;
  G.bonusAsteroids = 0;

  showScreen('flight-screen');
  startFlightAnimation(planet);
}

function startFlightAnimation(planet){
  flightCanvas = document.getElementById('flight-canvas');
  flightCanvas.width  = window.innerWidth;
  flightCanvas.height = window.innerHeight;
  flightCtx = flightCanvas.getContext('2d');

  shipX = flightCanvas.width / 2;
  shipY = flightCanvas.height * 0.55;
  stars = [];
  asteroids = [];
  frame = 0;

  for(let i=0; i<200; i++){
    stars.push({
      x: Math.random() * flightCanvas.width,
      y: Math.random() * flightCanvas.height,
      r: Math.random() * 1.5 + .3,
      speed: Math.random() * 6 + 2,
      opacity: Math.random()
    });
  }

  document.getElementById('flight-dest').textContent = `→ ${planet.name} ${planet.emoji}`;

  let timeLeft = planet.duration;
  updateFlightTimer(timeLeft);

  clearInterval(flightInterval);
  flightInterval = setInterval(() => {
    timeLeft--;
    updateFlightTimer(timeLeft);
    if(timeLeft % 8 === 0 && timeLeft > 5) spawnFlightEvent();
    if(timeLeft % 12 === 0) spawnAsteroid();
    if(timeLeft <= 0){
      clearInterval(flightInterval);
      cancelAnimationFrame(flightAnimFrame);
      finalizeFlight(planet);
    }
  }, 1000);

  animateFlight();
}

let flightAnimFrame;
function animateFlight(){
  const c = flightCtx;
  const W = flightCanvas.width, H = flightCanvas.height;
  frame++;

  c.fillStyle = '#000010';
  c.fillRect(0,0,W,H);

  // Nebula bg glow
  const grad = c.createRadialGradient(W/2, H/2, 0, W/2, H/2, H*0.7);
  grad.addColorStop(0, 'rgba(15,30,80,.4)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = grad;
  c.fillRect(0,0,W,H);

  // Stars (hyperspace streaks)
  for(const s of stars){
    s.y += s.speed;
    if(s.y > H){ s.y = 0; s.x = Math.random()*W; }
    const len = s.speed * 3;
    c.beginPath();
    c.moveTo(s.x, s.y);
    c.lineTo(s.x, s.y - len);
    c.strokeStyle = `rgba(255,255,255,${s.opacity})`;
    c.lineWidth = s.r;
    c.stroke();
  }

  // Ship
  drawShip(c, shipX, shipY);

  // Engine glow trail
  const trailGrad = c.createRadialGradient(shipX, shipY+28, 0, shipX, shipY+28, 40);
  trailGrad.addColorStop(0, 'rgba(79,142,247,.8)');
  trailGrad.addColorStop(.5,'rgba(124,92,252,.3)');
  trailGrad.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = trailGrad;
  c.beginPath();
  c.ellipse(shipX, shipY+35, 12, 30+Math.sin(frame*.15)*6, 0, 0, Math.PI*2);
  c.fill();

  flightAnimFrame = requestAnimationFrame(animateFlight);
}

function drawShip(c, x, y){
  // Body
  c.save();
  c.translate(x, y);

  // Main hull
  c.beginPath();
  c.moveTo(0,-28);
  c.lineTo(12,10);
  c.lineTo(8,18);
  c.lineTo(-8,18);
  c.lineTo(-12,10);
  c.closePath();
  c.fillStyle = '#b0c4de';
  c.fill();
  c.strokeStyle = '#7a9cbf';
  c.lineWidth = 1;
  c.stroke();

  // Cockpit window
  c.beginPath();
  c.ellipse(0,-10,5,7,0,0,Math.PI*2);
  c.fillStyle = 'rgba(100,180,255,.7)';
  c.fill();

  // Left wing
  c.beginPath();
  c.moveTo(-10,8);
  c.lineTo(-24,18);
  c.lineTo(-18,22);
  c.lineTo(-8,16);
  c.closePath();
  c.fillStyle = '#8a9fbc';
  c.fill();
  c.strokeStyle='#6a7f9c';c.lineWidth=.8;c.stroke();

  // Right wing
  c.beginPath();
  c.moveTo(10,8);
  c.lineTo(24,18);
  c.lineTo(18,22);
  c.lineTo(8,16);
  c.closePath();
  c.fillStyle = '#8a9fbc';
  c.fill();
  c.strokeStyle='#6a7f9c';c.lineWidth=.8;c.stroke();

  // Engine nozzle
  c.beginPath();
  c.moveTo(-6,18);
  c.lineTo(-5,26);
  c.lineTo(5,26);
  c.lineTo(6,18);
  c.fillStyle='#4a6080';
  c.fill();

  c.restore();
}

function updateFlightTimer(s){
  const m = Math.floor(s/60);
  const sec = s%60;
  document.getElementById('flight-timer').textContent =
    `${m}:${sec.toString().padStart(2,'0')}`;
}

const EVENT_MSGS = [
  {text:'Метеоритный поток — уклонение!', type:'bad'},
  {text:'Аномалия пространства — ускоряемся!', type:''},
  {text:'Сигнал неизвестного происхождения...', type:''},
  {text:'Двигатели в норме. Курс стабилен.', type:'good'},
  {text:'Обнаружен фрагмент спутника!', type:'good'},
  {text:'Солнечный ветер — попутный курс.', type:'good'},
  {text:'Ионный шторм по левому борту!', type:'bad'},
];

function spawnFlightEvent(){
  const ev = EVENT_MSGS[Math.floor(Math.random()*EVENT_MSGS.length)];
  const log = document.getElementById('flight-events');
  const msg = document.createElement('div');
  msg.className = `event-msg ${ev.type}`;
  msg.textContent = ev.text;
  log.appendChild(msg);
  while(log.children.length > 4) log.removeChild(log.firstChild);
}

function spawnAsteroid(){
  const el = document.createElement('div');
  el.className = 'asteroid-target';
  const side = Math.random() > .5 ? 1 : -1;
  const startX = 20 + Math.random() * (window.innerWidth - 80);
  const startY = 80 + Math.random() * (window.innerHeight * .3);
  const dx = side * (40 + Math.random()*60);
  const dy = 60 + Math.random()*80;
  el.style.left = startX + 'px';
  el.style.top  = startY + 'px';
  el.style.setProperty('--dx', dx+'px');
  el.style.setProperty('--dy', dy+'px');
  el.style.setProperty('--dur', (2+Math.random()*2)+'s');
  el.textContent = '☄️';
  el.onclick = () => {
    G.bonusAsteroids++;
    spawnFloatNum({clientX: startX+26, clientY: startY}, '+5 F', '#f5c518');
    G.fuel = Math.min(G.fuelMax, G.fuel + 5);
    if(window.Telegram?.WebApp?.HapticFeedback)
      Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    el.style.animation='none';
    el.style.opacity='0';
    setTimeout(()=>el.remove(),200);
  };
  document.getElementById('flight-screen').appendChild(el);
  el.addEventListener('animationend', ()=>el.remove());
}

async function finalizeFlight(planet){
  cancelAnimationFrame(flightAnimFrame);

  const success = Math.random() > planet.risk;
  G.inFlight = false;

  // Update server
  if(success){
    G.gc += planet.reward;
    G.ci += planet.ci;
    G.fuel += G.bonusAsteroids * 5;
  }

  // Show arrival
  showScreen('arrival-screen');
  document.getElementById('arrival-emoji').textContent = planet.emoji;

  if(success){
    document.getElementById('arrival-title').textContent = 'Успешная экспедиция!';
    document.getElementById('arrival-subtitle').textContent = `Добыча на ${planet.name} завершена`;
    document.getElementById('rewards-box').innerHTML = `
      <div class="reward-row">
        <span class="reward-label">Получено GC</span>
        <span class="reward-val">+${planet.reward} GC</span>
      </div>
      <div class="reward-row">
        <span class="reward-label">Рейтинг CI</span>
        <span class="reward-val green">+${planet.ci} CI</span>
      </div>
      <div class="reward-row">
        <span class="reward-label">Астероидов сбито</span>
        <span class="reward-val" style="color:#b39dfa">${G.bonusAsteroids}</span>
      </div>`;
  } else {
    document.getElementById('arrival-title').innerHTML = '<span class="result-fail">Крушение!</span>';
    document.getElementById('arrival-subtitle').textContent = `Корабль потерян у ${planet.name}`;
    document.getElementById('rewards-box').innerHTML = `
      <div class="reward-row">
        <span class="reward-label">Исход</span>
        <span class="reward-val" style="color:#e74c3c">Провал</span>
      </div>
      <div class="reward-row">
        <span class="reward-label">Астероидов сбито</span>
        <span class="reward-val" style="color:#b39dfa">${G.bonusAsteroids} (+${G.bonusAsteroids*5} F)</span>
      </div>
      <div class="reward-row">
        <span class="reward-label" style="font-size:11px;color:#6b7db3">Улучши щиты чтобы снизить риск</span>
        <span></span>
      </div>`;
  }

  updateMainUI();
  renderPlanets();
  // Sync with server
  await apiPost('/finalize_flight', { success, planet_key: planet.key, bonus_fuel: G.bonusAsteroids * 5 });
}

// ══════════════════════════════════════════
//  LEADERBOARD
// ══════════════════════════════════════════
async function showLeague(){
  showScreen('league-screen');
  const list = document.getElementById('lb-list');
  list.innerHTML = '<div style="text-align:center;padding:40px;color:#6b7db3">Загрузка...</div>';

  const res = await apiGet('/leaderboard');
  list.innerHTML = '';

  if(!res || res.status !== 'success'){
    list.innerHTML = '<div style="text-align:center;padding:40px;color:#6b7db3">Ошибка загрузки</div>';
    return;
  }

  const players = res.top_by_gc || [];
  players.forEach((p,i) => {
    const isMe = p.telegram_id === G.tgId;
    const rankClass = i===0?'gold':i===1?'silver':i===2?'bronze':'';
    const div = document.createElement('div');
    div.className = `lb-item ${isMe?'me':''}`;
    div.innerHTML = `
      <div class="lb-rank ${rankClass}">${i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1}</div>
      <div class="lb-avatar">${(p.first_name||'?').slice(0,2).toUpperCase()}</div>
      <div class="lb-name">${p.first_name || 'Командор'}${isMe?' (ты)':''}</div>
      <div class="lb-score">${Math.floor(p.gc_balance||0)} GC</div>`;
    list.appendChild(div);
  });
}

// ══════════════════════════════════════════
//  REFERRALS
// ══════════════════════════════════════════
function copyRef(){
  const link = document.getElementById('ref-link-text').textContent;
  navigator.clipboard.writeText(link).then(()=>{
    if(window.Telegram?.WebApp) Telegram.WebApp.showAlert('Ссылка скопирована!');
    else alert('Скопировано!');
  });
}

function shareRef(){
  const link = document.getElementById('ref-link-text').textContent;
  const text = `Строю межзвёздную колонию в MarsX! Присоединяйся в мой экипаж 🚀\n${link}`;
  if(window.Telegram?.WebApp){
    Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent('Строю межзвёздную колонию в MarsX! Присоединяйся 🚀')}`);
  } else {
    navigator.clipboard.writeText(text);
  }
}

// ══════════════════════════════════════════
//  NAVIGATION
// ══════════════════════════════════════════
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function showMain(){
  if(flightInterval){ clearInterval(flightInterval); flightInterval = null; }
  cancelAnimationFrame(flightAnimFrame);
  document.querySelectorAll('.asteroid-target').forEach(a=>a.remove());
  showScreen('main-screen');
  updateMainUI();
  renderPlanets();
}

// ══════════════════════════════════════════
//  STARS BACKGROUND
// ══════════════════════════════════════════
function createStarsBg(){
  const bg = document.getElementById('stars-bg');
  for(let i=0; i<120; i++){
    const s = document.createElement('div');
    s.className = 'star-dot';
    const size = Math.random()*2+.5;
    s.style.cssText = `
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      width:${size}px;
      height:${size}px;
      opacity:${Math.random()*.5+.1};
      --d:${2+Math.random()*4}s;
      animation-delay:${Math.random()*3}s;
    `;
    bg.appendChild(s);
  }
}
