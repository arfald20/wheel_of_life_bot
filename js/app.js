// webapp/js/app.js
import { drawWheel } from './wheel.js';
import { initTelegram } from './telegram.js';

// Данные о сферах жизни
const SPHERES_DATA = [
    {
        key: 'health',
        title: 'Здоровье',
        icon: '💪',
        color: '#10B981',
        className: 'sphere-health',
        questions: [
            'Как вы оцениваете свое физическое самочувствие в последнее время?',
            'Хватает ли вам энергии для выполнения повседневных дел?',
            'Уделяете ли вы достаточно внимания профилактике здоровья?'
        ]
    },
    {
        key: 'career',
        title: 'Карьера',
        icon: '💼',
        color: '#6366F1',
        className: 'sphere-career',
        questions: [
            'Приносит ли ваша работа ощущение смысла и удовлетворения?',
            'Видите ли вы перспективы профессионального роста?',
            'Соответствует ли ваша деятельность долгосрочным целям?'
        ]
    },
    {
        key: 'finance',
        title: 'Финансы',
        icon: '💰',
        color: '#059669',
        className: 'sphere-finance',
        questions: [
            'Устраивает ли вас ваш текущий уровень дохода?',
            'Чувствуете ли вы финансовую стабильность и безопасность?',
            'Умеете ли вы планировать бюджет и контролировать расходы?'
        ]
    },
    {
        key: 'love',
        title: 'Любовь',
        icon: '❤️',
        color: '#DC2626',
        className: 'sphere-love',
        questions: [
            'Есть ли в вашей жизни близость и взаимная поддержка?',
            'Удовлетворены ли вы качеством романтических отношений?',
            'Довольны ли вы уровнем эмоциональной близости с партнером?'
        ]
    },
    {
        key: 'family',
        title: 'Семья',
        icon: '👨‍👩‍👧‍👦',
        color: '#EA580C',
        className: 'sphere-family',
        questions: [
            'Насколько гармоничны ваши отношения с семьей?',
            'Хватает ли вам времени для близких людей?',
            'Есть ли взаимопонимание и поддержка в семье?'
        ]
    },
    {
        key: 'friends',
        title: 'Друзья',
        icon: '👥',
        color: '#2563EB',
        className: 'sphere-friends',
        questions: [
            'Есть ли у вас надежные друзья, на которых можно положиться?',
            'Удовлетворяет ли вас ваш круг общения?',
            'Легко ли вам заводить новые знакомства?'
        ]
    },
    {
        key: 'hobby',
        title: 'Хобби',
        icon: '🎭',
        color: '#7C3AED',
        className: 'sphere-hobby',
        questions: [
            'Хватает ли вам времени на увлечения и хобби?',
            'Получаете ли вы удовольствие от досуга и развлечений?',
            'Умеете ли вы качественно отдыхать и расслабляться?'
        ]
    },
    {
        key: 'self',
        title: 'Саморазвитие',
        icon: '📚',
        color: '#16A34A',
        className: 'sphere-self',
        questions: [
            'Продолжаете ли вы учиться и познавать новое?',
            'Работаете ли вы над личностным развитием?',
            'Занимаетесь ли саморефлексией и самоанализом?'
        ]
    }
];

class LifeWheelApp {
    constructor() {
        this.currentSphereIndex = 0;
        this.scores = {};
        this.isCompleted = false;
        
        // DOM элементы
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        this.sphereIcon = document.getElementById('sphereIcon');
        this.sphereTitle = document.getElementById('sphereTitle');
        this.questionsContainer = document.getElementById('questionsContainer');
        this.ratingSlider = document.getElementById('ratingSlider');
        this.ratingValue = document.getElementById('ratingValue');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.questionCard = document.getElementById('questionCard');
        this.completionScreen = document.getElementById('completionScreen');
        this.wheelCanvas = document.getElementById('wheelCanvas');
        this.finalWheelCanvas = document.getElementById('finalWheelCanvas');
        
        this.init();
    }
    
    init() {
        // Инициализация Telegram Web App
        initTelegram();
        
        // Установка обработчиков событий
        this.ratingSlider.addEventListener('input', (e) => {
            this.updateRatingDisplay(e.target.value);
        });
        
        this.prevBtn.addEventListener('click', () => {
            this.previousSphere();
        });
        
        this.nextBtn.addEventListener('click', () => {
            this.nextSphere();
        });
        
        // Показать первую сферу
        this.showSphere(0);
        this.updateWheel();
        
        console.log('Life Wheel App initialized');
    }
    
    showSphere(index) {
        if (index < 0 || index >= SPHERES_DATA.length) return;
        
        const sphere = SPHERES_DATA[index];
        this.currentSphereIndex = index;
        
        // Анимация смены карточки
        this.questionCard.style.opacity = '0';
        this.questionCard.style.transform = 'translateX(20px)';
        
        setTimeout(() => {
            // Обновление содержимого
            this.sphereIcon.textContent = sphere.icon;
            this.sphereIcon.className = `sphere-icon ${sphere.className}`;
            this.sphereTitle.textContent = sphere.title;
            
            // Обновление вопросов
            this.questionsContainer.innerHTML = '';
            sphere.questions.forEach(question => {
                const questionDiv = document.createElement('div');
                questionDiv.className = 'question-item';
                questionDiv.textContent = question;
                this.questionsContainer.appendChild(questionDiv);
            });
            
            // Восстановление или установка значения слайдера
            const currentScore = this.scores[sphere.key] || 5;
            this.ratingSlider.value = currentScore;
            this.updateRatingDisplay(currentScore);
            
            // Обновление прогресса
            this.updateProgress();
            
            // Обновление кнопок
            this.updateButtons();
            
            // Анимация появления
            this.questionCard.style.opacity = '1';
            this.questionCard.style.transform = 'translateX(0)';
        }, 200);
    }
    
    updateRatingDisplay(value) {
        this.ratingValue.textContent = value;
        
        // Сохранение оценки
        const currentSphere = SPHERES_DATA[this.currentSphereIndex];
        this.scores[currentSphere.key] = parseInt(value);
        
        // Обновление колеса
        this.updateWheel();
    }
    
    updateProgress() {
        const progress = ((this.currentSphereIndex + 1) / SPHERES_DATA.length) * 100;
        this.progressFill.style.width = `${progress}%`;
        this.progressText.textContent = `${this.currentSphereIndex + 1} / ${SPHERES_DATA.length}`;
    }
    
    updateButtons() {
        // Кнопка "Назад"
        if (this.currentSphereIndex === 0) {
            this.prevBtn.style.display = 'none';
        } else {
            this.prevBtn.style.display = 'block';
        }
        
        // Кнопка "Далее/Завершить"
        if (this.currentSphereIndex === SPHERES_DATA.length - 1) {
            this.nextBtn.textContent = 'Завершить тест ✅';
            this.nextBtn.classList.add('btn-success');
        } else {
            this.nextBtn.textContent = 'Далее →';
            this.nextBtn.classList.remove('btn-success');
        }
    }
    
    updateWheel() {
        if (this.wheelCanvas) {
            drawWheel(this.wheelCanvas, this.scores, SPHERES_DATA);
        }
    }
    
    previousSphere() {
        if (this.currentSphereIndex > 0) {
            this.showSphere(this.currentSphereIndex - 1);
        }
    }
    
    nextSphere() {
        // Сохранение текущей оценки
        const currentSphere = SPHERES_DATA[this.currentSphereIndex];
        this.scores[currentSphere.key] = parseInt(this.ratingSlider.value);
        
        if (this.currentSphereIndex < SPHERES_DATA.length - 1) {
            // Переход к следующей сфере
            this.showSphere(this.currentSphereIndex + 1);
        } else {
            // Завершение теста
            this.completeTest();
        }
    }
    
    completeTest() {
        console.log('Test completed with scores:', this.scores);
        
        // Проверка, что все сферы оценены
        const missingScores = SPHERES_DATA.filter(sphere => !this.scores[sphere.key]);
        if (missingScores.length > 0) {
            alert('Пожалуйста, оцените все сферы жизни');
            return;
        }
        
        // Показать экран завершения
        this.showCompletionScreen();
        
        // Отправить данные в Telegram через 2 секунды
        setTimeout(() => {
            this.sendDataToTelegram();
        }, 2000);
    }
    
    showCompletionScreen() {
        this.completionScreen.style.display = 'flex';
        
        // Нарисовать финальное колесо
        setTimeout(() => {
            if (this.finalWheelCanvas) {
                drawWheel(this.finalWheelCanvas, this.scores, SPHERES_DATA);
            }
        }, 500);
    }
    
    sendDataToTelegram() {
        if (window.Telegram?.WebApp) {
            try {
                // Валидация данных перед отправкой
                const validatedScores = {};
                SPHERES_DATA.forEach(sphere => {
                    const score = this.scores[sphere.key];
                    validatedScores[sphere.key] = Math.max(1, Math.min(10, parseInt(score) || 5));
                });
                
                console.log('Sending data to Telegram:', validatedScores);
                
                // Отправка данных в Telegram
                window.Telegram.WebApp.sendData(JSON.stringify(validatedScores));
                
                // Закрытие Web App
                setTimeout(() => {
                    window.Telegram.WebApp.close();
                }, 1000);
                
            } catch (error) {
                console.error('Error sending data to Telegram:', error);
                alert('Ошибка отправки данных. Попробуйте еще раз.');
            }
        } else {
            console.warn('Telegram WebApp not available');
            // Для тестирования без Telegram
            alert('Тест завершен! Данные: ' + JSON.stringify(this.scores));
        }
    }
    
    // Метод для тестирования без Telegram
    debugMode() {
        console.log('Debug mode - filling with sample data');
        SPHERES_DATA.forEach((sphere, index) => {
            this.scores[sphere.key] = Math.floor(Math.random() * 10) + 1;
        });
        this.updateWheel();
        this.completeTest();
    }
}

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    const app = new LifeWheelApp();
    
    // Добавляем app в глобальную область для отладки
    window.lifeWheelApp = app;
    
    // Для отладки - можно вызвать app.debugMode() в консоли
    console.log('Life Wheel App loaded. Use lifeWheelApp.debugMode() for testing.');
});

// Обработка изменения темы Telegram
document.addEventListener('DOMContentLoaded', () => {
    if (window.Telegram?.WebApp) {
        // Применение темы Telegram
        const themeParams = window.Telegram.WebApp.themeParams;
        if (themeParams) {
            document.documentElement.style.setProperty('--tg-bg-color', themeParams.bg_color || '#ffffff');
            document.documentElement.style.setProperty('--tg-text-color', themeParams.text_color || '#000000');
            document.documentElement.style.setProperty('--tg-hint-color', themeParams.hint_color || '#708499');
            document.documentElement.style.setProperty('--tg-button-color', themeParams.button_color || '#3390ec');
            document.documentElement.style.setProperty('--tg-button-text-color', themeParams.button_text_color || '#ffffff');
            document.documentElement.style.setProperty('--tg-secondary-bg-color', themeParams.secondary_bg_color || '#f4f4f5');
        }
    }
});

export default LifeWheelApp;
