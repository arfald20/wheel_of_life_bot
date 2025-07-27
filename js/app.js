/*  Колесо жизненного баланса — пошаговый опрос  */
/*  Алгоритм:
    1. spheres[] – массив 8 объектов с ключом, названием и вопросами.
    2. currentSphere – индекс текущей сферы.
    3. results – словарь {key: score}.
    4. renderSphere() перерисовывает экран.
    5. finishTest() показывает сообщение и через 3 с отправляет данные в Bot.   */

const spheres = [
  { key: "health",  title: "Здоровье",    emoji: "🏃‍♂️", questions: [
      "Как оцениваете физическое самочувствие?",
      "Хватает ли энергии на день?",
      "Уделяете ли время профилактике?"
  ]},
  { key: "career",  title: "Карьера",     emoji: "💼", questions: [
      "Приносит ли работа ощущение смысла?",
      "Есть ли перспектива роста?",
      "Соответствует ли деятельность целям?"
  ]},
  { key: "finance", title: "Финансы",     emoji: "💰", questions: [
      "Устраивает ли уровень дохода?",
      "Чувствуете ли стабильность?",
      "Планируете ли бюджет?"
  ]},
  { key: "love",    title: "Любовь",      emoji: "❤️", questions: [
      "Есть ли близость и поддержка?",
      "Удовлетворены ли отношениями?",
      "Довольны качеством общения?"
  ]},
  { key: "family",  title: "Семья",       emoji: "👨‍👩‍👧‍👦", questions: [
      "Гармоничны ли отношения?",
      "Хватает ли времени с близкими?",
      "Есть ли взаимопонимание?"
  ]},
  { key: "friends", title: "Друзья",      emoji: "👥", questions: [
      "Есть ли надёжные друзья?",
      "Удовлетворяет ли круг общения?",
      "Легко ли заводить знакомства?"
  ]},
  { key: "hobby",   title: "Хобби",       emoji: "🎭", questions: [
      "Хватает ли времени на увлечения?",
      "Получаете ли удовольствие от досуга?",
      "Умеете ли отдыхать?"
  ]},
  { key: "self",    title: "Саморазвитие",emoji: "📚", questions: [
      "Учитесь ли новому?",
      "Развиваетесь ли личностно?",
      "Работаете ли над собой?"
  ]},
];

let currentSphere = 0;
const results = {};

/* ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  if (window.Telegram?.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
  }
  renderSphere();
});

/* ----------------   UI-рендер одной сферы   --------------- */
function renderSphere() {
  const sp = spheres[currentSphere];
  const progress = ((currentSphere + 1) / spheres.length) * 100;
  const saved = results[sp.key] ?? 5;

  document.getElementById("app").innerHTML = `
    <div class="sphere-header">
      <h2>${sp.emoji} ${sp.title}</h2>
    </div>

    <div class="progress-bar">
      <div class="progress-fill" style="width:${progress}%"></div>
      <span class="progress-text">${currentSphere + 1} / ${spheres.length}</span>
    </div>

    <div class="questions">
      ${sp.questions.map(q => `<p class="question">• ${q}</p>`).join("")}
    </div>

    <div class="slider-container">
      <label>Ваша оценка: <span id="slider-val">${saved}</span>/10</label>
      <input type="range" id="slider" min="1" max="10" value="${saved}" class="slider">
      <div class="slider-labels"><span>1</span><span>10</span></div>
    </div>

    <div class="buttons-container">
      ${currentSphere > 0
        ? `<button id="prevBtn" class="btn btn-secondary">← Назад</button>`
        : `<div></div>`}
      <button id="nextBtn" class="btn btn-primary">
        ${currentSphere < spheres.length - 1 ? "Далее →" : "Завершить ✓"}
      </button>
    </div>
  `;

  /* ——— Обработчики ——— */
  const slider = document.getElementById("slider");
  slider.addEventListener("input", e => {
    document.getElementById("slider-val").textContent = e.target.value;
  });

  document.getElementById("nextBtn").addEventListener("click", () => {
    results[sp.key] = Number(slider.value);
    if (currentSphere < spheres.length - 1) {
      currentSphere += 1;
      renderSphere();
    } else {
      finishTest();
    }
  });

  const prev = document.getElementById("prevBtn");
  if (prev) {
    prev.addEventListener("click", () => {
      currentSphere -= 1;
      renderSphere();
    });
  }
}

/* ----------------  Экран завершения + отправка ------------- */
function finishTest() {
  document.getElementById("app").innerHTML = `
    <div class="completion-message">
      <div class="completion-icon">✅</div>
      <h2>Тест завершён!</h2>
      <p>Ваши результаты отправляются боту…</p>
      <p>Через несколько секунд вы получите:</p>
      <ul>
        <li>📊 Детальный анализ баланса</li>
        <li>🎯 Персональные рекомендации</li>
        <li>📄 PDF отчёт с колесом жизни</li>
      </ul>
      <div class="loading-spinner"></div>
    </div>
  `;

  /* Делаем небольшую паузу, чтобы пользователь увидел сообщение */
  setTimeout(() => {
    try {
      Telegram.WebApp.sendData(JSON.stringify(results));
    } catch (err) {
      console.error("SendData error:", err);
      alert("Ошибка отправки данных. Попробуйте ещё раз.");
    }
  }, 3000);
}
