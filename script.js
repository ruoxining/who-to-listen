const composers = [
  { zh: "巴赫", latin: "Johann Sebastian Bach" },
  { zh: "贝多芬", latin: "Ludwig van Beethoven" },
  { zh: "莫扎特", latin: "Wolfgang Amadeus Mozart" },
  { zh: "勃拉姆斯", latin: "Johannes Brahms" },
  { zh: "柴可夫斯基", latin: "Pyotr Ilyich Tchaikovsky" },
  { zh: "亨德尔", latin: "George Frideric Handel" },
  { zh: "瓦格纳", latin: "Richard Wagner" },
  { zh: "肖邦", latin: "Frédéric Chopin" },
  { zh: "格里格", latin: "Edvard Grieg" },
  { zh: "李斯特", latin: "Franz Liszt" },
  { zh: "舒伯特", latin: "Franz Schubert" },
  { zh: "马勒", latin: "Gustav Mahler" },
  { zh: "布鲁克纳", latin: "Anton Bruckner" },
  { zh: "拉威尔", latin: "Maurice Ravel" },
  { zh: "斯特拉文斯基", latin: "Igor Stravinsky" },
  { zh: "拉赫玛尼诺夫", latin: "Sergei Rachmaninoff" },
  { zh: "海顿", latin: "Joseph Haydn" },
  { zh: "门德尔松", latin: "Felix Mendelssohn" },
  { zh: "肖斯塔科维奇", latin: "Dmitri Shostakovich" },
  { zh: "勋伯格", latin: "Arnold Schoenberg" },
  { zh: "德沃夏克", latin: "Antonín Dvořák" },
  { zh: "德彪西", latin: "Claude Debussy" },
  { zh: "西贝柳斯", latin: "Jean Sibelius" },
  { zh: "巴托克", latin: "Béla Bartók" },
  { zh: "普罗科菲耶夫", latin: "Sergei Prokofiev" },
  { zh: "克拉拉·舒曼", latin: "Clara Schumann" },
  { zh: "霍尔斯特", latin: "Gustav Holst" },
  { zh: "巴伯", latin: "Samuel Barber" },
  { zh: "柏辽兹", latin: "Hector Berlioz" },
  { zh: "圣桑", latin: "Camille Saint-Saëns" },
  { zh: "拉罗", latin: "Édouard Lalo" },
  { zh: "埃尔加", latin: "Edward Elgar" },
  { zh: "维瓦尔第", latin: "Antonio Vivaldi" },
  { zh: "小约翰·施特劳斯", latin: "Johann Strauss II" },
  { zh: "比才", latin: "Georges Bizet" },
  { zh: "威尔第", latin: "Giuseppe Verdi" },
  { zh: "理查·施特劳斯", latin: "Richard Strauss" },
  { zh: "斯美塔那", latin: "Bedřich Smetana" },
  { zh: "舒曼", latin: "Robert Schumann" },
  { zh: "欣德米特", latin: "Paul Hindemith" },
  { zh: "斯克里亚宾", latin: "Alexander Scriabin" },
  { zh: "萨蒂", latin: "Erik Satie" },
  { zh: "雷斯庇基", latin: "Ottorino Respighi" },
  { zh: "里姆斯基-科萨科夫", latin: "Nikolai Rimsky-Korsakov" },
  { zh: "帕格尼尼", latin: "Niccolò Paganini" },
  { zh: "普契尼", latin: "Giacomo Puccini" },
  { zh: "鲍罗丁", latin: "Alexander Borodin" },
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
    .map((composer, index) => `<div class="picker-item" data-index="${index}">${composer.zh}（${composer.latin}）</div>`)
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
  setHeading("今天听谁？");
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
