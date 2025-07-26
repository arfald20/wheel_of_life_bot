/**
 * Главное приложение для Web App "Колесо жизненного баланса"
 */

class LifeBalanceApp {
    constructor() {
        this.currentSphereIndex = 0;
        this.scores = {};
        this.isInitialized = false;
        
        // Конфигурация сфер и вопросов
        this.spheresData = {
            'health': {
                emoji: '🏃‍♂️',
                title: 'Здоровье',
                description: 'Оцените ваше физическое и психическое здоровье',
                questions: [
                    'Как оцениваете физическое самочувствие?',
                    'Хватает ли энергии на весь день?',
                    'Уделяете ли время профилактике здоровья?'
                ]
            },
            'career': {
                emoji: '💼',
                title: 'Карьера',
                description: 'Как складывается ваша профессиональная деятельность',
                questions: [
                    'Приносит ли работа ощущение смысла?',
                    'Есть ли перспективы роста?',
                    'Соответствует ли деятельность вашим целям?'
                ]
            },
            'finance': {
                emoji: '💰',
                title: 'Финансы', 
                description: 'Оцените ваше финансовое положение',
                questions: [
                    'Устраивает ли уровень дохода?',
                    'Чувствуете ли финансовую стабильность?',
                    'Планируете ли семейный бюджет?'
                ]
            },
            'love': {
                emoji: '❤️',
                title: 'Любовь',
                description: 'Оцените ваши романтические отношения',
                questions: [
                    'Есть ли близость и поддержка?',
                    'Удовлетворены ли отношениями?',
                    'Довольны качеством общения?'
                ]
            },
            'family': {
                emoji: '👨‍👩‍👧‍👦',
                title: 'Семья',
                description: 'Как складываются отношения с близкими',
                questions: [
                    'Гармоничны ли семейные отношения?',
                    'Хватает ли времени с близкими?',
                    'Есть ли взаимопонимание в семье?'
                ]
            },
            'friends': {
                emoji: '👥',
                title: 'Друзья',
                description: 'Оцените ваш круг общения и дружбы',
                questions: [
                    'Есть ли надёжные друзья?',
                    'Удовлетворяет ли круг общения?',
                    'Легко ли заводить новые знакомства?'
                ]
            },
            'hobby': {
                emoji: '🎭',
                title: 'Хобби',
                description: 'Как проводите свободное время',
                questions: [
                    'Хватает ли времени на увлечения?',
                    'Получаете ли удовольствие от досуга?',
                    'Умеете ли полноценно отдыхать?'
                ]
            },
            'self': {
                emoji: '📚',
                title: 'Саморазвитие',
                description: 'Оцените ваш личностный рост',
                questions: [
                    'Учитесь ли новому регулярно?',
                    'Развиваетесь ли как личность?',
                    'Работаете ли над собой?'
                ]
            }
        };

        this.sphereKeys = Object.keys(this.spheresData);
        
        this.init();
    }

    async init() {
        try {
            // Ждем инициализации Telegram Web App
            await this.waitForTelegram();
            
            // Инициализация DOM элементов
            this.initDOM();
            
            // Настройка обработчиков событий
            this.setupEventListeners();
            
            // Инициализация прогресс-бара
            this.updateProgress();
            
            this.isInitialized = true;
            console.log('Life Balance App инициализировано');
            
        } catch (error) {
            console.error('Ошибка инициализации приложения:', error);
        }
    }

    async waitForTelegram() {
        return new Promise((resolve) => {
            if (window.telegramApp && window.telegramApp.isReady) {
                resolve();
            } else {
                const checkTelegram = setInterval(() => {
                    if (window.telegramApp && window.telegramApp.isReady) {
                        clearInterval(checkTelegram);
                        resolve();
                    }
                }, 100);
                
                // Fallback через 3 секунды
                setTimeout(() => {
                    clearInterval(checkTelegram);
                    console.warn('Telegram Web App недоступен, продолжаем без него');
                    resolve();
                }, 3000);
            }
        });
    }

    initDOM() {
        // Основные элементы
        this.progressFill = document.getElementById('progressFill');
        this.currentStepSpan = document.getElementById('currentStep');
        this.totalStepsSpan = document.getElementById('totalSteps');
        
        // Экраны
        this.welcomeScreen = document.getElementById('welcomeScreen');
        this.assessmentScreen = document.getElementById('assessmentScreen');
        this.completionScreen = document.getElementById('completionScreen');
        
        // Элементы оценки
        this.sphereEmoji = document.getElementById('sphereEmoji');
        this.sphereTitle = document.getElementById('sphereTitle');
        this.sphereDescription = document.getElementById('sphereDescription');
        this.questionsList = document.getElementById('questionsList');
        this.ratingSlider = document.getElementById('ratingSlider');
        this.ratingValue = document.getElementById('ratingValue');
        this.ratingLabel = document.getElementById('ratingLabel');
        
        // Кнопки навигации
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        
        // Предварительный результат
        this.resultsPreview = document.getElementById('resultsPreview');
        
        // Установка общего количества шагов
        if (this.totalStepsSpan) {
            this.totalStepsSpan.textContent = this.sphereKeys.length;
        }
    }

    setupEventListeners() {
        // Слайдер рейтинга
        if (this.ratingSlider) {
            this.ratingSlider.addEventListener('input', (e) => {
                this.updateRatingDisplay(e.target.value);
            });
        }

        // Хапитик фидбек для слайдера
        if (this.ratingSlider && window.telegramApp) {
            this.ratingSlider.addEventListener('input', () => {
                window.telegramApp.hapticFeedback('selection');
            });
        }
    }

    updateProgress() {
        const progress = (this.currentSphereIndex / this.sphereKeys.length) * 100;
        
        if (this.progressFill) {
            this.progressFill.style.width = `${progress}%`;
        }
        
        if (this.currentStepSpan) {
            this.currentStepSpan.textContent = this.currentSphereIndex + 1;
        }
    }

    showScreen(screenId) {
        // Скрыть все экраны
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Показать нужный экран
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.add('active');
        }
    }

    startAssessment() {
        if (window.telegramApp) {
            window.telegramApp.hapticFeedback('impact', 'light');
        }
        
        this.currentSphereIndex = 0;
        this.scores = {};
        this.showScreen('assessmentScreen');
        this.displayCurrentSphere();
        this.updateProgress();
    }

    displayCurrentSphere() {
        const sphereKey = this.sphereKeys[this.currentSphereIndex];
        const sphereData = this.spheresData[sphereKey];
        
        // Обновление информации о сфере
        if (this.sphereEmoji) {
            this.sphereEmoji.textContent = sphereData.emoji;
        }
        
        if (this.sphereTitle) {
            this.sphereTitle.textContent = sphereData.title;
        }
        
        if (this.sphereDescription) {
            this.sphereDescription.textContent = sphereData.description;
        }
        
        // Отображение вопросов
        if (this.questionsList) {
            this.questionsList.innerHTML = '';
            
            sphereData.questions.forEach((question, index) => {
                const questionDiv = document.createElement('div');
                questionDiv.className = 'question-item';
                
                questionDiv.innerHTML = `
                    <div class="question-number">${index + 1}.</div>
                    <div class="question-text">${question}</div>
                `;
                
                this.questionsList.appendChild(questionDiv);
            });
        }
        
        // Сброс слайдера
        if (this.ratingSlider) {
            const previousScore = this.scores[sphereKey] || 5;
            this.ratingSlider.value = previousScore;
            this.updateRatingDisplay(previousScore);
        }
        
        // Обновление кнопок навигации
        this.updateNavigationButtons();
    }

    updateRatingDisplay(value) {
        if (this.ratingValue) {
            this.ratingValue.textContent = value;
        }
        
        if (this.ratingLabel) {
            const labels = {
                '1': 'очень плохо',
                '2': 'плохо', 
                '3': 'неудовлетворительно',
                '4': 'ниже среднего',
                '5': 'средне',
                '6': 'выше среднего',
                '7': 'хорошо',
                '8': 'очень хорошо',
                '9': 'отлично',
                '10': 'идеально'
            };
            this.ratingLabel.textContent = `из 10 (${labels[value] || ''})`;
        }
    }

    updateNavigationButtons() {
        // Кнопка "Назад"
        if (this.prevBtn) {
            if (this.currentSphereIndex === 0) {
                this.prevBtn.style.display = 'none';
            } else {
                this.prevBtn.style.display = 'block';
            }
        }
        
        // Кнопка "Далее"
        if (this.nextBtn) {
            if (this.currentSphereIndex === this.sphereKeys.length - 1) {
                this.nextBtn.textContent = 'Завершить';
            } else {
                this.nextBtn.textContent = 'Далее →';
            }
        }
    }

    nextSphere() {
        // Сохраняем текущую оценку
        const sphereKey = this.sphereKeys[this.currentSphereIndex];
        const score = parseInt(this.ratingSlider.value);
        this.scores[sphereKey] = score;
        
        // Хапитик фидбек
        if (window.telegramApp) {
            window.telegramApp.hapticFeedback('impact', 'light');
        }
        
        if (this.currentSphereIndex < this.sphereKeys.length - 1) {
            // Переход к следующей сфере
            this.currentSphereIndex++;
            this.displayCurrentSphere();
            this.updateProgress();
        } else {
            // Завершение оценки
            this.completeAssessment();
        }
    }

    previousSphere() {
        if (this.currentSphereIndex > 0) {
            // Хапитик фидбек
            if (window.telegramApp) {
                window.telegramApp.hapticFeedback('impact', 'light');
            }
            
            this.currentSphereIndex--;
            this.displayCurrentSphere();
            this.updateProgress();
        }
    }

    completeAssessment() {
        // Обновление прогресса до 100%
        this.updateProgress();
        
        // Показ экрана завершения
        this.showScreen('completionScreen');
        
        // Генерация предварительного просмотра
        this.generateResultsPreview();
        
        // Хапитик фидбек успеха
        if (window.telegramApp) {
            window.telegramApp.hapticFeedback('notification', 'success');
        }
    }

    generateResultsPreview() {
        if (!this.resultsPreview) return;
        
        const summary = window.ResultsUtils.generateSummary(this.scores);
        
        this.resultsPreview.innerHTML = `
            <div class="preview-item">
                <span class="preview-label">Общий балл:</span>
                <span class="preview-value">${summary.analysis.total}/80</span>
            </div>
            <div class="preview-item">
                <span class="preview-label">Средняя оценка:</span>
                <span class="preview-value">${summary.analysis.average}/10</span>
            </div>
            <div class="preview-item">
                <span class="preview-label">Лучшая сфера:</span>
                <span class="preview-value">${summary.strongest.info.emoji} ${summary.strongest.info.title}</span>
            </div>
            <div class="preview-item">
                <span class="preview-label">Требует внимания:</span>
                <span class="preview-value">${summary.weakest.info.emoji} ${summary.weakest.info.title}</span>
            </div>
            <div class="preview-item">
                <span class="preview-label">Баланс:</span>
                <span class="preview-value">${summary.analysis.balanceLevel}</span>
            </div>
        `;
    }

    sendResults() {
        if (!this.isInitialized) {
            console.error('Приложение не инициализировано');
            return;
        }
        
        console.log('Отправка результатов:', this.scores);
        
        // Хапитик фидбек
        if (window.telegramApp) {
            window.telegramApp.hapticFeedback('impact', 'medium');
            
            // Отправляем данные боту
            window.telegramApp.sendData(this.scores);
        } else {
            // Fallback для тестирования без Telegram
            console.log('Результаты оценки:', this.scores);
            alert('Результаты готовы! (Тестовый режим без Telegram)');
        }
    }
}

// Глобальные функции для вызова из HTML
function startAssessment() {
    if (window.lifeBalanceApp) {
        window.lifeBalanceApp.startAssessment();
    }
}

function nextSphere() {
    if (window.lifeBalanceApp) {
        window.lifeBalanceApp.nextSphere();
    }
}

function previousSphere() {
    if (window.lifeBalanceApp) {
        window.lifeBalanceApp.previousSphere();
    }
}

function updateRatingDisplay(value) {
    if (window.lifeBalanceApp) {
        window.lifeBalanceApp.updateRatingDisplay(value);
    }
}

function sendResults() {
    if (window.lifeBalanceApp) {
        window.lifeBalanceApp.sendResults();
    }
}

// Инициализация приложения при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    window.lifeBalanceApp = new LifeBalanceApp();
});