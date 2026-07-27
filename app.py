from flask import Flask, render_template, request, redirect, url_for
import json
from pathlib import Path

app = Flask(__name__)
STATE_FILE = Path(__file__).with_name("state.json")

DAYS = [
    {
        "title": "Monday – Easy Spin",
        "main_task": "Easy recovery ride",
        "summary": "Recovery and movement with no intensity.",
        "details": "Goal: Loosen the legs, zero intensity, start unloading fatigue from last week's big volume spike.\n\n- 07:00 Wake up, drink a glass of water\n- 07:15 Breakfast: oatmeal or toast, eggs, fruit, milk\n- 08:00 – 09:00 Free time, light stretching/mobility\n- 09:00 – 10:15 Easy ride, 60–75 min, 90–110W, no targets. Focus on smooth pedaling, relaxed cadence drills (90–100 rpm), stay conversational pace.\n- 10:15 Recovery snack: milk + banana, or yogurt + fruit\n- 10:30 Shower\n- 10:45 – 12:30 Free time\n- 12:30 Lunch: carbs + protein + vegetables\n- 13:30 – 15:00 Quiet time / rest\n- 15:00 Snack: fruit + yogurt or a handful of nuts\n- 17:00 Light mobility or stretching\n- 18:30 Dinner: extra carbs, protein, vegetables\n- 21:15 Lights out — target 9.5–10 hours of sleep\n\nNotes: No power zones today. This is about movement and recovery, not fitness building.",
    },
    {
        "title": "Tuesday – Rest Day",
        "main_task": "Full recovery rest",
        "summary": "Rest and optional very easy spin.",
        "details": "Goal: Full recovery. Let HRV and legs bounce back before Wednesday's one quality session.\n\n- 07:00 Wake up naturally, hydrate\n- 07:15 Breakfast: eggs or oatmeal, fruit, milk\n- 08:00 – 10:00 Free time, no structured activity\n- 10:00 Optional: 20–30 min very easy spin, flat terrain\n- 10:30 Snack: fruit + yogurt\n- 12:30 Lunch: protein-forward meal + carbs + vegetables\n- 13:30 – 15:00 Rest / quiet time\n- 15:00 Snack: nuts + fruit or cheese + crackers\n- 17:00 Light mobility: gentle stretching or foam rolling\n- 18:30 Dinner: balanced meal\n- 21:15 Lights out — target 9.5–10 hours of sleep\n\nNotes: No training pressure today. Check HRV and skip cycling if still tired.",
    },
    {
        "title": "Wednesday – Shortened Quality Session",
        "main_task": "Short quality session",
        "summary": "A short controlled session to stay sharp.",
        "details": "Goal: One controlled, shortened version of the coach's session — enough to stay sharp without digging fatigue.\n\n- 07:00 Wake up, hydrate\n- 07:30 Breakfast: oatmeal + fruit + eggs, or toast + peanut butter + banana\n- 09:30 – 10:30 Session (~60 min): 20 min warm-up → 2 rounds of [1 min @180W / 4 min @145–150W / 30s sprint] → 15 min cool-down.\n- 10:30 Recovery snack: chocolate milk, or yogurt + banana\n- 11:00 Shower\n- 12:30 Lunch: carbs + protein + vegetables\n- 15:00 Snack: fruit + nuts or yogurt\n- 17:00 Light stretching, 10 min\n- 18:30 Dinner: carb-forward meal + protein + vegetables\n- 21:15 Lights out — target 9.5–10 hours of sleep\n\nNotes: If HRV is low, downgrade to Monday's easy-spin format.",
    },
    {
        "title": "Thursday – Rest / Easy Spin",
        "main_task": "Recovery day",
        "summary": "Easy day with optional light spin.",
        "details": "Goal: Absorb Wednesday's session and keep recovery on track.\n\n- 07:00 Wake up naturally, hydrate\n- 07:15 Breakfast: eggs or oatmeal, fruit, milk\n- 08:00 – 10:00 Free time\n- 10:00 Optional: 30–40 min easy spin, high cadence\n- 10:45 Snack: fruit + yogurt\n- 12:30 Lunch: balanced meal\n- 15:00 Snack: nuts + fruit\n- 17:00 Light mobility, 10-15 min\n- 18:30 Dinner: balanced meal\n- 21:15 Lights out — target 10 hours of sleep\n\nNotes: Skip riding if legs feel heavy or energy is low.",
    },
    {
        "title": "Friday – Easy Ride with Openers",
        "main_task": "Easy ride + openers",
        "summary": "An easy ride with a few light openers.",
        "details": "Goal: Keep the legs moving and reactive without adding fatigue.\n\n- 07:00 Wake up, hydrate\n- 07:15 Breakfast: oatmeal/toast + eggs, fruit, milk\n- 09:00 – 10:00 Easy ride, 45–60 min, mostly 90–110W. Finish with 3–4 x 10 second openers.\n- 10:00 Recovery snack: fruit + yogurt\n- 12:30 Lunch: balanced meal\n- 15:00 Snack: fruit + nuts\n- 17:00 Light stretching, 10 min\n- 18:30 Dinner: balanced meal with hydration\n- 21:15 Lights out — target 9.5–10 hours of sleep\n\nNotes: Openers should be easy and quick, not maximal efforts.",
    },
    {
        "title": "Saturday – Rest Day",
        "main_task": "Full rest day",
        "summary": "Full recovery, rest, and prep for travel.",
        "details": "Goal: Full rest, family time, mental recharge before travel prep.\n\n- 07:30 Wake up naturally, hydrate\n- 08:00 Breakfast: relaxed family breakfast\n- 09:00 – 12:00 Free time — family activities, hobbies\n- 12:00 Optional: gentle stretching or mobility\n- 12:30 Lunch: balanced meal\n- 13:30 – 17:00 Free time / rest / packing\n- 17:00 Light walk or relaxed outdoor time\n- 18:30 Dinner: generous balanced meal\n- 21:15 Lights out — target 9.5–10 hours of sleep\n\nNotes: No bike today. Focus on mental recovery.",
    },
]


def create_default_state():
    return [{"completed": False, "notes": ""} for _ in DAYS]


def load_state():
    if not STATE_FILE.exists():
        return create_default_state()
    try:
        with STATE_FILE.open("r", encoding="utf-8") as handle:
            data = json.load(handle)
        if not isinstance(data, list) or len(data) != len(DAYS):
            return create_default_state()
        return data
    except (json.JSONDecodeError, OSError):
        return create_default_state()


def save_state(state):
    with STATE_FILE.open("w", encoding="utf-8") as handle:
        json.dump(state, handle, indent=2)


def get_today_index():
    day = __import__("datetime").datetime.now().weekday()
    return min(day, len(DAYS) - 1)


def status_for_day(index, completed):
    today = get_today_index()
    if completed:
        return "complete"
    if index < today:
        return "missed"
    return "upcoming"


@app.route("/")
def index():
    state = load_state()
    progress = [status_for_day(i, state[i]["completed"]) for i in range(len(DAYS))]
    completed_count = sum(1 for item in state if item["completed"])
    return render_template(
        "index.html",
        days=DAYS,
        state=state,
        progress=progress,
        completed_count=completed_count,
        total_count=len(DAYS),
        today_index=get_today_index(),
    )


@app.route("/day/<int:day_id>", methods=["GET", "POST"])
def day_detail(day_id):
    if day_id < 0 or day_id >= len(DAYS):
        return redirect(url_for("index"))

    state = load_state()
    if request.method == "POST":
        notes = request.form.get("notes", "").strip()
        completed = request.form.get("completed") == "on"
        state[day_id]["notes"] = notes
        state[day_id]["completed"] = completed
        save_state(state)
        return redirect(url_for("day_detail", day_id=day_id))

    day = DAYS[day_id]
    return render_template(
        "day.html",
        day=day,
        day_id=day_id,
        status=state[day_id]["completed"],
        notes=state[day_id]["notes"],
        completed_count=sum(1 for item in state if item["completed"]),
        total_count=len(DAYS),
    )


@app.route("/reset", methods=["POST"])
def reset():
    save_state(create_default_state())
    return redirect(url_for("index"))


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
