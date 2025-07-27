// webapp/js/wheel.js

// Цвета сфер
const SPHERE_COLORS = {
    health: '#10B981',
    career: '#6366F1',
    finance: '#059669',
    love: '#DC2626',
    family: '#EA580C',
    friends: '#2563EB',
    hobby: '#7C3AED',
    self: '#16A34A'
};

// Названия сфер
const SPHERE_NAMES = {
    health: 'Здоровье',
    career: 'Карьера',
    finance: 'Финансы',
    love: 'Любовь',
    family: 'Семья',
    friends: 'Друзья',
    hobby: 'Хобби',
    self: 'Саморазвитие'
};

// Порядок отображения сфер (по часовой стрелке, начиная с верха)
const SPHERE_ORDER = ['health', 'career', 'finance', 'love', 'family', 'friends', 'hobby', 'self'];

export function drawWheel(canvas, scores, spheresData = null) {
    if (!canvas || !canvas.getContext) {
        console.error('Canvas element not found or not supported');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    const size = Math.min(canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = (size / 2) - 20;
    
    // Очистка canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Сохранение состояния
    ctx.save();
    
    // Настройка сглаживания
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Фон колеса
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#f8fafc';
    ctx.fill();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Рисование секторов
    const numSectors = SPHERE_ORDER.length;
    const anglePerSector = (2 * Math.PI) / numSectors;
    
    SPHERE_ORDER.forEach((sphereKey, index) => {
        const score = scores[sphereKey] || 0;
        const color = SPHERE_COLORS[sphereKey];
        
        // Углы сектора
        const startAngle = (index * anglePerSector) - (Math.PI / 2); // Начинаем с верха
        const endAngle = startAngle + anglePerSector;
        
        // Радиус на основе оценки
        const radius = (score / 10) * maxRadius;
        
        if (score > 0) {
            // Рисование заполненного сектора
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            
            // Заливка с градиентом
            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
            gradient.addColorStop(0, color + '40'); // 25% прозрачности в центре
            gradient.addColorStop(1, color + 'CC'); // 80% прозрачности по краям
            
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Обводка сектора
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        // Линии сетки (границы секторов)
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        const gridX = centerX + maxRadius * Math.cos(startAngle);
        const gridY = centerY + maxRadius * Math.sin(startAngle);
        ctx.lineTo(gridX, gridY);
        ctx.strokeStyle = '#d1d5db';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Подписи сфер
        const labelRadius = maxRadius + 15;
        const labelAngle = startAngle + (anglePerSector / 2);
        const labelX = centerX + labelRadius * Math.cos(labelAngle);
        const labelY = centerY + labelRadius * Math.sin(labelAngle);
        
        ctx.fillStyle = '#374151';
        ctx.font = 'bold 10px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const sphereName = SPHERE_NAMES[sphereKey] || sphereKey;
        ctx.fillText(sphereName, labelX, labelY);
        
        // Оценки в секторах
        if (score > 0) {
            const scoreRadius = radius * 0.7;
            const scoreX = centerX + scoreRadius * Math.cos(labelAngle);
            const scoreY = centerY + scoreRadius * Math.sin(labelAngle);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px Arial, sans-serif';
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            
            // Обводка текста для лучшей читаемости
            ctx.strokeText(score.toString(), scoreX, scoreY);
            ctx.fillText(score.toString(), scoreX, scoreY);
        }
    });
    
    // Концентрические круги для шкалы
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    
    for (let scale = 2; scale <= 10; scale += 2) {
        const scaleRadius = (scale / 10) * maxRadius;
        ctx.beginPath();
        ctx.arc(centerX, centerY, scaleRadius, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Подписи шкалы
        ctx.fillStyle = '#9ca3af';
        ctx.font = '8px Arial, sans-serif';
        ctx.fillText(scale.toString(), centerX - scaleRadius + 5, centerY - 2);
    }
    
    ctx.setLineDash([]); // Сброс пунктирной линии
    
    // Центральный круг
    const centralRadius = 25;
    ctx.beginPath();
    ctx.arc(centerX, centerY, centralRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#1f2937';
    ctx.fill();
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Общая оценка в центре
    const totalScore = Object.values(scores).reduce((sum, score) => sum + (score || 0), 0);
    const avgScore = totalScore / Object.keys(SPHERE_COLORS).length;
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    if (avgScore > 0) {
        ctx.fillText(avgScore.toFixed(1), centerX, centerY - 4);
        
        ctx.font = '8px Arial, sans-serif';
        ctx.fillStyle = '#9ca3af';
        ctx.fillText('из 10', centerX, centerY + 8);
    } else {
        ctx.fillStyle = '#9ca3af';
        ctx.font = '10px Arial, sans-serif';
        ctx.fillText('0.0', centerX, centerY);
    }
    
    // Восстановление состояния
    ctx.restore();
}

// Функция для получения цвета сферы
export function getSphereColor(sphereKey) {
    return SPHERE_COLORS[sphereKey] || '#6b7280';
}

// Функция для получения названия сферы
export function getSphereName(sphereKey) {
    return SPHERE_NAMES[sphereKey] || sphereKey;
}

// Функция для анимированного рисования колеса
export function drawAnimatedWheel(canvas, scores, spheresData = null, duration = 1000) {
    if (!canvas || !canvas.getContext) return;
    
    const startTime = Date.now();
    const finalScores = { ...scores };
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        // Промежуточные значения
        const currentScores = {};
        Object.keys(finalScores).forEach(key => {
            currentScores[key] = Math.round((finalScores[key] || 0) * easeOut);
        });
        
        drawWheel(canvas, currentScores, spheresData);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

// Функция для создания статичного изображения колеса
export function createWheelImage(scores, size = 400) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    
    drawWheel(canvas, scores);
    
    return canvas.toDataURL('image/png');
}

export default { drawWheel, drawAnimatedWheel, getSphereColor, getSphereName, createWheelImage };