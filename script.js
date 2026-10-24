const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const tasksElement = document.getElementById("tasks");
const timerElement = document.getElementById("timer");
const minutesInput = document.getElementById("minutes");
const selectedTaskElement = document.getElementById("selectedTask");
const statusElement = document.getElementById("status");
const startBtn = document.getElementById("startBtn");
const scareElement = document.getElementById("jumpscare");
const XP_PER_TASK = 50;
const XP_PER_LEVEL = 200;
const levelLabel = document.getElementById("levelLabel");
const xpText = document.getElementById("xpText");
const xpFill = document.getElementById("xpFill");
const xpProgress = document.getElementById("xpProgress");
const xpMessage = document.getElementById("xpMessage");
const graveyardList = document.getElementById("graveyardList");
const scareSound = document.getElementById("scareSound");
const hurrySound = document.getElementById("hurrySound");
const HURRY_SECONDS = 21;

    let tasks = [];
    let selectedTaskId = null;
    let remainingSeconds = 25 * 60;
    let endTime = null;
    let timerId = null;
    let sessionRunning = false;
    let leftDuringSession = false;
    let scareActive = false;
    let totalXP = Number(localStorage.getItem("zombieXP")) || 0;
    let totalStudySeconds =
        Number(localStorage.getItem("zombieStudySeconds")) || 0;
    let lastStudyUpdate = null;

function saveTasks() {
  localStorage.setItem("zombieTasks", JSON.stringify(tasks));
}

function renderTasks() {
  tasksElement.innerHTML = "";
  graveyardList.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");

    li.textContent = (task.done ? "✓ " : "☣ ") + task.name;

    li.className =
      (task.id === selectedTaskId ? "selected " : "") +
      (task.done ? "done" : "");

    li.addEventListener("click", () => {
      selectedTaskId = task.id;
      renderTasks();
      selectedTaskElement.textContent = "Mission: " + task.name;
    });

    if (task.done) {
      // Turn completed tasks into headstones
      li.classList.add("grave-stone");

      const headstone = document.createElement("span");
      headstone.className = "headstone";
      headstone.textContent = "🪦";

      li.prepend(headstone);
      graveyardList.appendChild(li);
    } else {
      // Keep unfinished tasks in the active mission list
      tasksElement.appendChild(li);
    }

<<<<<<< HEAD
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "🗑️";
    deleteButton.className = "delete-button";
    deleteButton.title = "Delete task";

    deleteButton.addEventListener("click", function (event) {
      event.stopPropagation();

      tasks = tasks.filter(function (t) {
        return t.id !== task.id;
      });

      if (selectedTaskId === task.id) {
        selectedTaskId = null;
        stopTimer();

        selectedTaskElement.textContent = "No task selected";
      }

      saveTasks();
      renderTasks();
=======
    // function stopTimer() {
    //   clearInterval(timerId);
    //   timerId = null;
    //   sessionRunning = false;
    //   endTime = null;
    //   startBtn.textContent = "▶ Start focus";
    // }

    function stopTimer() {
        clearInterval(timerId);
        timerId = null;
        sessionRunning = false;
        endTime = null;
        lastStudyUpdate = null;
        startBtn.textContent = "▶ Start focus";
    }

    // function tick() {
    //   if (!sessionRunning || endTime === null) return;

    //   remainingSeconds = Math.max(
    //     0, Math.ceil((endTime - Date.now()) / 1000)
    //   );
    //   showTime();

    //   if (remainingSeconds <= 0) {
    //     stopTimer();
    //     statusElement.textContent = "Session complete! Take a break.";
    //     alert("Pomodoro complete! You survived another session.");
    //   }
    // }

    function tick() {
        if (!sessionRunning || endTime === null) return;

        const now = Date.now();

        remainingSeconds = Math.max(
            0,
            Math.ceil((endTime - now) / 1000)
        );

        if (lastStudyUpdate !== null) {
            const elapsed = Math.max(
            0,
            (now - lastStudyUpdate) / 1000
            );

            totalStudySeconds += elapsed;
            saveStudyTime();
            updateAchievements();
        }

        lastStudyUpdate = now;
        showTime();

        if (remainingSeconds <= 0) {
            stopTimer();
            statusElement.textContent =
            "Session complete! Take a break.";
            alert("Pomodoro complete! You survived another session.");
        }
}

    function updateXP() {
        const level = Math.floor(totalXP / XP_PER_LEVEL) + 1;
        const xpIntoLevel = totalXP % XP_PER_LEVEL;
        const percentage = (xpIntoLevel / XP_PER_LEVEL) * 100;

        levelLabel.textContent = `LEVEL ${level} SURVIVOR`;
        xpText.textContent = `${xpIntoLevel} / ${XP_PER_LEVEL} XP`;
        xpFill.style.width = `${percentage}%`;

        xpProgress.setAttribute("aria-valuenow", xpIntoLevel);

        xpMessage.textContent =
            `${XP_PER_LEVEL - xpIntoLevel} XP until Level ${level + 1}`;
    }

    function awardXP() {
        const previousLevel = Math.floor(totalXP / XP_PER_LEVEL) + 1;

        totalXP += XP_PER_TASK;
        localStorage.setItem("zombieXP", totalXP);

        updateXP();

        const newLevel = Math.floor(totalXP / XP_PER_LEVEL) + 1;

        if (newLevel > previousLevel) {
            xpMessage.textContent =
            `LEVEL UP! Welcome to Level ${newLevel}, survivor!`;

            xpFill.classList.remove("level-up");
            void xpFill.offsetWidth;
            xpFill.classList.add("level-up");
        } else {
            xpMessage.textContent = `+${XP_PER_TASK} XP earned!`;
        }
    }

    function saveStudyTime() {
        localStorage.setItem("zombieStudySeconds", totalStudySeconds);
    }
    
    function updateAchievements() {
        const totalMinutes = Math.floor(totalStudySeconds / 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        document.getElementById("studyTime").textContent =
            hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;

        const badge = document.getElementById("studyBadge");

        if (totalStudySeconds >= 10 * 3600) {
            badge.textContent = "🥇 Gold";
            badge.className = "badge gold";
        } else if (totalStudySeconds >= 5 * 3600) {
            badge.textContent = "🥈 Silver";
            badge.className = "badge silver";
        } else {
            badge.textContent = "🥉 Bronze";
            badge.className = "badge bronze";
        }
    }

    startBtn.addEventListener("click", () => {
      if (sessionRunning) {
        stopTimer();
        statusElement.textContent = "Focus paused.";
        return;
      }

      if (remainingSeconds <= 0) {
        remainingSeconds = Number(minutesInput.value) * 60;
      }

      if (!Number.isFinite(remainingSeconds) || remainingSeconds <= 0) {
        statusElement.textContent = "Choose a valid focus duration.";
        return;
      }

      scareSound.play().then(() => {
        scareSound.pause();
        scareSound.currentTime = 0;
      }).catch(() => {});
      lastStudyUpdate = Date.now();
      endTime = Date.now() + remainingSeconds * 1000;
      sessionRunning = true;
      startBtn.textContent = "Ⅱ Pause";
      statusElement.textContent = "Focus active. Don't look away...";
      tick();
      timerId = setInterval(tick, 250);
>>>>>>> d8ef0cfca0c9a7b05f2b425a75355e81bbc06e9a
    });

    li.appendChild(deleteButton);
  });
}

taskForm.addEventListener("submit", event => {
  event.preventDefault();
  const name = taskInput.value.trim();
  if (!name) return;

  const task = {
    id: Date.now() + Math.random(),
    name,
    done: false
  };

  tasks.push(task);
  selectedTaskId = task.id;
  taskInput.value = "";
  saveTasks();
  renderTasks();
  selectedTaskElement.textContent = "Mission: " + task.name;
});

function showTime() {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  timerElement.textContent =
    String(minutes).padStart(2, "0") + ":" +
    String(seconds).padStart(2, "0");
}

function stopTimer() {
  clearInterval(timerId);
  timerId = null;
  sessionRunning = false;
  endTime = null;
  startBtn.textContent = "▶ Start focus";
  hurrySound.pause();
  hurrySound.currentTime = 0;
}

function tick() {
  if (!sessionRunning || endTime === null) return;

  remainingSeconds = Math.max(
    0, Math.ceil((endTime - Date.now()) / 1000)
  );
  showTime();

  // Hurry-up sound for the last 21 seconds
  if (remainingSeconds <= HURRY_SECONDS && remainingSeconds > 0 && !hurryPlayed) {
    hurryPlayed = true;
    hurrySound.currentTime = 0;
    hurrySound.play().catch(() => {});
  }

  if (remainingSeconds <= 0) {
    stopTimer();
    statusElement.textContent = "Session complete! Take a break.";
    alert("Pomodoro complete! You survived another session.");
  }
}

function updateXP() {
  const level = Math.floor(totalXP / XP_PER_LEVEL) + 1;
  const xpIntoLevel = totalXP % XP_PER_LEVEL;
  const percentage = (xpIntoLevel / XP_PER_LEVEL) * 100;

  levelLabel.textContent = `LEVEL ${level} SURVIVOR`;
  xpText.textContent = `${xpIntoLevel} / ${XP_PER_LEVEL} XP`;
  xpFill.style.width = `${percentage}%`;

  xpProgress.setAttribute("aria-valuenow", xpIntoLevel);

  xpMessage.textContent =
    `${XP_PER_LEVEL - xpIntoLevel} XP until Level ${level + 1}`;
}

function awardXP() {
  const previousLevel = Math.floor(totalXP / XP_PER_LEVEL) + 1;

  totalXP += XP_PER_TASK;
  localStorage.setItem("zombieXP", totalXP);

  updateXP();

  const newLevel = Math.floor(totalXP / XP_PER_LEVEL) + 1;

  if (newLevel > previousLevel) {
    xpMessage.textContent =
      `LEVEL UP! Welcome to Level ${newLevel}, survivor!`;

    xpFill.classList.remove("level-up");
    void xpFill.offsetWidth;
    xpFill.classList.add("level-up");
  } else {
    xpMessage.textContent = `+${XP_PER_TASK} XP earned!`;
  }
}

startBtn.addEventListener("click", () => {
  if (sessionRunning) {
    stopTimer();
    statusElement.textContent = "Focus paused.";
    return;
  }

  if (remainingSeconds <= 0) {
    remainingSeconds = Number(minutesInput.value) * 60;
  }

  if (!Number.isFinite(remainingSeconds) || remainingSeconds <= 0) {
    statusElement.textContent = "Choose a valid focus duration.";
    return;
  }

  hurryPlayed = false;

  // Unlock both sounds so the browser lets them play later
  scareSound.play().then(() => {
    scareSound.pause();
    scareSound.currentTime = 0;
  }).catch(() => {});

  hurrySound.play().then(() => {
    hurrySound.pause();
    hurrySound.currentTime = 0;
  }).catch(() => {});

  endTime = Date.now() + remainingSeconds * 1000;
  sessionRunning = true;
  startBtn.textContent = "Ⅱ Pause";
  statusElement.textContent = "Focus active. Don't look away...";
  tick();
  timerId = setInterval(tick, 250);
});

document.getElementById("resetBtn").addEventListener("click", () => {
  stopTimer();
  remainingSeconds = Math.max(
    1, Math.min(120, Number(minutesInput.value) || 25)
  ) * 60;
  leftDuringSession = false;
  showTime();
  statusElement.textContent = "Timer reset.";
});

minutesInput.addEventListener("change", () => {
  const value = Math.max(1, Math.min(120,
    Number(minutesInput.value) || 25));
  minutesInput.value = value;

  if (!sessionRunning) {
    remainingSeconds = value * 60;
    showTime();
  }
});

document.getElementById("completeBtn").addEventListener("click", () => {
  const task = tasks.find(t => t.id === selectedTaskId);

  if (!task) {
    statusElement.textContent = "Select a mission first.";
    return;
  }

  if (!task.done) {
    task.done = true;
    stopTimer();
    awardXP();
    statusElement.textContent =
      `Mission complete! +${XP_PER_TASK} XP earned.`;
  } else {
    task.done = false;
    statusElement.textContent = "Mission reopened. No XP deducted.";
  }

  saveTasks();
  renderTasks();
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    if (sessionRunning) leftDuringSession = true;
    return;
  }

  if (leftDuringSession && sessionRunning && !scareActive) {
    leftDuringSession = false;
    scareActive = true;
    scareElement.classList.add("show");
    scareSound.currentTime = 0;
    scareSound.play().catch(() => {});
  }
});

document.getElementById("dismiss").addEventListener("click", () => {
  scareElement.classList.remove("show");
  scareSound.pause();
  scareSound.currentTime = 0;
  scareActive = false;
  statusElement.textContent = "Back to work, survivor.";
});

try {
  const saved = JSON.parse(localStorage.getItem("zombieTasks") || "[]");
  if (Array.isArray(saved)) tasks = saved;
} catch {
  tasks = [];
}

renderTasks();
showTime();
updateXP();

/* ---------- Ghost picture popup ---------- */

const ghost = document.getElementById("ghost");
const ghostPopup = document.getElementById("ghostPopup");

ghost.addEventListener("click", () => ghostPopup.classList.add("show"));

document.getElementById("ghostClose").addEventListener("click", () => {
  ghostPopup.classList.remove("show");
});

ghostPopup.addEventListener("click", event => {
  if (event.target === ghostPopup) ghostPopup.classList.remove("show");
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") ghostPopup.classList.remove("show");
});
