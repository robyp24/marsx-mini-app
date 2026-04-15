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

    // Показываем основное приложение
    document.getElementById('main-app').style.display = 'block';

    // Загружаем данные пользователя
    loadUserData();
}

// --- Загрузка данных пользователя с сервера ---
async function loadUserData() {
    console.log(`[loadUserData] Начало загрузки данных для пользователя: ${tg_user_id}`);
    try {
        const response = await fetch(`${API_URL}/user_data?telegram_id=${tg_user_id}`);
        console.log(`[loadUserData] Ответ от сервера: ${response.status}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log(`[loadUserData] Полученные данные:`, result);

        if (result.status === 'success') {
            const data = result.data;
            document.getElementById('gc-balance').textContent = data.gc_balance;
            document.getElementById('ci-score').textContent = data.ci_score;
            document.getElementById('status').textContent = 'На планете';
            isFlightInProgress = (data.state === 'in_flight');
            if (isFlightInProgress) {
                document.getElementById('status').textContent = 'В полете...';
                disablePlanetButtons();
            }
        } else {
            console.error(`[loadUserData] Ошибка от сервера: ${result.message}`);
            // Если пользователя нет, возможно, он не нажал /start в боте
            document.getElementById('status').textContent = 'Ошибка: Нажмите /start в боте';
        }
    } catch (error) {
        console.error('[loadUserData] Произошла ошибка:', error);
        document.getElementById('status').textContent = 'Не удалось загрузить данные. Проверьте подключение.';
    }
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
        const response = await fetch(`${API_URL}/start_flight`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
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
            document.getElementById('status').textContent = `Полет на ${planet.name}...`;
            isFlightInProgress = true;
            disablePlanetButtons();
            startFlightAnimation(planet.duration_min * 60); // Длительность в секундах
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
    document.querySelectorAll('.planet-button').forEach(button => {
        button.disabled = true;
        button.style.opacity = '0.5';
    });
}

function enablePlanetButtons() {
    document.querySelectorAll('.planet-button').forEach(button => {
        button.disabled = false;
        button.style.opacity = '1';
    });
}

function startFlightAnimation(durationSeconds) {
    const rocket = document.getElementById('rocket');
    rocket.classList.add('flying');
    
    // Таймер для обратного отсчета
    let timeLeft = durationSeconds;
    const timerInterval = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById('status').textContent = `В полете... ${minutes}:${seconds.toString().padStart(2, '0')}`;
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timerInterval);
            endFlight();
        }
    }, 1000);
}

function endFlight() {
    const rocket = document.getElementById('rocket');
    rocket.classList.remove('flying');
    document.getElementById('status').textContent = 'Полет завершен!';
    tg.showAlert('Полет завершен! Награда зачислена.');
    
    isFlightInProgress = false;
    loadUserData(); // Перезагружаем данные, чтобы обновить баланс
    enablePlanetButtons();
}


// --- Запуск приложения при загрузке страницы ---
window.onload = function() {
    if (window.Telegram) {
        initTelegramApp();
    } else {
        document.getElementById('status').textContent = 'Ошибка: Telegram WebApp не найден.';
    }
};
