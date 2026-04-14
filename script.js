// Ждем, пока Telegram Web App API будет готов
window.Telegram.WebApp.ready();

const user = window.Telegram.WebApp.initDataUnsafe.user;
const tg_user_id = user.id;

// Адрес вашего API сервера (пока локальный)
const API_URL = 'http://localhost:8080';

// Функция для загрузки данных пользователя с бэкенда
async function loadUserData() {
    try {
        const response = await fetch(`${API_URL}/user_data?telegram_id=${tg_user_id}`);
        const data = await response.json();
        
        if (data.status === 'success') {
            const statusEl = document.getElementById('status');
            statusEl.innerHTML = `<p>Привет, ${user.first_name}! Баланс: ${data.data.gc_balance} GC | CI: ${data.data.ci_score}</p>`;
        } else {
            console.error('Ошибка при загрузке данных:', data.message);
        }
    } catch (error) {
        console.error('Сетевая ошибка:', error);
        document.getElementById('status').innerHTML = '<p>Не удалось загрузить данные. Проверьте подключение.</p>';
    }
}

// Функция для отправки запроса на полет (пока заглушка)
async function sendFlightRequest(planetKey) {
    alert(`Запрос на полет на ${planetKey} отправлен! (Это пока заглушка, но скоро будет работать!)`);
}

// Функция для отображения интерфейса
function renderUI() {
    const planetsEl = document.getElementById('planets');
    const planets = [
        { key: 'moon', name: '🌕 Луна', info: 'Низкий риск, 1 мин' },
        { key: 'mars', name: '🔴 Марс', info: 'Средний риск, 2 мин' },
        { key: 'jupiter', name: '🟠 Юпитер', info: 'Высокий риск, 3 мин' }
    ];

    planetsEl.innerHTML = '';
    planets.forEach(planet => {
        const planetDiv = document.createElement('div');
        planetDiv.className = 'planet';
        planetDiv.innerHTML = `
            <div class="planet-name">${planet.name}</div>
            <div class="planet-info">${planet.info}</div>
        `;
        planetDiv.onclick = () => sendFlightRequest(planet.key);
        planetsEl.appendChild(planetDiv);
    });
}

// Запускаем все
loadUserData();
renderUI();