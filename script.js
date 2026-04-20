// ═══════════════════════════════════════════
//  MarsX script.js — полная версия
// ═══════════════════════════════════════════

const API_URL      = 'https://humbly-petunia-customs.ngrok-free.dev';
const BOT_USERNAME = 'MarsXRocketBot';

const G = {
  tgUser:null, tgId:null, initData:'',
  fuel:0, fuelMax:800, gc:0, ci:0,
  passiveIncome:0, crewCount:0,
  tapPower:1, comboCount:0, comboTimer:null, lastTap:0,
  inFlight:false, currentPlanet:null, bonusObjCount:0,
  inventory:{}, miners:{},
  dailyStreak:0, dailyClaimedToday:false,
  onboardingDone:false, onboardingStep:0,
  quests:{}, season:null,
  shopTab:'boosters',
};

// ── Планеты ──
const PLANETS = [
  {key:'moon',    name:'Луна',          emoji:'🌙',duration:60,  reward:12, ci:5,  risk:0.08,riskClass:'risk-low',   riskLabel:'8%', fuelCost:50, minCI:0,   resource:'Гелий-3',     resEmoji:'🔵'},
  {key:'mars',    name:'Марс',          emoji:'🔴',duration:120, reward:25, ci:15, risk:0.34,riskClass:'risk-med',   riskLabel:'34%',fuelCost:100,minCI:0,   resource:'Железо',      resEmoji:'🟤'},
  {key:'jupiter', name:'Юпитер',        emoji:'🟠',duration:180, reward:50, ci:30, risk:0.71,riskClass:'risk-high',  riskLabel:'71%',fuelCost:200,minCI:50,  resource:'Антиматерия', resEmoji:'⚡'},
  {key:'saturn',  name:'Сатурн',        emoji:'🪐',duration:300, reward:120,ci:60, risk:0.85,riskClass:'risk-high',  riskLabel:'85%',fuelCost:350,minCI:150, resource:'Кристаллы',   resEmoji:'💎'},
  {key:'neptune', name:'Нептун',        emoji:'🔵',duration:480, reward:250,ci:120,risk:0.95,riskClass:'risk-high',  riskLabel:'95%',fuelCost:600,minCI:400, resource:'Нейтрониум',  resEmoji:'🌀'},
  {key:'alpha',   name:'Alpha Centauri',emoji:'⭐',duration:900, reward:500,ci:300,risk:0.98,riskClass:'risk-legend',riskLabel:'98%',fuelCost:750,minCI:1000,resource:'Тёмная материя',resEmoji:'🌑'},
];

// ── Магазин ──
const SHOP = {
  boosters:[
    {id:'fuel_boost',  name:'Топливный буст',    emoji:'⛽',desc:'×2 добыча топлива на 30 мин',         price:200, currency:'gc'},
    {id:'shield',      name:'Щит',               emoji:'🛡',desc:'Защита от одной потери груза',        price:150, currency:'gc',   stackable:true},
    {id:'combo_boost', name:'Комбо-усилитель',   emoji:'⚡',desc:'×3 комбо с 3 тапов (1 час)',          price:300, currency:'gc'},
    {id:'instant_fuel',name:'Мгновенное топливо',emoji:'💧',desc:'Заполняет топливо до 100% сейчас',   price:500, currency:'gc'},
  ],
  parts:[
    {id:'engine_1',  name:'Двигатель Mk.II',  emoji:'🔧',desc:'+20% скорость полётов, −7% риск',     price:800,  currency:'gc',  unique:true},
    {id:'engine_2',  name:'Двигатель Mk.III', emoji:'🚀',desc:'+50% скорость, −15% риск',            price:2500, currency:'gc',  unique:true, requires:'engine_1'},
    {id:'tank_ext',  name:'Доп. бак',         emoji:'🛢',desc:'Лимит топлива 800 → 1200 F',          price:1200, currency:'gc',  unique:true},
    {id:'scanner',   name:'Сканер',           emoji:'📡',desc:'Вдвое больше объектов в полёте',      price:600,  currency:'gc',  unique:true},
    {id:'droid',     name:'Майнинг-дроид',    emoji:'🤖',desc:'Авто-тапает реактор раз в 5 сек',    price:1500, currency:'gc',  unique:true},
  ],
  weapons:[
    {id:'blaster_1',  name:'Бластер Mk.I',  emoji:'🔫',desc:'+10 F за сбитый объект',                price:400,  currency:'gc', unique:true},
    {id:'blaster_2',  name:'Бластер Mk.II', emoji:'💥',desc:'+25 F, шанс двойного дропа',            price:1800, currency:'gc', unique:true, requires:'blaster_1'},
    {id:'emp',        name:'ЭМИ-пушка',     emoji:'⚡',desc:'Уничтожает все объекты на экране',      price:3000, currency:'gc', unique:true},
    {id:'auto_turret',name:'Авто-турель',   emoji:'🎯',desc:'Авто-стреляет по астероидам',           price:5000, currency:'gc', unique:true},
  ],
  autopilot:[
    {id:'autopilot',  name:'Автопилот',     emoji:'🛸',desc:'Полёты завершаются пока ты офлайн. Уведомление в Telegram когда корабль вернётся. Навсегда.',price:499, currency:'stars', unique:true},
    {id:'vip_1month', name:'VIP Командор',  emoji:'👑',desc:'+30% добыча, 2 слота полётов, без рекламы. 1 месяц.',price:299, currency:'stars', unique:true},
    {id:'vip_3month', name:'VIP Командор ×3',emoji:'💎',desc:'Всё то же + эксклюзивный корабль. 3 месяца.',price:699, currency:'stars', unique:true},
    {id:'gc_1000',    name:'1 000 GC',      emoji:'💰',desc:'Пак галактических кредитов',             price:99,  currency:'stars'},
    {id:'gc_5000',    name:'6 000 GC',      emoji:'💎',desc:'Выгодный пак (+20% бонус)',              price:399, currency:'stars'},
    {id:'gc_15000',   name:'20 000 GC',     emoji:'🌟',desc:'Мега-пак (+33% бонус)',                  price:999, currency:'stars'},
  ],
};

const DAILY_REWARDS = [
  {day:1, gc:50,   fuel:100,label:'День 1',       bonus:''},
  {day:2, gc:75,   fuel:100,label:'День 2',       bonus:''},
  {day:3, gc:100,  fuel:150,label:'День 3',       bonus:'🛡 Щит'},
  {day:4, gc:125,  fuel:150,label:'День 4',       bonus:''},
  {day:5, gc:200,  fuel:200,label:'День 5',       bonus:'⚡ Буст'},
  {day:6, gc:250,  fuel:200,label:'День 6',       bonus:''},
  {day:7, gc:500,  fuel:300,label:'День 7 🔥',    bonus:'🔫 Бластер'},
  {day:14,gc:1000, fuel:400,label:'День 14 🔥🔥', bonus:'📡 Сканер'},
  {day:21,gc:1500, fuel:500,label:'День 21 ⭐',   bonus:'🔧 Двигатель'},
  {day:30,gc:3000, fuel:800,label:'День 30 👑',   bonus:'🛸 Автопилот'},
];

const RANKS = [
  {min:0,name:'Новобранец'},{min:50,name:'Пилот'},{min:200,name:'Лейтенант'},
  {min:500,name:'Командор'},{min:1500,name:'Адмирал'},{min:5000,name:'Легенда'},
];
const getRank = ci => { let r=RANKS[0]; for(const k of RANKS) if(ci>=k.min) r=k; return r.name; };

// ══════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════
function onTap(e){
  tapHeat = Math.min(100, tapHeat + 7);
  if(e){
    const c = document.getElementById('tap-canvas');
    const rect = c.getBoundingClientRect();
    const scale = c.width / rect.width;
    const lx = (e.clientX - rect.left) * scale;
    const ly = (e.clientY - rect.top) * scale;
    const colors = ['79,142,247','124,92,252','245,197,24','100,180,255','180,150,255'];
    for(let i=0;i<14;i++){
      const a=Math.random()*Math.PI*2, sp=2+Math.random()*5;
      TAP_P.push({x:lx,y:ly,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-2,r:2+Math.random()*3.5,life:1,c:colors[Math.floor(Math.random()*colors.length)]});
    }
  }
  doTap(e);
}

window.onload = () => {
  createStarsBg();
  initTapCanvas();
  initTelegram();
  setInterval(passiveTick,   1000);
  setInterval(saveFuel,      10000);
  setInterval(minerTick,     60000);
  setInterval(checkAutopilot,30000);
};

function initTelegram(){
  if(!window.Telegram?.WebApp){
    G.tgUser={first_name:'Тест',id:12345}; G.tgId=12345;
    applyUserUI(); loadUserData(); return;
  }
  const tg=window.Telegram.WebApp;
  tg.expand();
  tg.setHeaderColor('#07091a');
  tg.setBackgroundColor('#07091a');
  G.tgUser  = tg.initDataUnsafe?.user || {first_name:'Командор',id:0};
  G.tgId    = G.tgUser.id;
  G.initData = tg.initData || '';
  applyUserUI();
  loadUserData();
}

function applyUserUI(){
  const name=G.tgUser.first_name||'Командор';
  document.getElementById('player-name').textContent=name;
  document.getElementById('avatar-initials').textContent=name.slice(0,2).toUpperCase();
  document.getElementById('ref-link-text').textContent=`https://t.me/${BOT_USERNAME}?start=ref_${G.tgId}`;
}

// ══════════════════════════════════════════
//  API
// ══════════════════════════════════════════
async function apiPost(path, body={}){
  if(!G.tgId){console.warn('[apiPost] tgId not ready, skip', path);return null;}
  try{
    const r=await fetch(API_URL+path,{
      method:'POST',
      headers:{'Content-Type':'application/json','ngrok-skip-browser-warning':'true'},
      body:JSON.stringify({telegram_id:G.tgId, init_data:G.initData||'', ...body})
    });
    return await r.json();
  }catch(e){console.error(path,e);return null;}
}
async function apiGet(path){
  if(!G.tgId){console.warn('[apiGet] tgId not ready, skip', path);return null;}
  try{
    const r=await fetch(`${API_URL}${path}?telegram_id=${G.tgId}`,
      {headers:{'ngrok-skip-browser-warning':'true'}});
    return await r.json();
  }catch(e){console.error(path,e);return null;}
}

async function loadUserData(){
  if(!G.tgId){
    console.warn('[loadUserData] tgId not ready, retry in 500ms');
    setTimeout(loadUserData, 500);
    return;
  }
  console.log('[loadUserData] запрос для', G.tgId);
  const res=await apiGet('/user_data');
  console.log('[loadUserData] ответ:', res?.status, res?.data);
  if(res?.status==='success'){
    const d=res.data;
    console.log('[loadUserData] GC:', d.gc_balance, 'Fuel:', d.fuel, 'Inventory:', JSON.stringify(d.inventory));
    G.fuel           = d.fuel??0;
    G.fuelMax        = d.fuel_max??800;
    G.gc             = d.gc_balance??0;
    G.ci             = d.ci_score??0;
    G.passiveIncome  = d.passive_income_per_minute??0;
    G.crewCount      = d.referrals_count??0;
    G.inventory      = d.inventory??{};
    G.miners         = d.miners??{};
    G.dailyStreak    = d.daily_streak??0;
    G.dailyClaimedToday = d.daily_claimed_today??false;
    G.onboardingDone = d.onboarding_done??false;
    G.quests         = d.quests??{};
    G.season         = d.season??null;
    G.inFlight       = (d.state==='in_flight');
    if(d.autopilot_result) showAutopilotResult(d.autopilot_result);
    updateMainUI();
    if(!G.onboardingDone) setTimeout(startOnboarding, 800);
    else if(!G.dailyClaimedToday) setTimeout(showDailyBonus, 1200);
  } else {
    console.error('[loadUserData] ошибка:', res);
    showToast('Ошибка загрузки данных — повтор через 3 сек');
    setTimeout(loadUserData, 3000);
  }
}

async function saveFuel(){
  if(!G.tgId||G.fuel<=0) return;
  await apiPost('/save_fuel',{fuel:Math.floor(G.fuel),fuel_max:G.fuelMax});
}

async function checkAutopilot(){
  if(!G.inFlight||!G.inventory.autopilot) return;
  const res=await apiGet('/check_autopilot');
  if(res?.data?.autopilot_result) showAutopilotResult(res.data.autopilot_result);
}

// ══════════════════════════════════════════
//  ONBOARDING
// ══════════════════════════════════════════
const ONBOARDING_STEPS = [
  {title:'Добро пожаловать в MarsX 🚀', body:'Ты — командор космической базы. Тапай планету чтобы добывать топливо для экспедиций.', btn:'Начать', action:'tap_hint'},
  {title:'Тапни планету 10 раз ⚡',      body:'Каждый тап добавляет топливо. Combo-тапы дают ×2 и ×3 бонус!',                       btn:'Понятно', action:'show_fuel'},
  {title:'Запусти первую экспедицию 🌙', body:'Луна — самый безопасный маршрут. Нажми "Запустить экспедицию" и выбери Луну.',        btn:'Лечу!',   action:'open_planets'},
  {title:'Собери награду 💰',            body:'Корабль вернулся! Ты получил GC и CI. Трать GC в магазине на апгрейды.',              btn:'Отлично!', action:'finish'},
];

function startOnboarding(){
  G.onboardingStep=0;
  showOnboardingStep(0);
}

function showOnboardingStep(i){
  const step=ONBOARDING_STEPS[i];
  if(!step) return;
  const el=document.getElementById('onboarding-modal');
  document.getElementById('ob-title').textContent=step.title;
  document.getElementById('ob-body').textContent=step.body;
  document.getElementById('ob-btn').textContent=step.btn;
  document.getElementById('ob-dots').innerHTML=ONBOARDING_STEPS.map((_,j)=>
    `<span style="width:6px;height:6px;border-radius:50%;background:${j===i?'#4f8ef7':'rgba(79,142,247,.3)'}"></span>`
  ).join('');
  el.style.display='flex';
}

document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('ob-btn').onclick = async ()=>{
    const step=ONBOARDING_STEPS[G.onboardingStep];
    if(step.action==='open_planets') showScreen('planet-screen');
    if(step.action==='finish'){
      document.getElementById('onboarding-modal').style.display='none';
      const res=await apiPost('/complete_onboarding');
      if(res?.status==='success'){
        G.gc+=100; G.fuel=Math.min(G.fuelMax,G.fuel+200);
        showToast('🎁 Стартовый бонус: +100 GC и +200 F!');
        updateMainUI();
      }
      if(!G.dailyClaimedToday) setTimeout(showDailyBonus,1500);
      return;
    }
    G.onboardingStep++;
    if(G.onboardingStep<ONBOARDING_STEPS.length) showOnboardingStep(G.onboardingStep);
    else document.getElementById('onboarding-modal').style.display='none';
  };
});

// ══════════════════════════════════════════
//  DAILY BONUS
// ══════════════════════════════════════════
function showDailyBonus(){
  if(G.dailyClaimedToday) return;
  const streak=G.dailyStreak+1;
  let reward=DAILY_REWARDS[0];
  for(const r of [...DAILY_REWARDS].reverse()) if(streak>=r.day){reward=r;break;}
  // Следующие дни
  const upcoming=DAILY_REWARDS.slice(0,7);
  const el=document.getElementById('daily-modal');
  document.getElementById('daily-streak').textContent=`День ${streak}`;
  document.getElementById('daily-gc').textContent=`+${reward.gc} GC`;
  document.getElementById('daily-fuel').textContent=`+${reward.fuel} F`;
  document.getElementById('daily-bonus').textContent=reward.bonus?`+ ${reward.bonus}`:'';
  // Полоса дней
  document.getElementById('daily-days').innerHTML=upcoming.map((r,i)=>{
    const active=streak===r.day;
    const past=streak>r.day;
    return `<div style="flex:1;text-align:center;padding:6px 2px;border-radius:8px;background:${active?'rgba(79,142,247,.2)':past?'rgba(46,204,113,.1)':'var(--bg3)'};border:1px solid ${active?'var(--accent)':past?'var(--green)':'var(--border)'}">
      <div style="font-size:10px;color:var(--muted);margin-bottom:2px">${r.label}</div>
      <div style="font-size:12px;font-weight:700;color:${active?'var(--accent)':past?'var(--green)':'var(--muted)'}">${r.gc}GC</div>
    </div>`;
  }).join('');
  el.style.display='flex';
}

async function claimDaily(){
  if(!G.tgId){showToast('Подожди — идёт загрузка...');return;}
  const res=await apiPost('/daily_claim');
  document.getElementById('daily-modal').style.display='none';
  if(res?.status==='success'){
    const d=res.data;
    G.gc+=d.gc; G.fuel=Math.min(G.fuelMax,G.fuel+d.fuel);
    G.dailyStreak=d.streak; G.dailyClaimedToday=true;
    showToast(`🎁 ${d.label} — +${d.gc} GC, +${d.fuel} F${d.bonus?', '+d.bonus:''}!`);
    updateMainUI();
  }else{
    showToast(res?.message||'Уже получено сегодня');
  }
}

// ══════════════════════════════════════════
//  AUTOPILOT RESULT
// ══════════════════════════════════════════
function showAutopilotResult(r){
  G.inFlight=false;
  // Показываем планету назначения, через 4 сек возвращаем на Землю
  updateTapPlanet(r.planet_key || 'earth');
  setTimeout(()=>updateTapPlanet('earth'), 4000);
  if(r.success){ G.gc+=r.reward_gc; G.ci+=r.reward_ci; }
  showScreen('arrival-screen');
  const arrPlanet = PLANETS.find(p=>p.key===r.planet_key);
  const arrEmoji  = arrPlanet ? arrPlanet.emoji : '🪐';
  document.getElementById('arrival-emoji').textContent = arrEmoji;
  document.getElementById('arrival-title').textContent=r.success?'Автопилот доставил груз!':'Крушение!';
  document.getElementById('arrival-subtitle').textContent=r.success?`${r.planet_name} — добыча завершена`:`Корабль потерян у ${r.planet_name}`;
  document.getElementById('rewards-box').innerHTML=r.success?`
    <div class="reward-row"><span class="reward-label">Получено GC</span><span class="reward-val">+${r.reward_gc} GC</span></div>
    <div class="reward-row"><span class="reward-label">Рейтинг CI</span><span class="reward-val green">+${r.reward_ci} CI</span></div>
    <div class="reward-row"><span class="reward-label">Доставлено автопилотом</span><span class="reward-val" style="color:#b39dfa">🛸</span></div>`:`
    <div class="reward-row"><span class="reward-label">Исход</span><span class="reward-val" style="color:var(--red)">Провал</span></div>`;
  updateMainUI();
}

// ══════════════════════════════════════════
//  ЗАМЕНА: вставь вместо initTapCanvas()
//  и animateTap() в script.js
//  Всё остальное в script.js не трогать!
// ══════════════════════════════════════════

// Конфиг визуала для каждой планеты
const PLANET_VISUALS = {
  earth:   { bg:'#07091a', glow:'#4f8ef7', ground:'#1a2540', sky:'rgba(79,142,247,.15)',  label:'Земля — база'         },
  moon:    { bg:'#0a0a12', glow:'#aaaacc', ground:'#1a1a28', sky:'rgba(180,180,220,.1)',  label:'Луна'                 },
  mars:    { bg:'#120500', glow:'#e05020', ground:'#3a1008', sky:'rgba(200,70,20,.18)',   label:'Марс'                 },
  jupiter: { bg:'#0a0500', glow:'#e8a040', ground:'#2a1800', sky:'rgba(220,140,50,.15)',  label:'Юпитер'               },
  saturn:  { bg:'#0a0800', glow:'#d4a050', ground:'#281a00', sky:'rgba(200,160,80,.15)',  label:'Сатурн'               },
  neptune: { bg:'#000a18', glow:'#2a60e0', ground:'#000f28', sky:'rgba(40,100,220,.2)',   label:'Нептун'               },
  alpha:   { bg:'#08001a', glow:'#9060ff', ground:'#150030', sky:'rgba(140,80,255,.2)',   label:'Alpha Centauri'       },
};

let tapCtx, tapFrame = 0;
let tapHeat = 0;          // 0–100, нагрев двигателей
let tapCurrentPlanet = 'earth';
const TAP_P = [];
const SMOKE_P = [];
let rocketStars = null;

// Вызывается из showMain() и при смене планеты
function updateTapPlanet(planetKey) {
  tapCurrentPlanet = planetKey || 'earth';
}

function initTapCanvas() {
  const c = document.getElementById('tap-canvas');
  if(!c){ console.error('tap-canvas not found'); return; }
  tapCtx = c.getContext('2d');
  function resize(){
    // Занимаем всю ширину экрана минус отступы, высота пропорциональна
    const vw = window.innerWidth || 375;
    const W  = Math.min(vw - 24, 420);   // ширина с отступом 12px с каждой стороны
    const H  = Math.floor(W * 1.05);      // чуть выше чем широкий
    c.width=W; c.height=H;
    c.style.width=W+'px'; c.style.height=H+'px';
    rocketStars=null;
  }
  resize(); setTimeout(resize,100); setTimeout(resize,500);
  window.addEventListener('resize', resize);
  c.addEventListener('click', e => onTap(e));
  c.addEventListener('touchstart', e=>{ e.preventDefault(); onTap(e.touches[0]); },{passive:false});
  animateTap();
}

function animateTap() {
  if(!tapCtx){requestAnimationFrame(animateTap);return;}
  const c=tapCtx.canvas, W=c.width, H=c.height;
  if(!W||H<10){requestAnimationFrame(animateTap);return;}
  const cx=W/2;
  tapFrame++;
  if(tapHeat>0) tapHeat=Math.max(0,tapHeat-.4);
  const vis=PLANET_VISUALS[tapCurrentPlanet]||PLANET_VISUALS.earth;

  // Фон
  tapCtx.fillStyle=vis.bg; tapCtx.fillRect(0,0,W,H);

  // Звёзды
  if(!rocketStars){
    rocketStars=[];
    for(let i=0;i<70;i++) rocketStars.push({x:Math.random()*W,y:Math.random()*H*.6,r:.5+Math.random()*1.5,o:.15+Math.random()*.55});
  }
  for(const s of rocketStars){
    tapCtx.beginPath();tapCtx.arc(s.x,s.y,s.r,0,Math.PI*2);
    tapCtx.fillStyle=`rgba(255,255,255,${s.o+Math.sin(tapFrame*.04+s.x)*.06})`;tapCtx.fill();
  }

  // Зарево планеты
  const skyG=tapCtx.createRadialGradient(cx,H,0,cx,H,H*.7);
  skyG.addColorStop(0,vis.sky);skyG.addColorStop(1,'rgba(0,0,0,0)');
  tapCtx.fillStyle=skyG;tapCtx.fillRect(0,0,W,H);

  // Поверхность
  tapCtx.fillStyle=vis.ground;
  tapCtx.beginPath();tapCtx.ellipse(cx,H+10,W*.9,28,0,Math.PI,Math.PI*2);tapCtx.fill();

  const padY=H-Math.floor(H*.15);
  const rocketY=H-Math.floor(H*.27);

  // Платформа
  tapCtx.fillStyle='#1a2540';tapCtx.beginPath();tapCtx.roundRect(cx-55,padY,110,13,3);tapCtx.fill();
  tapCtx.fillStyle='#263060';tapCtx.fillRect(cx-62,padY-4,124,6);
  for(let i=0;i<3;i++){
    const lx=cx-36+i*36;
    tapCtx.fillStyle='#1e2e4a';tapCtx.fillRect(lx-3,padY-30,6,30);
    tapCtx.fillStyle='#141e30';tapCtx.fillRect(lx-7,padY-4,14,5);
  }
  tapCtx.strokeStyle='#263060';tapCtx.lineWidth=3;
  tapCtx.beginPath();tapCtx.moveTo(cx-52,padY);tapCtx.lineTo(cx-18,rocketY);tapCtx.stroke();
  tapCtx.beginPath();tapCtx.moveTo(cx+52,padY);tapCtx.lineTo(cx+18,rocketY);tapCtx.stroke();

  // Дым
  if(tapHeat>15&&tapFrame%2===0){
    for(let i=0;i<2;i++) SMOKE_P.push({x:cx+(-14+i*14)+(Math.random()-.5)*6,y:rocketY,vx:(Math.random()-.5)*1.2,vy:-1.2-Math.random()*.8,r:3+Math.random()*5,life:.5+Math.random()*.3});
  }
  for(let i=SMOKE_P.length-1;i>=0;i--){
    const s=SMOKE_P[i];s.x+=s.vx;s.y+=s.vy;s.r+=.25;s.life-=.018;
    if(s.life<=0){SMOKE_P.splice(i,1);continue;}
    tapCtx.beginPath();tapCtx.arc(s.x,s.y,s.r,0,Math.PI*2);
    tapCtx.fillStyle=`rgba(180,200,230,${s.life*.5*(tapHeat/100)})`;tapCtx.fill();
  }

  // Пламя
  if(tapHeat>5){
    const fH=12+tapHeat*.6+Math.sin(tapFrame*.35)*3;
    for(let e=0;e<3;e++){
      const ex=cx-11+e*11;
      const fg=tapCtx.createLinearGradient(ex,rocketY,ex,rocketY+fH);
      fg.addColorStop(0,'rgba(140,180,255,.95)');fg.addColorStop(.4,'rgba(80,100,252,.7)');fg.addColorStop(1,'rgba(0,0,0,0)');
      tapCtx.beginPath();tapCtx.moveTo(ex-4,rocketY);tapCtx.lineTo(ex,rocketY+fH);tapCtx.lineTo(ex+4,rocketY);
      tapCtx.fillStyle=fg;tapCtx.fill();
    }
    const eg=tapCtx.createRadialGradient(cx,rocketY,0,cx,rocketY,tapHeat*.5);
    eg.addColorStop(0,`rgba(79,142,247,${tapHeat/180})`);eg.addColorStop(1,'rgba(0,0,0,0)');
    tapCtx.beginPath();tapCtx.arc(cx,rocketY,tapHeat*.5,0,Math.PI*2);tapCtx.fillStyle=eg;tapCtx.fill();
  }

  // Ракета (масштаб относительно высоты canvas)
  const sc=Math.max(0.55,Math.min(1.0,H/260));
  tapCtx.save();tapCtx.translate(cx,rocketY);tapCtx.scale(sc,sc);
  tapCtx.beginPath();tapCtx.moveTo(2,5);tapCtx.lineTo(13,40);tapCtx.lineTo(13,88);tapCtx.lineTo(2,88);tapCtx.fillStyle='rgba(0,0,0,.2)';tapCtx.fill();
  tapCtx.beginPath();tapCtx.moveTo(0,-68);tapCtx.lineTo(13,40);tapCtx.lineTo(13,88);tapCtx.lineTo(-13,88);tapCtx.lineTo(-13,40);tapCtx.closePath();
  const rbg=tapCtx.createLinearGradient(-13,0,13,0);
  rbg.addColorStop(0,'#8aaac8');rbg.addColorStop(.22,'#c8ddf0');rbg.addColorStop(.5,'#eef8ff');rbg.addColorStop(.78,'#b8d0e8');rbg.addColorStop(1,'#6888a0');
  tapCtx.fillStyle=rbg;tapCtx.fill();tapCtx.strokeStyle='#7090ae';tapCtx.lineWidth=.8;tapCtx.stroke();
  tapCtx.beginPath();tapCtx.moveTo(0,-68);tapCtx.lineTo(13,40);tapCtx.lineTo(-13,40);tapCtx.closePath();
  const rng=tapCtx.createLinearGradient(-13,0,13,0);
  rng.addColorStop(0,'#a0c0d8');rng.addColorStop(.45,'#e0f2ff');rng.addColorStop(1,'#88a8c0');
  tapCtx.fillStyle=rng;tapCtx.fill();tapCtx.strokeStyle='#7090ae';tapCtx.lineWidth=.8;tapCtx.stroke();
  tapCtx.beginPath();tapCtx.arc(0,-68,3.5,0,Math.PI*2);tapCtx.fillStyle='#c0d8f0';tapCtx.fill();
  const rwg=tapCtx.createRadialGradient(-2,-14,1,0,-12,10);
  rwg.addColorStop(0,'rgba(200,240,255,.95)');rwg.addColorStop(.4,'rgba(100,180,255,.8)');rwg.addColorStop(1,'rgba(40,100,180,.6)');
  tapCtx.beginPath();tapCtx.ellipse(0,-12,8,11,0,0,Math.PI*2);tapCtx.fillStyle=rwg;tapCtx.fill();
  tapCtx.strokeStyle='rgba(180,220,255,.6)';tapCtx.lineWidth=1;tapCtx.stroke();
  tapCtx.beginPath();tapCtx.ellipse(-2.5,-17,3,4,-.4,0,Math.PI*2);tapCtx.fillStyle='rgba(255,255,255,.25)';tapCtx.fill();
  tapCtx.strokeStyle='rgba(79,142,247,.35)';tapCtx.lineWidth=1.5;
  tapCtx.beginPath();tapCtx.moveTo(-12,16);tapCtx.lineTo(12,16);tapCtx.stroke();
  tapCtx.beginPath();tapCtx.moveTo(-12,46);tapCtx.lineTo(12,46);tapCtx.stroke();
  tapCtx.fillStyle='rgba(79,142,247,.2)';tapCtx.fillRect(-12,23,24,16);
  tapCtx.fillStyle='rgba(140,190,255,.85)';tapCtx.font='bold 7px -apple-system';tapCtx.textAlign='center';tapCtx.fillText('MarsX',0,34);
  tapCtx.beginPath();tapCtx.moveTo(-13,48);tapCtx.lineTo(-30,78);tapCtx.lineTo(-30,88);tapCtx.lineTo(-13,84);tapCtx.closePath();
  const rlf=tapCtx.createLinearGradient(-30,0,-13,0);rlf.addColorStop(0,'#4a6080');rlf.addColorStop(1,'#8aaac8');
  tapCtx.fillStyle=rlf;tapCtx.fill();tapCtx.strokeStyle='#4a6080';tapCtx.lineWidth=.7;tapCtx.stroke();
  tapCtx.beginPath();tapCtx.moveTo(13,48);tapCtx.lineTo(30,78);tapCtx.lineTo(30,88);tapCtx.lineTo(13,84);tapCtx.closePath();
  const rrf=tapCtx.createLinearGradient(13,0,30,0);rrf.addColorStop(0,'#8aaac8');rrf.addColorStop(1,'#4a6080');
  tapCtx.fillStyle=rrf;tapCtx.fill();tapCtx.strokeStyle='#4a6080';tapCtx.lineWidth=.7;tapCtx.stroke();
  for(let e2=0;e2<3;e2++){
    const ex2=-11+e2*11;
    tapCtx.beginPath();tapCtx.moveTo(ex2-5,84);tapCtx.lineTo(ex2-6,93);tapCtx.lineTo(ex2+6,93);tapCtx.lineTo(ex2+5,84);
    tapCtx.closePath();tapCtx.fillStyle='#3a4a60';tapCtx.fill();
    if(tapHeat>8){
      const rng2=tapCtx.createRadialGradient(ex2,88,0,ex2,88,7);
      rng2.addColorStop(0,`rgba(100,150,255,${tapHeat/150})`);rng2.addColorStop(1,'rgba(0,0,0,0)');
      tapCtx.beginPath();tapCtx.arc(ex2,90,7,0,Math.PI*2);tapCtx.fillStyle=rng2;tapCtx.fill();
    }
  }
  tapCtx.restore();

  // Шкала топлива
  const bw=W-28,bx2=14,by2=H-12,bh=5;
  tapCtx.fillStyle='rgba(255,255,255,.06)';tapCtx.beginPath();tapCtx.roundRect(bx2,by2,bw,bh,3);tapCtx.fill();
  if(tapHeat>0){
    const hfg=tapCtx.createLinearGradient(bx2,0,bx2+bw,0);
    hfg.addColorStop(0,'#4f8ef7');hfg.addColorStop(.5,'#7c5cfc');hfg.addColorStop(1,'#f5c518');
    tapCtx.fillStyle=hfg;tapCtx.beginPath();tapCtx.roundRect(bx2,by2,bw*(tapHeat/100),bh,3);tapCtx.fill();
  }
  const hlbl=tapHeat>85?'🔥 Готово к старту!':tapHeat>40?`⚡ Прогрев ${Math.floor(tapHeat)}%`:'Тапай — добывай топливо';
  tapCtx.fillStyle=tapHeat>85?'#f5c518':tapHeat>40?'#7c5cfc':'rgba(107,125,179,.8)';
  tapCtx.font=`${tapHeat>85?'bold ':''}10px -apple-system`;
  tapCtx.textAlign='center';tapCtx.fillText(hlbl,W/2,by2-5);

  requestAnimationFrame(animateTap);
}

function updateMainUI(){
  document.getElementById('stat-fuel').innerHTML=`${Math.floor(G.fuel)} <span>F</span>`;
  document.getElementById('stat-gc').innerHTML=`${Math.floor(G.gc)} <span>GC</span>`;
  document.getElementById('stat-ci').innerHTML=`${Math.floor(G.ci)} <span>CI</span>`;
  document.getElementById('player-rank').textContent=getRank(G.ci);
  const pct=Math.min(100,(G.fuel/G.fuelMax)*100);
  document.getElementById('fuel-fill').style.width=pct+'%';
  document.getElementById('fuel-pct').textContent=Math.floor(pct)+'%';
  const crew=G.crewCount, bonus=Math.min(30,crew*2);
  if(document.getElementById('crew-count')) document.getElementById('crew-count').textContent=crew;
  if(document.getElementById('crew-bonus-fill')) document.getElementById('crew-bonus-fill').style.width=(bonus/30*100)+'%';
  if(document.getElementById('crew-bonus-label')) document.getElementById('crew-bonus-label').textContent=`+${bonus}% к добыче топлива`;
  // Ежедневный индикатор
  const dailyBtn=document.getElementById('daily-indicator');
  if(dailyBtn) dailyBtn.style.display=G.dailyClaimedToday?'none':'flex';
  // Кнопка сброса застрявшего полёта
  const resetBtn=document.getElementById('reset-flight-btn');
  // Показываем только если в полёте И нет автопилота (при автопилоте полёт штатный)
  if(resetBtn) resetBtn.style.display=(G.inFlight && !G.inventory.autopilot)?'block':'none';
}

function passiveTick(){
  if(G.passiveIncome>0){
    G.fuel=Math.min(G.fuelMax,G.fuel+G.passiveIncome/60);
    updateMainUI();
  }
  if(G.inventory.droid && tapFrame%300===0) doTap(null);
}
function minerTick(){
  for(const key of Object.keys(G.miners)){
    const m=G.miners[key];if(!m||m.level<1)continue;
    const rate={1:2,2:5,3:12}[m.level]||2, cap={1:200,2:500,3:1200}[m.level]||200;
    m.stored=Math.min(cap,(m.stored||0)+rate);
  }
}

// ══════════════════════════════════════════
//  TAP
// ══════════════════════════════════════════

function doTap(e){
  const now=Date.now();
  const thresh=G.inventory.combo_boost?3:5;
  if(now-G.lastTap<400) G.comboCount++; else G.comboCount=1;
  G.lastTap=now;
  clearTimeout(G.comboTimer);G.comboTimer=setTimeout(()=>G.comboCount=0,1500);
  let mult=1;
  if(G.comboCount>=thresh*2) mult=3; else if(G.comboCount>=thresh) mult=2;
  const fBuf=G.inventory.fuel_boost?2:1;
  const crew=1+Math.min(30,G.crewCount*2)/100;
  const vip=G.inventory.vip?1.3:1;
  const earned=G.tapPower*mult*fBuf*crew*vip;
  G.fuel=Math.min(G.fuelMax,G.fuel+earned);
  if(e) spawnFloat(e,`+${earned.toFixed(1)}F`,mult>=3?'#f5c518':'#4f8ef7');
  if(mult>=2){
    const el=document.getElementById('combo-display');
    el.textContent=mult>=3?'×3 MEGA!':'×2 COMBO';
    el.classList.add('show');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),900);
  }
  updateMainUI();
  if(window.Telegram?.WebApp?.HapticFeedback)
    mult>=3?Telegram.WebApp.HapticFeedback.notificationOccurred('success'):Telegram.WebApp.HapticFeedback.impactOccurred('light');
}
function spawnFloat(e,text,color){
  const el=document.createElement('div');el.className='float-num';
  el.style.cssText=`color:${color};left:${(e.clientX||window.innerWidth/2)-20}px;top:${(e.clientY||window.innerHeight/2)-20}px;text-shadow:0 0 12px ${color}80`;
  el.textContent=text;document.body.appendChild(el);el.addEventListener('animationend',()=>el.remove());
}

// ══════════════════════════════════════════
//  PLANETS
// ══════════════════════════════════════════
function renderPlanets(){
  const list=document.getElementById('planets-list');list.innerHTML='';
  PLANETS.forEach(p=>{
    const locked=G.ci<p.minCI,hasMiner=G.miners[p.key]?.level>=1;
    const div=document.createElement('div');div.className=`planet-item ${locked?'locked':''}`;
    div.innerHTML=`
      <div class="planet-emoji">${p.emoji}</div>
      <div class="planet-info">
        <div class="planet-name">${p.name}</div>
        <div class="planet-stats">
          <span>⏱ ${p.duration<60?p.duration+'с':p.duration/60+'м'}</span>
          <span>💰 ${p.reward} GC</span>
          <span>⬆️ +${p.ci} CI</span>
        </div>
        <div class="fuel-cost">${locked?'🔒 CI '+p.minCI:'⛽ '+p.fuelCost+' F'}</div>
        ${hasMiner?`<div class="miner-badge">⛏ Майнер ур.${G.miners[p.key].level}</div>`:''}
        ${G.inventory.autopilot?'<div style="font-size:10px;color:#7c5cfc;margin-top:2px">🛸 Автопилот активен</div>':''}
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
        <span class="risk-pill ${p.riskClass}">риск ${p.riskLabel}</span>
        <span style="font-size:18px;color:var(--muted)">${locked?'🔒':'›'}</span>
      </div>`;
    if(!locked) div.onclick=()=>launchFlight(p);
    list.appendChild(div);
  });
}

// ══════════════════════════════════════════
//  FLIGHT
// ══════════════════════════════════════════
let flightInterval=null,flightCtx=null,flightAnimId=null;
let fStars=[],fNebulas=[],fTrail=[],fShipX,fShipY,fFrame=0,fPhase='warp';

async function launchFlight(planet){
  if(G.inFlight){showToast('Вы уже в полёте!');return;}
  if(G.fuel<planet.fuelCost){showToast(`Нужно ${planet.fuelCost} F топлива`);return;}
  const res=await apiPost('/start_flight',{planet_key:planet.key,current_fuel:Math.floor(G.fuel)});
  if(res?.status!=='success'){showToast(res?.message||'Ошибка запуска');return;}
  G.fuel-=planet.fuelCost;G.inFlight=true;G.currentPlanet=planet;G.bonusObjCount=0;
  updateTapPlanet(planet.key);
  // Если автопилот — показываем инфо и возвращаемся на главный
  if(G.inventory.autopilot){
    showToast(`🛸 Автопилот активирован! Вернись через ${planet.duration/60} мин.`);
    updateMainUI();
    return;
  }
  showScreen('flight-screen');
  startFlightAnim(planet);
}

function startFlightAnim(planet){
  const canvas=document.getElementById('flight-canvas');
  canvas.width=window.innerWidth;canvas.height=window.innerHeight;
  flightCtx=canvas.getContext('2d');
  fShipX=canvas.width/2;fShipY=canvas.height*.52;
  fFrame=0;fPhase='warp';fStars=[];fNebulas=[];fTrail=[];
  for(let i=0;i<300;i++) fStars.push(newFStar(canvas));
  for(let i=0;i<5;i++) fNebulas.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:80+Math.random()*120,c:i%2===0?'79,89,200':'120,60,180',o:.03+Math.random()*.04});
  document.getElementById('flight-dest').textContent=`→ ${planet.name} ${planet.emoji}`;
  let timeLeft=planet.duration;
  updateFlightTimer(timeLeft);
  clearInterval(flightInterval);
  flightInterval=setInterval(()=>{
    timeLeft--;updateFlightTimer(timeLeft);
    if(timeLeft===Math.floor(planet.duration*.8)) fPhase='cruise';
    if(timeLeft===Math.floor(planet.duration*.15)) fPhase='approach';
    if(timeLeft%7===0&&timeLeft>4) spawnFlightEvent();
    if(timeLeft%9===0) spawnSpaceObj(canvas);
    if(G.inventory.auto_turret&&timeLeft%3===0) autoShoot();
    if(timeLeft<=0){clearInterval(flightInterval);cancelAnimationFrame(flightAnimId);finalizeFlight(planet);}
  },1000);
  flightLoop(canvas);
}

function newFStar(c){return{x:Math.random()*c.width,y:Math.random()*c.height,r:.3+Math.random()*1.5,speed:Math.random()*8+1,opacity:.2+Math.random()*.8,color:Math.random()>.9?`255,${180+Math.floor(Math.random()*75)},${100+Math.floor(Math.random()*100)}`:'255,255,255'};}

function flightLoop(canvas){
  const ctx=flightCtx,W=canvas.width,H=canvas.height;fFrame++;
  ctx.fillStyle='#000008';ctx.fillRect(0,0,W,H);
  for(const n of fNebulas){n.x-=.2;if(n.x+n.r<0){n.x=W+n.r;n.y=Math.random()*H;}
    const g=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,n.r);g.addColorStop(0,`rgba(${n.c},${n.o})`);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,Math.PI*2);ctx.fill();}
  const wf=fPhase==='warp'?1:fPhase==='approach'?.3:.7;
  for(const s of fStars){s.y+=s.speed*wf;if(s.y>H){s.y=0;s.x=Math.random()*W;}
    ctx.beginPath();ctx.moveTo(s.x,s.y);ctx.lineTo(s.x,s.y-s.speed*wf*4);ctx.strokeStyle=`rgba(${s.color},${s.opacity*wf})`;ctx.lineWidth=s.r;ctx.stroke();}
  if(fPhase==='warp'){for(let i=0;i<6;i++){const t=(fFrame*.05+i/6)%1,r=t*H*.8,a=(1-t)*.06;ctx.beginPath();ctx.ellipse(W/2,H*.4,r*.5,r*.2,0,0,Math.PI*2);ctx.strokeStyle=`rgba(79,142,247,${a})`;ctx.lineWidth=2;ctx.stroke();}}
  if(fPhase==='approach'){const pR=40+60,px=W*.65,py=H*.25;const pg=ctx.createRadialGradient(px-pR*.3,py-pR*.3,pR*.1,px,py,pR);pg.addColorStop(0,'#3a1f6e');pg.addColorStop(.6,'#1a0f3a');pg.addColorStop(1,'#080412');ctx.beginPath();ctx.arc(px,py,pR,0,Math.PI*2);ctx.fillStyle=pg;ctx.fill();ctx.strokeStyle='rgba(124,92,252,.4)';ctx.lineWidth=2;ctx.stroke();}
  fTrail.push({x:fShipX,y:fShipY+26,o:1});if(fTrail.length>25)fTrail.shift();
  fTrail.forEach((t,i)=>{const prog=i/fTrail.length;ctx.beginPath();ctx.arc(t.x,t.y,(1-prog)*5,0,Math.PI*2);ctx.fillStyle=`rgba(79,142,247,${prog*.5})`;ctx.fill();});
  const fl=20+Math.sin(fFrame*.2)*8,fg=ctx.createLinearGradient(fShipX,fShipY+22,fShipX,fShipY+22+fl);
  fg.addColorStop(0,'rgba(120,180,255,.9)');fg.addColorStop(.5,'rgba(79,100,252,.6)');fg.addColorStop(1,'rgba(0,0,0,0)');
  ctx.beginPath();ctx.moveTo(fShipX-7,fShipY+22);ctx.lineTo(fShipX,fShipY+22+fl);ctx.lineTo(fShipX+7,fShipY+22);ctx.fillStyle=fg;ctx.fill();
  drawShip(ctx,fShipX,fShipY);
  flightAnimId=requestAnimationFrame(()=>flightLoop(canvas));
}

function drawShip(ctx,x,y){
  ctx.save();ctx.translate(x,y);
  ctx.beginPath();ctx.moveTo(0,-30);ctx.lineTo(13,8);ctx.lineTo(9,20);ctx.lineTo(-9,20);ctx.lineTo(-13,8);ctx.closePath();ctx.fillStyle='#c8d8ec';ctx.fill();ctx.strokeStyle='#8aaac8';ctx.lineWidth=.8;ctx.stroke();
  ctx.beginPath();ctx.ellipse(0,-10,6,9,0,0,Math.PI*2);const cg=ctx.createRadialGradient(-2,-14,1,-1,-10,8);cg.addColorStop(0,'rgba(160,220,255,.95)');cg.addColorStop(1,'rgba(60,120,200,.7)');ctx.fillStyle=cg;ctx.fill();
  ctx.beginPath();ctx.moveTo(-11,6);ctx.lineTo(-28,20);ctx.lineTo(-20,25);ctx.lineTo(-9,18);ctx.closePath();ctx.fillStyle='#8fa8c4';ctx.fill();ctx.strokeStyle='#6a86a0';ctx.lineWidth=.7;ctx.stroke();
  ctx.beginPath();ctx.moveTo(11,6);ctx.lineTo(28,20);ctx.lineTo(20,25);ctx.lineTo(9,18);ctx.closePath();ctx.fillStyle='#8fa8c4';ctx.fill();ctx.strokeStyle='#6a86a0';ctx.lineWidth=.7;ctx.stroke();
  ctx.beginPath();ctx.moveTo(-7,20);ctx.lineTo(-6,28);ctx.lineTo(6,28);ctx.lineTo(7,20);ctx.fillStyle='#4a6080';ctx.fill();
  if(G.inventory.blaster_1||G.inventory.blaster_2){ctx.fillStyle='#e74c3c';ctx.beginPath();ctx.rect(-17,10,5,8);ctx.fill();ctx.beginPath();ctx.rect(12,10,5,8);ctx.fill();}
  ctx.restore();
}

const SPACE_OBJ=[{e:'☄️',type:'asteroid',fw:5,label:'+5F'},{e:'💎',type:'gem',fw:15,label:'+15F'},{e:'👽',type:'alien',fw:20,label:'+20GC'},{e:'🛸',type:'ufo',fw:35,label:'+35GC'},{e:'🌀',type:'anomaly',fw:10,label:'+10F'},{e:'💥',type:'hazard',fw:-10,label:'-10GC'}];
const FLIGHT_EVT=[{text:'Метеоритный поток!',t:'bad'},{text:'Пространственная аномалия...',t:''},{text:'Двигатели в норме.',t:'good'},{text:'Солнечный ветер — попутный.',t:'good'},{text:'Ионный шторм по борту!',t:'bad'},{text:'Пираты на радаре!',t:'bad'},{text:'Сигнал неизвестного происхождения.',t:''},{text:'Гравитационная рябь.',t:'bad'}];

function spawnSpaceObj(canvas){
  const def=SPACE_OBJ[Math.floor(Math.random()*SPACE_OBJ.length)];
  const el=document.createElement('div');el.className='space-obj';
  const sx=30+Math.random()*(canvas.width-80),sy=100+Math.random()*(canvas.height*.35);
  el.style.cssText=`left:${sx}px;top:${sy}px;--dx:${(Math.random()-.5)*120}px;--dy:${80+Math.random()*100}px;--dur:${2.5+Math.random()*2}s;font-size:${30+Math.floor(Math.random()*12)}px`;
  el.textContent=def.e;el.dataset.type=def.type;el.dataset.fw=def.fw;el.dataset.label=def.label;
  el.onclick=()=>hitObj(el,sx,sy);
  document.getElementById('flight-screen').appendChild(el);
  el.addEventListener('animationend',()=>{if(el.parentNode)el.remove();});
}
function hitObj(el,sx,sy){
  const fw=parseInt(el.dataset.fw),label=el.dataset.label,type=el.dataset.type;
  const mult=G.inventory.blaster_2?2.5:G.inventory.blaster_1?1.5:1;
  if(type==='hazard'){G.gc=Math.max(0,G.gc+fw);spawnFloat({clientX:sx+20,clientY:sy},`${fw} GC`,'#e74c3c');}
  else if(['alien','ufo'].includes(type)){const g=Math.round(fw*mult);G.gc+=g;spawnFloat({clientX:sx+20,clientY:sy},`+${g} GC`,'#f5c518');}
  else{const f=Math.round(fw*mult);G.fuel=Math.min(G.fuelMax,G.fuel+f);spawnFloat({clientX:sx+20,clientY:sy},`+${f}F`,'#4f8ef7');}
  G.bonusObjCount++;
  if(window.Telegram?.WebApp?.HapticFeedback) Telegram.WebApp.HapticFeedback.impactOccurred('medium');
  el.style.cssText='animation:none;opacity:0;transition:opacity .15s';setTimeout(()=>el.remove(),150);
  addFlightLog(label,type==='hazard'?'bad':'good');
}
function autoShoot(){document.querySelectorAll('.space-obj').forEach(o=>{if(Math.random()<.4) hitObj(o,parseInt(o.style.left),parseInt(o.style.top));});}
function spawnFlightEvent(){const e=FLIGHT_EVT[Math.floor(Math.random()*FLIGHT_EVT.length)];addFlightLog(e.text,e.t);}
function addFlightLog(msg,cls=''){
  const log=document.getElementById('flight-events');
  const d=document.createElement('div');d.className=`event-msg ${cls}`;d.textContent=msg;log.appendChild(d);
  while(log.children.length>2)log.removeChild(log.firstChild);
}
function updateFlightTimer(s){const m=Math.floor(s/60),sec=s%60;document.getElementById('flight-timer').textContent=`${m}:${sec.toString().padStart(2,'0')}`;}

async function finalizeFlight(planet){
  cancelAnimationFrame(flightAnimId);
  document.querySelectorAll('.space-obj').forEach(o=>o.remove());
  const riskMod=G.inventory.engine_2?-.15:G.inventory.engine_1?-.07:0;
  const success=Math.random()>(planet.risk+riskMod);
  G.inFlight=false;
  updateTapPlanet(planet.key);  // показываем планету куда прилетели
  setTimeout(()=>updateTapPlanet('earth'), 5000);  // через 5 сек домой
  if(success){G.gc+=planet.reward;G.ci+=planet.ci;}
  showScreen('arrival-screen');
  document.getElementById('arrival-emoji').textContent=planet.emoji;
  document.getElementById('arrival-title').textContent=success?'Успешная экспедиция!':'Крушение!';
  document.getElementById('arrival-subtitle').textContent=success?`Добыча на ${planet.name} завершена`:`Корабль потерян у ${planet.name}`;
  document.getElementById('rewards-box').innerHTML=success?`
    <div class="reward-row"><span class="reward-label">Получено GC</span><span class="reward-val">+${planet.reward} GC</span></div>
    <div class="reward-row"><span class="reward-label">Рейтинг CI</span><span class="reward-val green">+${planet.ci} CI</span></div>
    <div class="reward-row"><span class="reward-label">Объектов сбито</span><span class="reward-val" style="color:#b39dfa">${G.bonusObjCount}</span></div>`:`
    <div class="reward-row"><span class="reward-label">Исход</span><span class="reward-val" style="color:var(--red)">Провал</span></div>
    <div class="reward-row"><span class="reward-label" style="font-size:11px;color:var(--muted)">Купи щит или автопилот в магазине</span><span></span></div>`;
  updateMainUI();renderPlanets();
  await apiPost('/finalize_flight',{success,planet_key:planet.key,bonus_fuel:G.bonusObjCount*5});
  await apiPost('/report_asteroids',{count:G.bonusObjCount});
}

// ══════════════════════════════════════════
//  SHOP
// ══════════════════════════════════════════
function setShopTab(tab){
  G.shopTab=tab;
  document.querySelectorAll('.shop-tab').forEach((t,i)=>{
    const tabs=['boosters','parts','weapons','autopilot'];
    t.classList.toggle('active',tabs[i]===tab);
  });
  renderShop();
}
function renderShop(){
  const list=document.getElementById('shop-items');list.innerHTML='';
  document.getElementById('shop-gc-display').textContent=`${Math.floor(G.gc)} GC`;
  (SHOP[G.shopTab]||[]).forEach(item=>{
    const owned=G.inventory[item.id];
    const reqMet=!item.requires||G.inventory[item.requires];
    const canAfford=item.currency==='gc'?G.gc>=item.price:true;
    const blocked=item.requires&&!reqMet;
    const div=document.createElement('div');div.className=`shop-item ${owned&&item.unique?'owned':''}`;
    const btnText=owned&&item.unique?'✓ Куплено':blocked?'🔒 Нужен '+item.requires:item.currency==='stars'?`⭐ ${item.price}`:`${item.price} GC`;
    const btnDis=(owned&&item.unique)||blocked;
    div.innerHTML=`
      <div class="shop-icon">${item.emoji}</div>
      <div class="shop-info">
        <div class="shop-name">${item.name}</div>
        <div class="shop-desc">${item.desc}</div>
        <div class="shop-price ${item.currency==='gc'?'gc':''}">${item.currency==='stars'?'⭐ Stars':'💰 GC'}: ${item.price}</div>
      </div>
      <button class="shop-btn ${btnDis?'owned-btn':''}" ${btnDis?'disabled':''} onclick="buyItem('${item.id}')">${btnText}</button>`;
    list.appendChild(div);
  });
}
async function buyItem(iid){
  const all=[...SHOP.boosters,...SHOP.parts,...SHOP.weapons,...SHOP.autopilot];
  const item=all.find(i=>i.id===iid);if(!item)return;
  if(item.requires&&!G.inventory[item.requires]){showToast('Сначала купи: '+item.requires);return;}
  if(item.unique&&G.inventory[iid]){showToast('Уже куплено');return;}
  if(item.currency==='gc'){
    if(G.gc<item.price){showToast('Недостаточно GC');return;}
    G.gc-=item.price;
  }
  // Локальный эффект
  if(iid==='instant_fuel') G.fuel=G.fuelMax;
  else if(iid==='tank_ext'){G.fuelMax=1200;G.inventory.tank_ext=true;}
  else if(iid==='gc_1000') G.gc+=1000;
  else if(iid==='gc_5000') G.gc+=6000;
  else if(iid==='gc_15000') G.gc+=20000;
  else if(item.stackable) G.inventory[iid]=(G.inventory[iid]||0)+1;
  else G.inventory[iid]=true;
  const res=await apiPost('/buy_item',{item_id:iid,price:item.price,currency:item.currency});
  if(res?.status==='success'){showToast(`✅ ${item.name} — получено!`);updateMainUI();renderShop();}
  else{showToast('Ошибка покупки');if(item.currency==='gc') G.gc+=item.price;}
}

// ══════════════════════════════════════════
//  MINERS
// ══════════════════════════════════════════
function showMiners(){showScreen('miners-screen');renderMiners();}
function renderMiners(){
  const list=document.getElementById('miners-list');list.innerHTML='';
  PLANETS.forEach(p=>{
    if(G.ci<p.minCI)return;
    const m=G.miners[p.key]||{level:0,stored:0};
    const div=document.createElement('div');div.className='miner-card';
    if(m.level===0){
      div.innerHTML=`<div class="miner-top"><div style="font-size:32px">${p.emoji}</div><div style="flex:1"><div class="miner-planet-name">${p.name}</div><div class="miner-resource">${p.resEmoji} ${p.resource} — не построен</div></div></div><button class="miner-btn build" onclick="buildMiner('${p.key}',300)">Построить — 300 GC</button>`;
    }else{
      const cap={1:200,2:500,3:1200}[m.level]||200,rate={1:2,2:5,3:12}[m.level]||2;
      // Считаем накопленное с учётом времени офлайна
      const now=Date.now()/1000;
      const lastCollect = m.last_collected || m.built_at || now;
      const minsOffline = Math.max(0,(now-lastCollect)/60);
      const earnedOffline = minsOffline * rate;
      const realStored = Math.min(cap, (m.stored||0) + earnedOffline);
      const pct=Math.min(100,(realStored/cap)*100),upgCost={1:800,2:2000}[m.level];
      div.innerHTML=`
        <div class="miner-top"><div style="font-size:32px">${p.emoji}</div><div style="flex:1"><div class="miner-planet-name">${p.name}</div><div class="miner-resource">${p.resEmoji} ${p.resource} · ${rate} ед/мин</div></div><div class="miner-level-badge">Ур. ${m.level}</div></div>
        <div><div style="display:flex;justify-content:space-between;font-size:11px;color:var(--muted);margin-bottom:4px"><span>Хранилище</span><span>${Math.floor(realStored)} / ${cap}</span></div><div class="miner-bar"><div class="miner-bar-fill" style="width:${pct}%"></div></div></div>
        <div class="miner-actions">
          <button class="miner-btn collect ${realStored<1?'dis':''}" onclick="collectMiner('${p.key}')">Собрать ${Math.floor(realStored)} GC</button>
          ${m.level<3?`<button class="miner-btn upgrade ${G.gc>=upgCost?'':'dis'}" onclick="upgradeMiner('${p.key}',${upgCost})">Ур.${m.level+1} — ${upgCost} GC</button>`:`<button class="miner-btn dis">Макс.</button>`}
        </div>`;
    }
    list.appendChild(div);
  });
  if(!list.innerHTML) list.innerHTML='<div style="text-align:center;padding:40px;color:var(--muted);font-size:14px">Открой планеты чтобы строить майнеры</div>';
}
async function buildMiner(pk,cost){
  if(G.gc<cost){showToast(`Нужно ${cost} GC`);return;}
  G.gc-=cost;G.miners[pk]={level:1,stored:0};
  const r=await apiPost('/build_miner',{planet_key:pk,cost});
  if(r?.status==='success'){showToast('⛏ Майнер построен!');}
  else{G.gc+=cost;G.miners[pk]=null;showToast('Ошибка');}
  updateMainUI();renderMiners();renderPlanets();
}
async function upgradeMiner(pk,cost){
  if(G.gc<cost){showToast(`Нужно ${cost} GC`);return;}
  G.gc-=cost;G.miners[pk].level++;
  const r=await apiPost('/upgrade_miner',{planet_key:pk,cost});
  if(r?.status==='success'){showToast('⬆️ Майнер улучшен!');}
  else{G.gc+=cost;G.miners[pk].level--;showToast('Ошибка');}
  updateMainUI();renderMiners();
}
async function collectMiner(pk){
  const m=G.miners[pk];
  if(!m||m.level<1){showToast('Майнер не найден');return;}
  showToast('Собираем ресурсы...');
  const r=await apiPost('/collect_miner',{planet_key:pk});
  if(r?.status==='success'){
    const amount=r.data?.amount||0;
    G.gc+=amount;
    if(m) m.stored=0;
    // Обновляем время последнего сбора локально
    if(m) m.last_collected=Date.now()/1000;
    showToast(`💰 Собрано ${amount} GC!`);
    updateMainUI();renderMiners();
  } else {
    showToast(r?.message||'Ошибка сбора');
  }
}

// ══════════════════════════════════════════
//  QUESTS
// ══════════════════════════════════════════
function showQuests(){
  showScreen('quests-screen');renderQuests();
}
function renderQuests(){
  const list=document.getElementById('quests-list');list.innerHTML='';
  Object.entries(G.quests).forEach(([key,q])=>{
    const pct=Math.min(100,(q.current/q.target)*100);
    const div=document.createElement('div');div.className='miner-card';
    div.innerHTML=`
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <div style="font-size:14px;font-weight:600">${q.label}</div>
        <div style="font-size:12px;font-weight:700;color:var(--gold)">+${q.reward_gc} GC</div>
      </div>
      <div style="font-size:11px;color:var(--muted);margin-bottom:6px">${q.current} / ${q.target}</div>
      <div class="miner-bar"><div class="miner-bar-fill" style="width:${pct}%;background:${q.done?'var(--gold)':''}"></div></div>
      ${q.done?`<button class="miner-btn collect" style="margin-top:8px;width:100%" onclick="claimQuest('${key}')">Забрать награду!</button>`:''}`;
    list.appendChild(div);
  });
}
async function claimQuest(key){
  const r=await apiPost('/claim_quest',{quest_key:key});
  if(r?.status==='success'){
    G.gc+=G.quests[key].reward_gc;
    showToast(`🎯 Квест выполнен! +${G.quests[key].reward_gc} GC`);
    await loadUserData();renderQuests();
  }
}

// ══════════════════════════════════════════
//  LEAGUE
// ══════════════════════════════════════════
async function showLeague(){
  showScreen('league-screen');
  const list=document.getElementById('lb-list');
  list.innerHTML='<div style="text-align:center;padding:40px;color:var(--muted)">Загрузка...</div>';
  const res=await apiGet('/leaderboard');
  list.innerHTML='';
  if(!res||res.status!=='success'){list.innerHTML='<div style="text-align:center;padding:40px;color:var(--muted)">Ошибка</div>';return;}
  // Сезон
  const season=res.data?.season;
  if(season){
    const timeLeft=season.time_left||0;
    const days=Math.floor(timeLeft/86400),hours=Math.floor((timeLeft%86400)/3600);
    const seasonEl=document.createElement('div');
    seasonEl.style.cssText='background:rgba(79,142,247,.08);border:1px solid var(--accent);border-radius:14px;padding:12px 16px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center';
    seasonEl.innerHTML=`<div><div style="font-size:13px;font-weight:700;color:var(--accent)">${season.name||'Текущий сезон'}</div><div style="font-size:11px;color:var(--muted)">Приз топ-10: ${season.prize_gc||0} GC</div></div><div style="font-size:12px;color:var(--muted)">⏱ ${days}д ${hours}ч</div>`;
    list.appendChild(seasonEl);
  }
  (res.data?.top_by_ci||[]).forEach((p,i)=>{
    const isMe=p.telegram_id===G.tgId;
    const medal=i===0?'🥇':i===1?'🥈':i===2?'🥉':`#${i+1}`;
    const div=document.createElement('div');div.className=`lb-item ${isMe?'me':''}`;
    div.innerHTML=`<div class="lb-rank">${medal}</div><div class="lb-avatar">${(p.first_name||'?').slice(0,2).toUpperCase()}</div><div class="lb-name">${p.first_name||'Командор'}${isMe?' (ты)':''}</div><div class="lb-score">${(p.colonist_index?.score||0)} CI</div>`;
    list.appendChild(div);
  });
}

// ══════════════════════════════════════════
//  REFERRALS
// ══════════════════════════════════════════
function copyRef(){navigator.clipboard.writeText(document.getElementById('ref-link-text').textContent).then(()=>showToast('Ссылка скопирована!'));}
function shareRef(){
  const link=document.getElementById('ref-link-text').textContent;
  if(window.Telegram?.WebApp) Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent('Строю межзвёздную колонию в MarsX! Присоединяйся 🚀')}`);
  else copyRef();
}

// ══════════════════════════════════════════
//  NAVIGATION
// ══════════════════════════════════════════
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}
async function resetFlight(){
  const r = await apiPost('/reset_flight');
  if(r?.status === 'success'){
    G.inFlight = false;
    G.currentPlanet = null;
    updateTapPlanet('earth');
    showToast('Полёт сброшен — можешь лететь снова');
    updateMainUI();
    renderPlanets();
  } else {
    showToast('Ошибка сброса');
  }
}

function showMain(){
  clearInterval(flightInterval);cancelAnimationFrame(flightAnimId);
  document.querySelectorAll('.space-obj').forEach(o=>o.remove());
  showScreen('main-screen');updateMainUI();renderPlanets();
}

// ══════════════════════════════════════════
//  TOAST + STARS
// ══════════════════════════════════════════
let toastT;
function showToast(msg){
  const el=document.getElementById('toast');el.textContent=msg;el.classList.add('show');
  clearTimeout(toastT);toastT=setTimeout(()=>el.classList.remove('show'),2500);
}
function createStarsBg(){
  const bg=document.getElementById('stars-bg');
  for(let i=0;i<100;i++){
    const s=document.createElement('div');s.className='star-dot';
    const sz=Math.random()*2+.4;
    s.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*100}%;width:${sz}px;height:${sz}px;opacity:${Math.random()*.4+.1};--d:${2+Math.random()*4}s;animation-delay:${Math.random()*3}s`;
    bg.appendChild(s);
  }
}
