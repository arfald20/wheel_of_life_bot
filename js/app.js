const spheres = [
  {
    key: "health",
    title: "Здоровье",
    emoji: "🏃‍♂️",
    questions: [
      "Как оцениваете физическое самочувствие?",
      "Хватает ли энергии на день?",
      "Уделяете ли время профилактике?",
    ],
  },
  {
    key: "career",
    title: "Карьера",
    emoji: "💼",
    questions: [
      "Приносит ли работа ощущение смысла?",
      "Есть ли перспектива роста?",
      "Соответствует ли деятельность целям?",
    ],
  },
  {
    key: "finance",
    title: "Финансы",
    emoji: "💰",
    questions: [
      "Устраивает ли уровень дохода?",
      "Чувствуете ли стабильность?",
      "Планируете ли бюджет?",
    ],
  },
  {
    key: "love",
    title: "Любовь",
    emoji: "❤️",
    questions: [
      "Есть ли близость и поддержка?",
      "Удовлетворены ли отношениями?",
      "Довольны качеством общения?",
    ],
  },
  {
    key: "family",
    title: "Семья",
    emoji: "👨‍👩‍👧‍👦",
    questions: [
      "Гармоничны ли отношения?",
      "Хватает ли времени с близкими?",
      "Есть ли взаимопонимание?",
    ],
  },
  {
    key: "friends",
    title: "Друзья",
    emoji: "👥",
    questions: [
      "Есть ли надёжные друзья?",
      "Удовлетворяет ли круг общения?",
      "Легко ли заводить знакомства?",
    ],
  },
  {
    key: "hobby",
    title: "Хобби",
    emoji: "🎭",
    questions: [
      "Хватает ли времени на увлечения?",
      "Получаете ли удовольствие от досуга?",
      "Умеете ли отдыхать?",
    ],
  },
  {
    key: "self",
    title: "Саморазвитие",
    emoji: "📚",
    questions: [
      "Учитесь ли новому?",
      "Развиваетесь ли личностно?",
      "Работаете ли над собой?",
    ],
  },
];

let currentSphere = 0;
const results = {};

document.addEventListener("DOMContentLoaded", () => {
  if (window.Telegram?.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
  }
  renderSphere();
});

function renderSphere() {
  const sphere = spheres[currentSphere];
  const progressPercent = ((currentSphere + 1) / spheres.length) * 100;
  const savedValue = results[sphere.key] ?? 5;

  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="sphere-header">
      <h2>${sphere.emoji} ${sphere.title}</h2>
    </div>

    <div class="progress-bar">
      <div class="progress-fill" style="width: ${progressPercent}%"></div>
      <span class="progress-text">${currentSphere + 1} из ${spheres.length}</span>
    </div>

    <div class="questions">
      ${sphere.questions.map((q) => `<p class="question">• ${q}</p>`).join("")}
    </div>

    <div class="slider-container">
      <label for="slider">Ваша оценка: <span id="slider-value">${savedValue}</span>/10</label>
      <input type="range" min="1" max="10" value="${savedValue}" id="slider" class="slider" />
      <div class="slider-labels"><span>1</span><span>10</span></div>
    </div>

    <div class="buttons-container">
      ${
        currentSphere > 0
          ? `<button id="prevBtn" class="btn btn-secondary">← Назад</button>`
          : `<div></div>`
      }
      <button id="nextBtn" class="btn btn-primary">${
        currentSphere < spheres.length - 1 ? "Далее →" : "Завершить ✓"
      }</button>
    </div>
  `;

  // Обработчики событий
  const slider = document.getElementById("slider");
  const sliderValue = document.getElementById("slider-value");
  slider.addEventListener("input", () => {
    sliderValue.textContent = slider.value;
  });

  const nextBtn = document.getElementById("nextBtn");
  nextBtn.addEventListener("click", () => {
    results[sphere.key] = parseInt(slider.value);

    if (currentSphere < spheres.length - 1) {
      currentSphere++;
      renderSphere();
    } else {
      finishTest();
    }
  });

  const prevBtn = document.getElementById("prevBtn");
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentSphere > 0) {
        currentSphere--;
        renderSphere();
      }
    });
  }
}

function finishTest() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="completion-message">
      <div class="completion-icon">✅</div>
      <h2>Тест завершён!</h2>
      <p>Ваши результаты отправляются боту...</p>
      <p>Через несколько секунд вы получите:</p>
      <ul>
        <li>📊 Детальный анализ баланса</li>
        <li>🎯 Персональные рекомендации</li>
        <li>📄 PDF отчёт с колесом жизни</li>
      </ul>
      <div class="loading-spinner"></div>
    </div>
  `;

  setTimeout(() => {
    try {
      if (window.Telegram?.WebApp?.sendData) {
        Telegram.WebApp.sendData(JSON.stringify(results));
        console.log("Данные успешно отправлены:", results);
      } else {
        console.warn("Telegram.WebApp.sendData недоступен");
      }
    } catch (error) {
      console.error("Ошибка при отправке данных:", error);
      alert("Ошибка отправки данных. Попробуйте позже.");
    }
  }, 3000);
}
