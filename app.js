const STORAGE_KEY = "taperWeekProgressState";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return daysData.map(() => ({ completed: false, notes: "" }));
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length !== daysData.length) {
      return daysData.map(() => ({ completed: false, notes: "" }));
    }
    return parsed;
  } catch (error) {
    console.warn("Could not load saved state:", error);
    return daysData.map(() => ({ completed: false, notes: "" }));
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("Could not save state:", error);
  }
}

function getTodayIndex() {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1;
}

function getProgressStatus(index, state) {
  const today = getTodayIndex();
  if (index < today) {
    return state[index].completed ? "complete" : "missed";
  }
  return state[index].completed ? "complete" : "upcoming";
}

function renderProgressSquares(state) {
  const squares = document.getElementById("progress-squares");
  squares.innerHTML = "";
  for (let i = 0; i < 6; i += 1) {
    const square = document.createElement("div");
    square.className = `progress-square ${getProgressStatus(i, state)}`;
    square.textContent = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i];
    squares.appendChild(square);
  }
}

function updateProgressCounts(state) {
  const completedCount = state.filter((item) => item.completed).length;
  document.getElementById("completed-count").textContent = completedCount;
  document.getElementById("total-count").textContent = 6;
}

function createDayCard(day, index, state) {
  const card = document.createElement("article");
  card.className = "day-card";
  if (state[index].completed) {
    card.classList.add("completed");
  }
  if (index === getTodayIndex()) {
    card.classList.add("today");
  }
  card.tabIndex = 0;
  card.innerHTML = `
    <div class="day-side">
      <p><strong>${day.title}</strong></p>
      <p>${day.mainTask}</p>
      <p class="day-status">${state[index].completed ? "Completed" : "Not completed"}</p>
    </div>
    <div class="day-body">
      <div class="day-header">
        <h3 class="day-title">${day.title}</h3>
        <button class="details-link" type="button">View details</button>
      </div>
      <p class="day-summary">${day.summary}</p>
      <div class="status-row">
        <button class="mark-done" type="button">${state[index].completed ? "Mark not done" : "Mark complete"}</button>
        <span class="status-label">${state[index].completed ? "Completed" : "Not completed"}</span>
      </div>
    </div>
  `;

  const detailsBtn = card.querySelector(".details-link");
  const markDoneBtn = card.querySelector(".mark-done");

  function openDetail() {
    window.location.hash = `#day-${index}`;
  }

  detailsBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    openDetail();
  });

  card.addEventListener("click", openDetail);
  card.addEventListener("keypress", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      openDetail();
    }
  });

  markDoneBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    const completed = !state[index].completed;
    state[index].completed = completed;
    saveState(state);
    renderPage();
  });

  return card;
}

function createDetailView(day, index, state) {
  const root = document.createElement("div");
  root.className = "detail-view";
  root.innerHTML = `
    <section class="detail-overview">
      <button class="back-button" type="button">← Back to week</button>
      <div>
        <h1>${day.title}</h1>
        <p class="detail-main-task"><span>Main task:</span> ${day.mainTask}</p>
      </div>
    </section>
    <section class="detail-content">
      <div>
        <h2>Summary</h2>
        <p>${day.summary}</p>
      </div>
      <div>
        <h2>Full details</h2>
        <div id="detail-details">${day.details.replace(/\n/g, "<br>")}</div>
      </div>
    </section>
    <section class="detail-notes">
      <label for="detail-notes">Your notes</label>
      <textarea id="detail-notes">${state[index].notes || ""}</textarea>
      <div class="save-status" id="detail-save-status" aria-live="polite"></div>
    </section>
    <section class="detail-action">
      <button id="detail-mark-done" type="button">${state[index].completed ? "Mark not done" : "Mark complete"}</button>
      <span class="status-label">${state[index].completed ? "Completed" : "Not completed"}</span>
    </section>
  `;

  root.querySelector(".back-button").addEventListener("click", () => {
    window.location.hash = "";
  });

  const textarea = root.querySelector("#detail-notes");
  const detailSaveStatus = root.querySelector("#detail-save-status");
  const detailMarkDoneBtn = root.querySelector("#detail-mark-done");
  const statusLabel = root.querySelector(".status-label");

  textarea.addEventListener("input", () => {
    state[index].notes = textarea.value;
    saveState(state);
    detailSaveStatus.textContent = "Saved";
    clearTimeout(detailSaveStatus.timeoutId);
    detailSaveStatus.timeoutId = setTimeout(() => {
      detailSaveStatus.textContent = "";
    }, 1400);
  });

  detailMarkDoneBtn.addEventListener("click", () => {
    state[index].completed = !state[index].completed;
    saveState(state);
    renderPage();
  });

  return root;
}

function renderMain(state) {
  const daysContainer = document.getElementById("days");
  daysContainer.innerHTML = "";
  for (let i = 0; i < 6; i += 1) {
    daysContainer.appendChild(createDayCard(daysData[i], i, state));
  }
  renderProgressSquares(state);
  updateProgressCounts(state);
}

function renderDetail(index, state) {
  const main = document.querySelector("main");
  main.innerHTML = "";
  main.appendChild(createDetailView(daysData[index], index, state));
}

function renderPage() {
  const state = loadState();
  const hash = window.location.hash;
  if (hash.startsWith("#day-")) {
    const matched = hash.match(/^#day-(\d+)$/);
    const index = matched ? Number(matched[1]) : null;
    if (index !== null && index >= 0 && index < 6) {
      renderDetail(index, state);
      return;
    }
  }

  document.body.dataset.page = "main";
  const main = document.querySelector("main");
  main.innerHTML = `
    <section class="overview">
      <h2>Weekly Goal</h2>
      <p>This is a deliberate deload/taper week. The goal is to arrive in Austria on Aug 2 fresh and healthy, not fatigued.</p>
    </section>
    <section class="progress-overview">
      <div class="progress-summary">
        <div>
          <p class="progress-title">Weekly progress</p>
          <p class="progress-count"><span id="completed-count"></span> / <span id="total-count">6</span> days complete</p>
        </div>
        <button id="reset-progress" type="button">Reset progress</button>
      </div>
      <div class="progress-squares" id="progress-squares" aria-label="Weekly progress"></div>
      <p class="progress-note">Green = complete, red = overdue, gray = upcoming. Click a day card for full details.</p>
    </section>
    <section class="days" id="days"></section>
  `;
  document.getElementById("reset-progress").addEventListener("click", () => {
    const confirmed = window.confirm("Reset all saved notes and completion status for this week?");
    if (!confirmed) {
      return;
    }
    const newState = daysData.map(() => ({ completed: false, notes: "" }));
    saveState(newState);
    renderPage();
  });
  renderMain(state);
}

window.addEventListener("hashchange", renderPage);
window.addEventListener("load", renderPage);
