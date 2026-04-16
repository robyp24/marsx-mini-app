// --- Глобальные переменные ---
let tg;
let user;
let tg_user_id;
let isFlightInProgress = false;
let currentScreen = 'main';

// --- Конфигурация API ---
const API_URL = 'https://humbly-petunia-customs.ngrok-free.dev';

// --- Управление экранами ---
function showScreen(screenId) {
    document.querySelectorAll('.screen, .container').forEach(el => el.classList.remove('active'));
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
        currentScreen = screenId;
    }
}

// --- Инициализация Telegram WebApp ---
function initTelegramApp() {
    if (!window.Telegram) {
        document.getElementById('status').innerHTML = '<p>Ошибка: Telegram WebApp не найден.</p>';
        return;
    }
    tg = window.Telegram.WebApp;
    user = tg.initDataUnsafe.user;
    if (!user) {
        document.getElementById('status').innerHTML = '<p>Ошибка: Данные пользователя не найдены.</p>';
        return;
    }
    tg_user_id = user.id;
    tg.expand();
    showScreen('main-screen');
    loadUserData();
    createStars();
}

// --- Загрузка данных пользователя ---
async function loadUserData() {
    try {
        const response = await fetch(`${API_URL}/user_data?telegram_id=${tg_user_id}`, {
            headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        if (result.status === 'success') {
            updateUI(result.data);
        } else {
            console.error(`Ошибка от сервера: ${result.message}`);
            document.getElementById('status').innerHTML = '<p>Ошибка: Нажмите /start в боте</p>';
        }
    } catch (error) {
        console.error('[loadUserData] Произошла ошибка:', error);
        document.getElementById('status').innerHTML = '<p>Не удалось загрузить данные.</p>';
    }
}

// --- Обновление интерфейса ---
function updateUI(data) {
    document.getElementById('status').innerHTML = `
        <p>Привет, ${user.first_name}!</p>
        <p>Капитал: ${data.gc_balance} GC</p>
        <p>Пассивный доход: ${data.passive_income_per_minute} GC/мин</p>
    `;
    isFlightInProgress = (data.state === 'in_flight');
    if (isFlightInProgress) {
        disablePlanetButtons();
    } else {
        enablePlanetButtons();
    }
    renderPlanets();
    updateReferralScreen(data);
}

// --- Рендеринг планет ---
function renderPlanets() {
    const planetsContainer = document.getElementById('planets');
    planetsContainer.innerHTML = '';
    const planets = [
        { key: 'moon', name: 'Луна', duration: '1 мин', reward: '12 GC', risk: '8%', icon: '🌙' },
        { key: 'mars', name: 'Марс', duration: '2 мин', reward: '25 GC', risk: '34%', icon: '🔴' },
        { key: 'jupiter', name: 'Юпитер', duration: '3 мин', reward: '50 GC', risk: '71%', icon: '🟠' }
    ];
    planets.forEach(planet => {
        const button = document.createElement('div');
        button.className = 'planet';
        button.innerHTML = `
            <div class="planet-info">
                <div class="planet-name">${planet.name}</div>
                <div class="planet-stats">Длительность: ${planet.duration} | Награда: ${planet.reward} | Риск: ${planet.risk}</div>
            </div>
            <div class="planet-icon">${planet.icon}</div>
        `;
        button.onclick = () => startFlight(planet.key);
        planetsContainer.appendChild(button);
    });
}

// --- Полет ---
async function startFlight(planetKey) {
    if (isFlightInProgress) { tg.showAlert('Вы уже в полете!'); return; }
    tg.MainButton.text = 'Запускаю...'; tg.MainButton.show(); tg.MainButton.disable();
    try {
        const response = await fetch(`${API_URL}/start_flight`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
            body: JSON.stringify({ telegram_id: tg_user_id, planet_key: planetKey })
        });
        const result = await response.json();
        if (result.status === 'success') {
            const planet = result.planet;
            document.getElementById('status').innerHTML = `<p>Полет на ${planet.name}...</p>`;
            isFlightInProgress = true; disablePlanetButtons();
            startFlightAnimation(planet.duration_min * 60);
        } else { tg.showAlert(`Ошибка запуска: ${result.message}`); }
    } catch (error) { console.error('[startFlight] Error:', error); tg.showAlert('Не удалось связаться с сервером.'); }
    finally { tg.MainButton.hide(); }
}

function startFlightAnimation(durationSeconds) {
    const rocket = document.getElementById('rocket'); rocket.classList.add('in-flight');
    let timeLeft = durationSeconds;
    const timerInterval = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60); const seconds = timeLeft % 60;
        document.getElementById('status').innerHTML = `<p>В полете... ${minutes}:${seconds.toString().padStart(2, '0')}</p>`;
        timeLeft--;
        if (timeLeft < 0) { clearInterval(timerInterval); endFlight(); }
    }, 1000);
}

function endFlight() {
    const rocket = document.getElementById('rocket'); rocket.classList.remove('in-flight');
    document.getElementById('status').innerHTML = '<p>Полет завершен!</p>';
    tg.showAlert('Полет завершен! Награда зачислена.');
    isFlightInProgress = false; loadUserData();
}

// --- Управление кнопками планет ---
function disablePlanetButtons() { document.querySelectorAll('.planet').forEach(b => { b.disabled = true; b.style.opacity = '0.5'; b.style.cursor = 'not-allowed'; }); }
function enablePlanetButtons() { document.querySelectorAll('.planet').forEach(b => { b.disabled = false; b.style.opacity = '1'; b.style.cursor = 'pointer'; }); }

// --- Экран инвестиций ---
async function handleInvestment(amount) {
    const confirm = tg.showConfirm(`Вы уверены, что хотите инвестировать $${amount}?`);
    if (!confirm) return;
    tg.MainButton.text = 'Обработка...'; tg.MainButton.show(); tg.MainButton.disable();
    try {
        const response = await fetch(`${API_URL}/invest`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
            body: JSON.stringify({ telegram_id: tg_user_id, amount_usd: amount })
        });
        const result = await response.json();
        if (result.status === 'success') { tg.showAlert(result.message); loadUserData(); showScreen('main-screen'); }
        else { tg.showAlert(`Ошибка: ${result.message}`); }
    } catch (error) { console.error('[handleInvestment] Error:', error); tg.showAlert('Не удалось связаться с сервером.'); }
    finally { tg.MainButton.hide(); }
}

// --- Экран таблицы лидеров ---
async function loadLeaderboard() {
    try {
        const response = await fetch(`${API_URL}/leaderboard`, { headers: { 'ngrok-skip-browser-warning': 'true' } });
        const result = await response.json();
        if (result.status === 'success') {
            renderLeaderboard('leaderboard-gc', result.top_by_gc, 'gc_balance');
            renderLeaderboard('leaderboard-income', result.top_by_income, 'passive_income_per_minute');
        }
    } catch (error) { console.error('[loadLeaderboard] Error:', error); }
}

function renderLeaderboard(listId, data, scoreField) {
    const list = document.getElementById(listId);
    list.innerHTML = '';
    data.forEach((user, index) => {
        const li = document.createElement('li');
        li.className = `leaderboard-item top-${index + 1}`;
        li.innerHTML = `
            <span class="leaderboard-rank">#${index + 1}</span>
            <span class="leaderboard-name">${user.first_name || 'Anonymous'}</span>
            <span class="leaderboard-score">${scoreField === 'passive_income_per_minute' ? user[scoreField].toFixed(2) : user[scoreField]}</span>
        `;
        list.appendChild(li);
    });
}

// --- Экран рефералов ---
function updateReferralScreen(data) {
    const refLink = `https://t.me/your_bot_username?start=ref_${data.referral_code}`;
    document.getElementById('referral-link').innerText = refLink;
    document.getElementById('referrals-count').innerText = data.referrals_count;
}

function copyReferralLink() {
    const refLink = document.getElementById('referral-link').innerText;
    navigator.clipboard.writeText(refLink).then(() => {
        tg.showAlert('Ссылка скопирована в буфер обмена!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        tg.showAlert('Не удалось скопировать ссылку.');
    });
}

// --- Декоративные элементы ---
function createStars() {
    const starsContainer = document.getElementById('stars');
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        starsContainer.appendChild(star);
    }
}

// --- Обработчики событий ---
document.addEventListener('DOMContentLoaded', () => {
    // Навигация
    document.getElementById('go-to-invest').addEventListener('click', () => showScreen('investment-screen'));
    document.getElementById('go-to-leaderboard').addEventListener('click', () => { showScreen('leaderboard-screen'); loadLeaderboard(); });
    document.getElementById('go-to-referrals').addEventListener('click', () => showScreen('referrals-screen'));

    // Кнопки "Назад"
    document.getElementById('back-to-main-from-invest').addEventListener('click', () => showScreen('main-screen'));
    document.getElementById('back-to-main-from-leaderboard').addEventListener('click', () => showScreen('main-screen'));
    document.getElementById('back-to-main-from-referrals').addEventListener('click', () => showScreen('main-screen'));

    // Инвестиции
    document.getElementById('investment-screen').addEventListener('click', e => {
        const card = e.target.closest('.investment-card');
        if (card) handleInvestment(parseFloat(card.dataset.amount));
    });

    // Рефералы
    document.getElementById('copy-referral').addEventListener('click', copyReferralLink);
});

// --- Запуск ---
window.onload = () => initTelegramApp();
