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
  setInterval(checkActiveEvent, 300000);
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
    if(d.current_skin && d.current_skin!=='default'){
      currentSkinColors={_skin:d.current_skin};
    }
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
    // Полная ширина и высота tap-area на телефоне
    const vw = window.innerWidth  || 375;
    const vh = window.innerHeight || 667;
    // Высота = всё что между stats и кнопкой запуска
    const statsH    = 100;  // stats-row примерно
    const bottomH   = 140;  // fuel-bar + launch-btn + nav
    const topBarH   = 72;
    const W = vw;
    const H = Math.max(vh - statsH - bottomH - topBarH, 200);
    c.width  = W;
    c.height = H;
    c.style.width  = W + "px";
    c.style.height = H + "px";
    rocketStars = null;
  }
  // Запускаем resize несколько раз — flex-контейнер разворачивается не сразу
  resize();
  setTimeout(resize, 50);
  setTimeout(resize, 200);
  setTimeout(resize, 600);
  window.addEventListener('resize', resize);
  window.addEventListener('resize', resize);
  c.addEventListener('click', e => onTap(e));
  c.addEventListener('touchstart', e=>{ e.preventDefault(); onTap(e.touches[0]); },{passive:false});
  animateTap();
}

// ── 6 уникальных ракет ──
const ROCKET_SKINS_DRAW = {

  // 1. Стандартная — классика MarsX
  default(ctx, cx, cy, f, heat, sc) {
    ctx.save(); ctx.translate(cx, cy); ctx.scale(sc, sc);
    // Корпус
    ctx.beginPath();
    ctx.moveTo(0,-68); ctx.lineTo(13,40); ctx.lineTo(13,90); ctx.lineTo(-13,90); ctx.lineTo(-13,40);
    ctx.closePath();
    const bg = ctx.createLinearGradient(-13,0,13,0);
    bg.addColorStop(0,'#8aaac8'); bg.addColorStop(.22,'#c8ddf0');
    bg.addColorStop(.5,'#eef8ff'); bg.addColorStop(.78,'#b8d0e8'); bg.addColorStop(1,'#6888a0');
    ctx.fillStyle=bg; ctx.fill(); ctx.strokeStyle='#7090ae'; ctx.lineWidth=.8; ctx.stroke();
    // Нос
    ctx.beginPath(); ctx.moveTo(0,-68); ctx.lineTo(13,40); ctx.lineTo(-13,40); ctx.closePath();
    const ng=ctx.createLinearGradient(-13,0,13,0);
    ng.addColorStop(0,'#a0c0d8'); ng.addColorStop(.45,'#e0f2ff'); ng.addColorStop(1,'#88a8c0');
    ctx.fillStyle=ng; ctx.fill(); ctx.strokeStyle='#7090ae'; ctx.lineWidth=.8; ctx.stroke();
    ctx.beginPath(); ctx.arc(0,-68,3.5,0,Math.PI*2); ctx.fillStyle='#c0d8f0'; ctx.fill();
    // Иллюминатор
    const wg=ctx.createRadialGradient(-2,-14,1,0,-12,10);
    wg.addColorStop(0,'rgba(200,240,255,.95)'); wg.addColorStop(.4,'rgba(100,180,255,.8)'); wg.addColorStop(1,'rgba(40,100,180,.6)');
    ctx.beginPath(); ctx.ellipse(0,-12,8,11,0,0,Math.PI*2); ctx.fillStyle=wg; ctx.fill();
    ctx.strokeStyle='rgba(180,220,255,.6)'; ctx.lineWidth=1; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(-2.5,-17,3,4,-.4,0,Math.PI*2); ctx.fillStyle='rgba(255,255,255,.25)'; ctx.fill();
    // Полосы и логотип
    ctx.strokeStyle='rgba(79,142,247,.35)'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(-12,18); ctx.lineTo(12,18); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-12,50); ctx.lineTo(12,50); ctx.stroke();
    ctx.fillStyle='rgba(79,142,247,.2)'; ctx.fillRect(-12,25,24,18);
    ctx.fillStyle='rgba(140,190,255,.85)'; ctx.font='bold 7px -apple-system'; ctx.textAlign='center';
    ctx.fillText('MarsX',0,37);
    // Крылья
    ctx.beginPath(); ctx.moveTo(-13,52); ctx.lineTo(-30,80); ctx.lineTo(-30,90); ctx.lineTo(-13,86); ctx.closePath();
    const lf=ctx.createLinearGradient(-30,0,-13,0); lf.addColorStop(0,'#4a6080'); lf.addColorStop(1,'#8aaac8');
    ctx.fillStyle=lf; ctx.fill(); ctx.strokeStyle='#4a6080'; ctx.lineWidth=.7; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(13,52); ctx.lineTo(30,80); ctx.lineTo(30,90); ctx.lineTo(13,86); ctx.closePath();
    const rf=ctx.createLinearGradient(13,0,30,0); rf.addColorStop(0,'#8aaac8'); rf.addColorStop(1,'#4a6080');
    ctx.fillStyle=rf; ctx.fill(); ctx.strokeStyle='#4a6080'; ctx.lineWidth=.7; ctx.stroke();
    // Сопла
    for(let e=0;e<3;e++){
      const ex=-11+e*11;
      ctx.beginPath(); ctx.moveTo(ex-5,86); ctx.lineTo(ex-6,95); ctx.lineTo(ex+6,95); ctx.lineTo(ex+5,86);
      ctx.closePath(); ctx.fillStyle='#3a4a60'; ctx.fill();
      if(heat>8){ const ng2=ctx.createRadialGradient(ex,90,0,ex,90,7); ng2.addColorStop(0,`rgba(100,150,255,${heat/150})`); ng2.addColorStop(1,'rgba(0,0,0,0)'); ctx.beginPath(); ctx.arc(ex,92,7,0,Math.PI*2); ctx.fillStyle=ng2; ctx.fill(); }
    }
    ctx.restore();
  },

  // 2. Золотая — широкая, с гравировкой
  gold(ctx, cx, cy, f, heat, sc) {
    ctx.save(); ctx.translate(cx, cy); ctx.scale(sc, sc);
    ctx.beginPath();
    ctx.moveTo(0,-65); ctx.lineTo(15,42); ctx.lineTo(16,90); ctx.lineTo(-16,90); ctx.lineTo(-15,42);
    ctx.closePath();
    const bg=ctx.createLinearGradient(-16,0,16,0);
    bg.addColorStop(0,'#c4820a'); bg.addColorStop(.25,'#f5c518'); bg.addColorStop(.5,'#ffe566'); bg.addColorStop(.75,'#e8a020'); bg.addColorStop(1,'#a06000');
    ctx.fillStyle=bg; ctx.fill(); ctx.strokeStyle='rgba(255,220,80,.5)'; ctx.lineWidth=1; ctx.stroke();
    // Нос с градиентом
    ctx.beginPath(); ctx.moveTo(0,-65); ctx.lineTo(15,42); ctx.lineTo(-15,42); ctx.closePath();
    const ng=ctx.createLinearGradient(-15,0,15,0);
    ng.addColorStop(0,'#e8a020'); ng.addColorStop(.5,'#fff8c0'); ng.addColorStop(1,'#c47000');
    ctx.fillStyle=ng; ctx.fill(); ctx.strokeStyle='rgba(255,220,80,.4)'; ctx.lineWidth=1; ctx.stroke();
    ctx.beginPath(); ctx.arc(0,-65,4,0,Math.PI*2); ctx.fillStyle='#ffe566'; ctx.fill();
    // Гравировка
    ctx.strokeStyle='rgba(160,100,0,.5)'; ctx.lineWidth=1;
    for(let i=0;i<3;i++){ ctx.beginPath(); ctx.moveTo(-13,5+i*22); ctx.lineTo(13,5+i*22); ctx.stroke(); }
    // Орнамент
    ctx.fillStyle='rgba(180,120,0,.4)';
    ctx.beginPath(); ctx.arc(-6,20,3,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(6,20,3,0,Math.PI*2); ctx.fill();
    // Иллюминатор золотой
    ctx.beginPath(); ctx.ellipse(0,-14,7,10,0,0,Math.PI*2);
    ctx.fillStyle='rgba(255,200,50,.75)'; ctx.fill();
    ctx.strokeStyle='rgba(255,240,100,.7)'; ctx.lineWidth=1; ctx.stroke();
    // Широкие крылья
    ctx.beginPath(); ctx.moveTo(-15,50); ctx.lineTo(-38,82); ctx.lineTo(-32,90); ctx.lineTo(-15,88); ctx.closePath();
    ctx.fillStyle='#c4820a'; ctx.fill(); ctx.strokeStyle='rgba(255,200,50,.4)'; ctx.lineWidth=1; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(15,50); ctx.lineTo(38,82); ctx.lineTo(32,90); ctx.lineTo(15,88); ctx.closePath();
    ctx.fillStyle='#c4820a'; ctx.fill(); ctx.stroke();
    // Оранжевые сопла
    for(let e=0;e<3;e++){
      const ex=-11+e*11;
      const fl=10+heat*.5+Math.sin(f*.3+e)*4;
      const fg=ctx.createLinearGradient(ex,90,ex,90+fl);
      fg.addColorStop(0,'rgba(255,160,30,.95)'); fg.addColorStop(.5,'rgba(255,100,0,.6)'); fg.addColorStop(1,'rgba(0,0,0,0)');
      if(heat>5){ ctx.beginPath(); ctx.moveTo(ex-5,90); ctx.lineTo(ex,90+fl); ctx.lineTo(ex+5,90); ctx.fillStyle=fg; ctx.fill(); }
      ctx.beginPath(); ctx.moveTo(ex-5,86); ctx.lineTo(ex-6,95); ctx.lineTo(ex+6,95); ctx.lineTo(ex+5,86);
      ctx.closePath(); ctx.fillStyle='#8a5000'; ctx.fill();
    }
    ctx.restore();
  },

  // 3. Стелс — угловатая, неоновый контур
  stealth(ctx, cx, cy, f, heat, sc) {
    ctx.save(); ctx.translate(cx, cy); ctx.scale(sc, sc);
    const neon = 0.5+Math.sin(f*.07)*0.3;
    // Угловатый корпус
    ctx.beginPath();
    ctx.moveTo(0,-72); ctx.lineTo(8,0); ctx.lineTo(14,90); ctx.lineTo(-14,90); ctx.lineTo(-8,0);
    ctx.closePath();
    ctx.fillStyle='#111120'; ctx.fill();
    ctx.strokeStyle=`rgba(0,255,100,${neon})`; ctx.lineWidth=1.2; ctx.stroke();
    // Нос острый
    ctx.beginPath(); ctx.moveTo(0,-72); ctx.lineTo(8,0); ctx.lineTo(-8,0); ctx.closePath();
    ctx.fillStyle='#1e1e30'; ctx.fill(); ctx.strokeStyle=`rgba(0,255,100,${neon})`; ctx.lineWidth=1; ctx.stroke();
    // Неоновые полосы пульсирующие
    for(let i=0;i<4;i++){
      const a=0.3+Math.sin(f*.06+i*.8)*0.25;
      ctx.strokeStyle=`rgba(0,255,100,${a})`; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(-7+i*2,8+i*18); ctx.lineTo(7-i*2,8+i*18); ctx.stroke();
    }
    // Зелёный иллюминатор
    ctx.beginPath(); ctx.ellipse(0,-20,5,7,0,0,Math.PI*2);
    ctx.fillStyle=`rgba(0,255,100,${neon})`; ctx.fill();
    ctx.strokeStyle=`rgba(150,255,150,${neon})`; ctx.lineWidth=1; ctx.stroke();
    // Угловые крылья
    ctx.beginPath(); ctx.moveTo(-14,52); ctx.lineTo(-36,90); ctx.lineTo(-14,90); ctx.closePath();
    ctx.fillStyle='#0a0a18'; ctx.fill(); ctx.strokeStyle=`rgba(0,255,100,${neon*.7})`; ctx.lineWidth=1; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(14,52); ctx.lineTo(36,90); ctx.lineTo(14,90); ctx.closePath();
    ctx.fillStyle='#0a0a18'; ctx.fill(); ctx.stroke();
    // Зелёное пламя
    for(let e=0;e<3;e++){
      const ex=-10+e*10;
      const fl=8+heat*.45+Math.sin(f*.3+e)*3;
      const fg=ctx.createLinearGradient(ex,90,ex,90+fl);
      fg.addColorStop(0,`rgba(0,255,100,.9)`); fg.addColorStop(1,'rgba(0,0,0,0)');
      if(heat>5){ ctx.beginPath(); ctx.moveTo(ex-4,90); ctx.lineTo(ex,90+fl); ctx.lineTo(ex+4,90); ctx.fillStyle=fg; ctx.fill(); }
      ctx.beginPath(); ctx.moveTo(ex-5,86); ctx.lineTo(ex-4,95); ctx.lineTo(ex+4,95); ctx.lineTo(ex+5,86);
      ctx.closePath(); ctx.fillStyle='#050510'; ctx.fill(); ctx.strokeStyle=`rgba(0,255,100,.3)`; ctx.lineWidth=.8; ctx.stroke();
    }
    ctx.restore();
  },

  // 4. Огненная — широкая, большой след
  fire(ctx, cx, cy, f, heat, sc) {
    ctx.save(); ctx.translate(cx, cy); ctx.scale(sc, sc);
    // Тело
    ctx.beginPath();
    ctx.moveTo(0,-65); ctx.lineTo(14,42); ctx.lineTo(14,90); ctx.lineTo(-14,90); ctx.lineTo(-14,42);
    ctx.closePath();
    const bg=ctx.createLinearGradient(-14,-65,14,90);
    bg.addColorStop(0,'#ff4500'); bg.addColorStop(.35,'#e74c3c'); bg.addColorStop(.7,'#c0392b'); bg.addColorStop(1,'#7b0000');
    ctx.fillStyle=bg; ctx.fill(); ctx.strokeStyle='rgba(255,120,50,.4)'; ctx.lineWidth=1; ctx.stroke();
    // Огненные узоры
    ctx.globalAlpha=.35;
    for(let i=0;i<5;i++){
      const fy=-30+i*18, fx=-8+Math.sin(f*.04+i)*5;
      ctx.strokeStyle='rgba(255,200,50,.9)'; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(fx,fy); ctx.quadraticCurveTo(fx+4,fy+8,fx+1,fy+16); ctx.stroke();
    }
    ctx.globalAlpha=1;
    // Нос
    ctx.beginPath(); ctx.moveTo(0,-65); ctx.lineTo(14,42); ctx.lineTo(-14,42); ctx.closePath();
    ctx.fillStyle='#ff6b35'; ctx.fill(); ctx.strokeStyle='rgba(255,150,50,.4)'; ctx.lineWidth=1; ctx.stroke();
    ctx.beginPath(); ctx.arc(0,-65,4,0,Math.PI*2); ctx.fillStyle='#ff9966'; ctx.fill();
    // Горящий иллюминатор
    const wf=0.6+Math.sin(f*.09)*0.3;
    ctx.beginPath(); ctx.ellipse(0,-14,7,10,0,0,Math.PI*2);
    ctx.fillStyle=`rgba(255,80,0,${wf})`; ctx.fill();
    ctx.strokeStyle=`rgba(255,180,50,${wf})`; ctx.lineWidth=1; ctx.stroke();
    // Зачёсанные крылья
    ctx.beginPath(); ctx.moveTo(-14,52); ctx.lineTo(-36,90); ctx.lineTo(-14,90); ctx.closePath();
    const ff=ctx.createLinearGradient(-36,0,-14,0); ff.addColorStop(0,'#7b0000'); ff.addColorStop(1,'#e74c3c');
    ctx.fillStyle=ff; ctx.fill(); ctx.strokeStyle='rgba(255,100,0,.3)'; ctx.lineWidth=1; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(14,52); ctx.lineTo(36,90); ctx.lineTo(14,90); ctx.closePath();
    ctx.fillStyle=ff; ctx.fill(); ctx.stroke();
    // Большое пламя
    for(let e=0;e<3;e++){
      const ex=-11+e*11;
      const fl=16+heat*.7+Math.sin(f*.25+e)*7;
      const fg=ctx.createLinearGradient(ex,90,ex,90+fl);
      fg.addColorStop(0,'rgba(255,100,0,.98)'); fg.addColorStop(.4,'rgba(255,50,0,.7)'); fg.addColorStop(1,'rgba(0,0,0,0)');
      if(heat>3){ ctx.beginPath(); ctx.moveTo(ex-7,90); ctx.lineTo(ex,90+fl); ctx.lineTo(ex+7,90); ctx.fillStyle=fg; ctx.fill(); }
      ctx.beginPath(); ctx.moveTo(ex-5,86); ctx.lineTo(ex-6,95); ctx.lineTo(ex+6,95); ctx.lineTo(ex+5,86);
      ctx.closePath(); ctx.fillStyle='#600000'; ctx.fill();
    }
    ctx.restore();
  },

  // 5. Галактическая — фиолетовая с туманностью
  galaxy(ctx, cx, cy, f, heat, sc) {
    ctx.save(); ctx.translate(cx, cy); ctx.scale(sc, sc);
    ctx.beginPath();
    ctx.moveTo(0,-68); ctx.lineTo(12,40); ctx.lineTo(12,90); ctx.lineTo(-12,90); ctx.lineTo(-12,40);
    ctx.closePath();
    const bg=ctx.createLinearGradient(-12,-68,12,90);
    bg.addColorStop(0,'#1a0050'); bg.addColorStop(.3,'#4a1090'); bg.addColorStop(.6,'#7c5cfc'); bg.addColorStop(1,'#2a0080');
    ctx.fillStyle=bg; ctx.fill();
    // Звёзды внутри
    ctx.save(); ctx.beginPath(); ctx.moveTo(0,-68); ctx.lineTo(12,40); ctx.lineTo(12,90); ctx.lineTo(-12,90); ctx.lineTo(-12,40); ctx.closePath(); ctx.clip();
    for(let i=0;i<14;i++){
      const sx=-8+Math.cos(i*1.9+f*.015)*9, sy=-52+i*11;
      const a=0.25+Math.sin(f*.08+i)*.18;
      ctx.beginPath(); ctx.arc(sx,sy,1,0,Math.PI*2);
      ctx.fillStyle=`rgba(255,255,255,${a})`; ctx.fill();
    }
    ctx.restore();
    // Пульсирующий контур
    const glow=0.3+Math.sin(f*.05)*.2;
    ctx.strokeStyle=`rgba(180,150,255,${glow+.2})`; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(0,-68); ctx.lineTo(12,40); ctx.lineTo(12,90); ctx.lineTo(-12,90); ctx.lineTo(-12,40); ctx.closePath(); ctx.stroke();
    // Нос
    ctx.beginPath(); ctx.moveTo(0,-68); ctx.lineTo(12,40); ctx.lineTo(-12,40); ctx.closePath();
    const ng=ctx.createLinearGradient(-12,0,12,0);
    ng.addColorStop(0,'#5a20c0'); ng.addColorStop(.5,'#b39dfa'); ng.addColorStop(1,'#4a10a0');
    ctx.fillStyle=ng; ctx.fill(); ctx.strokeStyle=`rgba(180,150,255,${glow})`; ctx.lineWidth=1; ctx.stroke();
    ctx.beginPath(); ctx.arc(0,-68,3.5,0,Math.PI*2); ctx.fillStyle='#c8aaff'; ctx.fill();
    // Туманность иллюминатор
    const wg=ctx.createRadialGradient(0,-14,1,0,-14,9);
    wg.addColorStop(0,'rgba(200,150,255,.9)'); wg.addColorStop(1,'rgba(80,20,180,.5)');
    ctx.beginPath(); ctx.ellipse(0,-14,7.5,10,0,0,Math.PI*2); ctx.fillStyle=wg; ctx.fill();
    ctx.strokeStyle=`rgba(200,160,255,${glow+.3})`; ctx.lineWidth=1; ctx.stroke();
    // Крылья
    ctx.beginPath(); ctx.moveTo(-12,50); ctx.lineTo(-30,80); ctx.lineTo(-30,90); ctx.lineTo(-12,86); ctx.closePath();
    ctx.fillStyle='#3a1080'; ctx.fill(); ctx.strokeStyle=`rgba(160,100,255,.4)`; ctx.lineWidth=1; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(12,50); ctx.lineTo(30,80); ctx.lineTo(30,90); ctx.lineTo(12,86); ctx.closePath();
    ctx.fillStyle='#3a1080'; ctx.fill(); ctx.stroke();
    // Фиолетовое пламя с частицами
    for(let e=0;e<3;e++){
      const ex=-10+e*10;
      const fl=12+heat*.55+Math.sin(f*.3+e)*5;
      const fg=ctx.createLinearGradient(ex,90,ex,90+fl);
      fg.addColorStop(0,'rgba(160,100,255,.95)'); fg.addColorStop(.5,'rgba(100,50,200,.5)'); fg.addColorStop(1,'rgba(0,0,0,0)');
      if(heat>5){ ctx.beginPath(); ctx.moveTo(ex-5,90); ctx.lineTo(ex,90+fl); ctx.lineTo(ex+5,90); ctx.fillStyle=fg; ctx.fill(); }
      ctx.beginPath(); ctx.moveTo(ex-5,86); ctx.lineTo(ex-6,95); ctx.lineTo(ex+6,95); ctx.lineTo(ex+5,86);
      ctx.closePath(); ctx.fillStyle='#200060'; ctx.fill();
    }
    // Магические частицы вокруг
    for(let i=0;i<5;i++){
      const a=f*.03+i*1.26;
      const px=Math.cos(a)*(16+i*3), py=-20+Math.sin(a*1.3)*30;
      const pa=0.2+Math.sin(f*.08+i)*.15;
      ctx.beginPath(); ctx.arc(px,py,1.2,0,Math.PI*2);
      ctx.fillStyle=`rgba(200,150,255,${pa})`; ctx.fill();
    }
    ctx.restore();
  },

  // 6. Нептуниум — ледяная, кристаллические крылья
  neptune(ctx, cx, cy, f, heat, sc) {
    ctx.save(); ctx.translate(cx, cy); ctx.scale(sc, sc);
    // Тонкий ледяной корпус
    ctx.beginPath();
    ctx.moveTo(0,-72); ctx.lineTo(10,30); ctx.lineTo(10,90); ctx.lineTo(-10,90); ctx.lineTo(-10,30);
    ctx.closePath();
    const bg=ctx.createLinearGradient(-10,-72,10,90);
    bg.addColorStop(0,'#e0f4ff'); bg.addColorStop(.25,'#80d0f8'); bg.addColorStop(.6,'#1a8abf'); bg.addColorStop(1,'#0a4a6e');
    ctx.fillStyle=bg; ctx.fill();
    // Ледяные трещины
    ctx.strokeStyle='rgba(255,255,255,.35)'; ctx.lineWidth=.8;
    ctx.beginPath(); ctx.moveTo(-6,-45); ctx.lineTo(0,-22); ctx.lineTo(7,5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(5,-35); ctx.lineTo(-2,8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-4,15); ctx.lineTo(6,35); ctx.stroke();
    // Ледяной контур
    ctx.strokeStyle='rgba(100,220,255,.5)'; ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.moveTo(0,-72); ctx.lineTo(10,30); ctx.lineTo(10,90); ctx.lineTo(-10,90); ctx.lineTo(-10,30); ctx.closePath(); ctx.stroke();
    // Острый нос
    ctx.beginPath(); ctx.moveTo(0,-72); ctx.lineTo(10,30); ctx.lineTo(-10,30); ctx.closePath();
    ctx.fillStyle='#c8ecff'; ctx.fill(); ctx.strokeStyle='rgba(100,220,255,.5)'; ctx.lineWidth=1; ctx.stroke();
    ctx.beginPath(); ctx.arc(0,-72,3,0,Math.PI*2); ctx.fillStyle='#e8f8ff'; ctx.fill();
    // Пульсирующий иллюминатор
    const wp=0.55+Math.sin(f*.07)*0.3;
    ctx.beginPath(); ctx.ellipse(0,-18,5.5,8,0,0,Math.PI*2);
    ctx.fillStyle=`rgba(100,220,255,${wp})`; ctx.fill();
    ctx.strokeStyle=`rgba(200,240,255,${wp+.2})`; ctx.lineWidth=1.2; ctx.stroke();
    // Кристаллические крылья — острые
    ctx.beginPath(); ctx.moveTo(-10,38); ctx.lineTo(-38,70); ctx.lineTo(-30,90); ctx.lineTo(-10,90); ctx.closePath();
    const cf=ctx.createLinearGradient(-38,0,-10,0);
    cf.addColorStop(0,'#0a4a6e'); cf.addColorStop(.5,'#1a8abf'); cf.addColorStop(1,'#80d0f8');
    ctx.fillStyle=cf; ctx.fill(); ctx.strokeStyle='rgba(100,220,255,.5)'; ctx.lineWidth=1; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(10,38); ctx.lineTo(38,70); ctx.lineTo(30,90); ctx.lineTo(10,90); ctx.closePath();
    ctx.fillStyle=cf; ctx.fill(); ctx.stroke();
    // Ледяное пламя
    for(let e=0;e<3;e++){
      const ex=-8+e*8;
      const fl=13+heat*.6+Math.sin(f*.3+e)*5;
      const fg=ctx.createLinearGradient(ex,90,ex,90+fl);
      fg.addColorStop(0,'rgba(100,220,255,.98)'); fg.addColorStop(.4,'rgba(150,240,255,.5)'); fg.addColorStop(1,'rgba(0,0,0,0)');
      if(heat>5){ ctx.beginPath(); ctx.moveTo(ex-4,90); ctx.lineTo(ex,90+fl); ctx.lineTo(ex+4,90); ctx.fillStyle=fg; ctx.fill(); }
      ctx.beginPath(); ctx.moveTo(ex-4,86); ctx.lineTo(ex-5,95); ctx.lineTo(ex+5,95); ctx.lineTo(ex+4,86);
      ctx.closePath(); ctx.fillStyle='#062030'; ctx.fill();
    }
    // Ледяные осколки
    for(let i=0;i<5;i++){
      const ix=(-12+i*6)+Math.sin(f*.04+i)*4;
      const iy=96+i*3;
      const ia=0.5-i*.08;
      ctx.save(); ctx.translate(ix,iy); ctx.rotate(f*.02+i);
      ctx.beginPath(); ctx.moveTo(0,-3); ctx.lineTo(2,1); ctx.lineTo(0,3); ctx.lineTo(-2,1); ctx.closePath();
      ctx.fillStyle=`rgba(150,230,255,${ia})`; ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  },
};

function animateTap() {
  if(!tapCtx){ requestAnimationFrame(animateTap); return; }
  const c=tapCtx.canvas, W=c.width, H=c.height;
  if(!W||H<10){ requestAnimationFrame(animateTap); return; }
  const cx=W/2;
  tapFrame++;
  if(tapHeat>0) tapHeat=Math.max(0,tapHeat-.4);
  const vis=PLANET_VISUALS[tapCurrentPlanet]||PLANET_VISUALS.earth;

  // Фон
  tapCtx.fillStyle=vis.bg; tapCtx.fillRect(0,0,W,H);

  // Звёзды
  if(!rocketStars){
    rocketStars=[];
    for(let i=0;i<80;i++) rocketStars.push({x:Math.random()*W,y:Math.random()*H*.62,r:.5+Math.random()*1.5,o:.15+Math.random()*.55});
  }
  for(const s of rocketStars){
    tapCtx.beginPath(); tapCtx.arc(s.x,s.y,s.r,0,Math.PI*2);
    tapCtx.fillStyle=`rgba(255,255,255,${s.o+Math.sin(tapFrame*.04+s.x)*.06})`; tapCtx.fill();
  }

  // Зарево
  const skyG=tapCtx.createRadialGradient(cx,H,0,cx,H,H*.75);
  skyG.addColorStop(0,vis.sky); skyG.addColorStop(1,'rgba(0,0,0,0)');
  tapCtx.fillStyle=skyG; tapCtx.fillRect(0,0,W,H);

  // Поверхность
  tapCtx.fillStyle=vis.ground;
  tapCtx.beginPath(); tapCtx.ellipse(cx,H+10,W*.9,28,0,Math.PI,Math.PI*2); tapCtx.fill();

  const padY   = H-Math.floor(H*.15);
  const rocketY = H-Math.floor(H*.27);

  // Платформа
  tapCtx.fillStyle='#1a2540';
  tapCtx.beginPath(); tapCtx.roundRect(cx-55,padY,110,13,3); tapCtx.fill();
  tapCtx.fillStyle='#263060'; tapCtx.fillRect(cx-62,padY-4,124,6);
  for(let i=0;i<3;i++){
    const lx=cx-36+i*36;
    tapCtx.fillStyle='#1e2e4a'; tapCtx.fillRect(lx-3,padY-30,6,30);
    tapCtx.fillStyle='#141e30'; tapCtx.fillRect(lx-7,padY-4,14,5);
  }
  tapCtx.strokeStyle='#263060'; tapCtx.lineWidth=3;
  tapCtx.beginPath(); tapCtx.moveTo(cx-52,padY); tapCtx.lineTo(cx-18,rocketY); tapCtx.stroke();
  tapCtx.beginPath(); tapCtx.moveTo(cx+52,padY); tapCtx.lineTo(cx+18,rocketY); tapCtx.stroke();

  // Дым
  if(tapHeat>15&&tapFrame%2===0){
    for(let i=0;i<2;i++) SMOKE_P.push({x:cx+(-14+i*14)+(Math.random()-.5)*6,y:rocketY,vx:(Math.random()-.5)*1.2,vy:-1.2-Math.random()*.8,r:3+Math.random()*5,life:.5+Math.random()*.3});
  }
  for(let i=SMOKE_P.length-1;i>=0;i--){
    const s=SMOKE_P[i]; s.x+=s.vx; s.y+=s.vy; s.r+=.25; s.life-=.018;
    if(s.life<=0){SMOKE_P.splice(i,1);continue;}
    tapCtx.beginPath(); tapCtx.arc(s.x,s.y,s.r,0,Math.PI*2);
    tapCtx.fillStyle=`rgba(180,200,230,${s.life*.5*(tapHeat/100)})`; tapCtx.fill();
  }

  // Ракета — выбираем скин
  const skinKey = (currentSkinColors && currentSkinColors._skin) || 'default';
  const drawFn  = ROCKET_SKINS_DRAW[skinKey] || ROCKET_SKINS_DRAW.default;
  const sc      = Math.max(0.55, Math.min(1.05, H/260));
  drawFn(tapCtx, cx, rocketY, tapFrame, tapHeat, sc);

  // Частицы тапа
  for(let i=TAP_P.length-1;i>=0;i--){
    const p=TAP_P[i]; p.x+=p.vx; p.y+=p.vy; p.vy+=.12; p.life-=.028;
    if(p.life<=0){TAP_P.splice(i,1);continue;}
    tapCtx.beginPath(); tapCtx.arc(p.x,p.y,p.r*p.life,0,Math.PI*2);
    tapCtx.fillStyle=`rgba(${p.c},${p.life})`; tapCtx.fill();
  }

  // Шкала прогрева/топлива
  const bw=W-28, bx2=14, by2=H-12, bh=5;
  tapCtx.fillStyle='rgba(255,255,255,.06)';
  tapCtx.beginPath(); tapCtx.roundRect(bx2,by2,bw,bh,3); tapCtx.fill();
  if(tapHeat>0){
    const hfg=tapCtx.createLinearGradient(bx2,0,bx2+bw,0);
    hfg.addColorStop(0,'#4f8ef7'); hfg.addColorStop(.5,'#7c5cfc'); hfg.addColorStop(1,'#f5c518');
    tapCtx.fillStyle=hfg; tapCtx.beginPath(); tapCtx.roundRect(bx2,by2,bw*(tapHeat/100),bh,3); tapCtx.fill();
  }
  const hlbl=tapHeat>85?'🔥 Готово к старту!':tapHeat>40?`⚡ Прогрев ${Math.floor(tapHeat)}%`:'Тапай — добывай топливо';
  tapCtx.fillStyle=tapHeat>85?'#f5c518':tapHeat>40?'#7c5cfc':'rgba(107,125,179,.8)';
  tapCtx.font=`${tapHeat>85?'bold ':''}10px -apple-system`;
  tapCtx.textAlign='center'; tapCtx.fillText(hlbl,W/2,by2-5);

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
//  SPIN — Колесо фортуны
// ══════════════════════════════════════════
let spinRewards = [], spinCanSpin = false, spinAnimating = false, spinAngle = 0;

async function showSpin(){
  showScreen('spin-screen');
  const res = await apiGet('/spin_info');
  if(res?.status === 'success'){
    spinRewards  = res.data.rewards;
    spinCanSpin  = res.data.can_spin;
    const next   = res.data.next_spin_in;
    const h = Math.floor(next/3600), m = Math.floor((next%3600)/60);
    document.getElementById('spin-next-time').textContent =
      spinCanSpin ? '✨ Бесплатное вращение доступно!' : `Следующий спин через ${h}ч ${m}м`;
    document.getElementById('spin-btn').disabled = !spinCanSpin;
    document.getElementById('spin-btn').style.opacity = spinCanSpin ? '1' : '0.5';
    drawSpinWheel(0);
  }
}

function drawSpinWheel(angle){
  const canvas = document.getElementById('spin-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height, cx = W/2, cy = H/2, r = cx - 8;
  ctx.clearRect(0,0,W,H);
  if(!spinRewards.length) return;
  const n     = spinRewards.length;
  const slice = (Math.PI*2) / n;

  spinRewards.forEach((reward, i) => {
    const start = angle + i * slice - Math.PI/2;  // 0й сектор начинается сверху
    const end   = start + slice;
    // Сектор
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, end);
    ctx.closePath();
    ctx.fillStyle = reward.color || '#4f8ef7';
    ctx.globalAlpha = 0.85;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#07091a';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Текст
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(start + slice/2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px -apple-system';
    ctx.shadowColor = 'rgba(0,0,0,.5)';
    ctx.shadowBlur = 3;
    ctx.fillText(reward.label, r - 8, 4);
    ctx.restore();
  });

  // Центральный круг
  ctx.beginPath();
  ctx.arc(cx, cy, 22, 0, Math.PI*2);
  ctx.fillStyle = '#07091a';
  ctx.fill();
  ctx.strokeStyle = '#263060';
  ctx.lineWidth = 2;
  ctx.stroke();
}

async function doSpin(){
  if(spinAnimating || !spinCanSpin) return;
  spinAnimating = true;
  document.getElementById('spin-btn').disabled = true;
  document.getElementById('spin-result').textContent = '';

  const res = await apiPost('/spin');
  if(!res || res.status !== 'success'){
    showToast(res?.message || 'Ошибка спина');
    spinAnimating = false;
    return;
  }

  // Парсим ответ — может быть res.data.reward или res.reward
  const spinData  = res.data || res;
  const reward    = spinData.reward;
  const resultIdx = spinData.result_idx ?? 0;
  console.log('[spin] full res:', JSON.stringify(res).slice(0,200));
  console.log('[spin] reward:', reward?.label, 'value:', reward?.value, 'idx:', resultIdx);
  if(!reward){ showToast('Ошибка: нет данных награды'); spinAnimating=false; return; }

  // Если spinRewards пуст — загружаем и ждём
  if(!spinRewards.length){
    const si = await apiGet('/spin_info');
    if(si?.status==='success') spinRewards = si.data.rewards;
  }

  const n = spinRewards.length || 10;
  const slice = (Math.PI*2) / n;

  // Целевой угол: нужный сектор под стрелкой (стрелка сверху = -PI/2)
  // Колесо крутится, стрелка фиксирована сверху
  // Сектор resultIdx начинается с угла (resultIdx * slice)
  // Центр сектора: resultIdx * slice + slice/2
  // Хотим чтобы центр сектора оказался сверху (-PI/2)
  // Стрелка сверху (12 часов). Колесо рисуется от angle - PI/2.
  // Чтобы сектор resultIdx оказался сверху:
  // angle - PI/2 + resultIdx*slice + slice/2 = -PI/2 (сверху = 0 на экране)
  // angle = -resultIdx*slice - slice/2
  const sectorCenter = resultIdx * slice + slice / 2;
  const fullSpins    = Math.PI * 2 * (6 + Math.floor(Math.random()*4));
  const finalAngle   = -(sectorCenter) - fullSpins;
  console.log('[spin] finalAngle:', finalAngle.toFixed(2), 'sectorCenter:', sectorCenter.toFixed(2));

  const start    = spinAngle;
  const duration = 4000;
  const startTime = performance.now();

  function animate(now){
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const ease = 1 - Math.pow(1 - progress, 3);
    spinAngle = start + (finalAngle - start) * ease;
    drawSpinWheel(spinAngle);
    if(progress < 1){
      requestAnimationFrame(animate);
    } else {
      // Готово
      spinAnimating = false;
      spinCanSpin   = false;
      // Применяем локально
      if(reward.type === 'gc') G.gc += reward.value;
      else if(reward.type === 'fuel') G.fuel = Math.min(G.fuelMax, G.fuel + reward.value);
      else if(reward.type === 'shield') G.inventory.shield = (G.inventory.shield||0) + reward.value;
      document.getElementById('spin-result').textContent = `🎉 ${reward.label}`;
      document.getElementById('spin-next-time').textContent = 'Следующий спин через 24 часа';
      if(window.Telegram?.WebApp?.HapticFeedback)
        Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      updateMainUI();
    }
  }
  requestAnimationFrame(animate);

}

// ══════════════════════════════════════════
//  GALAXY MAP — Карта галактики
// ══════════════════════════════════════════
const GALAXY_PLANETS = [
  {key:'earth',   name:'Земля',         emoji:'🌍', color:'#1a6e3a', x:.5,  y:.82, r:22},
  {key:'moon',    name:'Луна',          emoji:'🌙', color:'#888',    x:.62, y:.72, r:12},
  {key:'mars',    name:'Марс',          emoji:'🔴', color:'#8b2500', x:.72, y:.55, r:16},
  {key:'jupiter', name:'Юпитер',        emoji:'🟠', color:'#c4820a', x:.6,  y:.38, r:24},
  {key:'saturn',  name:'Сатурн',        emoji:'🪐', color:'#c8a060', x:.3,  y:.3,  r:20},
  {key:'neptune', name:'Нептун',        emoji:'🔵', color:'#1a3a8f', x:.18, y:.52, r:17},
  {key:'alpha',   name:'Alpha Centauri',emoji:'⭐', color:'#9060ff', x:.12, y:.22, r:14},
];

let galaxyData = null, galaxyFrame = 0, galaxyAnimId = null;

async function showGalaxy(){
  showScreen('galaxy-screen');
  const res = await apiGet('/galaxy_map');
  if(res?.status === 'success') galaxyData = res.data;
  initGalaxyCanvas();
}

function initGalaxyCanvas(){
  const canvas = document.getElementById('galaxy-canvas');
  if(!canvas) return;
  canvas.width  = canvas.offsetWidth  || window.innerWidth;
  canvas.height = canvas.offsetHeight || window.innerHeight - 80;
  animateGalaxy(canvas);

  canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const my = (e.clientY - rect.top)  * (canvas.height / rect.height);
    const W = canvas.width, H = canvas.height;
    GALAXY_PLANETS.forEach(p => {
      const px = p.x * W, py = p.y * H;
      const dist = Math.sqrt((mx-px)**2 + (my-py)**2);
      if(dist < p.r + 14){
        const pData = galaxyData?.planets?.find(d=>d.key===p.key);
        const tip = document.getElementById('galaxy-tooltip');
        const visited = pData?.visited || p.key === 'earth';
        const flights = pData?.flights || 0;
        const minerLv = pData?.miner_level || 0;
        tip.innerHTML = `<b style="color:#4f8ef7">${p.emoji} ${p.name}</b><br>${visited?`✅ Посещена · ${flights} полётов`:'🔒 Не посещена'}${minerLv>0?`<br>⛏ Майнер ур.${minerLv}`:''}`;
        tip.style.display = 'block';
        tip.style.left    = Math.min(mx + 10, W - 160) + 'px';
        tip.style.top     = Math.min(my + 10, H - 80)  + 'px';
        setTimeout(()=> tip.style.display = 'none', 2500);
      }
    });
  });
}

function animateGalaxy(canvas){
  if(galaxyAnimId) cancelAnimationFrame(galaxyAnimId);
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  // Генерируем звёзды один раз
  if(!animateGalaxy._stars){
    animateGalaxy._stars = [];
    for(let i=0;i<150;i++) animateGalaxy._stars.push({x:Math.random(),y:Math.random(),r:.3+Math.random()*1.2,o:.1+Math.random()*.6});
  }

  function frame(){
    galaxyFrame++;
    ctx.fillStyle = '#07091a';
    ctx.fillRect(0,0,W,H);

    // Звёзды
    for(const s of animateGalaxy._stars){
      ctx.beginPath(); ctx.arc(s.x*W, s.y*H, s.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(255,255,255,${s.o + Math.sin(galaxyFrame*.03+s.x*10)*.05})`;
      ctx.fill();
    }

    // Орбиты (пунктирные)
    ctx.setLineDash([4, 8]);
    ctx.strokeStyle = 'rgba(79,142,247,.12)';
    ctx.lineWidth = 1;
    const earthX = .5*W, earthY = .82*H;
    GALAXY_PLANETS.forEach(p => {
      if(p.key === 'earth') return;
      const px = p.x*W, py = p.y*H;
      const dist = Math.sqrt((px-earthX)**2 + (py-earthY)**2);
      ctx.beginPath(); ctx.arc(earthX, earthY, dist, 0, Math.PI*2); ctx.stroke();
    });
    ctx.setLineDash([]);

    // Планеты
    GALAXY_PLANETS.forEach((p, i) => {
      const px = p.x*W, py = p.y*H;
      const pData = galaxyData?.planets?.find(d=>d.key===p.key);
      const visited = pData?.visited || p.key === 'earth';
      const pulse   = Math.sin(galaxyFrame*.04 + i) * 2;

      // Glow
      const g = ctx.createRadialGradient(px,py,0,px,py,p.r*2.5);
      g.addColorStop(0, visited ? p.color+'55' : 'rgba(40,40,60,.3)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px,py,p.r*2.5,0,Math.PI*2); ctx.fill();

      // Планета
      const pg = ctx.createRadialGradient(px-p.r*.3,py-p.r*.3,p.r*.1,px,py,p.r+pulse);
      pg.addColorStop(0, visited ? lighten(p.color) : '#2a2a3a');
      pg.addColorStop(1, visited ? p.color : '#1a1a2a');
      ctx.beginPath(); ctx.arc(px,py,p.r+pulse,0,Math.PI*2);
      ctx.fillStyle = pg; ctx.fill();
      ctx.strokeStyle = visited ? p.color+'99' : '#333355';
      ctx.lineWidth = 1.5; ctx.stroke();

      // Майнер индикатор
      if(pData?.has_miner){
        ctx.beginPath(); ctx.arc(px+p.r*.7, py-p.r*.7, 5, 0, Math.PI*2);
        ctx.fillStyle = '#2ecc71'; ctx.fill();
      }

      // Emoji
      ctx.font = `${p.r * 1.1}px serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.globalAlpha = visited ? 1 : .4;
      ctx.fillText(p.emoji, px, py);
      ctx.globalAlpha = 1;

      // Название
      ctx.font = 'bold 10px -apple-system';
      ctx.fillStyle = visited ? 'rgba(255,255,255,.8)' : 'rgba(255,255,255,.3)';
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(p.name, px, py + p.r + pulse + 4);
    });

    // Статистика
    if(galaxyData){
      ctx.font = '11px -apple-system'; ctx.fillStyle = 'rgba(107,125,179,.7)';
      ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      ctx.fillText(`Полётов: ${galaxyData.total_flights} · CI: ${galaxyData.ci_score}`, 12, 12);
    }

    galaxyAnimId = requestAnimationFrame(frame);
  }
  frame();
}

function lighten(hex){
  try{
    const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
    return `rgb(${Math.min(255,r+60)},${Math.min(255,g+60)},${Math.min(255,b+60)})`;
  }catch{return hex;}
}

// ══════════════════════════════════════════
//  ACHIEVEMENTS
// ══════════════════════════════════════════
async function showAchievements(){
  showScreen('achievements-screen');
  const res = await apiGet('/achievements');
  if(res?.status !== 'success') return;
  const list = document.getElementById('achievements-list');
  list.innerHTML = `<div style="text-align:center;margin-bottom:14px;font-size:13px;color:var(--muted)">
    Получено ${res.data.total} / ${res.data.achievements.length}
  </div>`;
  res.data.achievements.forEach(a => {
    const div = document.createElement('div');
    div.className = `achievement-item ${a.earned?'earned':'locked'}`;
    div.innerHTML = `
      <div class="ach-icon">${a.icon}</div>
      <div class="ach-info">
        <div class="ach-title">${a.label} ${a.earned?'✅':''}</div>
        <div class="ach-desc">${a.desc}</div>
      </div>
      <div class="ach-reward">${a.earned?'+'+a.reward+' GC':'?'}</div>`;
    list.appendChild(div);
  });
}

// ══════════════════════════════════════════
//  ACTIVE EVENT BANNER
// ══════════════════════════════════════════
let activeEvent = null;

async function checkActiveEvent(){
  const res = await apiGet('/active_event');
  if(res?.status === 'success'){
    activeEvent = res.data.event;
    const banner = document.getElementById('event-banner');
    if(!banner) return;
    if(activeEvent){
      const left = activeEvent.time_left;
      const h = Math.floor(left/3600), m = Math.floor((left%3600)/60);
      document.getElementById('event-banner-title').textContent = getEventLabel(activeEvent.type);
      document.getElementById('event-banner-desc').textContent  = `${activeEvent.desc || ''} · Осталось ${h}ч ${m}м`;
      banner.style.display = 'block';
    } else {
      banner.style.display = 'none';
    }
  }
}

function getEventLabel(type){
  const labels = {
    'double_fuel':    '⚡ Двойное топливо активно!',
    'double_gc':      '💰 Двойные GC с полётов!',
    'half_risk':      '🛡 Половина риска!',
    'free_spin':      '🎰 Дополнительный спин!',
    'meteor_shower':  '☄️ Метеоритный дождь!',
  };
  return labels[type] || '🌍 Событие активно!';
}

// Применяем бонус события к тапу
const _origDoTap = doTap;


// ══════════════════════════════════════════
//  MORE MENU
// ══════════════════════════════════════════
function showMoreMenu(){
  const m = document.getElementById('more-menu');
  m.style.display = 'flex';
}

// ══════════════════════════════════════════
//  PvP — ОГРАБЛЕНИЕ
// ══════════════════════════════════════════
async function showPvP(){
  document.getElementById('more-menu').style.display='none';
  showScreen('pvp-screen');
  const list = document.getElementById('pvp-targets-list');
  list.innerHTML = '<div style="text-align:center;padding:40px;color:var(--muted)">Загрузка...</div>';
  const res = await apiGet('/pvp_targets');
  list.innerHTML = '';
  if(!res||res.status!=='success'){
    list.innerHTML='<div style="text-align:center;padding:40px;color:var(--muted)">Ошибка загрузки</div>'; return;
  }
  const targets = res.data.targets;
  if(!targets.length){
    list.innerHTML='<div style="text-align:center;padding:40px;color:var(--muted)">Нет доступных целей рядом по рейтингу</div>'; return;
  }
  targets.forEach(t => {
    const div = document.createElement('div');
    div.className = 'pvp-card';
    const hasShield = t.shields > 0;
    div.innerHTML = `
      <div style="width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,var(--red),#c0392b);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;flex-shrink:0">
        ${(t.first_name||'?').slice(0,2).toUpperCase()}
      </div>
      <div class="pvp-info">
        <div class="pvp-name">${t.first_name||'Командор'}</div>
        <div class="pvp-stats">CI: ${t.ci} · Топливо: ${t.fuel}F ${hasShield?'🛡 Защищён':''}</div>
      </div>
      <button class="pvp-btn ${hasShield?'shield':''}" onclick="attackPlayer(${t.telegram_id},'${t.first_name||'Командор'}')">
        ${hasShield?'🛡 Щит':'⚔️ Атака'}
      </button>`;
    list.appendChild(div);
  });
}

async function attackPlayer(targetId, name){
  const res = await apiPost('/pvp_attack', {target_id: targetId});
  if(res?.status==='success'){
    showToast(res.data.message);
    if(res.data.stolen > 0) G.fuel = Math.min(G.fuelMax, G.fuel + res.data.stolen);
    updateMainUI();
    setTimeout(showPvP, 1000);
  } else {
    showToast(res?.message || 'Ошибка атаки');
  }
}

// ══════════════════════════════════════════
//  АЛЬЯНСЫ
// ══════════════════════════════════════════
async function showAlliance(){
  document.getElementById('more-menu').style.display='none';
  showScreen('alliance-screen');
  renderAllianceScreen();
}

async function renderAllianceScreen(){
  const content = document.getElementById('alliance-content');
  content.innerHTML = '<div style="text-align:center;padding:30px;color:var(--muted)">Загрузка...</div>';
  const res = await apiGet('/alliance_info');
  content.innerHTML = '';
  if(!res||res.status!=='success') return;
  const alliance = res.data.alliance;
  if(!alliance){
    content.innerHTML = `
      <div class="alliance-hero" style="background:var(--card);border:1px solid var(--border)">
        <div style="font-size:40px;margin-bottom:8px">🤝</div>
        <div style="font-size:16px;font-weight:700;margin-bottom:4px">Ты не в альянсе</div>
        <div style="font-size:12px;color:var(--muted)">Создай или вступи в альянс</div>
      </div>
      <div style="margin-bottom:10px">
        <div style="font-size:12px;color:var(--muted);margin-bottom:6px">Создать новый (500 GC)</div>
        <input id="alliance-name-input" placeholder="Название альянса" style="width:100%;padding:10px 12px;background:var(--bg3);border:1px solid var(--border);border-radius:10px;color:var(--text);font-size:14px;margin-bottom:8px;font-family:var(--font)"/>
        <button onclick="createAlliance()" style="width:100%;padding:12px;background:linear-gradient(135deg,var(--accent2),var(--accent));border:none;border-radius:12px;color:#fff;font-size:14px;font-weight:700;cursor:pointer;font-family:var(--font)">Создать альянс</button>
      </div>
      <div>
        <div style="font-size:12px;color:var(--muted);margin-bottom:6px">Вступить по ID</div>
        <input id="alliance-id-input" placeholder="ID альянса" style="width:100%;padding:10px 12px;background:var(--bg3);border:1px solid var(--border);border-radius:10px;color:var(--text);font-size:14px;margin-bottom:8px;font-family:var(--font)"/>
        <button onclick="joinAlliance()" style="width:100%;padding:12px;background:linear-gradient(135deg,var(--green),#1abc9c);border:none;border-radius:12px;color:#fff;font-size:14px;font-weight:700;cursor:pointer;font-family:var(--font)">Вступить</button>
      </div>`;
    return;
  }
  const members = alliance.members||[];
  content.innerHTML = `
    <div class="alliance-hero">
      <div style="font-size:32px;margin-bottom:6px">🤝</div>
      <div class="alliance-name">${alliance.name}</div>
      <div style="font-size:12px;color:var(--muted)">${members.length} / 20 членов</div>
      <div style="font-size:11px;color:var(--muted);margin-top:4px">ID: ${alliance._id}</div>
    </div>
    <div style="font-size:13px;font-weight:600;margin-bottom:8px">Участники</div>
    ${members.map((m,i)=>`
      <div class="alliance-member">
        <div style="font-size:12px;color:var(--muted);min-width:20px">${i+1}</div>
        <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0">${(m.first_name||'?').slice(0,2).toUpperCase()}</div>
        <div style="flex:1;font-size:13px">${m.first_name||'Командор'}</div>
        <div style="font-size:12px;font-weight:700;color:var(--accent)">${(m.colonist_index?.score||0)} CI</div>
      </div>`).join('')}
    <button onclick="leaveAlliance()" style="width:100%;padding:12px;background:rgba(231,76,60,.15);border:1px solid rgba(231,76,60,.3);border-radius:12px;color:var(--red);font-size:13px;font-weight:600;cursor:pointer;margin-top:12px;font-family:var(--font)">Покинуть альянс</button>`;
}

async function createAlliance(){
  const name = document.getElementById('alliance-name-input').value.trim();
  if(!name){showToast('Введи название'); return;}
  const res = await apiPost('/create_alliance',{name});
  if(res?.status==='success'){ showToast('✅ Альянс создан!'); renderAllianceScreen(); }
  else showToast(res?.message||'Ошибка');
}
async function joinAlliance(){
  const id = document.getElementById('alliance-id-input').value.trim();
  if(!id){showToast('Введи ID альянса'); return;}
  const res = await apiPost('/join_alliance',{alliance_id:id});
  if(res?.status==='success'){ showToast('✅ Вступил в альянс!'); renderAllianceScreen(); }
  else showToast(res?.message||'Ошибка');
}
async function leaveAlliance(){
  const res = await apiPost('/leave_alliance');
  if(res?.status==='success'){ showToast('Покинул альянс'); renderAllianceScreen(); }
}

// ══════════════════════════════════════════
//  БОСС
// ══════════════════════════════════════════
async function showBoss(){
  document.getElementById('more-menu').style.display='none';
  showScreen('boss-screen');
  const content = document.getElementById('boss-content');
  content.innerHTML='<div style="text-align:center;padding:30px;color:var(--muted)">Загрузка...</div>';
  const res = await apiGet('/boss_status');
  content.innerHTML='';
  if(!res||res.status!=='success') return;
  const boss = res.data.boss;
  if(!boss){
    const nextSec = res.data.next_boss_in||0;
    const d=Math.floor(nextSec/86400), h=Math.floor((nextSec%86400)/3600);
    content.innerHTML=`
      <div class="boss-card">
        <div class="boss-emoji">😴</div>
        <div style="font-size:18px;font-weight:800;margin-bottom:6px">Босс отдыхает</div>
        <div style="font-size:13px;color:var(--muted)">Следующий босс появится через</div>
        <div style="font-size:28px;font-weight:900;color:var(--accent);margin-top:8px">${d}д ${h}ч</div>
        <div style="font-size:11px;color:var(--muted);margin-top:4px">Каждое воскресенье в 20:00 UTC</div>
      </div>`;
    return;
  }
  const hpPct = Math.max(0, Math.min(100, (boss.current_hp/boss.max_hp)*100));
  const top = boss.top_attackers||[];
  content.innerHTML=`
    <div class="boss-card">
      <div class="boss-emoji">${boss.emoji||'👾'}</div>
      <div style="font-size:20px;font-weight:800;margin-bottom:4px">${boss.name}</div>
      <div style="font-size:13px;color:var(--muted)">HP: ${Math.floor(boss.current_hp).toLocaleString()} / ${boss.max_hp.toLocaleString()}</div>
      <div class="boss-hp-bar"><div class="boss-hp-fill" style="width:${hpPct}%"></div></div>
      <div style="font-size:12px;color:var(--muted);margin-bottom:12px">Мой урон: ${(boss.my_damage||0).toLocaleString()}</div>
      <button onclick="attackBoss()" style="width:100%;padding:14px;background:linear-gradient(135deg,var(--red),#c0392b);border:none;border-radius:14px;color:#fff;font-size:16px;font-weight:700;cursor:pointer;font-family:var(--font)">
        ⚔️ Атаковать босса
      </button>
    </div>
    <div style="font-size:13px;font-weight:600;margin-bottom:8px">Топ атакующих</div>
    ${top.map((t,i)=>`<div class="alliance-member">
      <div style="font-size:12px;color:var(--muted);min-width:20px">${['🥇','🥈','🥉','4.','5.'][i]}</div>
      <div style="flex:1;font-size:13px">Игрок ${t.tid}</div>
      <div style="font-size:12px;font-weight:700;color:var(--red)">${t.dmg.toLocaleString()} урона</div>
    </div>`).join('')}
    <div style="font-size:11px;color:var(--muted);margin-top:10px;text-align:center">Топ-10 по урону получат награды когда босс будет убит</div>`;
}

async function attackBoss(){
  const res = await apiPost('/boss_attack');
  if(res?.status==='success'){
    const d = res.data;
    showToast(`💥 Урон: ${d.damage.toLocaleString()}! ${d.boss_dead?'БОСС УБИТ!':''}`);
    if(window.Telegram?.WebApp?.HapticFeedback) Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
    setTimeout(showBoss, 500);
  } else showToast(res?.message||'Ошибка атаки');
}

// ══════════════════════════════════════════
//  КРАФТ
// ══════════════════════════════════════════
async function showCraft(){
  document.getElementById('more-menu').style.display='none';
  showScreen('craft-screen');
  const content = document.getElementById('craft-content');
  content.innerHTML='<div style="text-align:center;padding:30px;color:var(--muted)">Загрузка...</div>';
  const res = await apiGet('/craft_info');
  content.innerHTML='';
  if(!res||res.status!=='success') return;
  const {recipes, resources} = res.data;
  // Ресурсы
  const resNames = {moon_helium:'🔵 Гелий-3',mars_iron:'🟤 Железо',jupiter_antimatter:'⚡ Антиматерия',saturn_crystals:'💎 Кристаллы',neptune_neutronium:'🌀 Нейтрониум',alpha_dark_matter:'🌑 Тёмная материя'};
  const resHtml = Object.entries(resNames).map(([k,n])=>`
    <div style="display:flex;justify-content:space-between;font-size:12px;padding:5px 0;border-bottom:0.5px solid var(--border)">
      <span>${n}</span><span style="font-weight:700;color:var(--accent)">${resources[k]||0}</span>
    </div>`).join('');
  content.innerHTML = `
    <div style="background:var(--card);border:1px solid var(--border);border-radius:14px;padding:14px;margin-bottom:14px">
      <div style="font-size:13px;font-weight:700;margin-bottom:8px">🧪 Мои ресурсы</div>
      ${resHtml}
      <div style="font-size:11px;color:var(--muted);margin-top:6px">Ресурсы получаешь при успешных полётах</div>
    </div>`;
  recipes.forEach(recipe => {
    const div = document.createElement('div');
    div.className = 'craft-card';
    const ingHtml = recipe.ingredients_display.map(ing=>`
      <div class="ingredient ${ing.have>=ing.need?'ok':'not-ok'}">
        <span>${ing.name}</span>
        <span>${ing.have} / ${ing.need}</span>
      </div>`).join('');
    div.innerHTML = `
      <div class="craft-name">${recipe.emoji} ${recipe.name}</div>
      <div class="craft-desc">${recipe.description}</div>
      <div>${ingHtml}</div>
      <button class="craft-btn" ${recipe.can_craft?'':'disabled'} onclick="doCraft('${recipe.key}')">
        ${recipe.can_craft?'🔨 Создать':'Недостаточно ресурсов'}
      </button>`;
    content.appendChild(div);
  });
}

async function doCraft(key){
  const res = await apiPost('/craft',{recipe_key:key});
  if(res?.status==='success'){
    showToast(`✅ Создано: ${res.data.crafted}`);
    if(window.Telegram?.WebApp?.HapticFeedback) Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    showCraft();
  } else showToast(res?.message||'Ошибка крафта');
}

// ══════════════════════════════════════════
//  СКИНЫ РАКЕТЫ
// ══════════════════════════════════════════
let currentSkinColors = null;

async function showSkins(){
  document.getElementById('more-menu').style.display='none';
  showScreen('skins-screen');
  const list = document.getElementById('skins-list');
  list.innerHTML='<div style="text-align:center;padding:30px;color:var(--muted)">Загрузка...</div>';
  const res = await apiGet('/skins_info');
  list.innerHTML='';
  if(!res||res.status!=='success') return;
  const {skins} = res.data;
  skins.forEach(skin => {
    const div = document.createElement('div');
    div.className=`skin-card ${skin.active?'active':''}`;
    const priceLabel = skin.price===0?'Бесплатно':skin.currency==='stars'?`⭐ ${skin.price} Stars`:`${skin.price} GC`;
    let btnHtml = '';
    if(skin.active) btnHtml = '<span class="skin-badge active">Активна</span>';
    else if(skin.owned) btnHtml = `<button onclick="equipSkin('${skin.key}')" style="padding:7px 12px;border:none;border-radius:8px;background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;font-size:11px;font-weight:700;cursor:pointer;font-family:var(--font)">Надеть</button>`;
    else btnHtml = `<button onclick="buySkin('${skin.key}')" style="padding:7px 12px;border:none;border-radius:8px;background:linear-gradient(135deg,var(--gold),var(--orange));color:#1a0a00;font-size:11px;font-weight:700;cursor:pointer;font-family:var(--font)">${priceLabel}</button>`;
    div.innerHTML=`
      <div class="skin-preview" style="background:${skin.colors?.body||'#c8d8ec'}20">${skin.emoji}</div>
      <div style="flex:1">
        <div class="skin-name">${skin.name}</div>
        <div class="skin-price">${priceLabel}</div>
      </div>
      ${btnHtml}`;
    list.appendChild(div);
  });
}

async function buySkin(key){
  const res = await apiPost('/buy_skin',{skin_key:key});
  if(res?.status==='success'){ showToast('✅ Скин куплен!'); showSkins(); }
  else showToast(res?.message||'Ошибка покупки');
}

async function equipSkin(key){
  const res = await apiPost('/equip_skin',{skin_key:key});
  if(res?.status==='success'){
    currentSkinColors = { ...(res.data.colors||{}), _skin: key };
    rocketStars = null;
    showToast('🎨 Скин применён!');
    showSkins();
  } else showToast(res?.message||'Ошибка');
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
