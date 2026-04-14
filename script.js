window.Telegram.WebApp.ready();
window.Telegram.WebApp.expand(); // Раскрываем на весь экран

const user = window.Telegram.WebApp.initDataUnsafe.user;
const tg_user_id = user.id;
const API_URL = 'http://localhost:8080';

let currentFlight = null;

// --- Функции для работы с UI ---

function showNotification(text, duration = 3000) {
    const notificationEl = document.getElementById('notification');
    const notificationTextEl = document.getElementById('notification-text');
    notificationTextEl.innerText = text;
    notificationEl.classList.add('show');
    setTimeout(() => {
        notificationEl.classList.remove('show');
    }, duration);
}

function animateRocket() {
    const rocket = document.getElementById('rocket');
    rocket.classList.add('in-flight');
    setTimeout(() => {
        rocket.classList.remove('in-flight');
    }, 2000); // Длительность анимации
}

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

// --- Функции для работы с API ---

async function loadUserData() {
    try {
        const response = await fetch(`${API_URL}/user_data?telegram_id=${tg_user_id}`);
        const data = await response.json();
        
        if (data.status === 'success') {
            const statusEl = document.getElementById('status');
            statusEl.innerHTML = `<p>Привет, ${user.first_name}! Баланс: ${data.data.gc_balance} GC | CI: ${data.data.ci_score}</p>`;
            if (data.data.state === 'in_flight') {
                statusEl.innerHTML += `<br><span style="color: #ff4d4d;">Вы в полете!</span>`;
            }
        } else {
            console.error('Ошибка при загрузке данных:', data.message);
        }
    } catch (error) {
        console.error('Сетевая ошибка:', error);
        document.getElementById('status').innerHTML = '<p>Не удалось загрузить данные. Проверьте подключение.</p>';
    }
}

async function sendFlightRequest(planetKey) {
    if (currentFlight) {
        showNotification('Вы уже в полете!');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/start_flight`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ telegram_id: tg_user_id, planet_key: planetKey }),
        });

        const data = await response.json();
        
        if (data.status === 'success') {
            currentFlight = true;
            animateRocket();
            showNotification(`🚀 Полет на ${data.planet.name} запущен!`);
            
            // Симулируем прибытие через N минут
            const flightDuration = data.planet.duration_min * 60 * 1000; // в миллисекундах
            setTimeout(() => {
                showNotification(`✅ Вы прибыли на ${data.planet.name}! Получено +${data.planet.reward_gc} GC и +${data.planet.ci_delta} CI.`);
                currentFlight = null;
                loadUserData(); // Обновляем данные
            }, flightDuration);

        } else {
            showNotification(`❌ Ошибка: ${data.message}`);
        }
    } catch (error) {
        console.error('Сетевая ошибка при отправке запроса:', error);
        showNotification('❌ Не удалось отправить запрос.');
    }
}

function renderUI() {
    const planetsEl = document.getElementById('planets');
    const planets = [
        { key: 'moon', name: 'Луна', info: 'Риск: 8% | Время: 1 мин', reward: '12 GC', icon: '🌕' },
        { key: 'mars', name: 'Марс', info: 'Риск: 34% | Время: 2 мин', reward: '25 GC', icon: '🔴' },
        { key: 'jupiter', name: 'Юпитер', info: 'Риск: 71% | Время: 3 мин', reward: '50 GC', icon: '🟠' }
    ];

    planetsEl.innerHTML = '';
    planets.forEach(planet => {
        const planetDiv = document.createElement('div');
        planetDiv.className = 'planet';
        planetDiv.innerHTML = `
            <div class="planet-info">
                <div class="planet-name">${planet.icon} ${planet.name}</div>
                <div class="planet-stats">${planet.info}</div>
            </div>
            <div style="font-weight: bold; color: #4dff4d;">${planet.reward}</div>
        `;
        planetDiv.onclick = () => sendFlightRequest(planet.key);
        planetsEl.appendChild(planetDiv);
    });
}

// --- Запуск ---
createStars();
loadUserData();
renderUI();