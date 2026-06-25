# Cowork scheduled tasks — morning briefing & nightly recap

Paste each block below into Claude Cowork as its own scheduled task, replacing the three placeholders:
- `[NAME]` — your name
- `[DASHBOARD_URL]` — your deployed dashboard URL, e.g. `https://life-dashboard.vercel.app`
- `[PHONE_NUMBER]` — the iMessage-reachable number/email to send the briefing to

> Note: I wasn't able to verify the exact required format for "Casey's structure" specifically — I don't have a confirmed source for that template, so this follows a standard scheduled-task structure (schedule → goal → steps → tone → output). Swap in any required sections if Casey's structure differs from what's below.

---

```
SCHEDULE: Every weekday at 7:00 AM (local time)

GOAL:
Send Edwina a warm, motivating morning briefing via iMessage that pulls together
today's tasks, the weekly focus, and anything time-sensitive coming up — so the
day starts with intention instead of just a to-do list.

STEPS:
1. Fetch GET https://life-dashboard-alpha-seven.vercel.app/api/briefing
2. Take the `text` field from the JSON response as-is — it is already formatted
   with color-coded emojis that change daily, and warm language. Do not summarize or rewrite it.
3. Send that text as an iMessage to [PHONE_NUMBER].
4. If the request fails or returns an error, send 7813084912 a short
   apologetic iMessage noting the dashboard briefing couldn't be reached today,
   instead of staying silent.

TONE:
Warm, personal, encouraging — like a thoughtful friend, not a productivity bot.
Never strip out the emojis or motivational closing line from the briefing text.

OUTPUT:
One iMessage only. No preamble, no "here's your briefing" wrapper — just the
briefing text itself.
```

---

```
SCHEDULE: Every weekday at 10:00 PM EST

GOAL:
Send Edwina a brief, warm nightly text that celebrates what she finished today
and gently nudges her toward winding down — so the day closes with the same
intentionality it started with.

STEPS:
1. Fetch GET https://life-dashboard-alpha-seven.vercel.app/api/data
2. Find the current week's entry. Each task (and subtask) carries a `goalCategory`
   (Finance, Health, Career, Personal, or Content Creation) and a `completedAt`
   date once it's finished. Filter for items whose `completedAt` is today's date
   AND that have a non-null `goalCategory` — skip anything completed today with
   no goal tagged on it.
3. For each goal category represented among today's completions, count how many
   tasks/subtasks tagged with that same `goalCategory` have a `completedAt`
   anywhere in the current week (Monday through today) — that's the weekly tally.
4. Write a short text (2-4 sentences) that:
   - Congratulates Edwina on progress toward the goal(s) she advanced today.
     Frame it around the goal category and the weekly tally, not a checklist of
     finished tasks — you may mention the specific completed task briefly for
     color, e.g. "You've made significant progress towards Health by going to
     the gym today. That makes 3 times this week!" If nothing eligible was
     completed today, skip the congrats line entirely and go straight to the
     wind-down message — no guilt, no nagging.
   - Follows with a warm reminder to unwind, meditate or breathe for a few
     quiet minutes, and head to bed soon.
   - Includes a couple of bedtime/night emojis (e.g. 🌙 ✨ 😴 🛏️ 🌌) — don't overdo it.
5. Send that text as an iMessage to [PHONE_NUMBER].
6. If the request fails or returns an error, send 7813084912 a short
   apologetic iMessage noting the nightly recap couldn't be reached tonight,
   instead of staying silent.

TONE:
Warm, soft, low-energy — like a thoughtful friend gently telling you it's time
to rest. Celebratory about what got done, never about what didn't.

OUTPUT:
One iMessage only. No preamble, no wrapper — just the nightly recap and
wind-down text itself.
```
