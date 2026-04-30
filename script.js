// ═══════════════════════════════════════════
//  MarsX script.js — полная версия
// ═══════════════════════════════════════════

const API_URL      = 'https://humbly-petunia-customs.ngrok-free.dev';

// ══════════════════════════════════════════
//  MarsX Rocket — i18n (ru/en/es/pt/hi)
// ══════════════════════════════════════════
const TRANSLATIONS = {
ru:{fuel:'ТОПЛИВО',capital:'КАПИТАЛ',rating:'РЕЙТИНГ',tap_hint:'Тапай ракету — добывай топливо',launch_btn:'🚀 Запустить экспедицию',nav_base:'База',nav_flights:'Полёты',nav_miners:'Майнеры',nav_quests:'Квесты',nav_league:'Лига',nav_map:'Карта',nav_more:'Ещё',select_planet:'Выбери планету',fuel_cost:'Топливо',risk:'Риск',reward:'Награда',duration:'Время',fly_btn:'Лететь!',cancel:'Отмена',shop:'Магазин',buy:'Купить',owned:'Куплено',boosters:'Бустеры',parts:'Запчасти',weapons:'Оружие',autopilot_item:'Автопилот',not_enough_gc:'Недостаточно GC',miners:'Майнеры',build_miner:'Построить майнер',collect:'Собрать',upgrade:'Улучшить',level:'Уровень',storage:'Хранилище',nothing_to_collect:'Нечего собирать',quests:'Квесты',claim_reward:'Забрать',quest_done:'Выполнено!',quest_progress:'Прогресс',league:'Лига командоров',rank:'Место',player:'Игрок',in_flight:'В полёте',autopilot_on:'✈️ Автопилот включён',tap_objects:'Тапай объекты для бонусов!',expedition_success:'🎉 Успешная экспедиция!',expedition_fail:'💥 Крушение!',collected:'Собрано',back_to_base:'На базу',spin_title:'Колесо фортуны',spin_btn:'🎰 Крутить!',spin_free:'Бесплатно раз в 24 часа',spin_next:'Следующий спин через',ob_welcome_title:'Добро пожаловать в MarsX!',ob_welcome_body:'Ты — командор межзвёздной базы. Тапай ракету чтобы добывать топливо.',ob_tap_title:'Тапай и комбо',ob_tap_body:'Быстрые тапы дают комбо ×2 и ×3. Набери 100% для старта!',ob_planet_title:'Первая экспедиция',ob_planet_body:'Луна — самый безопасный маршрут. Риск всего 8%.',ob_miner_title:'Майнеры и пассивный доход',ob_miner_body:'Построй майнер на Луне — он добывает GC пока ты офлайн.',ob_bonus_title:'Стартовый бонус получен!',ob_bonus_body:'Ты готов к покорению галактики. Удачных полётов, Командор!',ob_skip:'Пропустить',ob_next:'Далее',ob_start:'Начать игру 🚀',ob_step:'из',token_title:'MarsX Token (MXT)',token_phase:'Farming Phase',token_network:'Ethereum / BNB Chain',token_tge:'TGE (объявим в канале)',token_subscribe:'📣 Подписаться на анонсы',token_share:'👥 Пригласить друзей',token_wallet_placeholder:'0x... EVM адрес',token_connect_wallet:'🔗 Привязать кошелёк',loading:'Загрузка...',error_load:'Ошибка загрузки',wait_loading:'Подожди — загрузка...',daily_claimed:'Бонус уже получен',daily_streak:'день подряд'},
en:{fuel:'FUEL',capital:'CAPITAL',rating:'RATING',tap_hint:'Tap rocket — mine fuel',launch_btn:'🚀 Launch expedition',nav_base:'Base',nav_flights:'Flights',nav_miners:'Miners',nav_quests:'Quests',nav_league:'League',nav_map:'Map',nav_more:'More',select_planet:'Select a planet',fuel_cost:'Fuel',risk:'Risk',reward:'Reward',duration:'Time',fly_btn:'Fly!',cancel:'Cancel',shop:'Shop',buy:'Buy',owned:'Owned',boosters:'Boosters',parts:'Parts',weapons:'Weapons',autopilot_item:'Autopilot',not_enough_gc:'Not enough GC',miners:'Miners',build_miner:'Build miner',collect:'Collect',upgrade:'Upgrade',level:'Level',storage:'Storage',nothing_to_collect:'Nothing to collect',quests:'Quests',claim_reward:'Claim',quest_done:'Completed!',quest_progress:'Progress',league:'Commander League',rank:'Rank',player:'Player',in_flight:'In flight',autopilot_on:'✈️ Autopilot ON',tap_objects:'Tap objects for bonuses!',expedition_success:'🎉 Expedition successful!',expedition_fail:'💥 Shipwreck!',collected:'Collected',back_to_base:'Back to base',spin_title:'Fortune Wheel',spin_btn:'🎰 Spin!',spin_free:'Free once every 24 hours',spin_next:'Next spin in',ob_welcome_title:'Welcome to MarsX!',ob_welcome_body:'You are a commander of an interstellar base. Tap the rocket to mine fuel.',ob_tap_title:'Tap & Combos',ob_tap_body:'Fast taps give ×2 and ×3 combos. Fill to 100% to launch!',ob_planet_title:'First expedition',ob_planet_body:'The Moon is the safest route. Only 8% risk.',ob_miner_title:'Miners & passive income',ob_miner_body:'Build a miner on the Moon — earns GC while offline.',ob_bonus_title:'Starter bonus received!',ob_bonus_body:'Ready to conquer the galaxy. Good luck, Commander!',ob_skip:'Skip',ob_next:'Next',ob_start:'Start game 🚀',ob_step:'of',token_title:'MarsX Token (MXT)',token_phase:'Farming Phase',token_network:'Ethereum / BNB Chain',token_tge:'TGE (announced in channel)',token_subscribe:'📣 Subscribe to announcements',token_share:'👥 Invite friends',token_wallet_placeholder:'0x... EVM address',token_connect_wallet:'🔗 Connect wallet',loading:'Loading...',error_load:'Failed to load',wait_loading:'Please wait...',daily_claimed:'Daily bonus claimed',daily_streak:'day streak'},
es:{fuel:'COMBUSTIBLE',capital:'CAPITAL',rating:'RANKING',tap_hint:'Toca el cohete — extrae combustible',launch_btn:'🚀 Lanzar expedición',nav_base:'Base',nav_flights:'Vuelos',nav_miners:'Mineros',nav_quests:'Misiones',nav_league:'Liga',nav_map:'Mapa',nav_more:'Más',select_planet:'Selecciona un planeta',fuel_cost:'Combustible',risk:'Riesgo',reward:'Recompensa',duration:'Tiempo',fly_btn:'¡Volar!',cancel:'Cancelar',shop:'Tienda',buy:'Comprar',owned:'Comprado',boosters:'Impulsores',parts:'Piezas',weapons:'Armas',autopilot_item:'Piloto automático',not_enough_gc:'GC insuficiente',miners:'Mineros',build_miner:'Construir minero',collect:'Recolectar',upgrade:'Mejorar',level:'Nivel',storage:'Almacén',nothing_to_collect:'Nada que recolectar',quests:'Misiones',claim_reward:'Reclamar',quest_done:'¡Completado!',quest_progress:'Progreso',league:'Liga de Comandantes',rank:'Posición',player:'Jugador',in_flight:'En vuelo',autopilot_on:'✈️ Piloto automático activado',tap_objects:'¡Toca los objetos para bonificaciones!',expedition_success:'🎉 ¡Expedición exitosa!',expedition_fail:'💥 ¡Naufragio!',collected:'Recolectado',back_to_base:'Volver a la base',spin_title:'Rueda de la fortuna',spin_btn:'🎰 ¡Girar!',spin_free:'Gratis una vez cada 24 horas',spin_next:'Próximo giro en',ob_welcome_title:'¡Bienvenido a MarsX!',ob_welcome_body:'Eres el comandante de una base interestelar. Toca el cohete para extraer combustible.',ob_tap_title:'Toques y combos',ob_tap_body:'Los toques rápidos dan combos ×2 y ×3. ¡Llena al 100% para lanzar!',ob_planet_title:'Primera expedición',ob_planet_body:'La Luna es la ruta más segura. Solo 8% de riesgo.',ob_miner_title:'Mineros e ingresos pasivos',ob_miner_body:'Construye un minero en la Luna — gana GC sin conexión.',ob_bonus_title:'¡Bono inicial recibido!',ob_bonus_body:'¡Listo para conquistar la galaxia. ¡Buena suerte, Comandante!',ob_skip:'Omitir',ob_next:'Siguiente',ob_start:'Comenzar juego 🚀',ob_step:'de',token_title:'MarsX Token (MXT)',token_phase:'Fase de Farming',token_network:'Ethereum / BNB Chain',token_tge:'TGE (anunciado en canal)',token_subscribe:'📣 Suscribirse',token_share:'👥 Invitar amigos',token_wallet_placeholder:'0x... dirección EVM',token_connect_wallet:'🔗 Conectar billetera',loading:'Cargando...',error_load:'Error al cargar',wait_loading:'Espera...',daily_claimed:'Bono ya reclamado',daily_streak:'días seguidos'},
pt:{fuel:'COMBUSTÍVEL',capital:'CAPITAL',rating:'RANKING',tap_hint:'Toque no foguete — extraia combustível',launch_btn:'🚀 Lançar expedição',nav_base:'Base',nav_flights:'Voos',nav_miners:'Mineradores',nav_quests:'Missões',nav_league:'Liga',nav_map:'Mapa',nav_more:'Mais',select_planet:'Selecione um planeta',fuel_cost:'Combustível',risk:'Risco',reward:'Recompensa',duration:'Tempo',fly_btn:'Voar!',cancel:'Cancelar',shop:'Loja',buy:'Comprar',owned:'Comprado',boosters:'Impulsores',parts:'Peças',weapons:'Armas',autopilot_item:'Piloto automático',not_enough_gc:'GC insuficiente',miners:'Mineradores',build_miner:'Construir minerador',collect:'Coletar',upgrade:'Melhorar',level:'Nível',storage:'Armazém',nothing_to_collect:'Nada para coletar',quests:'Missões',claim_reward:'Resgatar',quest_done:'Concluído!',quest_progress:'Progresso',league:'Liga dos Comandantes',rank:'Posição',player:'Jogador',in_flight:'Em voo',autopilot_on:'✈️ Piloto automático ativado',tap_objects:'Toque nos objetos para bônus!',expedition_success:'🎉 Expedição bem-sucedida!',expedition_fail:'💥 Naufrágio!',collected:'Coletado',back_to_base:'Voltar à base',spin_title:'Roda da fortuna',spin_btn:'🎰 Girar!',spin_free:'Grátis uma vez a cada 24 horas',spin_next:'Próximo giro em',ob_welcome_title:'Bem-vindo ao MarsX!',ob_welcome_body:'Você é o comandante de uma base interestelar. Toque no foguete para extrair combustível.',ob_tap_title:'Toques e combos',ob_tap_body:'Toques rápidos dão combos ×2 e ×3. Encha 100% para lançar!',ob_planet_title:'Primeira expedição',ob_planet_body:'A Lua é a rota mais segura. Apenas 8% de risco.',ob_miner_title:'Mineradores e renda passiva',ob_miner_body:'Construa um minerador na Lua — ganha GC offline.',ob_bonus_title:'Bônus inicial recebido!',ob_bonus_body:'Pronto para conquistar a galáxia. Boa sorte, Comandante!',ob_skip:'Pular',ob_next:'Próximo',ob_start:'Começar jogo 🚀',ob_step:'de',token_title:'MarsX Token (MXT)',token_phase:'Fase de Farming',token_network:'Ethereum / BNB Chain',token_tge:'TGE (anunciado no canal)',token_subscribe:'📣 Inscrever-se',token_share:'👥 Convidar amigos',token_wallet_placeholder:'0x... endereço EVM',token_connect_wallet:'🔗 Conectar carteira',loading:'Carregando...',error_load:'Erro ao carregar',wait_loading:'Aguarde...',daily_claimed:'Bônus já resgatado',daily_streak:'dias seguidos'},
hi:{fuel:'ईंधन',capital:'पूंजी',rating:'रैंकिंग',tap_hint:'रॉकेट टैप करें — ईंधन खनन',launch_btn:'🚀 अभियान शुरू करें',nav_base:'बेस',nav_flights:'उड़ान',nav_miners:'खनिक',nav_quests:'क्वेस्ट',nav_league:'लीग',nav_map:'नक्शा',nav_more:'अधिक',select_planet:'ग्रह चुनें',fuel_cost:'ईंधन',risk:'जोखिम',reward:'इनाम',duration:'समय',fly_btn:'उड़ान भरें!',cancel:'रद्द करें',shop:'दुकान',buy:'खरीदें',owned:'खरीदा',boosters:'बूस्टर',parts:'पुर्जे',weapons:'हथियार',autopilot_item:'ऑटोपायलट',not_enough_gc:'पर्याप्त GC नहीं',miners:'खनिक',build_miner:'खनिक बनाएं',collect:'एकत्र करें',upgrade:'अपग्रेड',level:'स्तर',storage:'भंडार',nothing_to_collect:'एकत्र करने के लिए कुछ नहीं',quests:'क्वेस्ट',claim_reward:'दावा करें',quest_done:'पूर्ण!',quest_progress:'प्रगति',league:'कमांडर लीग',rank:'स्थान',player:'खिलाड़ी',in_flight:'उड़ान में',autopilot_on:'✈️ ऑटोपायलट चालू',tap_objects:'बोनस के लिए टैप करें!',expedition_success:'🎉 अभियान सफल!',expedition_fail:'💥 जहाज़ टूट गया!',collected:'एकत्रित',back_to_base:'बेस पर वापस',spin_title:'भाग्य चक्र',spin_btn:'🎰 घुमाएं!',spin_free:'24 घंटे में एक बार मुफ्त',spin_next:'अगला स्पिन',ob_welcome_title:'MarsX में आपका स्वागत!',ob_welcome_body:'आप एक अंतरतारकीय बेस के कमांडर हैं। ईंधन के लिए रॉकेट टैप करें।',ob_tap_title:'टैप और कॉम्बो',ob_tap_body:'तेज़ टैप से ×2 और ×3 कॉम्बो! 100% भरें।',ob_planet_title:'पहला अभियान',ob_planet_body:'चाँद सबसे सुरक्षित। केवल 8% जोखिम।',ob_miner_title:'खनिक और निष्क्रिय आय',ob_miner_body:'चाँद पर खनिक — ऑफलाइन भी GC कमाएं।',ob_bonus_title:'स्टार्टर बोनस!',ob_bonus_body:'आकाशगंगा जीतने के लिए तैयार! शुभकामनाएं।',ob_skip:'छोड़ें',ob_next:'अगला',ob_start:'गेम शुरू करें 🚀',ob_step:'में से',token_title:'MarsX Token (MXT)',token_phase:'फार्मिंग फेज',token_network:'Ethereum / BNB Chain',token_tge:'TGE (चैनल पर)',token_subscribe:'📣 सदस्यता लें',token_share:'👥 दोस्तों को बुलाएं',token_wallet_placeholder:'0x... EVM पता',token_connect_wallet:'🔗 वॉलेट कनेक्ट करें',loading:'लोड हो रहा है...',error_load:'लोड त्रुटि',wait_loading:'रुकें...',daily_claimed:'बोनस पहले ही लिया',daily_streak:'दिन लगातार'},
};

let _lang='en';
function initLang(){
  // 1. Ручной выбор пользователя
  const saved = localStorage.getItem('marsx_lang');
  if(saved && TRANSLATIONS[saved]){ _lang=saved; return; }
  // 2. Язык из Telegram
  const tgLang=(window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code||'').toLowerCase().slice(0,2);
  const brLang=(navigator.language||'').toLowerCase().slice(0,2);
  const raw=tgLang||brLang;
  const map={ru:'ru',en:'en',es:'es',pt:'pt',hi:'hi',
    mx:'es',ar:'es',co:'es',ve:'es',cl:'es',pe:'es',ec:'es',
    br:'pt',bn:'hi',ta:'hi',te:'hi',mr:'hi',gu:'hi',kn:'hi',ml:'hi'};
  _lang=map[raw]||'en';
  console.log('[i18n] lang='+_lang+' raw='+raw);
}
function switchLang(lang){
  _lang = lang;
  localStorage.setItem('marsx_lang', lang);
  applyTranslations();
  document.getElementById('more-menu').style.display='none';
  showToast(t('loading','...') + ' → ' + lang.toUpperCase());
}

function t(key,fallback){return(TRANSLATIONS[_lang]||TRANSLATIONS.en)[key]||fallback||key;}
function applyTranslations(){
  document.querySelectorAll('[data-i18n]').forEach(el=>{const v=t(el.getAttribute('data-i18n'));if(v)el.textContent=v;});
  document.querySelectorAll('[data-i18n-ph]').forEach(el=>{const v=t(el.getAttribute('data-i18n-ph'));if(v)el.placeholder=v;});
}

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
    {id:'fuel_boost',  name:'Топливный буст',    emoji:'⛽',desc:'×2 добыча топлива на 30 мин',         price:250, currency:'gc'},
    {id:'shield',      name:'Щит',               emoji:'🛡',desc:'Защита от одной потери груза',        price:180, currency:'gc',   stackable:true},
    {id:'combo_boost', name:'Комбо-усилитель',   emoji:'⚡',desc:'×3 комбо с 3 тапов (1 час)',          price:300, currency:'gc'},
    {id:'instant_fuel',name:'Мгновенное топливо',emoji:'💧',desc:'Заполняет топливо до 100% сейчас',   price:600, currency:'gc'},
  ],
  parts:[
    {id:'engine_1',  name:'Двигатель Mk.II',  emoji:'🔧',desc:'+20% скорость полётов, −7% риск',     price:1200, currency:'gc',  unique:true},
    {id:'engine_2',  name:'Двигатель Mk.III', emoji:'🚀',desc:'+50% скорость, −15% риск',            price:3500, currency:'gc',  unique:true, requires:'engine_1'},
    {id:'tank_ext',  name:'Доп. бак',         emoji:'🛢',desc:'Лимит топлива 800 → 1200 F',          price:1800, currency:'gc',  unique:true},
    {id:'scanner',   name:'Сканер',           emoji:'📡',desc:'Вдвое больше объектов в полёте',      price:600,  currency:'gc',  unique:true},
    {id:'droid',     name:'Майнинг-дроид',    emoji:'🤖',desc:'Авто-тапает реактор раз в 5 сек',    price:2200, currency:'gc',  unique:true},
  ],
  weapons:[
    {id:'blaster_1',  name:'Бластер Mk.I',  emoji:'🔫',desc:'+10 F за сбитый объект',                price:600,  currency:'gc', unique:true},
    {id:'blaster_2',  name:'Бластер Mk.II', emoji:'💥',desc:'+25 F, шанс двойного дропа',            price:2500, currency:'gc', unique:true, requires:'blaster_1'},
    {id:'emp',        name:'ЭМИ-пушка',     emoji:'⚡',desc:'Уничтожает все объекты на экране',      price:3000, currency:'gc', unique:true},
    {id:'auto_turret',name:'Авто-турель',   emoji:'🎯',desc:'Авто-стреляет по астероидам',           price:5000, currency:'gc', unique:true},
  ],
  autopilot:[
    {id:'autopilot',  name:'Автопилот',     emoji:'🛸',desc:'Полёты завершаются пока ты офлайн. Уведомление в Telegram когда корабль вернётся. Навсегда.',price:499, currency:'stars', unique:true},
    {id:'vip_1month', name:'VIP Командор',  emoji:'👑',desc:'+30% добыча, 2 слота полётов, без рекламы. 1 месяц.',price:299, currency:'stars', unique:true},
    {id:'vip_3month', name:'VIP Командор ×3',emoji:'💎',desc:'Всё то же + эксклюзивный корабль. 3 месяца.',price:699, currency:'stars', unique:true},
    {id:'gc_1000',    name:'1 000 GC',      emoji:'💰',desc:'Пак галактических кредитов',             price:99,  currency:'stars'},
    {id:'gc_5000',    name:'5 500 GC',      emoji:'💎',desc:'Выгодный пак (+10% бонус)',              price:399, currency:'stars'},
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
    // Частицы под цвет скина
    const skinKey = (currentSkinColors&&currentSkinColors._skin)||'default';
    const colorMap = {
      default:['79,142,247','124,92,252','245,197,24','100,180,255'],
      gold:   ['245,197,24','255,160,30','255,220,80','200,140,0'],
      stealth:['0,255,100','0,200,80','100,255,150','0,150,60'],
      fire:   ['255,100,0','231,76,60','255,180,50','200,50,0'],
      galaxy: ['180,150,255','124,92,252','200,170,255','80,40,200'],
      neptune:['100,220,255','150,240,255','200,240,255','50,180,220'],
    };
    const colors = colorMap[skinKey]||colorMap.default;
    for(let i=0;i<16;i++){
      const a=Math.random()*Math.PI*2, sp=2.5+Math.random()*5.5;
      TAP_P.push({x:lx,y:ly,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-2.5,r:2+Math.random()*4,life:1,c:colors[Math.floor(Math.random()*colors.length)]});
    }
  }
  doTap(e);
}

window.onload = () => {
  initSplash();
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
  hideSplash(); // скрываем splash как только получили ответ
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
    // Даже при ошибке — показываем игру с базовыми данными
    // чтобы splash не висел вечно
    if(G.fuel === 0) G.fuel = 80;
    if(G.fuelMax === 0) G.fuelMax = 800;
    updateMainUI();
    // Пробуем перезагрузить через 5 сек
    setTimeout(loadUserData, 5000);
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
//  ONBOARDING — пошаговый туториал
// ══════════════════════════════════════════
const ONBOARDING_STEPS = [
  {
    emoji: '🚀',
    title: 'Добро пожаловать в MarsX!',
    body:  'Ты — командор межзвёздной базы. Тапай ракету чтобы прогревать двигатели и добывать топливо.',
    btn:   'Поехали!',
    action: null,
    highlight: 'tap-area-wrap',
  },
  {
    emoji: '⚡',
    title: 'Тапай и комбо',
    body:  'Быстрые тапы дают комбо ×2 и ×3. Шкала внизу — твоё топливо. Набери 100% для старта!',
    btn:   'Понял!',
    action: null,
    highlight: 'fuel-bar-wrap',
  },
  {
    emoji: '🌙',
    title: 'Первая экспедиция',
    body:  'Луна — самый безопасный маршрут. Риск всего 8%. Лети туда чтобы заработать первые GC.',
    btn:   'Выбрать планету',
    action: 'open_planets',
    highlight: null,
  },
  {
    emoji: '⛏',
    title: 'Майнеры и пассивный доход',
    body:  'После первого полёта построй майнер на Луне. Он добывает GC пока ты офлайн — это твой пассивный доход.',
    btn:   'Отлично!',
    action: null,
    highlight: null,
  },
  {
    emoji: '🎁',
    title: 'Стартовый бонус получен!',
    body:  'Ты готов к покорению галактики. Заходи каждый день за бонусами. Удачных полётов, Командор!',
    btn:   'Начать игру 🚀',
    action: 'finish',
    highlight: null,
  },
];

function startOnboarding(){
  G.onboardingStep = 0;
  showOnboardingStep(0);
}

function showOnboardingStep(i){
  const step = ONBOARDING_STEPS[i];
  if(!step) return;
  const modal = document.getElementById('onboarding-modal');

  document.getElementById('ob-emoji').textContent = step.emoji;
  document.getElementById('ob-title').textContent = step.title;
  document.getElementById('ob-body').textContent  = step.body;
  document.getElementById('ob-btn').textContent   = step.btn;
  document.getElementById('ob-step').textContent  =
    `${i+1} / ${ONBOARDING_STEPS.length}`;

  document.getElementById('ob-dots').innerHTML = ONBOARDING_STEPS.map((_,j) =>
    `<span style="width:${j===i?'18':'6'}px;height:6px;border-radius:3px;background:${j===i?'#4f8ef7':'rgba(79,142,247,.3)'};transition:all .3s"></span>`
  ).join('');

  // Подсветка элемента
  document.querySelectorAll('.ob-highlight').forEach(el => el.classList.remove('ob-highlight'));
  if(step.highlight){
    const el = document.getElementById(step.highlight);
    if(el) el.classList.add('ob-highlight');
  }

  modal.style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('ob-btn');
  if(!btn) return;
  btn.onclick = async () => {
    const step = ONBOARDING_STEPS[G.onboardingStep];
    // Убираем подсветку
    document.querySelectorAll('.ob-highlight').forEach(el => el.classList.remove('ob-highlight'));

    if(step.action === 'open_planets'){
      document.getElementById('onboarding-modal').style.display = 'none';
      showScreen('planet-screen'); renderPlanets();
      // Ждём возврата на главный — продолжим онбординг
      G.onboardingStep++;
      setTimeout(()=>{
        if(!G.onboardingDone) showOnboardingStep(G.onboardingStep);
      }, 8000);
      return;
    }

    if(step.action === 'finish'){
      document.getElementById('onboarding-modal').style.display = 'none';
      const res = await apiPost('/complete_onboarding');
      if(res?.status === 'success'){
        G.gc   += 100;
        G.fuel  = Math.min(G.fuelMax, G.fuel + 200);
        G.onboardingDone = true;
        // Красивый финальный тост
        setTimeout(()=>showToast('🎁 +100 GC и +200 F стартового бонуса!'), 300);
        updateMainUI();
      }
      if(!G.dailyClaimedToday) setTimeout(showDailyBonus, 1800);
      return;
    }

    G.onboardingStep++;
    if(G.onboardingStep < ONBOARDING_STEPS.length){
      showOnboardingStep(G.onboardingStep);
    } else {
      document.getElementById('onboarding-modal').style.display = 'none';
    }
  };

  // Пропустить онбординг
  const skipBtn = document.getElementById('ob-skip');
  if(skipBtn){
    skipBtn.onclick = async () => {
      document.getElementById('onboarding-modal').style.display = 'none';
      document.querySelectorAll('.ob-highlight').forEach(el => el.classList.remove('ob-highlight'));
      await apiPost('/complete_onboarding');
      G.onboardingDone = true;
      if(!G.dailyClaimedToday) setTimeout(showDailyBonus, 500);
    };
  }
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
  if(!G.tgId){showToast(t('wait_loading','Please wait...'));return;}
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

// ══════════════════════════════════════════
//  THREE.JS 3D ROCKET
// ══════════════════════════════════════════

// Three.js загружается динамически
let THREE = null;
let tapRenderer = null, tapScene = null, tapCamera = null;
let rocketGroup = null, engLight = null;
let exhaustParticles = [];
let tapFrame3d = 0;
let isDragging = false, prevTouchX = 0, prevTouchY = 0;
let rotY = 0, rotX = 0.1, targetRotY = 0, targetRotX = 0.1;
let autoRotate = true;
let rocketMeshes = {};

const PLANET_ENV_COLORS = {
  earth:   { bg: 0x07091a, fog: 0x07091a, light: 0x4488ff, ground: 0x1a2540 },
  moon:    { bg: 0x080810, fog: 0x080810, light: 0xaaaacc, ground: 0x1a1a28 },
  mars:    { bg: 0x120500, fog: 0x120500, light: 0xe05020, ground: 0x3a1008 },
  jupiter: { bg: 0x0a0500, fog: 0x0a0500, light: 0xe8a040, ground: 0x2a1800 },
  saturn:  { bg: 0x0a0800, fog: 0x0a0800, light: 0xd4b060, ground: 0x281a00 },
  neptune: { bg: 0x000a18, fog: 0x000a18, light: 0x2a80ff, ground: 0x000f28 },
  alpha:   { bg: 0x08001a, fog: 0x08001a, light: 0x9060ff, ground: 0x150030 },
};

function updateTapPlanet(planetKey) {
  tapCurrentPlanet = planetKey || 'earth';
  if (tapScene) {
    const env = PLANET_ENV_COLORS[tapCurrentPlanet] || PLANET_ENV_COLORS.earth;
    tapScene.background = new THREE.Color(env.bg);
    tapScene.fog = new THREE.FogExp2(env.fog, 0.05);
    if (engLight) engLight.color = new THREE.Color(env.light);
  }
}

function initTapCanvas() {
  // Загружаем Three.js динамически
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  script.onload = () => {
    THREE = window.THREE;
    initThreeScene();
  };
  script.onerror = () => {
    console.warn('[3D] Three.js не загрузился — fallback на 2D');
    init2DFallback();
  };
  document.head.appendChild(script);
}

function init2DFallback() {
  // Простой 2D canvas как запасной вариант
  const c = document.getElementById('tap-canvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  const area = document.getElementById('tap-area-wrap') || c.parentElement;
  const W = Math.max(area ? area.offsetWidth : 300, 200);
  const H = Math.max(area ? area.offsetHeight : 260, 200);
  c.width = W; c.height = H;
  c.style.width = W + 'px'; c.style.height = H + 'px';
  c.addEventListener('click', e => onTap(e));
  c.addEventListener('touchstart', e => { e.preventDefault(); onTap(e.touches[0]); }, { passive: false });
  function draw2D() {
    tapFrame++;
    if (tapHeat > 0) tapHeat = Math.max(0, tapHeat - 0.4);
    ctx.fillStyle = '#07091a'; ctx.fillRect(0, 0, W, H);
    const cx = W / 2, cy = H * 0.5;
    // Simple rocket shape
    ctx.fillStyle = '#c8d8ec';
    ctx.beginPath(); ctx.moveTo(cx, cy - 70); ctx.lineTo(cx + 14, cy + 30); ctx.lineTo(cx + 14, cy + 80); ctx.lineTo(cx - 14, cy + 80); ctx.lineTo(cx - 14, cy + 30); ctx.closePath(); ctx.fill();
    // Flame
    if (tapHeat > 5) {
      const fl = 20 + tapHeat * 0.8 + Math.sin(tapFrame * 0.3) * 5;
      const fg = ctx.createLinearGradient(cx, cy + 80, cx, cy + 80 + fl);
      fg.addColorStop(0, 'rgba(150,180,255,.9)'); fg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.moveTo(cx - 8, cy + 80); ctx.lineTo(cx, cy + 80 + fl); ctx.lineTo(cx + 8, cy + 80); ctx.fillStyle = fg; ctx.fill();
    }
    // Heat bar
    ctx.fillStyle = 'rgba(255,255,255,.06)'; ctx.fillRect(14, H - 12, W - 28, 5);
    if (tapHeat > 0) { ctx.fillStyle = '#4f8ef7'; ctx.fillRect(14, H - 12, (W - 28) * (tapHeat / 100), 5); }
    ctx.fillStyle = 'rgba(107,125,179,.7)'; ctx.font = '10px -apple-system'; ctx.textAlign = 'center';
    ctx.fillText(tapHeat > 85 ? '🔥 Готово!' : 'Тапай — прогревай', W / 2, H - 15);
    requestAnimationFrame(draw2D);
  }
  draw2D();
}

function initThreeScene() {
  const container = document.getElementById('tap-area-wrap') || document.body;
  const W = container.offsetWidth || window.innerWidth;
  const H = container.offsetHeight || Math.floor(window.innerHeight * 0.45);

  // Canvas
  const c = document.getElementById('tap-canvas');
  c.width = W; c.height = H;
  c.style.width = W + 'px'; c.style.height = H + 'px';

  // Renderer
  tapRenderer = new THREE.WebGLRenderer({ canvas: c, antialias: true, alpha: false });
  tapRenderer.setSize(W, H);
  tapRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  tapRenderer.shadowMap.enabled = true;
  tapRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
  tapRenderer.toneMapping = THREE.ACESFilmicToneMapping;
  tapRenderer.toneMappingExposure = 1.3;

  // Scene
  tapScene = new THREE.Scene();
  const env = PLANET_ENV_COLORS[tapCurrentPlanet] || PLANET_ENV_COLORS.earth;
  tapScene.background = new THREE.Color(env.bg);
  tapScene.fog = new THREE.FogExp2(env.fog, 0.04);

  // Camera
  tapCamera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
  tapCamera.position.set(0, 0.5, 7.5);
  tapCamera.lookAt(0, 0.5, 0);

  // Lights
  const ambient = new THREE.AmbientLight(0x334466, 0.9); tapScene.add(ambient);
  const sun = new THREE.DirectionalLight(0x88aaff, 2.5);
  sun.position.set(4, 6, 3); sun.castShadow = true;
  sun.shadow.mapSize.width = 1024; sun.shadow.mapSize.height = 1024;
  tapScene.add(sun);
  const fill = new THREE.DirectionalLight(0x334488, 0.6);
  fill.position.set(-3, 2, -2); tapScene.add(fill);
  const rim = new THREE.DirectionalLight(0x8899ff, 1.4);
  rim.position.set(0, -3, -4); tapScene.add(rim);
  engLight = new THREE.PointLight(new THREE.Color(env.light), 0, 4);
  engLight.position.set(0, -2.5, 0); tapScene.add(engLight);

  // Stars
  const sg = new THREE.BufferGeometry();
  const sv = [];
  for (let i = 0; i < 1500; i++) sv.push((Math.random() - 0.5) * 60, (Math.random() - 0.5) * 60, (Math.random() - 0.5) * 60);
  sg.setAttribute('position', new THREE.Float32BufferAttribute(sv, 3));
  tapScene.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: 0.04, sizeAttenuation: true })));

  // Platform
  const platGeo = new THREE.CylinderGeometry(1.4, 1.7, 0.12, 32);
  const platMat = new THREE.MeshStandardMaterial({ color: 0x1a2540, metalness: 0.7, roughness: 0.35 });
  const plat = new THREE.Mesh(platGeo, platMat);
  plat.position.y = -2.8; plat.receiveShadow = true;
  tapScene.add(plat);
  // Platform ring lights
  for (let i = 0; i < 8; i++) {
    const a = i / 8 * Math.PI * 2;
    const lm = new THREE.MeshStandardMaterial({ color: 0x4488ff, emissive: 0x2244ff, emissiveIntensity: 2 });
    const lg = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), lm);
    lg.position.set(Math.cos(a) * 1.2, -2.74, Math.sin(a) * 1.2);
    tapScene.add(lg);
  }
  // Support legs
  for (let i = 0; i < 4; i++) {
    const a = i / 4 * Math.PI * 2 + Math.PI / 4;
    const lm = new THREE.MeshStandardMaterial({ color: 0x2a3a5a, metalness: 0.8, roughness: 0.3 });
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 1.4, 8), lm);
    leg.position.set(Math.cos(a) * 0.75, -2.2, Math.sin(a) * 0.75);
    leg.rotation.z = Math.cos(a) * 0.28; leg.rotation.x = Math.sin(a) * 0.28;
    tapScene.add(leg);
  }

  // Rocket group
  rocketGroup = new THREE.Group();
  tapScene.add(rocketGroup);
  buildRocket3D(G.inventory || {});

  // Events
  c.addEventListener('click', e => { onTap(e); autoRotate = false; });
  c.addEventListener('touchstart', e => {
    e.preventDefault();
    const t = e.touches[0];
    isDragging = false; prevTouchX = t.clientX; prevTouchY = t.clientY;
    onTap(t); autoRotate = false;
  }, { passive: false });
  c.addEventListener('touchmove', e => {
    e.preventDefault();
    isDragging = true;
    targetRotY += (e.touches[0].clientX - prevTouchX) * 0.009;
    targetRotX += (e.touches[0].clientY - prevTouchY) * 0.006;
    targetRotX = Math.max(-0.55, Math.min(0.55, targetRotX));
    prevTouchX = e.touches[0].clientX; prevTouchY = e.touches[0].clientY;
  }, { passive: false });
  c.addEventListener('mousedown', e => { isDragging = false; prevTouchX = e.clientX; prevTouchY = e.clientY; });
  c.addEventListener('mousemove', e => {
    if (e.buttons !== 1) return;
    isDragging = true;
    targetRotY += (e.clientX - prevTouchX) * 0.007;
    targetRotX += (e.clientY - prevTouchY) * 0.005;
    targetRotX = Math.max(-0.55, Math.min(0.55, targetRotX));
    prevTouchX = e.clientX; prevTouchY = e.clientY;
    autoRotate = false;
  });

  // Resize
  window.addEventListener('resize', () => {
    const nW = container.offsetWidth || window.innerWidth;
    const nH = container.offsetHeight || Math.floor(window.innerHeight * 0.45);
    tapCamera.aspect = nW / nH; tapCamera.updateProjectionMatrix();
    tapRenderer.setSize(nW, nH);
    c.style.width = nW + 'px'; c.style.height = nH + 'px';
  });

  animateTap();
}

function buildRocket3D(inv) {
  if (!rocketGroup || !THREE) return;
  while (rocketGroup.children.length) rocketGroup.remove(rocketGroup.children[0]);
  rocketMeshes = {};
  exhaustParticles = [];

  const hasE1 = inv.engine_1 || inv.engine_2;
  const hasE2 = inv.engine_2;
  const hasTank = inv.tank_ext;
  const hasB1 = inv.blaster_1 || inv.blaster_2;
  const hasB2 = inv.blaster_2;
  const hasScan = inv.scanner;
  const hasTurret = inv.auto_turret;
  const hasDroid = inv.droid;

  const bW = hasTank ? 0.56 : 0.44;
  const bH = 3.0 + (hasTank ? 0.2 : 0) + (hasE2 ? 0.25 : 0);

  // Materials
  const bMat = new THREE.MeshStandardMaterial({ color: hasE2 ? 0x607898 : hasE1 ? 0x7090b0 : 0x9ab8d0, metalness: 0.75, roughness: 0.22 });
  const nMat = new THREE.MeshStandardMaterial({ color: hasE2 ? 0x90b0cc : 0xc8e4f8, metalness: 0.6, roughness: 0.18 });
  const dkMat = new THREE.MeshStandardMaterial({ color: 0x2a3a58, metalness: 0.88, roughness: 0.25 });
  const glMat = new THREE.MeshStandardMaterial({ color: 0x88ccff, emissive: 0x2266bb, emissiveIntensity: 0.9, transparent: true, opacity: 0.82, roughness: 0.05 });
  const strMat = new THREE.MeshStandardMaterial({ color: 0x4f8ef7, emissive: 0x1133cc, emissiveIntensity: 0.6 });
  const rMat = new THREE.MeshStandardMaterial({ color: 0xe74c3c, metalness: 0.55, roughness: 0.32, emissive: 0x440000, emissiveIntensity: 0.3 });
  const gMat = new THREE.MeshStandardMaterial({ color: 0x2ecc71, emissive: 0x006622, emissiveIntensity: 0.8 });
  const pMat = new THREE.MeshStandardMaterial({ color: 0x9b59b6, emissive: 0x220044, emissiveIntensity: 0.5 });
  const eMat = new THREE.MeshStandardMaterial({ color: 0x1a2a40, metalness: 0.9, roughness: 0.2, emissive: 0x081020, emissiveIntensity: 0.6 });
  const tMat = new THREE.MeshStandardMaterial({ color: 0x4a6080, metalness: 0.7, roughness: 0.35 });

  // ── BODY ──
  const body = new THREE.Mesh(new THREE.CylinderGeometry(bW, bW * 1.08, bH, 28, 6), bMat);
  body.castShadow = true; rocketGroup.add(body);

  // Body panel lines
  for (let i = 0; i < 4; i++) {
    const stripe = new THREE.Mesh(new THREE.CylinderGeometry(bW + 0.005, bW + 0.005, 0.03, 28), strMat);
    stripe.position.y = -0.4 + i * 0.55; rocketGroup.add(stripe);
  }

  // ── NOSE ──
  const nose = new THREE.Mesh(new THREE.ConeGeometry(bW, 1.9, 28, 4), nMat);
  nose.position.y = bH / 2 + 0.95; nose.castShadow = true; rocketGroup.add(nose);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 10), nMat);
  tip.position.y = bH / 2 + 1.9; rocketGroup.add(tip);

  // ── WINDOW ──
  const winOuter = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.04, 10, 28), dkMat);
  winOuter.position.set(bW + 0.01, bH / 2 - 0.45, 0); winOuter.rotation.y = Math.PI / 2; rocketGroup.add(winOuter);
  const win = new THREE.Mesh(new THREE.CircleGeometry(0.18, 20), glMat);
  win.position.set(bW + 0.02, bH / 2 - 0.45, 0); win.rotation.y = Math.PI / 2; rocketGroup.add(win);
  const wGlow = new THREE.PointLight(0x88ccff, 0.6, 1.2); wGlow.position.set(bW, bH / 2 - 0.45, 0); rocketGroup.add(wGlow);
  rocketMeshes.windowGlow = wGlow; rocketMeshes.win = win;

  // MarsX logo strip
  const logo = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.22, 0.55), new THREE.MeshStandardMaterial({ color: 0x4f8ef7, emissive: 0x2244cc, emissiveIntensity: 0.7 }));
  logo.position.set(bW + 0.005, -0.1, 0); logo.rotation.y = Math.PI / 2; rocketGroup.add(logo);

  // ── FINS ──
  const finCount = hasE2 ? 4 : 3;
  for (let i = 0; i < finCount; i++) {
    const a = i / finCount * Math.PI * 2 + (finCount === 3 ? 0 : Math.PI / 4);
    const fW = 0.05, fH = 1.1, fD = hasE2 ? 0.85 : 0.7;
    const fin = new THREE.Mesh(new THREE.BoxGeometry(fW, fH, fD), bMat.clone());
    fin.position.set(Math.cos(a) * (bW + 0.32), -bH / 2 + 0.5, Math.sin(a) * (bW + 0.32));
    fin.rotation.y = -a; fin.castShadow = true; rocketGroup.add(fin);
    // Fin edge glow
    const fe = new THREE.Mesh(new THREE.BoxGeometry(0.02, fH * 0.8, 0.03), strMat);
    fe.position.set(Math.cos(a) * (bW + 0.6), -bH / 2 + 0.5, Math.sin(a) * (bW + 0.6));
    fe.rotation.y = -a; rocketGroup.add(fe);
  }

  // ── NOZZLES ──
  const nozzPos = hasE2
    ? [{ x: 0, z: 0 }, { x: 0.32, z: 0 }, { x: -0.32, z: 0 }, { x: 0, z: 0.32 }, { x: 0, z: -0.32 }]
    : [{ x: 0, z: 0 }];
  nozzPos.forEach((np, ni) => {
    const nb = new THREE.Mesh(new THREE.CylinderGeometry(0.11 + ni * 0.01, 0.19 + ni * 0.01, 0.38, 18), eMat);
    nb.position.set(np.x, -bH / 2 - 0.18, np.z); rocketGroup.add(nb);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.025, 8, 24), new THREE.MeshStandardMaterial({ color: 0x4488ff, emissive: 0x2244ff, emissiveIntensity: 2.5 }));
    ring.position.set(np.x, -bH / 2 - 0.37, np.z); ring.rotation.x = Math.PI / 2; rocketGroup.add(ring);
  });
  rocketMeshes.nozzPos = nozzPos; rocketMeshes.bH = bH;

  // ── BOOSTERS (engine_1) ──
  if (hasE1) {
    [1, -1].forEach(s => {
      const pod = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.9, 16), tMat.clone());
      pod.position.set(s * (bW + 0.3), -bH / 2 + 0.32, 0); rocketGroup.add(pod);
      const podCap = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 12), tMat.clone());
      podCap.position.set(s * (bW + 0.3), -bH / 2 + 0.77, 0); rocketGroup.add(podCap);
      const conn = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.06, 0.06), dkMat);
      conn.position.set(s * (bW + 0.15), -0.3, 0); rocketGroup.add(conn);
      const conn2 = conn.clone(); conn2.position.y = 0.15; rocketGroup.add(conn2);
      const pnoz = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.11, 0.22, 12), eMat);
      pnoz.position.set(s * (bW + 0.3), -bH / 2 - 0.12, 0); rocketGroup.add(pnoz);
    });
  }

  // ── SIDE TANKS ──
  if (hasTank) {
    [1, -1].forEach(s => {
      const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 2.3, 16), new THREE.MeshStandardMaterial({ color: 0x506070, metalness: 0.8, roughness: 0.3 }));
      tank.position.set(s * (bW + 0.4), -0.15, 0); rocketGroup.add(tank);
      [0.95, -1.15].forEach(ty => {
        const cap = new THREE.Mesh(new THREE.SphereGeometry(0.17, 12, 12), dkMat);
        cap.position.set(s * (bW + 0.4), ty, 0); rocketGroup.add(cap);
      });
      [-0.4, 0.35].forEach(ty => {
        const ts = new THREE.Mesh(new THREE.CylinderGeometry(0.175, 0.175, 0.03, 16), strMat);
        ts.position.set(s * (bW + 0.4), ty, 0); rocketGroup.add(ts);
      });
    });
  }

  // ── BLASTERS ──
  if (hasB1) {
    [1, -1].forEach(s => {
      const off = hasTank ? 0.42 : 0.18;
      const house = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.42, 0.14), rMat.clone());
      house.position.set(s * (bW + off), 0.22, 0); rocketGroup.add(house);
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.55, 10), dkMat);
      barrel.position.set(s * (bW + off), 0.65, 0); rocketGroup.add(barrel);
      rocketMeshes[`barrel_${s}`] = barrel;
      const mfMat = new THREE.MeshStandardMaterial({ color: 0xff4400, emissive: 0xff2200, emissiveIntensity: 4, transparent: true, opacity: 0 });
      const mf = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), mfMat);
      mf.position.set(s * (bW + off), 0.95, 0); rocketGroup.add(mf);
      rocketMeshes[`muzzle_${s}`] = mf;
      if (hasB2) {
        const b2 = house.clone(); b2.position.set(s * (bW + off), 0.1, 0.16); rocketGroup.add(b2);
        const br2 = barrel.clone(); br2.position.set(s * (bW + off), 0.52, 0.16); rocketGroup.add(br2);
      }
    });
  }

  // ── SCANNER ──
  if (hasScan) {
    const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.55, 8), gMat);
    ant.position.set(0.12, bH / 2 + 1.95, 0); rocketGroup.add(ant);
    const dish = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.025, 8, 20, 0.8 * Math.PI), gMat.clone());
    dish.position.set(0.12, bH / 2 + 2.2, 0); dish.rotation.z = -0.3; rocketGroup.add(dish);
    const prMat2 = new THREE.MeshStandardMaterial({ color: 0x2ecc71, emissive: 0x00aa44, emissiveIntensity: 1.2, transparent: true, opacity: 0.7 });
    const pr = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.015, 8, 32), prMat2);
    pr.position.copy(dish.position); pr.rotation.x = Math.PI / 2; rocketGroup.add(pr);
    rocketMeshes.scanPulse = pr;
  }

  // ── TURRETS ──
  if (hasTurret) {
    [1, -1].forEach(s => {
      const tb = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.16, 12), pMat.clone());
      tb.position.set(s * (bW + 0.24), 0.85, 0); rocketGroup.add(tb);
      const tg = new THREE.Group(); tg.position.copy(tb.position); rocketGroup.add(tg);
      const tBar = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.38, 8), pMat.clone());
      tBar.position.y = 0.28; tg.add(tBar);
      const tMz = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), new THREE.MeshStandardMaterial({ color: 0xcc44ff, emissive: 0x880088, emissiveIntensity: 1.5 }));
      tMz.position.y = 0.5; tg.add(tMz);
      rocketMeshes[`turretGroup_${s}`] = tg;
    });
  }

  // ── DROID ──
  if (hasDroid) {
    const dBody = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.14), new THREE.MeshStandardMaterial({ color: 0x2a3a5a, metalness: 0.8, roughness: 0.3 }));
    dBody.position.set(bW + 0.22, 0.5, 0); rocketGroup.add(dBody);
    const dEye = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), new THREE.MeshStandardMaterial({ color: 0x4488ff, emissive: 0x2244ff, emissiveIntensity: 2 }));
    dEye.position.set(bW + 0.29, 0.52, 0); rocketGroup.add(dEye);
    rocketMeshes.droid = dBody; rocketMeshes.droidEye = dEye;
  }
}

function spawnExhaust3D(pos) {
  if (!THREE || !tapScene) return;
  const geo = new THREE.SphereGeometry(0.05 + Math.random() * 0.04, 5, 5);
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.25 + Math.random() * 0.2, 0.35 + Math.random() * 0.2, 1.0),
    emissive: new THREE.Color(0.05, 0.1, 0.5),
    emissiveIntensity: 1.5,
    transparent: true, opacity: 0.85
  });
  const p = new THREE.Mesh(geo, mat);
  p.position.set(pos.x + (Math.random() - 0.5) * 0.1, pos.y, pos.z + (Math.random() - 0.5) * 0.1);
  p.userData = {
    vy: -0.07 - Math.random() * 0.07,
    vx: (Math.random() - 0.5) * 0.03,
    vz: (Math.random() - 0.5) * 0.03,
    life: 1, decay: 0.055 + Math.random() * 0.04
  };
  tapScene.add(p);
  exhaustParticles.push(p);
}

function animateTap() {
  if (!tapRenderer || !THREE) { requestAnimationFrame(animateTap); return; }
  tapFrame3d++;
  tapFrame++;
  if (tapHeat > 0) tapHeat = Math.max(0, tapHeat - 0.4);

  // Auto rotate
  if (autoRotate) targetRotY += 0.007;
  rotY += (targetRotY - rotY) * 0.09;
  rotX += (targetRotX - rotX) * 0.09;
  if (rocketGroup) {
    rocketGroup.rotation.y = rotY;
    rocketGroup.rotation.x = rotX;
    rocketGroup.position.y = Math.sin(tapFrame3d * 0.022) * 0.06;
  }

  // Engine light
  if (engLight) {
    engLight.intensity = tapHeat * 0.04 + Math.sin(tapFrame3d * 0.18) * 0.04;
    engLight.position.y = -2.4;
  }

  // Exhaust particles
  if (rocketMeshes.nozzPos && (tapHeat > 12 || tapFrame3d % 4 === 0)) {
    const bY = rocketGroup ? rocketGroup.position.y : 0;
    const bH = rocketMeshes.bH || 3;
    rocketMeshes.nozzPos.forEach(np => {
      spawnExhaust3D({ x: np.x, y: bY - bH / 2 - 0.5, z: np.z });
    });
  }

  // Update particles
  for (let i = exhaustParticles.length - 1; i >= 0; i--) {
    const p = exhaustParticles[i];
    p.position.y += p.userData.vy;
    p.position.x += p.userData.vx;
    p.position.z += p.userData.vz;
    p.userData.life -= p.userData.decay;
    p.material.opacity = p.userData.life * 0.8;
    p.scale.setScalar(0.4 + p.userData.life * 0.6);
    if (p.userData.life <= 0) { tapScene.remove(p); exhaustParticles.splice(i, 1); }
  }

  // Scanner pulse
  if (rocketMeshes.scanPulse) {
    const s = 1 + Math.sin(tapFrame3d * 0.07) * 0.45;
    rocketMeshes.scanPulse.scale.setScalar(s);
    rocketMeshes.scanPulse.material.opacity = 0.7 - Math.sin(tapFrame3d * 0.07) * 0.45;
  }

  // Window glow
  if (rocketMeshes.windowGlow) rocketMeshes.windowGlow.intensity = 0.35 + Math.sin(tapFrame3d * 0.05) * 0.2;

  // Muzzle flash
  [1, -1].forEach(s => {
    const mf = rocketMeshes[`muzzle_${s}`];
    if (mf) { const fl = Math.max(0, Math.sin(tapFrame3d * 0.13 + s) * 0.5); mf.material.opacity = fl; mf.material.emissiveIntensity = fl * 5; }
  });

  // Turret rotation
  [1, -1].forEach(s => {
    const tg = rocketMeshes[`turretGroup_${s}`];
    if (tg) tg.rotation.y = Math.sin(tapFrame3d * 0.04 + s * 1.5) * 1.3;
  });

  // Droid orbit
  if (rocketMeshes.droid) {
    const da = tapFrame3d * 0.05;
    const bW2 = 0.44; const r2 = bW2 + 0.32;
    rocketMeshes.droid.position.x = Math.cos(da) * r2;
    rocketMeshes.droid.position.z = Math.sin(da) * r2;
    rocketMeshes.droid.position.y = 0.3 + Math.sin(da * 1.3) * 0.15;
    if (rocketMeshes.droidEye) rocketMeshes.droidEye.position.copy(rocketMeshes.droid.position);
  }

  // Rebuild rocket when inventory changes (check every 120 frames)
  if (tapFrame3d % 120 === 0 && rocketGroup) buildRocket3D(G.inventory || {});

  // Update heat bar UI (outside canvas)
  const bw = document.getElementById('fuel-fill');
  if (bw) { /* handled by updateMainUI */ }

  tapRenderer.render(tapScene, tapCamera);
  requestAnimationFrame(animateTap);
}

function updateMainUI(){
  // Обновляем токен баланс если экран открыт
  const tb = document.getElementById('token-gc-balance');
  if(tb) tb.textContent = Math.floor(G.gc||0).toLocaleString();
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
  if(success) addActivity(`${G.tgUser?.first_name||'Командор'} долетел до ${planet.name}!`, planet.emoji);
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
  if(success){
    const xpAmount = planet.ci * 2;
    await apiPost('/bp_add_xp',{amount:xpAmount});
  }
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
    if(G.gc<item.price){showToast(t('not_enough_gc','Not enough GC'));return;}
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
  if(res?.status==='success'){
    showToast(`✅ ${item.name} — получено!`);
    updateMainUI();
    // Перестраиваем 3D ракету
    if(typeof buildRocket3D==='function' && rocketGroup && THREE) buildRocket3D(G.inventory);
    renderShop();
  } else {showToast('Ошибка покупки');if(item.currency==='gc') G.gc+=item.price;}
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


function applyRocketSkin3D(skinKey) {
  if (!rocketGroup || !THREE) return;
  const skinColors = {
    default: { body: 0x9ab8d0, nose: 0xc8e4f8, fin: 0x607890 },
    gold:    { body: 0xf5c518, nose: 0xffe566, fin: 0xc48000 },
    stealth: { body: 0x1a1a2a, nose: 0x2a2a3a, fin: 0x0a0a18 },
    fire:    { body: 0xe74c3c, nose: 0xff6b5b, fin: 0x9b0000 },
    galaxy:  { body: 0x7c5cfc, nose: 0xb39dfa, fin: 0x3a1090 },
    neptune: { body: 0x1a8abf, nose: 0x70d0ff, fin: 0x0a4a6e },
  };
  const sc = skinColors[skinKey] || skinColors.default;
  rocketGroup.traverse(obj => {
    if (obj.isMesh && obj.material && obj.material.metalness > 0.5) {
      const c = obj.material.color.getHex();
      if (c === 0x9ab8d0 || c === 0x7090b0 || c === 0x607898) obj.material.color.setHex(sc.body);
      else if (c === 0xc8e4f8 || c === 0x90b0cc) obj.material.color.setHex(sc.nose);
      else if (c === 0x506070 || c === 0x4a6080) obj.material.color.setHex(sc.fin);
    }
  });
}

// ══════════════════════════════════════════
//  MXT TOKEN
// ══════════════════════════════════════════
function showToken(){
  document.getElementById('more-menu').style.display='none';
  showScreen('token-screen');
  // Показываем текущий баланс GC
  const el = document.getElementById('token-gc-balance');
  if(el) el.textContent = Math.floor(G.gc || 0).toLocaleString();
}

function openTelegramChannel(){
  const url = 'https://t.me/MarsXRocketChannel'; // замени на свой канал
  if(window.Telegram?.WebApp?.openTelegramLink){
    Telegram.WebApp.openTelegramLink(url);
  } else {
    window.open(url, '_blank');
  }
}

function shareReferral(){
  const uid = G.tgId || '';
  const text = `🚀 Играю в MarsX Rocket и накапливаю GC для будущего MXT токена!\n\nПрисоединяйся — при TGE токены распределят между активными игроками.`;
  const url  = `https://t.me/MarsXRocketBot?start=${uid}`;
  if(window.Telegram?.WebApp?.openTelegramLink){
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    Telegram.WebApp.openTelegramLink(shareUrl);
  } else {
    // Копируем в буфер
    navigator.clipboard?.writeText(url + '\n\n' + text);
    showToast('Ссылка скопирована!');
  }
}

// ══════════════════════════════════════════
//  SPLASH SCREEN
// ══════════════════════════════════════════
function showSplash(){
  const splash = document.getElementById('splash-screen');
  if(!splash) return;
  splash.style.display='flex';
  // Анимация прогресса
  let p=0;
  const bar = document.getElementById('splash-bar');
  const interval = setInterval(()=>{
    p += Math.random()*15 + 5;
    if(p>=100){ p=100; clearInterval(interval);
      setTimeout(()=>{
        splash.style.opacity='0';
        splash.style.transition='opacity .4s';
        setTimeout(()=>splash.style.display='none', 400);
      }, 300);
    }
    if(bar) bar.style.width = Math.min(p,100)+'%';
  }, 120);
}

// ══════════════════════════════════════════
//  ACTIVITY FEED — лента активности
// ══════════════════════════════════════════
const FEED_EVENTS = [];
const FEED_TEMPLATES = [
  (n,p)=>`🚀 ${n} долетел до ${p}`,
  (n)=>`💰 ${n} собрал с майнера`,
  (n,p)=>`⚔️ ${n} ограбил базу у ${p}`,
  (n)=>`🎰 ${n} выиграл джекпот!`,
  (n)=>`🏅 ${n} открыл достижение`,
  (n,p)=>`🌍 ${n} основал колонию на ${p}`,
  (n)=>`👑 ${n} купил Battle Pass`,
];
const PLANET_NAMES_FEED = ['Луны','Марса','Юпитера','Сатурна','Нептуна','Alpha Centauri'];
const FAKE_NAMES = ['Александр','Игорь','Antonio','Maria','Дмитрий','Carlos','Вика','Max','Sunita','Pavel'];

function generateFeedEvent(){
  const n1 = FAKE_NAMES[Math.floor(Math.random()*FAKE_NAMES.length)];
  const n2 = FAKE_NAMES[Math.floor(Math.random()*FAKE_NAMES.length)];
  const p  = PLANET_NAMES_FEED[Math.floor(Math.random()*PLANET_NAMES_FEED.length)];
  const t  = FEED_TEMPLATES[Math.floor(Math.random()*FEED_TEMPLATES.length)];
  return { text: t(n1, p, n2), ts: Date.now() };
}

function initFeed(){
  // Стартовые события
  for(let i=0;i<4;i++) FEED_EVENTS.unshift(generateFeedEvent());
  renderFeed();
  // Новое событие каждые 15-45 секунд
  function nextEvent(){
    FEED_EVENTS.unshift(generateFeedEvent());
    if(FEED_EVENTS.length>8) FEED_EVENTS.pop();
    renderFeed();
    setTimeout(nextEvent, 15000+Math.random()*30000);
  }
  setTimeout(nextEvent, 20000);
}

function renderFeed(){
  const el = document.getElementById('activity-feed');
  if(!el) return;
  el.innerHTML = FEED_EVENTS.slice(0,5).map(e=>`
    <div class="feed-item">
      <span class="feed-text">${e.text}</span>
    </div>`).join('');
}

// ══════════════════════════════════════════
//  STARTER PACK — стартовый пак
// ══════════════════════════════════════════
function checkStarterPack(){
  // Показываем новым игрокам через 3 минуты
  const shownKey = 'marsx_starter_shown';
  if(localStorage.getItem(shownKey)) return;
  if(!G.tgId) return;
  // Только если мало GC и мало полётов — новичок
  if(G.gc > 200 || (G.stats && G.stats.flights_total > 2)) return;
  setTimeout(()=>{
    if(localStorage.getItem(shownKey)) return;
    showStarterPackModal();
  }, 180000); // 3 минуты
}

function showStarterPackModal(){
  const m = document.getElementById('starter-pack-modal');
  if(m) m.style.display='flex';
}

function closeStarterPack(){
  const m = document.getElementById('starter-pack-modal');
  if(m) m.style.display='none';
  localStorage.setItem('marsx_starter_shown','1');
}

async function buyStarterPack(){
  // В реальности здесь Telegram Stars payment
  // Пока показываем что можно купить
  closeStarterPack();
  showToast('⭐ Функция оплаты Stars будет добавлена скоро!');
}

// ══════════════════════════════════════════
//  SOCIAL PRESSURE — «твой друг обогнал»
// ══════════════════════════════════════════
async function checkSocialPressure(){
  if(!G.tgId || !G.ci) return;
  const res = await apiGet('/leaderboard');
  if(!res?.data?.players) return;
  const myRank = res.data.players.findIndex(p=>p.telegram_id==G.tgId)+1;
  const above  = res.data.players[myRank-2]; // игрок выше
  if(above && above.ci - G.ci < 50 && above.ci > G.ci){
    const el = document.getElementById('social-pressure-banner');
    if(el){
      el.querySelector('.sp-text').textContent =
        `⚡ ${above.first_name} опережает тебя на ${above.ci-G.ci} CI — лети сейчас!`;
      el.style.display='block';
      setTimeout(()=>el.style.display='none', 8000);
    }
  }
}


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
    // Перекрашиваем 3D ракету под скин
    if(rocketGroup && THREE) applyRocketSkin3D(key);
    showToast('🎨 Скин применён!');
    showSkins();
  } else showToast(res?.message||'Ошибка');
}

// ══════════════════════════════════════════
//  BATTLE PASS
// ══════════════════════════════════════════
async function showBP(){
  document.getElementById('more-menu').style.display='none';
  showScreen('bp-screen');
  renderBP();
}

async function renderBP(){
  const content = document.getElementById('bp-content');
  content.innerHTML='<div style="text-align:center;padding:30px;color:var(--muted)">Загрузка...</div>';
  const res = await apiGet('/bp_status');
  content.innerHTML='';
  if(!res||res.status!=='success'){
    content.innerHTML='<div style="text-align:center;padding:30px;color:var(--muted)">Battle Pass не активен.<br>Администратор запустит следующий сезон.</div>';
    return;
  }
  const d = res.data;
  // Таймер
  const tl=d.time_left, days=Math.floor(tl/86400), hours=Math.floor((tl%86400)/3600);
  document.getElementById('bp-timer').textContent=`⏱ ${days}д ${hours}ч`;
  // XP прогресс
  const xpPct = Math.min(100, (d.xp / d.xp_next) * 100);
  const hero = document.createElement('div');
  hero.className='bp-hero';
  hero.innerHTML=`
    <div style="font-size:13px;font-weight:700;color:var(--accent2);margin-bottom:2px">${d.season_name}</div>
    <div style="font-size:32px;font-weight:900;color:#fff;margin:6px 0">Уровень ${d.level}</div>
    <div class="bp-xp-bar"><div class="bp-xp-fill" style="width:${xpPct}%"></div></div>
    <div style="font-size:11px;color:var(--muted)">${d.xp} / ${d.xp_next} XP до следующего уровня</div>
    <div style="margin-top:6px;font-size:12px;color:${d.premium?'#f5c518':'var(--muted)'}">
      ${d.premium?'👑 Premium активен':'🔒 Бесплатная версия'}
    </div>
    ${!d.premium?`<button class="bp-buy-btn" onclick="buyBP('${d.season_id}')">
      👑 Купить Premium — ⭐ ${d.bp_price_stars} Stars
    </button>`:''}`;
  content.appendChild(hero);

  // XP подсказка
  const xpHint = document.createElement('div');
  xpHint.style.cssText='font-size:11px;color:var(--muted);text-align:center;margin-bottom:12px';
  xpHint.textContent='XP получаешь за успешные полёты, квесты и ежедневные заходы';
  content.appendChild(xpHint);

  // Бесплатные награды
  const freeTitle = document.createElement('div');
  freeTitle.className='bp-section-title';
  freeTitle.innerHTML='⚪ Бесплатные награды';
  content.appendChild(freeTitle);
  content.appendChild(buildRewardsRow(d.free_rewards, 'free', d.season_id));

  // Разделитель
  const sep = document.createElement('div');
  sep.style.cssText='height:0.5px;background:rgba(245,197,24,.3);margin:12px 0';
  content.appendChild(sep);

  // Премиум награды
  const premTitle = document.createElement('div');
  premTitle.className='bp-section-title';
  premTitle.innerHTML=`👑 <span style="color:var(--gold)">Premium награды</span>${!d.premium?' <span style="font-size:10px;background:rgba(245,197,24,.15);color:var(--gold);padding:2px 8px;border-radius:10px">🔒 Нужен Premium</span>':''}`;
  content.appendChild(premTitle);
  content.appendChild(buildRewardsRow(d.premium_rewards, 'premium', d.season_id));
}

function buildRewardsRow(rewards, type, seasonId){
  const row = document.createElement('div');
  row.className='bp-rewards-row';
  rewards.forEach(r => {
    const cell = document.createElement('div');
    let cls = 'bp-reward-cell';
    if(type==='premium') cls += ' premium-cell';
    if(r.claimed)    cls += ' claimed';
    else if(r.locked) cls += ' locked';
    else if(r.available) cls += ' available';
    cell.className = cls;
    cell.innerHTML = `
      <div class="bp-level-num">Ур.${r.level}</div>
      <div class="bp-reward-icon">${r.icon}</div>
      <div class="bp-reward-label">${r.label}</div>
      ${r.claimed?'<div class="bp-claimed-badge">✅</div>':''}`;
    if(r.available && !r.claimed){
      cell.onclick = ()=>claimBP(r.level, type, seasonId);
      cell.title = 'Нажми чтобы получить!';
    }
    row.appendChild(cell);
  });
  return row;
}

async function buyBP(seasonId){
  const res = await apiPost('/bp_buy_premium');
  if(res?.status==='success'){
    showToast('👑 Premium Battle Pass активирован!');
    if(window.Telegram?.WebApp?.HapticFeedback)
      Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    renderBP();
  } else {
    showToast(res?.message||'Ошибка покупки');
  }
}

async function claimBP(level, rewardType, seasonId){
  const res = await apiPost('/bp_claim',{level, reward_type: rewardType, season_id: seasonId});
  if(res?.status==='success'){
    const r = res.data?.reward;
    showToast(`🎁 Получено: ${r?.label||'Награда'}`);
    if(window.Telegram?.WebApp?.HapticFeedback)
      Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    // Применяем локально
    if(r?.type==='gc') G.gc += r.value;
    else if(r?.type==='fuel') G.fuel = Math.min(G.fuelMax, G.fuel + r.value);
    updateMainUI();
    renderBP();
  } else {
    showToast(res?.message||'Ошибка');
  }
}

// Добавляем XP после успешного полёта
const _origFinalizeFlight = finalizeFlight;

// ══════════════════════════════════════════
//  MXT TOKEN
// ══════════════════════════════════════════
function showToken(){
  document.getElementById('more-menu').style.display='none';
  showScreen('token-screen');
  // Показываем текущий баланс GC
  const el = document.getElementById('token-gc-balance');
  if(el) el.textContent = Math.floor(G.gc || 0).toLocaleString();
}

function openTelegramChannel(){
  const url = 'https://t.me/MarsXRocketChannel'; // замени на свой канал
  if(window.Telegram?.WebApp?.openTelegramLink){
    Telegram.WebApp.openTelegramLink(url);
  } else {
    window.open(url, '_blank');
  }
}

function shareReferral(){
  const uid = G.tgId || '';
  const text = `🚀 Играю в MarsX Rocket и накапливаю GC для будущего MXT токена!\n\nПрисоединяйся — при TGE токены распределят между активными игроками.`;
  const url  = `https://t.me/MarsXRocketBot?start=${uid}`;
  if(window.Telegram?.WebApp?.openTelegramLink){
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    Telegram.WebApp.openTelegramLink(shareUrl);
  } else {
    // Копируем в буфер
    navigator.clipboard?.writeText(url + '\n\n' + text);
    showToast('Ссылка скопирована!');
  }
}

// ══════════════════════════════════════════
//  SPLASH SCREEN
// ══════════════════════════════════════════
function initSplash(){
  const el = document.getElementById('splash-screen');
  if(!el) return;
  el.style.display    = 'flex';
  el.style.opacity    = '1';
  el.style.transition = 'none';
  const bar = document.getElementById('splash-bar');
  let p = 0;
  const iv = setInterval(()=>{
    p += Math.random() * 20 + 10;
    if(bar) bar.style.width = Math.min(p, 95) + '%';
    if(p >= 95) clearInterval(iv);
  }, 80);
  setTimeout(hideSplash, 2000);
}

function hideSplash(){
  const el = document.getElementById('splash-screen');
  if(!el || el.style.display==='none') return;
  const bar = document.getElementById('splash-bar');
  if(bar) bar.style.width = '100%';
  setTimeout(()=>{
    el.style.opacity    = '0';
    el.style.transition = 'opacity 0.4s ease';
    setTimeout(()=>{ el.style.display = 'none'; }, 420);
  }, 100);
}

// ══════════════════════════════════════════
//  ЛЕНТА АКТИВНОСТИ
// ══════════════════════════════════════════
const _activityItems = [];

function addActivity(text, emoji='🚀'){
  _activityItems.unshift({text, emoji, time: new Date()});
  if(_activityItems.length > 8) _activityItems.pop();
  renderActivity();
}

function renderActivity(){
  const feed = document.getElementById('activity-feed');
  const list = document.getElementById('activity-items');
  if(!feed||!list) return;
  if(_activityItems.length===0){ feed.style.display='none'; return; }
  feed.style.display='block';
  list.innerHTML = _activityItems.slice(0,5).map(item=>{
    const mins = Math.floor((new Date()-item.time)/60000);
    const timeStr = mins<1?'только что':mins<60?`${mins}м`:Math.floor(mins/60)+'ч';
    return `<div class="activity-item"><span>${item.emoji}</span><span>${item.text}</span><span class="activity-time">${timeStr}</span></div>`;
  }).join('');
}

async function loadRecentActivity(){
  const res = await apiGet('/recent_activity');
  if(res?.status==='success'){
    (res.data||[]).forEach(item=>addActivity(item.text, item.emoji));
  }
}

// ══════════════════════════════════════════
//  СТАРТОВЫЙ ПАК
// ══════════════════════════════════════════
function checkStarterPack(){
  // Показываем новым игрокам через 3 минуты после регистрации
  if(G.onboardingDone && !G.inventory.starter_pack_seen){
    const regTime = parseInt(localStorage.getItem('marsx_reg_time')||'0');
    const now = Date.now();
    if(!regTime){ localStorage.setItem('marsx_reg_time', now); return; }
    if(now - regTime > 180000){ // 3 минуты
      showStarterPack();
    }
  }
}

function showStarterPack(){
  const modal = document.createElement('div');
  modal.id = 'starter-pack-modal';
  modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:200;display:flex;align-items:center;justify-content:center;padding:16px';
  modal.innerHTML=`
    <div style="background:var(--bg2);border:1px solid rgba(245,197,24,.4);border-radius:20px;padding:24px;max-width:320px;width:100%;text-align:center">
      <div style="font-size:36px;margin-bottom:8px">🎁</div>
      <div style="font-size:18px;font-weight:800;margin-bottom:4px;color:#f5c518">Пак Первопроходца</div>
      <div style="font-size:12px;color:var(--muted);margin-bottom:16px">Специальное предложение только для тебя!</div>
      <div style="background:var(--bg3);border-radius:12px;padding:12px;margin-bottom:16px">
        <div style="font-size:13px;margin-bottom:8px">В паке:</div>
        <div style="display:flex;flex-direction:column;gap:5px;font-size:12px">
          <div>💰 1000 GC</div>
          <div>🛡 Щит × 3</div>
          <div>⚡ Топливный буст × 2</div>
          <div>⛽ +400 топлива</div>
        </div>
      </div>
      <button onclick="buyStarterPack()" style="width:100%;padding:13px;background:linear-gradient(135deg,#f5c518,#f39c12);border:none;border-radius:12px;color:#1a0a00;font-size:15px;font-weight:700;cursor:pointer;font-family:var(--font);margin-bottom:8px">
        ⭐ 99 Stars — Забрать пак!
      </button>
      <button onclick="closeStarterPack()" style="background:none;border:none;color:var(--muted);font-size:12px;cursor:pointer;font-family:var(--font);padding:6px">
        Не сейчас
      </button>
    </div>`;
  document.body.appendChild(modal);
  G.inventory.starter_pack_seen = true;
}

async function buyStarterPack(){
  const res = await apiPost('/buy_starter_pack');
  if(res?.status==='success'){
    G.gc += 1000;
    G.fuel = Math.min(G.fuelMax, G.fuel + 400);
    G.inventory.shield = (G.inventory.shield||0) + 3;
    G.inventory.fuel_boost = true;
    showToast('🎁 Пак Первопроходца получен!');
    closeStarterPack();
    updateMainUI();
  } else showToast(res?.message||'Ошибка');
}

function closeStarterPack(){
  const m = document.getElementById('starter-pack-modal');
  if(m) m.remove();
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



async function connectWallet(){
  const addr = document.getElementById('wallet-input')?.value?.trim();
  if(!addr || addr.length < 20){ showToast(t('token_wallet_placeholder','Enter wallet')); return; }
  if(!addr.startsWith('0x')){ showToast('EVM адрес должен начинаться с 0x'); return; }
  const res = await apiPost('/connect_wallet',{wallet_address: addr});
  if(res?.status==='success') showToast('✅ ' + t('token_connect_wallet','Wallet connected'));
  else showToast(res?.message||'Error');
}
