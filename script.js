// Ждем, пока Telegram Web App API будет готов
window.Telegram.WebApp.ready();

// Получаем данные от Telegram (имя пользователя, аватар и т.д.)
const user = window.Telegram.WebApp.initDataUnsafe.user;

// Функция для отправки данных на наш бэкенд (пока это заглушка)
async function sendFlightRequest(planetKey) {
    alert(`Вы выбрали планету: ${planetKey}. Запрос отправлен! (Это пока заглушка)`);
}

// Функция для отображения интерфейса
function renderUI() {
    const statusEl = document.getElementById('status');
    const planetsEl = document.getElementById('planets');

    // Показываем приветствие
    statusEl.innerHTML = `<p>Привет, ${user.first_name}! Ваш баланс: 0 GC | CI: 0</p>`;

    // Создаем кнопки планет
    const planets = [
        { key: 'moon', name: '🌕 Луна', info: 'Низкий риск, 1 мин' },
        { key: 'mars', name: '🔴 Марс', info: 'Средний риск, 2 мин' },
        { key: 'jupiter', name: '🟠 Юпитер', info: 'Высокий риск, 3 мин' }
    ];

    planetsEl.innerHTML = ''; // Очищаем контейнер
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

// Запускаем отображение, когда все готово
renderUI();