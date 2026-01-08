// static/js/timer.js

// --- 時間設定（テスト用） ---
const WORK_TIME = 5;    // 作業時間テスト用　5s
const BREAK_TIME = 5;  // 休憩時間テスト用 5s

// --- グローバル変数 ---

let timerInterval;
let timeLeft = WORK_TIME;
let isRunning = false;
let currentMode = 'work';
let startTime;

// DOM要素の取得
const display = document.getElementById('timer-display');
const label = document.getElementById('timer-label');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const alarmSound = document.getElementById('alarm-sound');
const goalMsg = document.getElementById('goal-msg');
const targetDisplay = document.getElementById('target-count');

// --- index.htmlから渡されたセット数を表示する処理 ---
function loadTodayGoal() {
    fetch('/api/goal/today')
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                targetDisplay.textContent = data.target;
            }
        });
}

function updateDisplay() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    display.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (isRunning) return;

    // アラーム停止
    alarmSound.pause();
    alarmSound.currentTime = 0;

    isRunning = true;
    startTime = new Date().toISOString();
    startBtn.disabled = true;
    pauseBtn.disabled = false;

    timerInterval = setInterval(() => {
        timeLeft--;
        updateDisplay();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            finishSession();
        }
    }, 1000);
}

function pauseTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

function resetTimer() {
    pauseTimer();
    alarmSound.pause();
    alarmSound.currentTime = 0;
    timeLeft = currentMode === 'work' ? WORK_TIME : BREAK_TIME;
    updateDisplay();
}

function finishSession() {
    isRunning = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    
    const msg = currentMode === 'work' ? "作業終了！休憩しましょう。" : "休憩終了！作業を始めましょう。";
    alarmSound.play().catch(e => console.log("再生ブロック: ", e));

    goalMsg.textContent = msg;
    goalMsg.style.display = 'block';
    goalMsg.style.color = currentMode === 'work' ? '#3498db' : '#e67e22';
    
    setTimeout(() => { goalMsg.style.display = 'none'; }, 5000);

    // 記録保存
    const endTime = new Date().toISOString();
    fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            start_time: startTime,
            end_time: endTime,
            status: 'completed',
            category: currentMode
        })
    });

    // モード切替
    if (currentMode === 'work') {
        currentMode = 'break';
        timeLeft = BREAK_TIME;
        label.textContent = '休憩中';
        label.style.color = '#e67e22';
    } else {
        currentMode = 'work';
        timeLeft = WORK_TIME;
        label.textContent = '作業中';
        label.style.color = '#333';
    }
    updateDisplay();
}

// イベントリスナー
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// 初期化
loadTodayGoal();
updateDisplay();