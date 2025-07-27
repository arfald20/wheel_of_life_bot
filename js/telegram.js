// webapp/js/telegram.js

// Инициализация Telegram Web App
export function initTelegram() {
    if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        
        // Настройка Web App
        tg.ready();
        tg.expand();
        
        // Настройка темы
        applyTelegramTheme();
        
        // Настройка главной кнопки (скрываем, используем свою)
        tg.MainButton.hide();
        
        // Настройка кнопки назад
        tg.BackButton.hide();
        
        // Обработчики событий
        setupTelegramEventHandlers();
        
        console.log('Telegram Web App initialized');
        console.log('User:', tg.initDataUnsafe?.user);
        console.log('Theme:', tg.themeParams);
        
        return tg;
    } else {
        console.warn('Telegram Web App not available');
        return null;
    }
}

// Применение темы Telegram
function applyTelegramTheme() {
    if (!window.Telegram?.WebApp?.themeParams) return;
    
    const theme = window.Telegram.WebApp.themeParams;
    const root = document.documentElement;
    
    // Применяем цвета темы
    if (theme.bg_color) {
        root.style.setProperty('--tg-bg-color', theme.bg_color);
    }
    if (theme.text_color) {
        root.style.setProperty('--tg-text-color', theme.text_color);
    }
    if (theme.hint_color) {
        root.style.setProperty('--tg-hint-color', theme.hint_color);
    }
    if (theme.link_color) {
        root.style.setProperty('--tg-link-color', theme.link_color);
    }
    if (theme.button_color) {
        root.style.setProperty('--tg-button-color', theme.button_color);
    }
    if (theme.button_text_color) {
        root.style.setProperty('--tg-button-text-color', theme.button_text_color);
    }
    if (theme.secondary_bg_color) {
        root.style.setProperty('--tg-secondary-bg-color', theme.secondary_bg_color);
    }
    
    // Добавляем класс темы к body
    if (theme.bg_color) {
        const brightness = getBrightnessFromColor(theme.bg_color);
        document.body.classList.add(brightness > 128 ? 'light-theme' : 'dark-theme');
    }
    
    console.log('Telegram theme applied:', theme);
}

// Вычисление яркости цвета
function getBrightnessFromColor(hexColor) {
    const color = hexColor.replace('#', '');
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
}

// Настройка обработчиков событий Telegram
function setupTelegramEventHandlers() {
    if (!window.Telegram?.WebApp) return;
    
    const tg = window.Telegram.WebApp;
    
    // Обработчик изменения размера окна
    tg.onEvent('viewportChanged', () => {
        console.log('Viewport changed:', tg.viewportHeight, tg.viewportStableHeight);
        adjustLayoutForViewport();
    });
    
    // Обработчик изменения темы
    tg.onEvent('themeChanged', () => {
        console.log('Theme changed');
        applyTelegramTheme();
    });
    
    // Обработчик главной кнопки (если используется)
    tg.onEvent('mainButtonClicked', () => {
        console.log('Main button clicked');
    });
    
    // Обработчик кнопки назад
    tg.onEvent('backButtonClicked', () => {
        console.log('Back button clicked');
        // Можно добавить логику возврата на предыдущий экран
    });
}

// Адаптация макета под размер окна
function adjustLayoutForViewport() {
    if (!window.Telegram?.WebApp) return;
    
    const tg = window.Telegram.WebApp;
    const appContainer = document.querySelector('.app-container');
    
    if (appContainer && tg.viewportStableHeight) {
        appContainer.style.minHeight = `${tg.viewportStableHeight}px`;
    }
}

// Отправка данных в Telegram
export function sendDataToTelegram(data) {
    if (!window.Telegram?.WebApp) {
        console.error('Telegram Web App not available');
        return false;
    }
    
    try {
        const tg = window.Telegram.WebApp;
        const dataString = JSON.stringify(data);
        
        console.log('Sending data to Telegram:', dataString);
        tg.sendData(dataString);
        
        return true;
    } catch (error) {
        console.error('Error sending data to Telegram:', error);
        return false;
    }
}

// Закрытие Web App
export function closeTelegramWebApp() {
    if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.close();
    }
}

// Показать уведомление
export function showTelegramAlert(message, callback = null) {
    if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showAlert(message, callback);
    } else {
        alert(message);
        if (callback) callback();
    }
}

// Показать подтверждение
export function showTelegramConfirm(message, callback) {
    if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showConfirm(message, callback);
    } else {
        const result = confirm(message);
        callback(result);
    }
}

// Показать всплывающее окно
export function showTelegramPopup(params, callback = null) {
    if (window.Telegram?.WebApp?.showPopup) {
        window.Telegram.WebApp.showPopup(params, callback);
    } else {
        // Fallback для старых версий
        const message = params.message || params.title || 'Сообщение';
        showTelegramAlert(message, callback);
    }
}

// Получение данных пользователя
export function getTelegramUser() {
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
        return window.Telegram.WebApp.initDataUnsafe.user;
    }
    return null;
}

// Получение данных чата
export function getTelegramChat() {
    if (window.Telegram?.WebApp?.initDataUnsafe?.chat) {
        return window.Telegram.WebApp.initDataUnsafe.chat;
    }
    return null;
}

// Получение параметров запуска
export function getTelegramStartParam() {
    if (window.Telegram?.WebApp?.initDataUnsafe?.start_param) {
        return window.Telegram.WebApp.initDataUnsafe.start_param;
    }
    return null;
}

// Проверка доступности функций Telegram
export function isTelegramAvailable() {
    return !!(window.Telegram?.WebApp);
}

// Проверка версии Telegram Web App
export function getTelegramVersion() {
    if (window.Telegram?.WebApp?.version) {
        return window.Telegram.WebApp.version;
    }
    return null;
}

// Включение/выключение вибрации
export function setTelegramHapticFeedback(type = 'impact', style = 'medium') {
    if (window.Telegram?.WebApp?.HapticFeedback) {
        const haptic = window.Telegram.WebApp.HapticFeedback;
        
        if (type === 'impact' && haptic.impactOccurred) {
            haptic.impactOccurred(style); // light, medium, heavy
        } else if (type === 'notification' && haptic.notificationOccurred) {
            haptic.notificationOccurred(style); // error, success, warning
        } else if (type === 'selection' && haptic.selectionChanged) {
            haptic.selectionChanged();
        }
    }
}

// Управление главной кнопкой
export function setMainButton(text, color = null, textColor = null) {
    if (!window.Telegram?.WebApp?.MainButton) return;
    
    const mainButton = window.Telegram.WebApp.MainButton;
    
    mainButton.setText(text);
    
    if (color) {
        mainButton.setParams({ color });
    }
    if (textColor) {
        mainButton.setParams({ text_color: textColor });
    }
    
    mainButton.show();
    mainButton.enable();
}

// Скрытие главной кнопки
export function hideMainButton() {
    if (window.Telegram?.WebApp?.MainButton) {
        window.Telegram.WebApp.MainButton.hide();
    }
}

// Управление кнопкой назад
export function showBackButton() {
    if (window.Telegram?.WebApp?.BackButton) {
        window.Telegram.WebApp.BackButton.show();
    }
}

export function hideBackButton() {
    if (window.Telegram?.WebApp?.BackButton) {
        window.Telegram.WebApp.BackButton.hide();
    }
}

// Открытие ссылки
export function openTelegramLink(url, options = {}) {
    if (window.Telegram?.WebApp?.openLink) {
        window.Telegram.WebApp.openLink(url, options);
    } else {
        window.open(url, '_blank');
    }
}

// Открытие инвойса
export function openTelegramInvoice(url, callback = null) {
    if (window.Telegram?.WebApp?.openInvoice) {
        window.Telegram.WebApp.openInvoice(url, callback);
    } else {
        console.warn('Invoice opening not supported');
    }
}

// Экспорт всех функций
export default {
    initTelegram,
    sendDataToTelegram,
    closeTelegramWebApp,
    showTelegramAlert,
    showTelegramConfirm,
    showTelegramPopup,
    getTelegramUser,
    getTelegramChat,
    getTelegramStartParam,
    isTelegramAvailable,
    getTelegramVersion,
    setTelegramHapticFeedback,
    setMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    openTelegramLink,
    openTelegramInvoice
};