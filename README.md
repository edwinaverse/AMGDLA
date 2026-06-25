# Life, in view

A personal life dashboard — Next.js 14 App Router, Neon Postgres, deployed on Vercel.

## Views

- **Week** — weekly focus + sub-goals, task checklist (confetti + Web Audio pop on check-off)
- **Gym** — weekly consistency score, 13-week history chart
- **Georgia Tech** — current courses, deadlines, study log, MS CS (NLP concentration) degree progress
- **Quarterly Goals** — goals by category (Finance, Health, Career, Personal, Content Creation), parking lot
- **Bucket List** — categorized items, progress bar, completion dates
- **Content Creation** — calendar, ideas pipeline, brand deals, quarterly content goals, posting consistency/streaks

## Data model

All dashboard data lives as a single JSON blob per user in one Postgres table (`dashboard`), so adding a feature never requires a schema migration. See `lib/types.ts` and `lib/defaultData.ts`.

## Local development

```bash
npm install
npm run dev
```

Requires a `DATABASE_URL` env var pointing at a Postgres database with the `dashboard` table created (see `lib/db.ts` for the schema). Run `vercel env pull` if this project is already linked to Vercel.

## API

- `GET /api/data`, `PUT /api/data` — load/save the full dashboard blob
- `GET /api/briefing` — formatted morning briefing (tasks, weekly focus, upcoming GT/content deadlines, quarterly-goals tie-in). See `cowork-morning-briefing-prompt.md` for the Cowork scheduled-task prompt that consumes it.

## Deployment

Connected to Vercel with auto-deploy on push to `main`; Neon Postgres is provisioned via the Vercel Neon integration.
