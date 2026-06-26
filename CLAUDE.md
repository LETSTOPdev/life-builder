# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Important:** This is Next.js 16 with breaking API changes from earlier versions. Read `node_modules/next/dist/docs/` before writing any Next.js-specific code. Route handler params are now `Promise<{ id: string }>` — always `await params`.

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run start    # Production server (binds 0.0.0.0 for Railway)
npm run lint     # ESLint
```

No test suite is configured.

## Architecture

### Stack
- **Next.js 16** App Router, React 19, TypeScript, Tailwind CSS v4
- **Database:** `better-sqlite3` (SQLite) — synchronous, no ORM, raw SQL only
- **Auth:** Custom JWT via `jose` — 7-day tokens stored in `buildr_session` HttpOnly cookie
- **AI:** Anthropic SDK (`claude-haiku-4-5-20251001`) — gracefully falls back to static strings when `ANTHROPIC_API_KEY` is absent
- **Payments:** LemonSqueezy (webhook-driven plan upgrades)
- **Deployment:** Railway — DB file persisted to `RAILWAY_VOLUME_MOUNT_PATH`, otherwise `./data/buildr.db`

### Database
All schema + migrations live in `src/lib/db.ts → migrate()`. There is no migration runner — the function runs `CREATE TABLE IF NOT EXISTS` and safe `ALTER TABLE` checks on every cold start. Add new columns via the safe-alter pattern already used for `stripe_customer_id`.

Tables: `users`, `goals`, `journal_entries`, `coach_messages`, `user_notifications`, `password_reset_tokens`.

### Auth flow
`src/lib/auth.ts` exports all auth helpers. Every API route calls `getSession(req)` then `requireSession(session)` before touching the DB. Session contains `{ sub (userId), email, name, plan }`. Cookie name: `buildr_session`.

### Plan limits
`src/lib/plan-limits.ts` is the single source of truth for what each plan (`free/pro/premium/elite`) can do. Check limits on every POST/PATCH route that writes user data. Free: 3 active goals, 5 coach messages/day, 3 journal entries/day.

### API routes (`src/app/api/`)
| Route | Methods | Notes |
|---|---|---|
| `/api/auth/*` | POST | signup, signin, signout, me, forgot-password, reset-password |
| `/api/goals` | GET, POST | filter by `?status=` and `?category=` |
| `/api/goals/[id]` | GET, PATCH, DELETE | progress clamped 0–100 server-side; streak is server-only |
| `/api/coach/message` | GET, POST | GET returns history; POST calls Claude with full goal context |
| `/api/analytics` | GET | KPIs derived from live DB data; `weeklyPerformance` is currently hardcoded mock data |
| `/api/journal` | GET, POST |  |
| `/api/journal/[id]` | PATCH, DELETE |  |
| `/api/user` | PATCH | profile + notification prefs |
| `/api/lemonsqueezy/webhook` | POST | upgrades `users.plan` on subscription events |

### Onboarding flow
`/onboarding/*` pages share state via `OnboardingContext` (React context, no persistence). Steps: direction → challenge → situation → time → success → analyzing → breakthrough → plan. Context holds `{ directions[], challenges[], situation, timePerWeek, successGoal, customGoal }`. The breakthrough page derives dynamic AI analysis from this context data — it does **not** call an API.

### Dashboard
`/dashboard/layout.tsx` wraps all dashboard pages. Pages fetch their own data via `useEffect` + `fetch("/api/...")`. No global dashboard state store — each page is self-contained. Pages: overview (`/dashboard`), goals, analytics, coach, journal, settings.

### Key known issues / tech debt
- `weeklyPerformance` in `/api/analytics` returns hardcoded dummy data — needs real per-day aggregation from `goals` + `journal_entries` tables
- Onboarding context is lost on page refresh (no persistence to localStorage or DB)
- The `seedDemoUser()` function in `src/lib/auth.ts` only runs if called explicitly from an API route

### Environment variables
```
AUTH_SECRET          # Required in production (openssl rand -base64 32)
ANTHROPIC_API_KEY    # Optional — coach falls back to static responses without it
LEMONSQUEEZY_*       # Payment webhook verification
RAILWAY_VOLUME_MOUNT_PATH  # Set automatically by Railway
```
