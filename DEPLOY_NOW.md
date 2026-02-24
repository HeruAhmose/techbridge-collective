# TechBridge Collective — Deploy & Demo Checklist

## 🚀 Deploy in 4 commands

```powershell
# 1. Replace your local files with this zip, then:
git add -A
git commit -m "fix: no-op middleware + Clerk 6.12.0 pin + dashboard + tsx seed"
git push
# Wait ~90 seconds for Vercel to build
```

```powershell
# 2. Verify it's live
$BaseUrl = (vercel ls --status READY --yes 2>&1 | Where-Object { $_ -match "https://.*\.vercel\.app" -and $_ -match "Production" } | ForEach-Object { [regex]::Match($_, "https://[a-zA-Z0-9\-]+\.vercel\.app").Value } | Select-Object -First 1)
curl.exe -i "$BaseUrl/api/health"
# Expect: 200 OK {"ok":true}
```

```powershell
# 3. Seed hubs (use your Neon direct URL — no -pooler in hostname)
pwsh -ExecutionPolicy Bypass -File .\scripts\seed-production.ps1 `
  -DirectDatabaseUrl "postgresql://neondb_owner:PASSWORD@ep-wild-night-ai2mpu44.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

```powershell
# 4. Run full smoke test
pwsh -ExecutionPolicy Bypass -File .\scripts\smoke2.ps1
```

## 🔑 Env vars required in Vercel (all set ✓)
- `DATABASE_URL` — Neon pooler URL
- `DIRECT_URL` — Neon direct URL (add this: same as DATABASE_URL minus `-pooler`)
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL` = `/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL` = `/sign-up`
- `NEXT_PUBLIC_BASE_URL` = `https://techbridgecollective.org`
- `CRON_SECRET`
- `NEXT_PUBLIC_CHATBASE_BOT_ID`

## 📋 Add DIRECT_URL to Vercel
```powershell
vercel env add DIRECT_URL production
# Value: postgresql://neondb_owner:PASSWORD@ep-wild-night-ai2mpu44.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require
# (same as DATABASE_URL but without -pooler in hostname)
```

## 🔄 Post-deploy credential rotation
```powershell
# Rotate Neon password (it appeared in chat)
Start-Process "https://console.neon.tech/app/projects/little-tree-98133525/settings"
# Then: vercel env rm DATABASE_URL --yes && vercel env add DATABASE_URL production
#       vercel env rm DIRECT_URL --yes  && vercel env add DIRECT_URL production
git commit --allow-empty -m "ci: redeploy after credential rotation" && git push
```

## 🎯 Key URLs for demo
| Page | URL |
|------|-----|
| Home | `/` |
| Interactive Dashboard | `/dashboard` |
| TechMinutes® Impact | `/impact` |
| Get Help | `/get-help` |
| Host a Hub | `/host-a-hub` |
| Sign In (Clerk) | `/sign-in` |

## ✅ What was fixed in this package
- **Middleware**: No-op (Clerk 6.36 crashes Vercel Edge Runtime — auth via layouts)
- **Clerk**: Pinned to `6.12.0` (known stable on Vercel)
- **Dashboard**: Added `/dashboard` page + `TechBridgeDashboard` component
- **Seed**: Uses `tsx` (Node 24 compatible), `prisma.seed` config added
- **Schema**: Added `directUrl` for Neon migration compatibility
- **SiteNav**: Dashboard pill with pulse indicator
- **robots.ts**: `/dashboard` excluded from crawlers
