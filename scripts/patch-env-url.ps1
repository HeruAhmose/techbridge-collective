param([string]$Root = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Ensure-BaseUrlHelper {
  $dir = Join-Path $Root "lib\url"
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }

  $file = Join-Path $dir "baseUrl.ts"
  if (Test-Path $file) { return }

@"
import { headers } from "next/headers";
import type { NextRequest } from "next/server";

export function serverBaseUrl(): string {
  const vercel = process.env.VERCEL_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export function serverBaseUrlFromHeaders(): string {
  const h = headers();
  const proto = h.get("x-forwarded-proto") || "https";
  const host = h.get("x-forwarded-host") || h.get("host");
  if (host) return `${proto}://${host}`;
  return serverBaseUrl();
}

export function baseUrlFromRequest(req: NextRequest): string {
  const proto = req.headers.get("x-forwarded-proto") || "https";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (host) return `${proto}://${host}`;
  return serverBaseUrl();
}
"@ | Set-Content -LiteralPath $file -Encoding UTF8
}

function Is-RouteHandler([string]$fullPath) { $fullPath -match '\\app\\api\\.*\\route\.ts$' }
function Has-UseClient([string]$text) { $text -match '^\s*["'']use client["''];' }

function Ensure-Import([string]$text, [string]$importLine) {
  if ($text -match [regex]::Escape($importLine)) { return $text }
  if ($text -match '^\s*["'']use client["''];') {
    return [regex]::Replace($text, '^\s*["'']use client["''];\s*', "`"use client`";`r`n$importLine`r`n")
  }
  return "$importLine`r`n$text"
}

function Patch-File([string]$fullPath) {
  $text = Get-Content -LiteralPath $fullPath -Raw
  if ($text -notmatch 'new URL\(\s*process\.env\.') { return $false }
  if (Has-UseClient $text) { return $false }

  $route = Is-RouteHandler $fullPath
  $text2 = $text

  if ($route) {
    $text2 = [regex]::Replace($text2, 'new URL\(\s*("[^"]+"|''[^'']+'')\s*,\s*process\.env\.[A-Z0-9_]+\s*!?\s*\)', 'new URL($1, baseUrlFromRequest(req))')
    $text2 = [regex]::Replace($text2, 'new URL\(\s*process\.env\.([A-Z0-9_]+)\s*!?\s*\)', 'new URL(baseUrlFromRequest(req))')

    if ($text2 -ne $text) {
      $text2 = Ensure-Import $text2 'import { baseUrlFromRequest } from "@/lib/url/baseUrl";'
      Set-Content -LiteralPath $fullPath -Value $text2 -Encoding UTF8
      return $true
    }
    return $false
  }

  $text2 = [regex]::Replace($text2, 'new URL\(\s*("[^"]+"|''[^'']+'')\s*,\s*process\.env\.[A-Z0-9_]+\s*!?\s*\)', 'new URL($1, serverBaseUrlFromHeaders())')
  $text2 = [regex]::Replace($text2, 'new URL\(\s*process\.env\.([A-Z0-9_]+)\s*!?\s*\)', 'new URL(serverBaseUrlFromHeaders())')

  if ($text2 -ne $text) {
    $text2 = Ensure-Import $text2 'import { serverBaseUrlFromHeaders } from "@/lib/url/baseUrl";'
    Set-Content -LiteralPath $fullPath -Value $text2 -Encoding UTF8
    return $true
  }
  return $false
}

Ensure-BaseUrlHelper

$targets = @(
  (Join-Path $Root "app")
  (Join-Path $Root "lib")
) | Where-Object { Test-Path $_ }

$files = Get-ChildItem -Path $targets -Recurse -File -Include *.ts,*.tsx -ErrorAction SilentlyContinue

$changed = 0
foreach ($f in $files) {
  try { if (Patch-File $f.FullName) { $changed++ } } catch { }
}

Write-Host "Patched files: $changed"
