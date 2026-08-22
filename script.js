const composers = [
  "巴赫",
  "贝多芬",
  "莫扎特",
  "勃拉姆斯",
  "柴可夫斯基",
  "亨德尔",
  "瓦格纳",
  "肖邦",
  "格里格",
  "李斯特",
  "舒伯特",
  "马勒",
  "布鲁克纳",
  "拉威尔",
  "斯特拉文斯基",
  "拉赫玛尼诺夫",
  "海顿",
  "门德尔松",
  "肖斯塔科维奇",
  "勋伯格",
  "德沃夏克",
  "德彪西",
  "西贝柳斯",
  "巴托克",
  "普罗科菲耶夫",
  "克拉拉·舒曼",
  "霍尔斯特",
  "巴伯",
  "柏辽兹",
  "圣桑",
  "拉罗",
  "埃尔加",
  "维瓦尔第",
  "小约翰·施特劳斯",
  "比才",
  "威尔第",
  "理查·施特劳斯",
  "斯美塔那",
  "舒曼",
  "欣德米特",
  "斯克里亚宾",
  "萨蒂",
  "雷斯庇基",
  "里姆斯基-科萨科夫",
  "帕格尼尼",
  "普契尼",
  "鲍罗丁",
];

const app = document.querySelector("#app");
const pickerTrack = document.querySelector("#pickerTrack");
const statusText = document.querySelector("#statusText");
const actionButton = document.querySelector("#actionButton");
const statusMessage = document.querySelector("#statusMessage");

let currentIndex = 0;
let rejectionCount = 0;
let spinTimer = null;
let spinInterval = null;
let isSpinning = false;

function getRowHeight() {
  return parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--row-height")) || 54;
}

function renderPicker() {
  pickerTrack.innerHTML = composers
    .map((composer, index) => `<div class="picker-item" data-index="${index}">${composer}</div>`)
    .join("");
  updatePickerPosition();
}

function updatePickerPosition() {
  const items = pickerTrack.querySelectorAll(".picker-item");
  items.forEach((item, index) => item.classList.toggle("is-selected", index === currentIndex));
  pickerTrack.style.transform = `translateY(-${currentIndex * getRowHeight()}px)`;
}

function setHeading(text) {
  statusText.textContent = text;
  statusMessage.textContent = text;
}

function chooseNext() {
  currentIndex = Math.floor(Math.random() * composers.length);
  updatePickerPosition();
}

function finishSpin() {
  if (!isSpinning) {
    return;
  }

  clearTimeout(spinTimer);
  clearInterval(spinInterval);
  isSpinning = false;
  chooseNext();
  app.dataset.state = "result";
  setHeading("今天听这个！");
  actionButton.textContent = "不想听，换一个";
}

function startSpin() {
  if (isSpinning) {
    finishSpin();
    return;
  }

  isSpinning = true;
  app.dataset.state = "running";
  setHeading("今天听谁，听什么？");
  actionButton.textContent = "停止";
  chooseNext();
  spinInterval = window.setInterval(chooseNext, 110);
  spinTimer = window.setTimeout(finishSpin, 2600 + Math.random() * 1400);
}

function rejectCurrent() {
  if (isSpinning || app.dataset.state !== "result") {
    return;
  }

  rejectionCount += 1;
  if (rejectionCount >= 3) {
    app.dataset.state = "done";
    setHeading("这么挑？今天别听了！");
    actionButton.hidden = true;
    return;
  }

  startSpin();
}

actionButton.addEventListener("click", () => {
  if (app.dataset.state === "result") {
    rejectCurrent();
    return;
  }

  startSpin();
});

renderPicker();
