# Production Launch Checklist

## Platform
- [ ] Vercel project created and connected to GitHub
- [ ] Managed Postgres (Neon) connected
- [ ] Environment variables set in Vercel (see `docs/ENV_VARS.md`)
- [ ] `prisma migrate deploy` succeeds during build
- [ ] Cron jobs enabled (invite-retry + prune)

## Security
- [ ] `CRON_SECRET` set
- [ ] Clerk keys set and domains allowed
- [ ] Admin emails set (ADMIN_EMAILS)
- [ ] Chatbase identity secret set (CHATBOT_IDENTITY_SECRET)

## Observability
- [ ] Invite tracking shows SENT/DELIVERED/FAILED
- [ ] Webhooks configured:
  - [ ] Resend `/api/webhooks/resend` + secret
  - [ ] Postmark `/api/webhooks/postmark` + basic auth
- [ ] Cron health shows SUCCESS recently

## QA
- [ ] Lighthouse mobile pass (target: 90+ Performance/Best Practices)
- [ ] Playwright smoke test passes
- [ ] Intake forms save successfully
- [ ] Partner exports download
