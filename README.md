# TechBridge Collective — Production Codebase

Neighborhood tech help desks in Durham and Raleigh, NC.
**Launching May 2026** at Durham County Library and City of Raleigh Digital Impact Program.

---

## Stack

- **Next.js 14** (App Router, ISR, Server Components)
- **PostgreSQL + Prisma 5** (8 migrations, fully typed)
- **Clerk** (auth, roles: PUBLIC / PARTNER / NAVIGATOR / ADMIN)
- **Chatbase** (H.K. AI widget with JWT auth)
- **Postmark / Resend** (partner invite emails with delivery tracking)
- **Vercel** (serverless deployment, cron jobs)
- **Recharts** (interactive TechMinutes® dashboard)

---

## Local Setup

```bash
# 1. Clone and install
npm install

# 2. Copy env vars
cp .env.example .env.local
# Fill in: DATABASE_URL, CLERK_*, CHATBASE_*, CRON_SECRET, EMAIL provider

# 3. Run migrations
npx prisma migrate deploy

# 4. Seed hubs (Durham + Raleigh)
npm run db:seed

# 5. Start dev server
npm run dev
```

---

## Key Pages

| Route | Description |
|-------|-------------|
| `/` | Public home — hub schedule, H.K. AI, impact snapshot |
| `/get-help` | Resident intake form + hub finder |
| `/host-a-hub` | Partner request form |
| `/impact` | Public TechMinutes® metrics (ISR 5min) |
| `/about` | Mission, Horace King story, funding |
| `/dashboard` | **Interactive TechMinutes® dashboard** (stakeholder-only, not indexed) |
| `/demo` | Stakeholder landing page → links to /dashboard |
| `/navigator/*` | Navigator portal (role-gated) |
| `/partner/*` | Partner portal (role-gated) |

---

## Interactive Dashboard (`/dashboard`)

Full TechBridgeDashboard client component at `components/dashboard/TechBridgeDashboard.tsx`:

- **30d / 60d / 90d** window selector with animated counter transitions
- **Hub filter** (All / Durham Library / Raleigh Digital)
- **5 tabs:** Overview (bar chart + donut), Categories (table), Trends (line chart + funding pipeline), Sessions (filterable log + export links), H.K. AI (simulated chat)
- Seeded with sample data; live data populates automatically after `npm run db:seed`
- Not indexed by search engines (`robots: disallow`, sitemap excluded)

Share with: Bold Path Fellowship, Durham County Library, City of Raleigh stakeholders, funders

---

## Cron Jobs (Vercel)

| Job | Schedule | Purpose |
|-----|----------|---------|
| `/api/cron/invite-retry` | Every 10 min | Retry failed partner invite emails |
| `/api/cron/prune` | Daily 03:17 UTC | Prune old CronRun records and webhook events |

Both require `Authorization: Bearer ${CRON_SECRET}` header.

---

## Vercel Deployment

```bash
# Connect GitHub repo to Vercel, then set env vars in Vercel dashboard.
# vercel.json handles: buildCommand, crons, function maxDuration.

# Required GitHub Secrets for CI/CD:
# VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID

# Build command (in vercel.json):
# prisma migrate deploy && prisma generate && next build
```

### Required Environment Variables

See `.env.example` for the full list. Minimum to deploy:

```
DATABASE_URL
NEXT_PUBLIC_BASE_URL
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
CHATBASE_SECRET_KEY
NEXT_PUBLIC_CHATBASE_BOT_ID
CRON_SECRET
```

---

## Database Migrations

8 migrations in order:

1. `0001_init` — Core tables (User, HubLocation, HubSchedule, TechMinute, etc.)
2. `0002_partner_multitenant` — PartnerOrganization + PartnerMembership
3. `0003_partner_invites` — PartnerInvite with email tracking fields
4. `0004_email_delivery_tracking` — EmailDeliveryEvent webhook table
5. `0005_techminute_perf_idx` — Performance indexes on TechMinute
6. `0006_cron_health` — CronRun table for job monitoring
7. `0007_optimize_indexes` — Additional composite indexes for cron job queries
8. `0008_fix_schema_indexes` — Schema correction (no-op SQL)

---

## File Structure

```
app/
  page.tsx                  # Home
  dashboard/page.tsx        # Interactive dashboard (stakeholder-only)
  demo/page.tsx             # Stakeholder landing → /dashboard
  get-help/page.tsx
  host-a-hub/page.tsx
  impact/page.tsx
  about/page.tsx
  navigator/                # Role-gated navigator portal
  partner/                  # Role-gated partner portal
  api/                      # 22 API routes

components/
  dashboard/
    TechBridgeDashboard.tsx # Full interactive dashboard (recharts)
  navigator/
    CronStatusBadge.tsx     # Live cron health badge (auto-polls 60s)
    CronHealthWidget.tsx    # Full cron run history table
    InviteTrackingTable.tsx # Partner invite status + retry
    TechMinuteForm.tsx      # Session logging form
  HKOpenButton.tsx          # Chatbase widget trigger
  HKQuickStarts.tsx         # Quick-start prompt buttons
  SiteNav.tsx               # Nav with Dashboard pill link
  Footer.tsx
  ui.tsx                    # Button, Card, Input, Select, Textarea, Label

lib/
  auth/                     # Clerk helpers + role enforcement
  chatbase/                 # JWT signing for Chatbase
  email/                    # Invite sending + delivery tracking
  partner/                  # Partner context + report generation
  db/prisma.ts
  csv.ts
  rateLimit.ts
  time.ts

prisma/
  schema.prisma             # 12 models, 8 enums, full indexes
  seed.ts                   # Durham + Raleigh hub data
  migrations/               # 8 migrations
```

---

## TechMinutes® Trademark

TechMinutes® is a service mark of TechBridge Collective. All session data is non-PII aggregate only — no names, no contact information stored in metrics.

---

*Built with Next.js 14, Prisma 5, Clerk, Chatbase, and Recharts.*
*Bold Path Fellowship seed funding, May 2026 launch.*


## Meeting + launch docs
- docs/MEETING_TOMORROW_RUNBOOK.md
- docs/LAUNCH_CHECKLIST.md
- docs/ENV_VARS.md
