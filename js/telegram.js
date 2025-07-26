/**
 * Модуль для работы с Telegram Web App API
 */

class TelegramApp {
    constructor() {
        this.tg = window.Telegram.WebApp;
        this.isReady = false;
        this.init();
    }

    init() {
        if (!this.tg) {
            console.error('Telegram Web App API не найден');
            return;
        }

        try {
            // Инициализация Telegram Web App
            this.tg.ready();
            this.isReady = true;

            // Настройка приложения
            this.setupApp();
            
            // Применение темы
            this.applyTheme();
            
            console.log('Telegram Web App инициализирован');
            console.log('User:', this.tg.initDataUnsafe.user);
            console.log('Theme:', this.tg.themeParams);

        } catch (error) {
            console.error('Ошибка инициализации Telegram Web App:', error);
        }
    }

    setupApp() {
        // Включить главную кнопку если нужно
        this.tg.MainButton.hide();
        
        // Отключить вертикальные свайпы если нужно
        this.tg.disableVerticalSwipes();
        
        // Развернуть приложение на весь экран
        this.tg.expand();
        
        // Настроить заголовок
        this.tg.setHeaderColor('bg_color');
        
        // Отключить закрытие по свайпу вниз (оставить только кнопку закрытия)
        this.tg.enableClosingConfirmation();
    }

    applyTheme() {
        if (!this.tg.themeParams) {
            console.warn('Параметры темы не доступны');
            return;
        }

        const theme = this.tg.themeParams;
        const root = document.documentElement;

        // Применяем цвета темы Telegram к CSS переменным
        if (theme.bg_color) {
            root.style.setProperty('--tg-theme-bg-color', theme.bg_color);
        }
        if (theme.text_color) {
            root.style.setProperty('--tg-theme-text-color', theme.text_color);
        }
        if (theme.hint_color) {
            root.style.setProperty('--tg-theme-hint-color', theme.hint_color);
        }
        if (theme.link_color) {
            root.style.setProperty('--tg-theme-link-color', theme.link_color);
        }
        if (theme.button_color) {
            root.style.setProperty('--tg-theme-button-color', theme.button_color);
        }
        if (theme.button_text_color) {
            root.style.setProperty('--tg-theme-button-text-color', theme.button_text_color);
        }
        if (theme.secondary_bg_color) {
            root.style.setProperty('--tg-theme-secondary-bg-color', theme.secondary_bg_color);
        }

        console.log('Тема применена:', theme);
    }

    // Методы для работы с интерфейсом
    showMainButton(text, callback) {
        if (!this.isReady) return;
        
        this.tg.MainButton.setText(text);
        this.tg.MainButton.show();
        this.tg.MainButton.onClick(callback);
    }

    hideMainButton() {
        if (!this.isReady) return;
        
        this.tg.MainButton.hide();
        this.tg.MainButton.offClick();
    }

    enableMainButton() {
        if (!this.isReady) return;
        this.tg.MainButton.enable();
    }

    disableMainButton() {
        if (!this.isReady) return;
        this.tg.MainButton.disable();
    }

    showBackButton(callback) {
        if (!this.isReady) return;
        
        this.tg.BackButton.show();
        this.tg.BackButton.onClick(callback);
    }

    hideBackButton() {
        if (!this.isReady) return;
        
        this.tg.BackButton.hide();
        this.tg.BackButton.offClick();
    }

    // Показать алерт
    showAlert(message) {
        if (!this.isReady) return;
        this.tg.showAlert(message);
    }

    // Показать подтверждение
    showConfirm(message, callback) {
        if (!this.isReady) return;
        this.tg.showConfirm(message, callback);
    }

    // Показать попап
    showPopup(params) {
        if (!this.isReady) return;
        this.tg.showPopup(params);
    }

    // Вибрация
    hapticFeedback(type = 'impact', style = 'medium') {
        if (!this.isReady) return;
        
        if (type === 'impact') {
            this.tg.HapticFeedback.impactOccurred(style); // light, medium, heavy
        } else if (type === 'notification') {
            this.tg.HapticFeedback.notificationOccurred(style); // success, warning, error
        } else if (type === 'selection') {
            this.tg.HapticFeedback.selectionChanged();
        }
    }

    // Отправить данные боту
    sendData(data) {
        if (!this.isReady) {
            console.error('Telegram Web App не готов');
            return;
        }

        try {
            const jsonData = JSON.stringify(data);
            console.log('Отправка данных боту:', jsonData);
            this.tg.sendData(jsonData);
        } catch (error) {
            console.error('Ошибка отправки данных:', error);
            this.showAlert('Ошибка отправки данных. Попробуйте еще раз.');
        }
    }

    // Закрыть приложение
    close() {
        if (!this.isReady) return;
        this.tg.close();
    }

    // Получить данные пользователя
    getUserData() {
        if (!this.isReady) return null;
        return this.tg.initDataUnsafe.user || null;
    }

    // Получить данные запроса
    getStartParam() {
        if (!this.isReady) return null;
        return this.tg.initDataUnsafe.start_param || null;
    }

    // Проверить доступность функций
    isFeatureAvailable(feature) {
        if (!this.isReady) return false;
        
        const features = {
            mainButton: !!this.tg.MainButton,
            backButton: !!this.tg.BackButton,
            hapticFeedback: !!this.tg.HapticFeedback,
            cloudStorage: !!this.tg.CloudStorage,
            biometric: !!this.tg.BiometricManager
        };

        return features[feature] || false;
    }

    // Работа с Cloud Storage (если доступно)
    async getCloudStorageItem(key) {
        if (!this.isFeatureAvailable('cloudStorage')) {
            throw new Error('Cloud Storage не доступен');
        }
        
        return new Promise((resolve, reject) => {
            this.tg.CloudStorage.getItem(key, (error, value) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(value);
                }
            });
        });
    }

    async setCloudStorageItem(key, value) {
        if (!this.isFeatureAvailable('cloudStorage')) {
            throw new Error('Cloud Storage не доступен');
        }
        
        return new Promise((resolve, reject) => {
            this.tg.CloudStorage.setItem(key, value, (error, success) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(success);
                }
            });
        });
    }

    // Утилиты для отладки
    getDebugInfo() {
        return {
            version: this.tg.version,
            platform: this.tg.platform,
            viewportHeight: this.tg.viewportHeight,
            viewportStableHeight: this.tg.viewportStableHeight,
            isExpanded: this.tg.isExpanded,
            themeParams: this.tg.themeParams,
            initData: this.tg.initData,
            initDataUnsafe: this.tg.initDataUnsafe
        };
    }
}

// Создание глобального экземпляра
window.telegramApp = new TelegramApp();

// Экспорт для использования в модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TelegramApp;
}