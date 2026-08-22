const composers = [
  { name: "巴赫" },
  { name: "莫扎特" },
  { name: "贝多芬" },
  { name: "肖邦" },
  { name: "德彪西" },
  { name: "马勒" },
  { name: "拉威尔" },
  { name: "格拉斯" },
];

const wheel = document.querySelector("#wheel");
const wheelLabels = document.querySelector("#wheelLabels");
const statusText = document.querySelector("#statusText");
const spinButton = document.querySelector("#spinButton");
const resultActions = document.querySelector("#resultActions");
const acceptButton = document.querySelector("#acceptButton");
const rejectButton = document.querySelector("#rejectButton");
const statusMessage = document.querySelector("#statusMessage");

const segmentAngle = 360 / composers.length;
const spinDuration = 5400;

let currentRotation = 0;
let rejectionCount = 0;
let currentComposer = null;
let spinTimer = null;
let spinSequence = 0;
let isSpinning = false;

function renderWheel() {
  const gradientStops = composers
    .map((_, index) => {
      const start = index * segmentAngle;
      const end = (index + 1) * segmentAngle;
      const color = index % 2 === 0 ? "#000000" : "#ffffff";
      return `${color} ${start}deg ${end}deg`;
    })
    .join(", ");

  wheel.style.background = `conic-gradient(from -${segmentAngle / 2}deg, ${gradientStops})`;

  wheelLabels.innerHTML = composers
    .map((composer, index) => {
      const angle = index * segmentAngle;
      const radians = (angle * Math.PI) / 180;
      const left = 50 + Math.sin(radians) * 37;
      const top = 50 - Math.cos(radians) * 37;
      const isDark = index % 2 === 0 ? "is-dark" : "";

      return `
        <div class="wheel-label ${isDark}" style="left: ${left}%; top: ${top}%;" aria-hidden="true">
          <span class="wheel-label-name">${composer.name}</span>
        </div>
      `;
    })
    .join("");
}

function announce(message) {
  statusMessage.textContent = message;
}

function setHeading(message) {
  statusText.textContent = message;
  announce(message);
}

function getSelectedIndex(rotation) {
  const normalizedRotation = ((rotation % 360) + 360) % 360;
  const pointerAngle = (360 - normalizedRotation) % 360;
  return Math.floor((pointerAngle + segmentAngle / 2) / segmentAngle) % composers.length;
}

function spin(force = false) {
  if (!force && (spinButton.disabled || isSpinning)) {
    return;
  }

  clearTimeout(spinTimer);
  const sequence = ++spinSequence;
  const turns = 5 + Math.floor(Math.random() * 4);
  const angle = Math.floor(Math.random() * 360);
  const targetRotation = currentRotation + turns * 360 + angle;

  currentRotation = targetRotation;
  currentComposer = null;
  isSpinning = true;
  resultActions.hidden = true;
  spinButton.disabled = true;
  setHeading("转动中…");
  wheel.style.setProperty("--rotation", `${targetRotation}deg`);

  spinTimer = window.setTimeout(() => {
    if (sequence !== spinSequence) {
      return;
    }

    currentComposer = composers[getSelectedIndex(targetRotation)];
    isSpinning = false;
    spinButton.disabled = false;
    spinButton.hidden = true;
    resultActions.hidden = false;
    setHeading(`今天听${currentComposer.name}！`);
  }, spinDuration + 100);
}

function acceptCurrentComposer() {
  if (!currentComposer || isSpinning) {
    return;
  }

  resultActions.hidden = true;
  setHeading(`今天听${currentComposer.name}！`);
}

function rejectCurrentComposer() {
  if (!currentComposer || isSpinning) {
    return;
  }

  rejectionCount += 1;
  currentComposer = null;
  resultActions.hidden = true;

  if (rejectionCount >= 3) {
    spinButton.hidden = true;
    setHeading("这么挑？今天别听了！");
    return;
  }

  window.setTimeout(() => spin(true), 260);
}

spinButton.addEventListener("click", () => spin());
acceptButton.addEventListener("click", acceptCurrentComposer);
rejectButton.addEventListener("click", rejectCurrentComposer);
window.addEventListener("resize", renderWheel);

renderWheel();
