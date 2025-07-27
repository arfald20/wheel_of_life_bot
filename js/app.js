// webapp/js/app.js
const spheres = [
    {
        key: 'health',
        title: 'Здоровье',
        emoji: '🏃‍♂️',
        questions: [
            'Как оцениваете физическое самочувствие?',
            'Хватает ли энергии на день?',
            'Уделяете ли время профилактике?'
        ]
    },
    {
        key: 'career',
        title: 'Карьера',
        emoji: '💼',
        questions: [
            'Приносит ли работа ощущение смысла?',
            'Есть ли перспектива роста?',
            'Соответствует ли деятельность целям?'
        ]
    },
    {
        key: 'finance',
        title: 'Финансы',
        emoji: '💰',
        questions: [
            'Устраивает ли уровень дохода?',
            'Чувствуете ли стабильность?',
            'Планируете ли бюджет?'
        ]
    },
    {
        key: 'love',
        title: 'Любовь',
        emoji: '❤️',
        questions: [
            'Есть ли близость и поддержка?',
            'Удовлетворены ли отношениями?',
            'Довольны качеством общения?'
        ]
    },
    {
        key: 'family',
        title: 'Семья',
        emoji: '👨‍👩‍👧‍👦',
        questions: [
            'Гармоничны ли отношения?',
            'Хватает ли времени с близкими?',
            'Есть ли взаимопонимание?'
        ]
    },
    {
        key: 'friends',
        title: 'Друзья',
        emoji: '👥',
        questions: [
            'Есть ли надёжные друзья?',
            'Удовлетворяет ли круг общения?',
            'Легко ли заводить знакомства?'
        ]
    },
    {
        key: 'hobby',
        title: 'Хобби',
        emoji: '🎭',
        questions: [
            'Хватает ли времени на увлечения?',
            'Получаете ли удовольствие от досуга?',
            'Умеете ли отдыхать?'
        ]
    },
    {
        key: 'self',
        title: 'Саморазвитие',
        emoji: '📚',
        questions: [
            'Учитесь ли новому?',
            'Развиваетесь ли личностно?',
            'Работаете ли над собой?'
        ]
    }
];

let currentSphere = 0;
const results = {};

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
        Telegram.WebApp.ready();
        Telegram.WebApp.expand();
        renderSphere();
    } else {
        console.error('Telegram WebApp API не доступен');
    }
});

function renderSphere() {
    const sphere = spheres[currentSphere];
    const progressPercent = ((currentSphere + 1) / spheres.length) * 100;
    
    document.getElementById('app').innerHTML = `
        <div class="sphere-container">
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progressPercent}%"></div>
                <span class="progress-text">${currentSphere + 1} из ${spheres.length}</span>
            </div>
            
            <div class="sphere-header">
                <h2>${sphere.emoji} ${sphere.title}</h2>
            </div>
            
            <div class="questions">
                ${sphere.questions.map(q => `<p class="question">• ${q}</p>`).join('')}
            </div>
            
            <div class="slider-container">
                <label for="slider">Ваша оценка: <span id="slider-value">5</span>/10</label>
                <input type="range" id="slider" min="1" max="10" value="5" class="slider">
                <div class="slider-labels">
                    <span>1</span>
                    <span>10</span>
                </div>
            </div>
            
            <div class="buttons-container">
                ${currentSphere > 0 ? 
                    '<button id="prevBtn" class="btn btn-secondary">← Назад</button>' : 
                    '<div></div>'
                }
                <button id="nextBtn" class="btn btn-primary">
                    ${currentSphere < spheres.length - 1 ? 'Далее →' : 'Завершить ✓'}
                </button>
            </div>
        </div>
    `;
    
    // Обработчики событий
    const slider = document.getElementById('slider');
    const sliderValue = document.getElementById('slider-value');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    
    // Обновление значения слайдера
    slider.addEventListener('input', function() {
        sliderValue.textContent = this.value;
    });
    
    // Кнопка "Далее/Завершить"
    nextBtn.addEventListener('click', function() {
        const value = parseInt(slider.value);
        results[sphere.key] = value;
        
        if (currentSphere < spheres.length - 1) {
            currentSphere++;
            renderSphere();
        } else {
            finishTest();
        }
    });
    
    // Кнопка "Назад"
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentSphere > 0) {
                currentSphere--;
                renderSphere();
                // Восстанавливаем предыдущее значение
                if (results[spheres[currentSphere].key]) {
                    document.getElementById('slider').value = results[spheres[currentSphere].key];
                    document.getElementById('slider-value').textContent = results[spheres[currentSphere].key];
                }
            }
        });
    }
    
    // Если есть сохраненное значение, восстанавливаем его
    if (results[sphere.key]) {
        slider.value = results[sphere.key];
        sliderValue.textContent = results[sphere.key];
    }
}

function finishTest() {
    // Показываем сообщение с большей задержкой
    document.getElementById('app').innerHTML = `
        <div class="completion-message">
            <div class="completion-icon">✅</div>
            <h2>Тест завершен!</h2>
            <p>Ваши результаты отправляются боту...</p>
            <p>Через несколько секунд вы получите:</p>
            <ul>
                <li>📊 Детальный анализ баланса</li>
                <li>🎯 Персональные рекомендации</li>
                <li>📄 PDF отчет с колесом жизни</li>
            </ul>
            <div class="loading-spinner"></div>
        </div>
    `;
    
    // Отправляем данные через таймаут для показа сообщения
    setTimeout(() => {
        if (typeof Telegram !== 'undefined' && Telegram.WebApp && Telegram.WebApp.sendData) {
            try {
                Telegram.WebApp.sendData(JSON.stringify(results));
                console.log('Данные отправлены:', results);
            } catch (error) {
                console.error('Ошибка отправки данных:', error);
                // Показываем сообщение об ошибке
                document.querySelector('.completion-message p').textContent = 
                    'Ошибка отправки данных. Попробуйте еще раз или обратитесь к администратору.';
            }
        } else {
            console.error('Telegram.WebApp.sendData недоступен');
        }
    }, 3000); // Увеличиваем задержку до 3 секунд
}
