const composers = [
  { name: "J. S. Bach", cn: "巴赫" },
  { name: "W. A. Mozart", cn: "莫扎特" },
  { name: "L. v. Beethoven", cn: "贝多芬" },
  { name: "F. Chopin", cn: "肖邦" },
  { name: "C. Debussy", cn: "德彪西" },
  { name: "G. Mahler", cn: "马勒" },
  { name: "M. Ravel", cn: "拉威尔" },
  { name: "I. Stravinsky", cn: "斯特拉文斯基" },
  { name: "S. Prokofiev", cn: "普罗科菲耶夫" },
  { name: "O. Messiaen", cn: "梅西安" },
  { name: "P. Glass", cn: "菲利普·格拉斯" },
  { name: "T. Takemitsu", cn: "武满彻" },
];

const wheel = document.querySelector("#wheel");
const wheelLabels = document.querySelector("#wheelLabels");
const spinButton = document.querySelector("#spinButton");
const spinButtonText = document.querySelector("#spinButtonText");
const resultActions = document.querySelector("#resultActions");
const acceptButton = document.querySelector("#acceptButton");
const rejectButton = document.querySelector("#rejectButton");
const resetButton = document.querySelector("#resetButton");
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
      const radius = window.innerWidth <= 520 ? 38 : 39;
      const left = 50 + Math.sin(radians) * radius;
      const top = 50 - Math.cos(radians) * radius;
      const isDark = index % 2 === 0 ? "is-dark" : "";

      return `
        <div class="wheel-label ${isDark}" style="left: ${left}%; top: ${top}%;" aria-hidden="true">
          <span class="wheel-label-name">${composer.name}</span>
          <span class="wheel-label-cn">${composer.cn}</span>
        </div>
      `;
    })
    .join("");
}

function announce(message) {
  statusMessage.textContent = message;
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
  resetButton.hidden = true;
  spinButton.hidden = false;
  spinButton.disabled = true;
  spinButtonText.textContent = "转动中";
  announce("转盘正在转动。");
  wheel.style.transform = `rotate(${targetRotation}deg)`;

  spinTimer = window.setTimeout(() => {
    if (sequence !== spinSequence) {
      return;
    }

    currentComposer = composers[getSelectedIndex(targetRotation)];
    isSpinning = false;
    spinButton.hidden = true;
    spinButton.disabled = false;
    resultActions.hidden = false;
    announce(`今天听 ${currentComposer.name}！`);
  }, spinDuration + 100);
}

function acceptCurrentComposer() {
  if (!currentComposer || isSpinning) {
    return;
  }

  resultActions.hidden = true;
  spinButton.hidden = false;
  spinButton.disabled = false;
  spinButtonText.textContent = "再转一次";
  announce(`今天听 ${currentComposer.name}！`);
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
    resetButton.hidden = false;
    announce("这么挑？今天别听了！");
    return;
  }

  window.setTimeout(() => spin(true), 260);
}

function resetSession() {
  clearTimeout(spinTimer);
  spinSequence += 1;
  currentRotation = 0;
  rejectionCount = 0;
  currentComposer = null;
  isSpinning = false;
  wheel.style.transform = "rotate(0deg)";
  resultActions.hidden = true;
  resetButton.hidden = true;
  spinButton.hidden = false;
  spinButton.disabled = false;
  spinButtonText.textContent = "转动";
  announce("");
}

spinButton.addEventListener("click", () => spin());
acceptButton.addEventListener("click", acceptCurrentComposer);
rejectButton.addEventListener("click", rejectCurrentComposer);
resetButton.addEventListener("click", resetSession);
window.addEventListener("resize", renderWheel);

renderWheel();
