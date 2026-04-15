// --- Глобальные переменные ---
let tg;
let user;
let tg_user_id;
let isFlightInProgress = false;

// --- Конфигурация API ---
// ВАЖНО: Замените эту ссылку на вашу актуальную ссылку от ngrok!
const API_URL = 'https://uncrown-untie-playset.ngrok-free.dev'; 

// --- Инициализация Telegram WebApp ---
function initTelegramApp() {
    tg = window.Telegram.WebApp;
    user = tg.initDataUnsafe.user;
    tg_user_id = user.id;

    // Расширяем окно на всю высоту
    tg.expand();

    // Показываем основное приложение, скрывая загрузку
    document.getElementById('status').innerHTML = '<p>Инициализация...</p>';
    document.querySelector('.container').style.display = 'flex';

    // Загружаем данные пользователя
    loadUserData();
}

// --- Загрузка данных пользователя с сервера ---
async function loadUserData() {
    console.log(`[loadUserData] Начало загрузки данных для пользователя: ${tg_user_id}`);
    try {
        // --- ИЗМЕНЕНИЕ ЗДЕСЬ ---
        const response = await fetch(`${API_URL}/user_data?telegram_id=${tg_user_id}`, {
            headers: {
                'ngrok-skip-browser-warning': 'true'
            }
        });
        console.log(`[loadUserData] Ответ от сервера: ${response.status}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log(`[loadUserData] Полученные данные:`, result);

        if (result.status === 'success') {
            const data = result.data;
            // Обновляем данные в интерфейсе
            updateUI(data);
        } else {
            console.error(`[loadUserData] Ошибка от сервера: ${result.message}`);
            document.getElementById('status').innerHTML = '<p>Ошибка: Нажмите /start в боте</p>';
        }
    } catch (error) {
        console.error('[loadUserData] Произошла ошибка:', error);
        document.getElementById('status').innerHTML = '<p>Не удалось загрузить данные. Проверьте подключение.</p>';
    }
}

// --- Функция для обновления интерфейса ---
function updateUI(data) {
    document.getElementById('status').innerHTML = `<p>Привет, ${user.first_name}! Баланс: ${data.gc_balance} GC | CI: ${data.ci_score}</p>`;
    isFlightInProgress = (data.state === 'in_flight');
    if (isFlightInProgress) {
        disablePlanetButtons();
    } else {
        enablePlanetButtons();
    }
    renderPlanets();
}

// --- Рендеринг кнопок планет ---
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

// --- Инициализация полета ---
async function startFlight(planetKey) {
    if (isFlightInProgress) {
        tg.showAlert('Вы уже в полете!');
        return;
    }

    console.log(`[startFlight] Попытка запустить полет на планету: ${planetKey}`);
    tg.MainButton.text = 'Запускаю...';
    tg.MainButton.show();
    tg.MainButton.disable();

    try {
        // --- ИЗМЕНЕНИЕ ЗДЕСЬ ---
        const response = await fetch(`${API_URL}/start_flight`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true' // <--- ВОТ ОНО
            },
            body: JSON.stringify({
                telegram_id: tg_user_id,
                planet_key: planetKey
            })
        });

        const result = await response.json();
        console.log(`[startFlight] Ответ от сервера:`, result);

        if (result.status === 'success') {
            const planet = result.planet;
            document.getElementById('status').innerHTML = `<p>Полет на ${planet.name}...</p>`;
            isFlightInProgress = true;
            disablePlanetButtons();
            startFlightAnimation(planet.duration_min * 60);
        } else {
            tg.showAlert(`Ошибка запуска: ${result.message}`);
        }
    } catch (error) {
        console.error('[startFlight] Произошла ошибка:', error);
        tg.showAlert('Не удалось связаться с сервером.');
    } finally {
        tg.MainButton.hide();
    }
}

// --- UI и анимации ---
function disablePlanetButtons() {
    document.querySelectorAll('.planet').forEach(button => {
        button.disabled = true;
        button.style.opacity = '0.5';
        button.style.cursor = 'not-allowed';
    });
}

function enablePlanetButtons() {
    document.querySelectorAll('.planet').forEach(button => {
        button.disabled = false;
        button.style.opacity = '1';
        button.style.cursor = 'pointer';
    });
}

function startFlightAnimation(durationSeconds) {
    const rocket = document.getElementById('rocket');
    rocket.classList.add('in-flight');
    
    let timeLeft = durationSeconds;
    const timerInterval = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById('status').innerHTML = `<p>В полете... ${minutes}:${seconds.toString().padStart(2, '0')}</p>`;
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timerInterval);
            endFlight();
        }
    }, 1000);
}

function endFlight() {
    const rocket = document.getElementById('rocket');
    rocket.classList.remove('in-flight');
    document.getElementById('status').innerHTML = '<p>Полет завершен!</p>';
    tg.showAlert('Полет завершен! Награда зачислена.');
    
    isFlightInProgress = false;
    loadUserData();
}

// --- Запуск приложения при загрузке страницы ---
window.onload = function() {
    if (window.Telegram) {
        initTelegramApp();
    } else {
        document.getElementById('status').innerHTML = '<p>Ошибка: Telegram WebApp не найден.</p>';
    }
};
