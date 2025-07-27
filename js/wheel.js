// webapp/js/wheel.js
// Рисует премиум-колесо на <canvas id="wheel">.

export function drawPremiumWheel(scores) {
  const palette = {
    health:  "#06b6d4",
    career:  "#8b5cf6",
    finance: "#059669",
    love:    "#dc2626",
    family:  "#d97706",
    friends: "#2563eb",
    hobby:   "#7c3aed",
    self:    "#16a34a",
  };

  const order = [
    "health", "career", "finance", "love",
    "family", "friends", "hobby", "self",
  ];

  const canvas = document.getElementById("wheel");
  const ctx = canvas.getContext("2d");
  const size = canvas.width;              // квадратный холст
  const cx = size / 2, cy = size / 2;     // центр
  const outerR = size / 2 * 0.95;         // небольшой отступ

  const seg = (2 * Math.PI) / order.length;

  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.translate(cx, cy);

  order.forEach((key, idx) => {
    const val = Math.max(0, Math.min(scores[key] ?? 0, 10));
    if (val === 0) return;                // пропускаем нулевые

    const r = (val / 10) * outerR;
    const a0 = -Math.PI / 2 + idx * seg;
    const a1 = a0 + seg;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, r, a0, a1, false);
    ctx.closePath();

    // тень для объёма
    ctx.shadowColor = "#0006";
    ctx.shadowBlur = 12;
    ctx.fillStyle = palette[key];
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  ctx.restore();
}
