# Seed Durham + Raleigh hubs into production Neon DB
# Usage: pwsh -ExecutionPolicy Bypass -File .\scripts\seed-production.ps1 -DirectDatabaseUrl "postgresql://..."
# Get DirectDatabaseUrl from: https://console.neon.tech -> Connection Details -> uncheck "Connection pooling"

param([Parameter(Mandatory=$true)][string]$DirectDatabaseUrl)

$env:DATABASE_URL = $DirectDatabaseUrl
Write-Host "Running migrations..." -ForegroundColor Cyan
npx prisma migrate deploy
if ($LASTEXITCODE -ne 0) { Write-Host "Migrations FAILED" -ForegroundColor Red; exit 1 }

Write-Host "Seeding hubs..." -ForegroundColor Cyan
npx tsx prisma/seed.ts
if ($LASTEXITCODE -ne 0) { Write-Host "Seed FAILED" -ForegroundColor Red; exit 1 }

Write-Host "SUCCESS — Durham Library + Raleigh Digital Impact hubs are live." -ForegroundColor Green
