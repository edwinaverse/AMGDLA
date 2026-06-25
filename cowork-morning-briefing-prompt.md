# Cowork scheduled task — morning briefing

Paste this into Claude Cowork as a scheduled task, replacing the three placeholders:
- `[NAME]` — your name
- `[DASHBOARD_URL]` — your deployed dashboard URL, e.g. `https://life-dashboard.vercel.app`
- `[PHONE_NUMBER]` — the iMessage-reachable number/email to send the briefing to

> Note: I wasn't able to verify the exact required format for "Casey's structure" specifically — I don't have a confirmed source for that template, so this follows a standard scheduled-task structure (schedule → goal → steps → tone → output). Swap in any required sections if Casey's structure differs from what's below.

---

```
SCHEDULE: Every weekday at 7:00 AM (local time)

GOAL:
Send [NAME] a warm, motivating morning briefing via iMessage that pulls together
today's tasks, the weekly focus, and anything time-sensitive coming up — so the
day starts with intention instead of just a to-do list.

STEPS:
1. Fetch GET [DASHBOARD_URL]/api/briefing
2. Take the `text` field from the JSON response as-is — it is already formatted
   with emojis and warm language. Do not summarize or rewrite it.
3. Send that text as an iMessage to [PHONE_NUMBER].
4. If the request fails or returns an error, send [PHONE_NUMBER] a short
   apologetic iMessage noting the dashboard briefing couldn't be reached today,
   instead of staying silent.

TONE:
Warm, personal, encouraging — like a thoughtful friend, not a productivity bot.
Never strip out the emojis or motivational closing line from the briefing text.

OUTPUT:
One iMessage only. No preamble, no "here's your briefing" wrapper — just the
briefing text itself.
```
