const display = document.getElementById("stopwatch-display");
const startBtn = document.getElementById("start-btn");
const lapBtn = document.getElementById("lap-btn");
const resetBtn = document.getElementById("reset-btn");
const lapsList = document.getElementById("laps-list");
let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let running = false;
let laps = [];
let lastLapTime = 0;
function formatTime(ms) {
  const date = new Date(ms);
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");
  const milliseconds = String(Math.floor(date.getUTCMilliseconds() / 10)).padStart(2, "0");
  const hours = String(Math.floor(ms / 3600000)).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}
function updateDisplay() {
  const currentElapsed = elapsedTime + (running ? Date.now() - startTime : 0);
  display.textContent = formatTime(currentElapsed);
}
function startStopwatch() {
  if (!running) {
    startTime = Date.now();
    timerInterval = setInterval(updateDisplay, 30);
    running = true;
    startBtn.textContent = "Stop";
    lapBtn.disabled = false;
    resetBtn.disabled = false;
  } else {
    elapsedTime += Date.now() - startTime;
    clearInterval(timerInterval);
    running = false;
    startBtn.textContent = "Start";
    lapBtn.disabled = true;
  }
}
function recordLap() {
  const currentElapsed = elapsedTime + (Date.now() - startTime);
  const lapDuration = currentElapsed - lastLapTime;
  const lapData = {
    number: laps.length + 1,
    split: lapDuration,
    total: currentElapsed
  };
  laps.unshift(lapData);
  lastLapTime = currentElapsed;
  renderLaps();
}
function renderLaps() {
  lapsList.innerHTML = "";
  laps.forEach(lap => {
    const li = document.createElement("li");
    li.className = "lap-item";
    const numSpan = document.createElement("span");
    numSpan.textContent = lap.number;
    const splitSpan = document.createElement(
      "span"
    );
    splitSpan.textContent = formatTime(lap.split);
    const totalSpan = document.createElement("span");
    totalSpan.textContent = formatTime(lap.total);
    li.appendChild(numSpan);
    li.appendChild(splitSpan);
    li.appendChild(totalSpan);
    lapsList.appendChild(li);
  });
}
function resetStopwatch() {
  clearInterval(timerInterval);
  running = false;
  startTime = 0;
  elapsedTime = 0;
  lastLapTime = 0;
  laps = [];
  display.textContent = "00:00:00.00";
  startBtn.textContent = "Start";
  lapBtn.disabled = true;
  resetBtn.disabled = true;
  lapsList.innerHTML = "";
}
startBtn.addEventListener("click", startStopwatch);
lapBtn.addEventListener("click", recordLap);
resetBtn.addEventListener("click", resetStopwatch);
