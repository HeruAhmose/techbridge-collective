# TechBridge Collective — Meeting Runbook (Tomorrow)

## 5-minute setup before the meeting
- Confirm staging URL loads:
  - `/` (home)
  - `/get-help` (resident intake)
  - `/host-a-hub` (partner pitch)
  - `/impact` (public metrics)
  - `/impact/dashboard` (fullscreen dashboard)
  - `/partner` (partner dashboard, requires login)
  - `/navigator/admin/partners` (admin tools, cron health, invite tracking)

- Sanity checks:
  - Chatbase widget loads + HK button opens chat
  - `/api/health` returns `{ ok: true }`
  - Impact dashboard loads and renders charts (no console errors)

## Demo agenda (20–25 min)
1) Problem + model (2 min)
2) Resident flow (4 min)
3) Partner “Host a Hub” flow (4 min)
4) Impact proof (6 min)
5) Navigator portal & logging (6 min)
6) Next steps (2 min)

## Narrative (what to say)
- “We provide tech help in trusted neighborhood hubs, track TechMinutes®, and deliver monthly reporting partners can use.”
- “HK AI triages quickly and escalates cleanly to a Navigator or hub hours.”
- “Our reporting is non‑PII and grant-ready.”

## Demo script (short)
- Open Home → click **Get Help**
- Show hub hours + submit a sample request
- Click **Host a Hub** → show pilot packages + submit partner request
- Open **TechMinutes Impact** → show dashboard and categories/outcomes
- Log in to Navigator portal → create one TechMinutes log
- Open Partner dashboard → download PDF/CSV + bulk ZIP

## FAQ answers (one-liners)
- Data privacy: “No passwords, SSNs, or banking info. Metrics are aggregate only.”
- Partner value: “Monthly rollups + needs insights + referrals and barrier reduction outcomes.”
- Scale: “Add hubs by adding schedules and Navigators; reporting scales automatically.”
