// ═══════════════════════════════════════════
//  MarsX — script.js v2
// ═══════════════════════════════════════════

const API_URL = 'https://humbly-petunia-customs.ngrok-free.dev';
const BOT_USERNAME = 'MarsXRocketBot';

// ── Состояние ──
const G = {
  tgUser: null, tgId: null,
  fuel: 0, fuelMax: 800, gc: 0, ci: 0,
  passiveIncome: 0, crewCount: 0,
  tapPower: 1, comboCount: 0, comboTimer: null, lastTap: 0,
  inFlight: false, currentPlanet: null, bonusObjCount: 0,
  inventory: {},   // { shield:2, engine_boost:1, ... }
  miners: {},      // { moon: { level:1, stored:45, last_collected: ts }, ... }
  shopTab: 'boosters',
};

// ── Планеты ──
const PLANETS = [
  { key:'moon',    name:'Луна',          emoji:'🌙', duration:60,   reward:12,  ci:5,   risk:0.08, riskClass:'risk-low',    riskLabel:'8%',  fuelCost:50,  minCI:0,    resource:'Гелий-3',    resEmoji:'🔵' },
  { key:'mars',    name:'Марс',          emoji:'🔴', duration:120,  reward:25,  ci:15,  risk:0.34, riskClass:'risk-med',    riskLabel:'34%', fuelCost:100, minCI:0,    resource:'Железо',     resEmoji:'🟤' },
  { key:'jupiter', name:'Юпитер',        emoji:'🟠', duration:180,  reward:50,  ci:30,  risk:0.71, riskClass:'risk-high',   riskLabel:'71%', fuelCost:200, minCI:50,   resource:'Антиматерия',resEmoji:'⚡' },
  { key:'saturn',  name:'Сатурн',        emoji:'🪐', duration:300,  reward:120, ci:60,  risk:0.85, riskClass:'risk-high',   riskLabel:'85%', fuelCost:350, minCI:150,  resource:'Кристаллы',  resEmoji:'💎' },
  { key:'neptune', name:'Нептун',        emoji:'🔵', duration:480,  reward:250, ci:120, risk:0.95, riskClass:'risk-high',   riskLabel:'95%', fuelCost:600, minCI:400,  resource:'Нейтрониум', resEmoji:'🌀' },
  { key:'alpha',   name:'Alpha Centauri',emoji:'⭐', duration:900,  reward:500, ci:300, risk:0.98, riskClass:'risk-legend', riskLabel:'98%', fuelCost:750, minCI:1000, resource:'Тёмная материя',resEmoji:'🌑' },
];

// ── Магазин ──
const SHOP = {
  boosters: [
    { id:'fuel_boost',   name:'Топливный буст',     emoji:'⛽', desc:'×2 добыча топлива на 30 минут',         price:200,  currency:'gc',   effect:'fuel_x2_30m' },
    { id:'shield',       name:'Щит',                emoji:'🛡', desc:'Защита от одной потери груза в полёте', price:150,  currency:'gc',   effect:'shield',     stackable:true },
    { id:'combo_boost',  name:'Комбо-усилитель',    emoji:'⚡', desc:'×3 комбо начинается с 3 тапов (1 час)', price:300,  currency:'gc',   effect:'combo_boost' },
    { id:'instant_fuel', name:'Мгновенное топливо', emoji:'💧', desc:'Заполняет топливо до 100% прямо сейчас',price:500,  currency:'gc',   effect:'instant_fuel' },
  ],
  parts: [
    { id:'engine_1',   name:'Двигатель Mk.II',   emoji:'🔧', desc:'+20% скорость всех полётов',         price:800,  currency:'gc',   effect:'engine_1',  unique:true },
    { id:'engine_2',   name:'Двигатель Mk.III',  emoji:'🚀', desc:'+50% скорость полётов, −10% риск',   price:2500, currency:'gc',   effect:'engine_2',  unique:true, requires:'engine_1' },
    { id:'tank_ext',   name:'Доп. топливный бак',emoji:'🛢', desc:'Лимит топлива: 800 → 1200 F',        price:1200, currency:'gc',   effect:'tank_ext',  unique:true },
    { id:'scanner',    name:'Сканер объектов',   emoji:'📡', desc:'Вдвое больше объектов в полёте',     price:600,  currency:'gc',   effect:'scanner',   unique:true },
    { id:'droid',      name:'Майнинг-дроид',     emoji:'🤖', desc:'Авто-тапает реактор раз в 5 сек',   price:1500, currency:'gc',   effect:'droid',     unique:true },
  ],
  weapons: [
    { id:'blaster_1',  name:'Бластер Mk.I',      emoji:'🔫', desc:'+10 F за каждый сбитый объект в полёте', price:400,  currency:'gc',   effect:'blaster_1', unique:true },
    { id:'blaster_2',  name:'Бластер Mk.II',     emoji:'💥', desc:'+25 F за объект, шанс двойного дропа',   price:1800, currency:'gc',   effect:'blaster_2', unique:true, requires:'blaster_1' },
    { id:'emp',        name:'ЭМИ-пушка',         emoji:'⚡', desc:'Уничтожает все объекты на экране',       price:3000, currency:'gc',   effect:'emp',       unique:true },
    { id:'auto_turret',name:'Авто-турель',        emoji:'🎯', desc:'Авто-стреляет по астероидам без тапа',   price:5000, currency:'gc',   effect:'auto_turret',unique:true },
  ],
  vip: [
    { id:'vip_1month', name:'VIP Командор (1 мес)',emoji:'👑', desc:'+30% добыча, 2 слота полётов, без рекламы', price:299,  currency:'stars', effect:'vip' },
    { id:'vip_3month', name:'VIP Командор (3 мес)',emoji:'💎', desc:'Всё то же + эксклюзивный корабль',          price:699,  currency:'stars', effect:'vip3' },
    { id:'gc_pack_1',  name:'1000 GC',            emoji:'💰', desc:'Пак галактических кредитов',               price:99,   currency:'stars', effect:'gc_1000' },
    { id:'gc_pack_2',  name:'5000 GC + бонус 20%',emoji:'💎', desc:'Выгодный пак с бонусом',                   price:399,  currency:'stars', effect:'gc_5000' },
  ],
};

const MINER_COSTS    = { 0:300, 1:800, 2:2000, 3:5000 };
const MINER_RATE_PER_MIN = { 1:2, 2:5, 3:12 };
const MINER_CAPACITY = { 1:200, 2:500, 3:1200 };

const RANKS = [
  {min:0,name:'Новобранец'},{min:50,name:'Пилот'},{min:200,name:'Лейтенант'},
  {min:500,name:'Командор'},{min:1500,name:'Адмирал'},{min:5000,name:'Легенда'},
];
function getRank(ci){ let r=RANKS[0]; for(const k of RANKS) if(ci>=k.min) r=k; return r.name; }

// ══════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════
window.onload = () => {
  createStarsBg();
  initTapCanvas();
  initTelegram();
  renderPlanets();
  setInterval(passiveTick, 1000);
  setInterval(saveFuel, 10000);
  setInterval(minerTick, 60000);
};

function initTelegram(){
  if(!window.Telegram?.WebApp){
    G.tgUser = {first_name:'Тест',id:12345};
    G.tgId = 12345;
    applyUserUI(); loadUserData(); return;
  }
  const tg = window.Telegram.WebApp;
  tg.expand();
  tg.setHeaderColor('#07091a');
  tg.setBackgroundColor('#07091a');
  G.tgUser = tg.initDataUnsafe?.user || {first_name:'Командор',id:0};
  G.tgId = G.tgUser.id;
  applyUserUI();
  loadUserData();
}

function applyUserUI(){
  const name = G.tgUser.first_name || 'Командор';
  document.getElementById('player-name').textContent = name;
  document.getElementById('avatar-initials').textContent = name.slice(0,2).toUpperCase();
  document.getElementById('ref-link-text').textContent = `https://t.me/${BOT_USERNAME}?start=ref_${G.tgId}`;
}

// ══════════════════════════════════════════
//  API
// ══════════════════════════════════════════
async function apiPost(path, body={}){
  try{
    const r = await fetch(API_URL+path, {
      method:'POST',
      headers:{'Content-Type':'application/json','ngrok-skip-browser-warning':'true'},
      body: JSON.stringify({telegram_id:G.tgId,...body})
    });
    return await r.json();
  } catch(e){ console.error(path,e); return null; }
}
async function apiGet(path){
  try{
    const r = await fetch(`${API_URL}${path}?telegram_id=${G.tgId}`,
      {headers:{'ngrok-skip-browser-warning':'true'}});
    return await r.json();
  } catch(e){ console.error(path,e); return null; }
}

async function loadUserData(){
  const res = await apiGet('/user_data');
  if(res?.status==='success'){
    const d = res.data;
    G.fuel    = d.fuel ?? 0;
    G.fuelMax = d.fuel_max ?? 800;
    G.gc      = d.gc_balance ?? 0;
    G.ci      = d.ci_score ?? 0;
    G.passiveIncome = d.passive_income_per_minute ?? 0;
    G.crewCount = d.referrals_count ?? 0;
    G.inventory = d.inventory ?? {};
    G.miners    = d.miners ?? {};
    G.inFlight  = (d.state === 'in_flight');
    updateMainUI();
  }
}

async function saveFuel(){
  if(!G.tgId || G.fuel<=0) return;
  await apiPost('/save_fuel', {fuel: Math.floor(G.fuel)});
}

// ══════════════════════════════════════════
//  TAP CANVAS — анимированная планета
// ══════════════════════════════════════════
let tapCtx, tapFrame=0, tapAnimId;
const TAP_PARTICLES = [];

function initTapCanvas(){
  const c = document.getElementById('tap-canvas');
  tapCtx = c.getContext('2d');
  c.addEventListener('click', onTap);
  c.addEventListener('touchstart', e=>{e.preventDefault(); onTap(e.touches[0]);}, {passive:false});
  animateTapCanvas();
}

function animateTapCanvas(){
  const c = tapCtx.canvas, W=c.width, H=c.height, cx=W/2, cy=H/2;
  tapFrame++;
  tapCtx.clearRect(0,0,W,H);

  // Outer glow ring
  const wobble = Math.sin(tapFrame*.04)*4;
  const grd = tapCtx.createRadialGradient(cx,cy,80+wobble,cx,cy,130);
  grd.addColorStop(0,'rgba(79,142,247,.18)');
  grd.addColorStop(1,'rgba(79,142,247,0)');
  tapCtx.beginPath();
  tapCtx.arc(cx,cy,130,0,Math.PI*2);
  tapCtx.fillStyle=grd; tapCtx.fill();

  // Orbit rings
  for(let i=0;i<3;i++){
    const r=90+i*12, speed=(i%2===0?.003:-.002)*(i+1);
    tapCtx.beginPath();
    tapCtx.ellipse(cx,cy,r,r*.3, tapFrame*speed,0,Math.PI*2);
    tapCtx.strokeStyle=`rgba(79,142,247,${.08+i*.04})`;
    tapCtx.lineWidth=1; tapCtx.stroke();

    // Satellite on ring
    const angle = tapFrame*speed*2+i*2.1;
    const sx = cx + r*Math.cos(angle);
    const sy = cy + r*.3*Math.sin(angle);
    tapCtx.beginPath();
    tapCtx.arc(sx,sy,2.5,0,Math.PI*2);
    tapCtx.fillStyle='rgba(79,142,247,.6)'; tapCtx.fill();
  }

  // Planet body
  const planetGrd = tapCtx.createRadialGradient(cx-18,cy-18,8,cx,cy,72);
  planetGrd.addColorStop(0,'#2a4a9e');
  planetGrd.addColorStop(.4,'#1a2f6e');
  planetGrd.addColorStop(.75,'#0f1d4a');
  planetGrd.addColorStop(1,'#060c20');
  tapCtx.beginPath();
  tapCtx.arc(cx,cy,72,0,Math.PI*2);
  tapCtx.fillStyle=planetGrd; tapCtx.fill();

  // Surface detail — continents
  tapCtx.save();
  tapCtx.beginPath();
  tapCtx.arc(cx,cy,72,0,Math.PI*2);
  tapCtx.clip();
  const shift = (tapFrame*.3)%360;
  tapCtx.fillStyle='rgba(46,90,180,.25)';
  tapCtx.beginPath(); tapCtx.ellipse(cx-20+shift*.1,cy-10,28,18,-.3,0,Math.PI*2); tapCtx.fill();
  tapCtx.fillStyle='rgba(46,160,100,.18)';
  tapCtx.beginPath(); tapCtx.ellipse(cx+15+shift*.05,cy+20,20,14,.4,0,Math.PI*2); tapCtx.fill();
  tapCtx.fillStyle='rgba(200,160,80,.12)';
  tapCtx.beginPath(); tapCtx.ellipse(cx-5,cy+5,12,8,1,0,Math.PI*2); tapCtx.fill();
  tapCtx.restore();

  // Planet edge highlight
  tapCtx.beginPath();
  tapCtx.arc(cx,cy,72,0,Math.PI*2);
  tapCtx.strokeStyle='rgba(79,142,247,.35)';
  tapCtx.lineWidth=2; tapCtx.stroke();

  // Atmosphere glow
  const atmGrd = tapCtx.createRadialGradient(cx,cy,70,cx,cy,82);
  atmGrd.addColorStop(0,'rgba(79,142,247,.22)');
  atmGrd.addColorStop(1,'rgba(79,142,247,0)');
  tapCtx.beginPath(); tapCtx.arc(cx,cy,82,0,Math.PI*2);
  tapCtx.fillStyle=atmGrd; tapCtx.fill();

  // City lights on dark side
  tapCtx.save();
  tapCtx.beginPath(); tapCtx.arc(cx,cy,72,0,Math.PI*2); tapCtx.clip();
  for(let i=0;i<8;i++){
    const bx=cx+30+Math.cos(i*1.3+tapFrame*.01)*20;
    const by=cy+Math.sin(i*1.7+tapFrame*.008)*25;
    const alpha=(.3+Math.sin(tapFrame*.1+i)*.2);
    tapCtx.beginPath(); tapCtx.arc(bx,by,1.2,0,Math.PI*2);
    tapCtx.fillStyle=`rgba(255,220,80,${alpha})`; tapCtx.fill();
  }
  tapCtx.restore();

  // Tap particles
  for(let i=TAP_PARTICLES.length-1;i>=0;i--){
    const p=TAP_PARTICLES[i];
    p.x+=p.vx; p.y+=p.vy; p.vy-=.15; p.life-=.025;
    if(p.life<=0){TAP_PARTICLES.splice(i,1);continue;}
    tapCtx.beginPath(); tapCtx.arc(p.x,p.y,p.r*p.life,0,Math.PI*2);
    tapCtx.fillStyle=`rgba(${p.color},${p.life})`; tapCtx.fill();
  }

  tapAnimId = requestAnimationFrame(animateTapCanvas);
}

function spawnTapParticles(ex,ey){
  const c=document.getElementById('tap-canvas');
  const rect=c.getBoundingClientRect();
  const scale=c.width/rect.width;
  const lx=(ex-rect.left)*scale, ly=(ey-rect.top)*scale;
  const colors=['79,142,247','124,92,252','245,197,24','46,204,113'];
  for(let i=0;i<12;i++){
    const angle=Math.random()*Math.PI*2;
    const speed=2+Math.random()*4;
    TAP_PARTICLES.push({
      x:lx, y:ly, vx:Math.cos(angle)*speed, vy:Math.sin(angle)*speed-2,
      r:2+Math.random()*3, life:1,
      color:colors[Math.floor(Math.random()*colors.length)]
    });
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
  const pct = Math.min(100,(G.fuel/G.fuelMax)*100);
  document.getElementById('fuel-fill').style.width = pct+'%';
  document.getElementById('fuel-pct').textContent  = Math.floor(pct)+'%';
  const crew = G.crewCount;
  document.getElementById('crew-count').textContent = crew;
  const bonus = Math.min(30,crew*2);
  document.getElementById('crew-bonus-fill').style.width = (bonus/30*100)+'%';
  document.getElementById('crew-bonus-label').textContent = `+${bonus}% к добыче топлива`;
  const refLink = `https://t.me/${BOT_USERNAME}?start=ref_${G.tgId}`;
  document.getElementById('ref-link-text').textContent = refLink;
}

function passiveTick(){
  if(G.passiveIncome>0){
    G.fuel=Math.min(G.fuelMax, G.fuel+G.passiveIncome/60);
    updateMainUI();
  }
  // Дроид авто-тап
  if(G.inventory.droid && tapFrame%300===0) doTap(null);
}

function minerTick(){
  // Локальное накопление майнеров раз в минуту
  for(const key of Object.keys(G.miners)){
    const m = G.miners[key];
    if(!m || m.level<1) continue;
    const rate = MINER_RATE_PER_MIN[m.level] || 2;
    const cap  = MINER_CAPACITY[m.level] || 200;
    m.stored = Math.min(cap, (m.stored||0) + rate);
  }
}

// ══════════════════════════════════════════
//  TAP MECHANIC
// ══════════════════════════════════════════
function onTap(e){
  doTap(e);
  spawnTapParticles(
    e?.clientX ?? window.innerWidth/2,
    e?.clientY ?? window.innerHeight/2
  );
}

function doTap(e){
  const now = Date.now();
  const comboThresh = G.inventory.combo_boost ? 3 : 5;
  if(now - G.lastTap < 400) G.comboCount++;
  else G.comboCount = 1;
  G.lastTap = now;
  clearTimeout(G.comboTimer);
  G.comboTimer = setTimeout(()=>G.comboCount=0, 1500);

  let mult = 1;
  if(G.comboCount >= comboThresh*2) mult = 3;
  else if(G.comboCount >= comboThresh) mult = 2;

  const fuelBuf = G.inventory.fuel_x2_30m ? 2 : 1;
  const crewBonus = 1 + Math.min(30,G.crewCount*2)/100;
  const blasterBonus = G.inventory.blaster_1 ? 1.1 : 1;
  const earned = G.tapPower * mult * fuelBuf * crewBonus * blasterBonus;

  G.fuel = Math.min(G.fuelMax, G.fuel + earned);

  if(e) spawnFloatNum(e, `+${earned.toFixed(1)}F`, mult>=3?'#f5c518':'#4f8ef7');
  showCombo(mult, G.comboCount);
  updateMainUI();

  if(window.Telegram?.WebApp?.HapticFeedback)
    mult>=3
      ? Telegram.WebApp.HapticFeedback.notificationOccurred('success')
      : Telegram.WebApp.HapticFeedback.impactOccurred('light');
}

function showCombo(mult, count){
  const el = document.getElementById('combo-display');
  if(mult>=2){
    el.textContent = mult>=3?'×3 MEGA!':'×2 COMBO';
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(()=>el.classList.remove('show'), 900);
  }
}

function spawnFloatNum(e,text,color){
  const el = document.createElement('div');
  el.className = 'float-num';
  el.style.cssText=`color:${color};left:${(e.clientX||window.innerWidth/2)-20}px;top:${(e.clientY||window.innerHeight/2)-20}px;text-shadow:0 0 12px ${color}80`;
  el.textContent = text;
  document.body.appendChild(el);
  el.addEventListener('animationend',()=>el.remove());
}

// ══════════════════════════════════════════
//  PLANETS
// ══════════════════════════════════════════
function renderPlanets(){
  const list = document.getElementById('planets-list');
  list.innerHTML = '';
  PLANETS.forEach(p=>{
    const locked = G.ci < p.minCI;
    const hasMiner = G.miners[p.key]?.level >= 1;
    const div = document.createElement('div');
    div.className = `planet-item ${locked?'locked':''}`;
    div.innerHTML = `
      <div class="planet-emoji">${p.emoji}</div>
      <div class="planet-info">
        <div class="planet-name">${p.name}</div>
        <div class="planet-stats">
          <span>⏱ ${p.duration<60?p.duration+'с':p.duration/60+'м'}</span>
          <span>💰 ${p.reward} GC</span>
          <span>⬆️ +${p.ci} CI</span>
        </div>
        <div class="fuel-cost">${locked?'🔒 CI '+p.minCI:'⛽ '+p.fuelCost+' F'}</div>
        ${hasMiner?`<div class="miner-badge">⛏ Майнер ур.${G.miners[p.key].level} — ${p.resEmoji} ${p.resource}</div>`:''}
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
        <span class="risk-pill ${p.riskClass}">риск ${p.riskLabel}</span>
        <span style="font-size:18px;color:var(--muted)">${locked?'🔒':'›'}</span>
      </div>`;
    if(!locked) div.onclick = ()=>launchFlight(p);
    list.appendChild(div);
  });
}

// ══════════════════════════════════════════
//  FLIGHT — улучшенная анимация
// ══════════════════════════════════════════
let flightInterval=null, flightCtx=null, flightAnimId=null;
let fStars=[], fNebulas=[], fShipTrail=[];
let fShipX, fShipY, fFrame=0, fPhase='warp';

async function launchFlight(planet){
  if(G.inFlight){ showToast('Вы уже в полёте!'); return; }
  if(G.fuel < planet.fuelCost){ showToast(`Нужно ${planet.fuelCost} F топлива`); return; }

  const res = await apiPost('/start_flight',{planet_key:planet.key, current_fuel:Math.floor(G.fuel)});
  if(res && res.status!=='success'){ showToast(res.message||'Ошибка запуска'); return; }

  G.fuel -= planet.fuelCost;
  G.inFlight = true;
  G.currentPlanet = planet;
  G.bonusObjCount = 0;

  showScreen('flight-screen');
  startFlightAnim(planet);
}

function startFlightAnim(planet){
  const canvas = document.getElementById('flight-canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  flightCtx = canvas.getContext('2d');
  fShipX = canvas.width/2;
  fShipY = canvas.height*0.52;
  fFrame = 0; fPhase = 'warp';
  fStars=[]; fNebulas=[]; fShipTrail=[];

  // Init stars
  for(let i=0;i<300;i++) fStars.push(newStar(canvas.width, canvas.height));

  // Nebula clouds
  for(let i=0;i<5;i++) fNebulas.push({
    x:Math.random()*canvas.width, y:Math.random()*canvas.height,
    r:80+Math.random()*120, color:i%2===0?'79,89,200':'120,60,180',
    opacity:0.03+Math.random()*0.04
  });

  document.getElementById('flight-dest').textContent = `→ ${planet.name} ${planet.emoji}`;
  let timeLeft = planet.duration;
  updateFlightTimer(timeLeft);

  clearInterval(flightInterval);
  flightInterval = setInterval(()=>{
    timeLeft--;
    updateFlightTimer(timeLeft);
    if(timeLeft === Math.floor(planet.duration*0.8)) fPhase='cruise';
    if(timeLeft === Math.floor(planet.duration*0.15)) fPhase='approach';
    if(timeLeft % 7===0 && timeLeft>4) spawnFlightEvent();
    if(timeLeft % 10===0) spawnSpaceObj(canvas);
    if(G.inventory.auto_turret && timeLeft%3===0) autoShootObjects();
    if(timeLeft<=0){
      clearInterval(flightInterval);
      cancelAnimationFrame(flightAnimId);
      finalizeFlight(planet);
    }
  },1000);

  flightLoop(canvas);
}

function newStar(W,H){
  return {
    x:Math.random()*W, y:Math.random()*H,
    r:.3+Math.random()*1.5,
    speed:Math.random()*8+1,
    opacity:.2+Math.random()*.8,
    color: Math.random()>.9?`255,${180+Math.floor(Math.random()*75)},${100+Math.floor(Math.random()*100)}`:'255,255,255'
  };
}

function flightLoop(canvas){
  const ctx=flightCtx, W=canvas.width, H=canvas.height;
  fFrame++;

  // Background
  ctx.fillStyle='#000008';
  ctx.fillRect(0,0,W,H);

  // Nebulas
  for(const n of fNebulas){
    n.x -= .2;
    if(n.x+n.r<0) { n.x=W+n.r; n.y=Math.random()*H; }
    const g=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,n.r);
    g.addColorStop(0,`rgba(${n.color},${n.opacity})`);
    g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g;
    ctx.beginPath(); ctx.arc(n.x,n.y,n.r,0,Math.PI*2); ctx.fill();
  }

  // Stars / warp streaks
  const warpFactor = fPhase==='warp'?1: fPhase==='approach'?.3:.7;
  for(const s of fStars){
    s.y += s.speed*warpFactor;
    if(s.y>H){ s.y=0; s.x=Math.random()*W; }
    const len = s.speed*warpFactor*4;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(s.x, s.y-len);
    ctx.strokeStyle=`rgba(${s.color},${s.opacity*warpFactor})`;
    ctx.lineWidth=s.r; ctx.stroke();
  }

  // Warp tunnel effect in warp phase
  if(fPhase==='warp'){
    const rings=6;
    for(let i=0;i<rings;i++){
      const t=(fFrame*.05+i/rings)%1;
      const r=t*H*.8, alpha=(1-t)*.06;
      ctx.beginPath();
      ctx.ellipse(W/2,H*.4,r*.5,r*.2,0,0,Math.PI*2);
      ctx.strokeStyle=`rgba(79,142,247,${alpha})`;
      ctx.lineWidth=2; ctx.stroke();
    }
  }

  // Destination planet (approach phase)
  if(fPhase==='approach'){
    const pScale = Math.min(1,(1-(fFrame%600)/600)*3);
    const pR = 40+pScale*60;
    const px=W*.65, py=H*.25;
    const pg=ctx.createRadialGradient(px-pR*.3,py-pR*.3,pR*.1,px,py,pR);
    pg.addColorStop(0,'#3a1f6e');
    pg.addColorStop(.6,'#1a0f3a');
    pg.addColorStop(1,'#080412');
    ctx.beginPath(); ctx.arc(px,py,pR,0,Math.PI*2);
    ctx.fillStyle=pg; ctx.fill();
    ctx.strokeStyle='rgba(124,92,252,.4)'; ctx.lineWidth=2; ctx.stroke();
    // Glow
    const ag=ctx.createRadialGradient(px,py,pR*.8,px,py,pR*1.8);
    ag.addColorStop(0,'rgba(124,92,252,.15)');
    ag.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=ag;
    ctx.beginPath(); ctx.arc(px,py,pR*1.8,0,Math.PI*2); ctx.fill();
  }

  // Ship trail
  fShipTrail.push({x:fShipX, y:fShipY+26, opacity:1});
  if(fShipTrail.length>25) fShipTrail.shift();
  fShipTrail.forEach((t,i)=>{
    const prog=i/fShipTrail.length;
    ctx.beginPath();
    ctx.arc(t.x, t.y, (1-prog)*5, 0, Math.PI*2);
    ctx.fillStyle=`rgba(79,142,247,${prog*.5})`;
    ctx.fill();
  });

  // Engine flame
  const flameLen = 20+Math.sin(fFrame*.2)*8;
  const flamGrd=ctx.createLinearGradient(fShipX,fShipY+22,fShipX,fShipY+22+flameLen);
  flamGrd.addColorStop(0,'rgba(120,180,255,.9)');
  flamGrd.addColorStop(.5,'rgba(79,100,252,.6)');
  flamGrd.addColorStop(1,'rgba(0,0,0,0)');
  ctx.beginPath();
  ctx.moveTo(fShipX-7,fShipY+22);
  ctx.lineTo(fShipX,fShipY+22+flameLen);
  ctx.lineTo(fShipX+7,fShipY+22);
  ctx.fillStyle=flamGrd; ctx.fill();

  // Draw ship
  drawDetailedShip(ctx, fShipX, fShipY);

  flightAnimId = requestAnimationFrame(()=>flightLoop(canvas));
}

function drawDetailedShip(ctx, x, y){
  ctx.save(); ctx.translate(x,y);

  // Body
  ctx.beginPath();
  ctx.moveTo(0,-30); ctx.lineTo(13,8); ctx.lineTo(9,20);
  ctx.lineTo(-9,20); ctx.lineTo(-13,8); ctx.closePath();
  ctx.fillStyle='#c8d8ec'; ctx.fill();
  ctx.strokeStyle='#8aaac8'; ctx.lineWidth=.8; ctx.stroke();

  // Cockpit
  ctx.beginPath();
  ctx.ellipse(0,-10,6,9,0,0,Math.PI*2);
  const cg=ctx.createRadialGradient(-2,-14,1,-1,-10,8);
  cg.addColorStop(0,'rgba(160,220,255,.95)');
  cg.addColorStop(1,'rgba(60,120,200,.7)');
  ctx.fillStyle=cg; ctx.fill();

  // Left wing
  ctx.beginPath();
  ctx.moveTo(-11,6); ctx.lineTo(-28,20); ctx.lineTo(-20,25); ctx.lineTo(-9,18);
  ctx.closePath();
  ctx.fillStyle='#8fa8c4'; ctx.fill();
  ctx.strokeStyle='#6a86a0'; ctx.lineWidth=.7; ctx.stroke();

  // Right wing
  ctx.beginPath();
  ctx.moveTo(11,6); ctx.lineTo(28,20); ctx.lineTo(20,25); ctx.lineTo(9,18);
  ctx.closePath();
  ctx.fillStyle='#8fa8c4'; ctx.fill();
  ctx.strokeStyle='#6a86a0'; ctx.lineWidth=.7; ctx.stroke();

  // Wing stripe
  ctx.beginPath(); ctx.moveTo(-9,18); ctx.lineTo(-20,22);
  ctx.strokeStyle='rgba(79,142,247,.6)'; ctx.lineWidth=1.5; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(9,18); ctx.lineTo(20,22);
  ctx.strokeStyle='rgba(79,142,247,.6)'; ctx.lineWidth=1.5; ctx.stroke();

  // Nozzle
  ctx.beginPath();
  ctx.moveTo(-7,20); ctx.lineTo(-6,28); ctx.lineTo(6,28); ctx.lineTo(7,20);
  ctx.fillStyle='#4a6080'; ctx.fill();

  // Blaster if owned
  if(G.inventory.blaster_1||G.inventory.blaster_2){
    ctx.fillStyle='#e74c3c';
    ctx.beginPath(); ctx.roundRect(-16,10,5,8,2); ctx.fill();
    ctx.beginPath(); ctx.roundRect(11,10,5,8,2); ctx.fill();
  }

  ctx.restore();
}

const SPACE_OBJECTS = [
  {emoji:'☄️',type:'asteroid',reward:5,label:'+5F'},
  {emoji:'💎',type:'gem',reward:15,label:'+15F'},
  {emoji:'👽',type:'alien',reward:20,label:'+20 GC'},
  {emoji:'🛸',type:'ufo',reward:30,label:'+30 GC'},
  {emoji:'💥',type:'explosion',reward:-10,label:'-10 GC'},
  {emoji:'🌀',type:'anomaly',reward:10,label:'+10F'},
];

function spawnSpaceObj(canvas){
  const objDef = SPACE_OBJECTS[Math.floor(Math.random()*SPACE_OBJECTS.length)];
  const obj = document.createElement('div');
  obj.className = 'space-obj';
  const sx = 30+Math.random()*(canvas.width-80);
  const sy = 100+Math.random()*(canvas.height*.35);
  const dx = (Math.random()-.5)*120;
  const dy = 80+Math.random()*100;
  const dur = 2.5+Math.random()*2;
  obj.style.cssText = `left:${sx}px;top:${sy}px;--dx:${dx}px;--dy:${dy}px;--dur:${dur}s;font-size:${32+Math.floor(Math.random()*12)}px`;
  obj.textContent = objDef.emoji;
  obj.dataset.type = objDef.type;
  obj.dataset.reward = objDef.reward;
  obj.dataset.label = objDef.label;
  obj.onclick = ()=>hitSpaceObj(obj, sx, sy);
  document.getElementById('flight-screen').appendChild(obj);
  obj.addEventListener('animationend',()=>{ if(obj.parentNode) obj.remove(); });
}

function hitSpaceObj(obj, sx, sy){
  const reward = parseInt(obj.dataset.reward);
  const label  = obj.dataset.label;
  const type   = obj.dataset.type;

  const blasterMult = G.inventory.blaster_2?2.5:G.inventory.blaster_1?1.5:1;

  if(type==='asteroid'||type==='gem'||type==='anomaly'){
    const gained = Math.round(reward*blasterMult);
    G.fuel = Math.min(G.fuelMax, G.fuel+gained);
    spawnFloatNum({clientX:sx+20,clientY:sy}, `+${gained}F`, '#4f8ef7');
  } else if(type==='alien'||type==='ufo'){
    const gained = Math.round(reward*blasterMult);
    G.gc += gained;
    spawnFloatNum({clientX:sx+20,clientY:sy}, `+${gained} GC`, '#f5c518');
  } else if(type==='explosion'){
    G.gc = Math.max(0, G.gc + reward);
    spawnFloatNum({clientX:sx+20,clientY:sy}, `${reward} GC`, '#e74c3c');
  }

  G.bonusObjCount++;
  if(window.Telegram?.WebApp?.HapticFeedback)
    Telegram.WebApp.HapticFeedback.impactOccurred('medium');

  obj.style.animation='none';
  obj.style.transform='scale(1.5)';
  obj.style.opacity='0';
  obj.style.transition='all .2s';
  setTimeout(()=>obj.remove(),200);

  addFlightLog(label, type==='explosion'?'bad':'good');
}

function autoShootObjects(){
  document.querySelectorAll('.space-obj').forEach(obj=>{
    if(Math.random()<.4) hitSpaceObj(obj, parseInt(obj.style.left), parseInt(obj.style.top));
  });
}

function addFlightLog(msg, cls=''){
  const log = document.getElementById('flight-events');
  const entry = document.createElement('div');
  entry.className = `event-msg ${cls}`;
  entry.textContent = msg;
  log.appendChild(entry);
  while(log.children.length>5) log.removeChild(log.firstChild);
}

const FLIGHT_EVENTS = [
  {text:'Метеоритный поток — уклонение!',type:'bad'},
  {text:'Пространственная аномалия — ускоряемся!',type:''},
  {text:'Сигнал неизвестного происхождения...',type:''},
  {text:'Двигатели в норме. Курс стабилен.',type:'good'},
  {text:'Фрагмент спутника обнаружен!',type:'good'},
  {text:'Солнечный ветер — попутный курс.',type:'good'},
  {text:'Ионный шторм по левому борту!',type:'bad'},
  {text:'Гравитационная рябь — держитесь!',type:'bad'},
  {text:'Пираты на радаре!',type:'bad'},
  {text:'Загадочный маяк впереди...',type:''},
];

function spawnFlightEvent(){
  const ev=FLIGHT_EVENTS[Math.floor(Math.random()*FLIGHT_EVENTS.length)];
  addFlightLog(ev.text, ev.type);
}

function updateFlightTimer(s){
  const m=Math.floor(s/60), sec=s%60;
  document.getElementById('flight-timer').textContent=`${m}:${sec.toString().padStart(2,'0')}`;
}

async function finalizeFlight(planet){
  cancelAnimationFrame(flightAnimId);
  document.querySelectorAll('.space-obj').forEach(o=>o.remove());

  const riskMod = G.inventory.engine_2 ? -.10 : 0;
  const success = Math.random() > (planet.risk + riskMod);
  G.inFlight = false;

  if(success){
    G.gc += planet.reward;
    G.ci += planet.ci;
  }

  showScreen('arrival-screen');
  document.getElementById('arrival-emoji').textContent = planet.emoji;
  document.getElementById('arrival-title').textContent = success?'Успешная экспедиция!':'Крушение!';
  document.getElementById('arrival-subtitle').textContent = success?`Добыча на ${planet.name} завершена`:`Корабль потерян у ${planet.name}`;

  if(success){
    document.getElementById('rewards-box').innerHTML = `
      <div class="reward-row"><span class="reward-label">Получено GC</span><span class="reward-val">+${planet.reward} GC</span></div>
      <div class="reward-row"><span class="reward-label">Рейтинг CI</span><span class="reward-val green">+${planet.ci} CI</span></div>
      <div class="reward-row"><span class="reward-label">Объектов сбито</span><span class="reward-val" style="color:#b39dfa">${G.bonusObjCount}</span></div>`;
  } else {
    document.getElementById('rewards-box').innerHTML = `
      <div class="reward-row"><span class="reward-label">Исход</span><span class="reward-val" style="color:var(--red)">Провал</span></div>
      <div class="reward-row"><span class="reward-label">Объектов сбито</span><span class="reward-val" style="color:#b39dfa">${G.bonusObjCount}</span></div>
      <div class="reward-row"><span class="reward-label" style="font-size:11px;color:var(--muted)">Купи щит в магазине — защитит груз</span><span></span></div>`;
  }

  updateMainUI(); renderPlanets();
  await apiPost('/finalize_flight',{success, planet_key:planet.key, bonus_fuel: G.bonusObjCount*5});
}

// ══════════════════════════════════════════
//  SHOP
// ══════════════════════════════════════════
function setShopTab(tab){
  G.shopTab = tab;
  document.querySelectorAll('.shop-tab').forEach((t,i)=>{
    const tabs=['boosters','parts','weapons','vip'];
    t.classList.toggle('active', tabs[i]===tab);
  });
  renderShop();
}

function renderShop(){
  const list = document.getElementById('shop-items');
  list.innerHTML = '';
  document.getElementById('shop-gc-display').textContent = `${Math.floor(G.gc)} GC`;

  const items = SHOP[G.shopTab] || [];
  items.forEach(item=>{
    const owned = G.inventory[item.id];
    const reqMet = !item.requires || G.inventory[item.requires];
    const canAfford = item.currency==='gc' ? G.gc >= item.price : true;
    const isBlocked = item.requires && !reqMet;

    const div = document.createElement('div');
    div.className = `shop-item ${owned&&item.unique?'owned':''}`;
    const priceLabel = item.currency==='stars'
      ? `⭐ ${item.price} Stars`
      : `${item.price} GC`;
    const btnText = owned&&item.unique?'Куплено':isBlocked?`🔒 Нужен ${item.requires}`:priceLabel;
    const btnClass = (owned&&item.unique)||isBlocked?'shop-btn owned-btn':'shop-btn';

    div.innerHTML = `
      <div class="shop-icon">${item.emoji}</div>
      <div class="shop-info">
        <div class="shop-name">${item.name}</div>
        <div class="shop-desc">${item.desc}</div>
        <div class="shop-price ${item.currency==='gc'?'gc':''}">${item.currency==='stars'?'⭐':'💰'} ${item.price} ${item.currency==='stars'?'Stars':'GC'}</div>
      </div>
      <button class="${btnClass}" ${(owned&&item.unique)||isBlocked?'disabled':''} onclick="buyItem('${item.id}')">${btnText}</button>`;
    list.appendChild(div);
  });
}

async function buyItem(itemId){
  const allItems = [...SHOP.boosters,...SHOP.parts,...SHOP.weapons,...SHOP.vip];
  const item = allItems.find(i=>i.id===itemId);
  if(!item) return;

  if(item.requires && !G.inventory[item.requires]){
    showToast(`Сначала купи: ${item.requires}`); return;
  }
  if(item.unique && G.inventory[itemId]){
    showToast('Уже куплено'); return;
  }
  if(item.currency==='gc'){
    if(G.gc < item.price){ showToast('Недостаточно GC'); return; }
    G.gc -= item.price;
  }

  // Применяем эффект
  if(item.effect==='instant_fuel'){
    G.fuel = G.fuelMax;
  } else if(item.effect==='tank_ext'){
    G.fuelMax = 1200;
    G.inventory[itemId] = true;
  } else if(item.effect==='gc_1000'){
    G.gc += 1000;
  } else if(item.effect==='gc_5000'){
    G.gc += 6000;
  } else if(item.stackable){
    G.inventory[itemId] = (G.inventory[itemId]||0)+1;
  } else {
    G.inventory[itemId] = true;
  }

  const res = await apiPost('/buy_item',{item_id:itemId, price:item.price, currency:item.currency});
  if(res?.status==='success'){
    showToast(`✅ ${item.name} — получено!`);
    updateMainUI(); renderShop();
  } else {
    showToast('Ошибка покупки, повтори');
  }
}

// ══════════════════════════════════════════
//  MINERS
// ══════════════════════════════════════════
function showMiners(){
  showScreen('miners-screen');
  renderMiners();
}

function renderMiners(){
  const list = document.getElementById('miners-list');
  list.innerHTML = '';

  PLANETS.forEach(p=>{
    const miner = G.miners[p.key] || {level:0, stored:0};
    const unlocked = G.ci >= p.minCI;
    if(!unlocked) return;

    const div = document.createElement('div');
    div.className = 'miner-card';

    if(miner.level===0){
      const cost = MINER_COSTS[0];
      div.innerHTML = `
        <div class="miner-top">
          <div style="font-size:32px">${p.emoji}</div>
          <div style="flex:1">
            <div class="miner-planet-name">${p.name}</div>
            <div class="miner-resource">${p.resEmoji} ${p.resource} — майнер не построен</div>
          </div>
        </div>
        <button class="miner-btn build" onclick="buildMiner('${p.key}',${cost})">
          Построить майнер — ${cost} GC
        </button>`;
    } else {
      const cap  = MINER_CAPACITY[miner.level];
      const rate = MINER_RATE_PER_MIN[miner.level];
      const pct  = Math.min(100,(miner.stored/cap)*100);
      const upgCost = MINER_COSTS[miner.level];
      const canUpg = miner.level<3 && G.gc>=upgCost;

      div.innerHTML = `
        <div class="miner-top">
          <div style="font-size:32px">${p.emoji}</div>
          <div style="flex:1">
            <div class="miner-planet-name">${p.name}</div>
            <div class="miner-resource">${p.resEmoji} ${p.resource} · ${rate} ед/мин</div>
          </div>
          <div class="miner-level-badge">Ур. ${miner.level}</div>
        </div>
        <div>
          <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--muted);margin-bottom:4px">
            <span>Хранилище</span><span>${Math.floor(miner.stored)} / ${cap}</span>
          </div>
          <div class="miner-bar"><div class="miner-bar-fill" style="width:${pct}%"></div></div>
        </div>
        <div class="miner-actions">
          <button class="miner-btn collect ${miner.stored<1?'dis':''}" onclick="collectMiner('${p.key}')">
            Собрать ${Math.floor(miner.stored)} GC
          </button>
          ${miner.level<3
            ? `<button class="miner-btn upgrade ${canUpg?'':'dis'}" onclick="upgradeMiner('${p.key}',${upgCost})">
                Ур.${miner.level+1} — ${upgCost} GC
               </button>`
            : `<button class="miner-btn dis">Макс. ур.</button>`}
        </div>`;
    }
    list.appendChild(div);
  });

  if(list.innerHTML===''){
    list.innerHTML='<div style="text-align:center;padding:40px;color:var(--muted);font-size:14px">Открой планеты чтобы строить майнеры</div>';
  }
}

async function buildMiner(planetKey, cost){
  if(G.gc<cost){ showToast(`Нужно ${cost} GC`); return; }
  G.gc -= cost;
  G.miners[planetKey] = {level:1, stored:0, built_at: Date.now()};
  const res = await apiPost('/build_miner',{planet_key:planetKey, cost});
  if(res?.status==='success'){ showToast('⛏ Майнер построен!'); }
  else { G.gc+=cost; G.miners[planetKey]=null; showToast('Ошибка'); }
  updateMainUI(); renderMiners(); renderPlanets();
}

async function upgradeMiner(planetKey, cost){
  if(G.gc<cost){ showToast(`Нужно ${cost} GC`); return; }
  G.gc -= cost;
  G.miners[planetKey].level++;
  const res = await apiPost('/upgrade_miner',{planet_key:planetKey, cost});
  if(res?.status==='success'){ showToast('⬆️ Майнер улучшен!'); }
  else { G.gc+=cost; G.miners[planetKey].level--; showToast('Ошибка'); }
  updateMainUI(); renderMiners();
}

async function collectMiner(planetKey){
  const m = G.miners[planetKey];
  if(!m || m.stored<1){ showToast('Нечего собирать'); return; }
  const amount = Math.floor(m.stored);
  G.gc += amount;
  m.stored = 0;
  const res = await apiPost('/collect_miner',{planet_key:planetKey, amount});
  if(res?.status==='success'){ showToast(`💰 Собрано ${amount} GC!`); }
  updateMainUI(); renderMiners();
}

// ══════════════════════════════════════════
//  LEADERBOARD
// ══════════════════════════════════════════
async function showLeague(){
  showScreen('league-screen');
  const list = document.getElementById('lb-list');
  list.innerHTML='<div style="text-align:center;padding:40px;color:var(--muted)">Загрузка...</div>';
  const res = await apiGet('/leaderboard');
  list.innerHTML='';
  if(!res||res.status!=='success'){
    list.innerHTML='<div style="text-align:center;padding:40px;color:var(--muted)">Ошибка загрузки</div>'; return;
  }
  (res.top_by_gc||[]).forEach((p,i)=>{
    const isMe = p.telegram_id===G.tgId;
    const medal = i===0?'🥇':i===1?'🥈':i===2?'🥉':`#${i+1}`;
    const div=document.createElement('div');
    div.className=`lb-item ${isMe?'me':''}`;
    div.innerHTML=`
      <div class="lb-rank">${medal}</div>
      <div class="lb-avatar">${(p.first_name||'?').slice(0,2).toUpperCase()}</div>
      <div class="lb-name">${p.first_name||'Командор'}${isMe?' (ты)':''}</div>
      <div class="lb-score">${Math.floor(p.gc_balance||0)} GC</div>`;
    list.appendChild(div);
  });
}

// ══════════════════════════════════════════
//  REFERRALS
// ══════════════════════════════════════════
function copyRef(){
  const link=document.getElementById('ref-link-text').textContent;
  navigator.clipboard.writeText(link).then(()=>showToast('Ссылка скопирована!'));
}
function shareRef(){
  const link=document.getElementById('ref-link-text').textContent;
  if(window.Telegram?.WebApp)
    Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent('Строю межзвёздную колонию в MarsX! Присоединяйся 🚀')}`);
  else copyRef();
}

// ══════════════════════════════════════════
//  NAVIGATION
// ══════════════════════════════════════════
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}
function showMain(){
  clearInterval(flightInterval);
  cancelAnimationFrame(flightAnimId);
  document.querySelectorAll('.space-obj').forEach(o=>o.remove());
  showScreen('main-screen');
  updateMainUI(); renderPlanets();
}

// ══════════════════════════════════════════
//  TOAST
// ══════════════════════════════════════════
let toastTimer;
function showToast(msg){
  const el=document.getElementById('toast');
  el.textContent=msg; el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>el.classList.remove('show'),2200);
}

// ══════════════════════════════════════════
//  STARS BG
// ══════════════════════════════════════════
function createStarsBg(){
  const bg=document.getElementById('stars-bg');
  for(let i=0;i<100;i++){
    const s=document.createElement('div');
    s.className='star-dot';
    const sz=Math.random()*2+.4;
    s.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*100}%;width:${sz}px;height:${sz}px;opacity:${Math.random()*.4+.1};--d:${2+Math.random()*4}s;animation-delay:${Math.random()*3}s`;
    bg.appendChild(s);
  }
}
