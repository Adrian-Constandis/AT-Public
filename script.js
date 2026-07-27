const daysData = [
  {
    title: "Monday – Easy Spin",
    summary: "Easy recovery ride day with zero intensity. Focus on movement, stretching, and hydration.",
    details: `Goal: Loosen the legs, zero intensity, start unloading fatigue from last week's big volume spike.

- 07:00 Wake up, drink a glass of water
- 07:15 Breakfast: oatmeal or toast, eggs, fruit, milk
- 08:00 – 09:00 Free time, light stretching/mobility
- 09:00 – 10:15 Easy ride, 60–75 min, 90–110W, no targets. Focus on smooth pedaling, relaxed cadence drills (90–100 rpm), stay conversational pace.
- 10:15 Recovery snack: milk + banana, or yogurt + fruit
- 10:30 Shower
- 10:45 – 12:30 Free time
- 12:30 Lunch: carbs + protein + vegetables
- 13:30 – 15:00 Quiet time / rest
- 15:00 Snack: fruit + yogurt or a handful of nuts
- 17:00 Light mobility or stretching
- 18:30 Dinner: extra carbs, protein, vegetables
- 21:15 Lights out — target 9.5–10 hours of sleep

Notes: No power zones today. This is about movement and recovery, not fitness building.",
  },
  {
    title: "Tuesday – Rest Day",
    summary: "Rest and recovery day. Optional very easy spin only if energy is good.",
    details: `Goal: Full recovery. Let HRV and legs bounce back before Wednesday's one quality session.

- 07:00 Wake up naturally, hydrate
- 07:15 Breakfast: eggs or oatmeal, fruit, milk
- 08:00 – 10:00 Free time, no structured activity
- 10:00 Optional: 20–30 min very easy spin, flat terrain
- 10:30 Snack: fruit + yogurt
- 12:30 Lunch: protein-forward meal + carbs + vegetables
- 13:30 – 15:00 Rest / quiet time
- 15:00 Snack: nuts + fruit or cheese + crackers
- 17:00 Light mobility: gentle stretching or foam rolling
- 18:30 Dinner: balanced meal
- 21:15 Lights out — target 9.5–10 hours of sleep

Notes: No training pressure today. Check HRV and skip cycling if still tired.",
  },
  {
    title: "Wednesday – Shortened Quality Session",
    summary: "One controlled quality session, kept short and sharp.",
    details: `Goal: One controlled, shortened version of the coach's session — enough to stay sharp without digging fatigue.

- 07:00 Wake up, hydrate
- 07:30 Breakfast: oatmeal + fruit + eggs, or toast + peanut butter + banana
- 09:30 – 10:30 Session (~60 min): 20 min warm-up → 2 rounds of [1 min @180W / 4 min @145–150W / 30s sprint] → 15 min cool-down.
- 10:30 Recovery snack: chocolate milk, or yogurt + banana
- 11:00 Shower
- 12:30 Lunch: carbs + protein + vegetables
- 15:00 Snack: fruit + nuts or yogurt
- 17:00 Light stretching, 10 min
- 18:30 Dinner: carb-forward meal + protein + vegetables
- 21:15 Lights out — target 9.5–10 hours of sleep

Notes: If HRV is low, downgrade to Monday's easy-spin format.",
  },
  {
    title: "Thursday – Rest / Easy Spin",
    summary: "Recovery day with an optional easy spin if legs feel good.",
    details: `Goal: Absorb Wednesday's session and keep recovery on track.

- 07:00 Wake up naturally, hydrate
- 07:15 Breakfast: eggs or oatmeal, fruit, milk
- 08:00 – 10:00 Free time
- 10:00 Optional: 30–40 min easy spin, high cadence
- 10:45 Snack: fruit + yogurt
- 12:30 Lunch: balanced meal
- 15:00 Snack: nuts + fruit
- 17:00 Light mobility, 10–15 min
- 18:30 Dinner: balanced meal
- 21:15 Lights out — target 10 hours of sleep

Notes: Skip riding if legs feel heavy or energy is low.",
  },
  {
    title: "Friday – Easy Ride with Openers",
    summary: "Easy ride with a few light openers to keep legs snappy.",
    details: `Goal: Keep the legs moving and reactive without adding fatigue.

- 07:00 Wake up, hydrate
- 07:15 Breakfast: oatmeal/toast + eggs, fruit, milk
- 09:00 – 10:00 Easy ride, 45–60 min, mostly 90–110W. Finish with 3–4 x 10 second openers.
- 10:00 Recovery snack: fruit + yogurt
- 12:30 Lunch: balanced meal
- 15:00 Snack: fruit + nuts
- 17:00 Light stretching, 10 min
- 18:30 Dinner: balanced meal with hydration
- 21:15 Lights out — target 9.5–10 hours of sleep

Notes: Openers should be easy and quick, not maximal efforts.",
  },
  {
    title: "Saturday – Rest Day",
    summary: "Full rest day with family time and recovery.",
    details: `Goal: Full rest, family time, mental recharge before travel prep.

- 07:30 Wake up naturally, hydrate
- 08:00 Breakfast: relaxed family breakfast
- 09:00 – 12:00 Free time — family activities, hobbies
- 12:00 Optional: gentle stretching or mobility
- 12:30 Lunch: balanced meal
- 13:30 – 17:00 Free time / rest / packing
- 17:00 Light walk or relaxed outdoor time
- 18:30 Dinner: generous balanced meal
- 21:15 Lights out — target 9.5–10 hours of sleep

Notes: No bike today. Focus on mental recovery.",
  },
  {
    title: "Sunday – Optional Easy Ride / Final Prep",
    summary: "Optional easy ride if energy is good; otherwise rest.",
    details: `Goal: Light activity if he feels good, otherwise rest before Austria travel.

- 07:30 Wake up naturally, hydrate
- 08:00 Breakfast: relaxed family breakfast
- 09:00 – 10:00 Optional easy ride, 45–60 min if energy is good
- 10:00 Snack: fruit + yogurt
- 12:30 Lunch: balanced meal
- 13:30 – 15:00 Rest / quiet time
- 15:00 Snack: fruit + nuts
- 15:30 – 17:00 Free time / finish packing
- 17:00 Light stretching, 10 min
- 18:30 Dinner: balanced meal
- 21:15 Lights out — target 9.5–10 hours of sleep

Notes: End the week feeling fresher and ready for travel.",
  },
];

function createDayCard(day) {
  const template = document.getElementById("day-template");
  const node = template.content.cloneNode(true);
  node.querySelector(".day-title").textContent = day.title;
  node.querySelector(".day-summary").textContent = day.summary;
  node.querySelector(".day-details").innerHTML = day.details.replace(/\n/g, "<br>");
  const toggleBtn = node.querySelector(".toggle-notes");
  const detailsEl = node.querySelector(".day-notes");
  const statusLabel = node.querySelector(".status-label");
  const markDoneBtn = node.querySelector(".mark-done");
  const textarea = node.querySelector("textarea");

  toggleBtn.addEventListener("click", () => {
    detailsEl.open = !detailsEl.open;
    toggleBtn.textContent = detailsEl.open ? "Hide notes" : "Show notes";
  });

  markDoneBtn.addEventListener("click", () => {
    const done = statusLabel.textContent !== "Completed";
    statusLabel.textContent = done ? "Completed" : "Not completed";
    statusLabel.style.color = done ? "#2f9e44" : "#1d2636";
    markDoneBtn.textContent = done ? "Mark not done" : "Mark complete";
  });

  textarea.addEventListener("input", () => {
    textarea.dataset.saved = "true";
  });

  return node;
}

const daysContainer = document.getElementById("days");
for (const day of daysData) {
  daysContainer.appendChild(createDayCard(day));
}
