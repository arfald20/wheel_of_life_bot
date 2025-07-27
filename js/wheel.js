/**
 * Модуль для генерации и отображения колеса жизненного баланса на клиенте
 */
 
class WheelOfLife {
    constructor(canvasId, size = 300) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.size = size;
        this.center = size / 2;
        this.radius = size / 2 - 40;
        
        // Конфигурация сфер (совпадает с серверной)
        this.spheres = {
            'health': { emoji: '🏃‍♂️', title: 'Здоровье', color: '#4CAF50' },
            'career': { emoji: '💼', title: 'Карьера', color: '#2196F3' },
            'finance': { emoji: '💰', title: 'Финансы', color: '#FF9800' },
            'love': { emoji: '❤️', title: 'Любовь', color: '#E91E63' },
            'family': { emoji: '👨‍👩‍👧‍👦', title: 'Семья', color: '#9C27B0' },
            'friends': { emoji: '👥', title: 'Друзья', color: '#00BCD4' },
            'hobby': { emoji: '🎭', title: 'Хобби', color: '#795548' },
            'self': { emoji: '📚', title: 'Саморазвитие', color: '#607D8B' }
        };

        this.sphereKeys = Object.keys(this.spheres);
        this.numSpheres = this.sphereKeys.length;
        this.angleStep = (2 * Math.PI) / this.numSpheres;

        if (this.canvas) {
            this.setupCanvas();
        }
    }

    setupCanvas() {
        this.canvas.width = this.size;
        this.canvas.height = this.size;
        this.canvas.style.maxWidth = '100%';
        this.canvas.style.height = 'auto';
    }

    // Создать SVG колесо (для предварительного просмотра)
    createSVGPreview(scores) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', this.size);
        svg.setAttribute('height', this.size);
        svg.setAttribute('viewBox', `0 0 ${this.size} ${this.size}`);

        // Фон
        const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        background.setAttribute('width', this.size);
        background.setAttribute('height', this.size);
        background.setAttribute('fill', 'var(--bg-color)');
        svg.appendChild(background);

        // Концентрические круги (шкала 1-10)
        for (let i = 1; i <= 10; i++) {
            const circleRadius = (this.radius * i) / 10;
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', this.center);
            circle.setAttribute('cy', this.center);
            circle.setAttribute('r', circleRadius);
            circle.setAttribute('fill', 'none');
            circle.setAttribute('stroke', '#E0E0E0');
            circle.setAttribute('stroke-width', '1');
            svg.appendChild(circle);

            // Подписи шкалы (только четные числа)
            if (i % 2 === 0) {
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', this.center + circleRadius - 10);
                text.setAttribute('y', this.center - 5);
                text.setAttribute('font-size', '12');
                text.setAttribute('fill', '#666666');
                text.textContent = i.toString();
                svg.appendChild(text);
            }
        }

        // Рисуем сферы и их оценки
        this.sphereKeys.forEach((sphereKey, index) => {
            const sphere = this.spheres[sphereKey];
            const score = scores[sphereKey] || 0;
            const startAngle = index * this.angleStep - Math.PI / 2;
            const endAngle = (index + 1) * this.angleStep - Math.PI / 2;

            // Линия-разделитель
            const lineX = this.center + this.radius * Math.cos(startAngle);
            const lineY = this.center + this.radius * Math.sin(startAngle);
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', this.center);
            line.setAttribute('y1', this.center);
            line.setAttribute('x2', lineX);
            line.setAttribute('y2', lineY);
            line.setAttribute('stroke', '#CCCCCC');
            line.setAttribute('stroke-width', '1');
            svg.appendChild(line);

            // Сектор с оценкой
            if (score > 0) {
                const scoreRadius = (this.radius * score) / 10;
                const path = this.createSectorPath(startAngle, endAngle, scoreRadius);
                const sector = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                sector.setAttribute('d', path);
                sector.setAttribute('fill', sphere.color);
                sector.setAttribute('fill-opacity', '0.6');
                sector.setAttribute('stroke', sphere.color);
                sector.setAttribute('stroke-width', '1');
                svg.appendChild(sector);
            }

            // Подпись сферы
            const labelAngle = startAngle + this.angleStep / 2;
            const labelRadius = this.radius + 15;
            const labelX = this.center + labelRadius * Math.cos(labelAngle);
            const labelY = this.center + labelRadius * Math.sin(labelAngle);

            // Эмодзи
            const emoji = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            emoji.setAttribute('x', labelX);
            emoji.setAttribute('y', labelY);
            emoji.setAttribute('font-size', '16');
            emoji.setAttribute('text-anchor', 'middle');
            emoji.textContent = sphere.emoji;
            svg.appendChild(emoji);

            // Название
            const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            title.setAttribute('x', labelX);
            title.setAttribute('y', labelY + 15);
            title.setAttribute('font-size', '10');
            title.setAttribute('text-anchor', 'middle');
            title.setAttribute('fill', 'var(--text-color)');
            title.textContent = sphere.title;
            svg.appendChild(title);

            // Оценка
            const scoreText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            scoreText.setAttribute('x', labelX);
            scoreText.setAttribute('y', labelY + 28);
            scoreText.setAttribute('font-size', '12');
            scoreText.setAttribute('text-anchor', 'middle');
            scoreText.setAttribute('fill', sphere.color);
            scoreText.setAttribute('font-weight', 'bold');
            scoreText.textContent = score.toString();
            svg.appendChild(scoreText);
        });

        // Центральный круг с общей информацией
        const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
        const avgScore = totalScore / this.numSpheres;

        const centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        centerCircle.setAttribute('cx', this.center);
        centerCircle.setAttribute('cy', this.center);
        centerCircle.setAttribute('r', '25');
        centerCircle.setAttribute('fill', 'var(--bg-color)');
        centerCircle.setAttribute('stroke', 'var(--primary-color)');
        centerCircle.setAttribute('stroke-width', '2');
        svg.appendChild(centerCircle);

        const avgText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        avgText.setAttribute('x', this.center);
        avgText.setAttribute('y', this.center - 3);
        avgText.setAttribute('font-size', '14');
        avgText.setAttribute('text-anchor', 'middle');
        avgText.setAttribute('fill', 'var(--primary-color)');
        avgText.setAttribute('font-weight', 'bold');
        avgText.textContent = avgScore.toFixed(1);
        svg.appendChild(avgText);

        const avgLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        avgLabel.setAttribute('x', this.center);
        avgLabel.setAttribute('y', this.center + 12);
        avgLabel.setAttribute('font-size', '8');
        avgLabel.setAttribute('text-anchor', 'middle');
        avgLabel.setAttribute('fill', 'var(--hint-color)');
        avgLabel.textContent = 'ср.балл';
        svg.appendChild(avgLabel);

        return svg;
    }

    createSectorPath(startAngle, endAngle, radius) {
        if (radius <= 0) return '';

        const x1 = this.center + radius * Math.cos(startAngle);
        const y1 = this.center + radius * Math.sin(startAngle);
        const x2 = this.center + radius * Math.cos(endAngle);
        const y2 = this.center + radius * Math.sin(endAngle);

        const largeArc = (endAngle - startAngle) > Math.PI ? 1 : 0;

        return `M ${this.center} ${this.center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    }

    // Получить рекомендации на основе оценок
    generateRecommendations(scores) {
        const recommendations = {
            'health': [
                'Начните с 15-минутной утренней зарядки',
                'Добавьте больше овощей в рацион',
                'Следите за режимом сна (7-8 часов)'
            ],
            'career': [
                'Определите 3 ключевые цели на ближайший год',
                'Инвестируйте в профессиональное развитие',
                'Найдите наставника в своей области'
            ],
            'finance': [
                'Создайте бюджет и отслеживайте расходы',
                'Откладывайте 10% от дохода',
                'Изучите основы инвестирования'
            ],
            'love': [
                'Уделяйте больше времени качественному общению',
                'Планируйте совместные активности',
                'Открыто выражайте свои чувства'
            ],
            'family': [
                'Организуйте регулярные семейные встречи',
                'Создайте новые семейные традиции',
                'Больше слушайте близких'
            ],
            'friends': [
                'Инициируйте встречи с друзьями',
                'Будьте более открыты к новым знакомствам',
                'Поддерживайте регулярный контакт'
            ],
            'hobby': [
                'Выделите время для любимых занятий',
                'Попробуйте что-то новое',
                'Присоединитесь к сообществам по интересам'
            ],
            'self': [
                'Читайте развивающую литературу',
                'Изучайте новые навыки онлайн',
                'Ведите дневник саморефлексии'
            ]
        };

        // Находим сферу с наименьшей оценкой
        const sortedScores = Object.entries(scores).sort((a, b) => a[1] - b[1]);
        const weakestSphere = sortedScores[0][0];

        return recommendations[weakestSphere] || [
            'Сосредоточьтесь на постепенном улучшении',
            'Ставьте небольшие достижимые цели',
            'Отслеживайте прогресс'
        ];
    }

    // Анализ баланса
    analyzeBalance(scores) {
        const values = Object.values(scores);
        const total = values.reduce((sum, score) => sum + score, 0);
        const average = total / values.length;
        const maxScore = Math.max(...values);
        const minScore = Math.min(...values);
        const range = maxScore - minScore;

        // Определяем уровень баланса
        let balanceLevel;
        if (range <= 2) {
            balanceLevel = 'Отличный баланс';
        } else if (range <= 4) {
            balanceLevel = 'Хороший баланс';
        } else if (range <= 6) {
            balanceLevel = 'Умеренный дисбаланс';
        } else {
            balanceLevel = 'Значительный дисбаланс';
        }

        return {
            total,
            average: parseFloat(average.toFixed(1)),
            maxScore,
            minScore,
            range,
            balanceLevel
        };
    }
}

// Утилиты для работы с результатами
class ResultsUtils {
    static formatScore(score) {
        return `${score}/10`;
    }

    static getScoreColor(score) {
        if (score >= 8) return '#4CAF50'; // Зеленый
        if (score >= 6) return '#FF9800'; // Оранжевый
        if (score >= 4) return '#FFC107'; // Желтый
        return '#F44336'; // Красный
    }

    static getScoreLabel(score) {
        if (score >= 9) return 'Отлично';
        if (score >= 7) return 'Хорошо';
        if (score >= 5) return 'Средне';
        if (score >= 3) return 'Слабо';
        return 'Критично';
    }

    static generateSummary(scores) {
        const wheel = new WheelOfLife();
        const analysis = wheel.analyzeBalance(scores);
        const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);

        return {
            analysis,
            strongest: {
                sphere: sortedScores[0][0],
                score: sortedScores[0][1],
                info: wheel.spheres[sortedScores[0][0]]
            },
            weakest: {
                sphere: sortedScores[sortedScores.length - 1][0],
                score: sortedScores[sortedScores.length - 1][1],
                info: wheel.spheres[sortedScores[sortedScores.length - 1][0]]
            },
            recommendations: wheel.generateRecommendations(scores)
        };
    }
}

// Экспорт для глобального использования
window.WheelOfLife = WheelOfLife;
window.ResultsUtils = ResultsUtils;
