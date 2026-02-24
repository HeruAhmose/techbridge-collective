param([string]$Secret = $env:VERCEL_AUTOMATION_BYPASS_SECRET)
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Get-ProductionUrl {
  $raw = vercel ls --status READY --yes 2>&1 | Out-String
  $lines = $raw -split "`n"
  foreach ($line in $lines) {
    if ($line -match "https://[a-zA-Z0-9\-]+\.vercel\.app" -and $line -match "Production") {
      $m = [regex]::Match($line, "https://[a-zA-Z0-9\-]+\.vercel\.app")
      if ($m.Success) { return $m.Value }
    }
  }
  # Fallback: first URL found anywhere
  foreach ($line in $lines) {
    if ($line -match "https://[a-zA-Z0-9\-]+\.vercel\.app") {
      $m = [regex]::Match($line, "https://[a-zA-Z0-9\-]+\.vercel\.app")
      if ($m.Success) { return $m.Value }
    }
  }
  throw "No Vercel URL found. Run: vercel ls"
}

function Invoke-Check([string]$Url, $Headers, $Session) {
  try { return Invoke-WebRequest -Uri $Url -Headers $Headers -WebSession $Session -MaximumRedirection 5 -SkipHttpErrorCheck -TimeoutSec 20 }
  catch { return $null }
}

function Get-PageTitle([string]$Html) {
  if (-not $Html) { return "" }
  $m = [regex]::Match($Html, "<title[^>]*>([^<]+)</title>", "IgnoreCase")
  if ($m.Success) { return $m.Groups[1].Value.Trim() } else { return "" }
}

$targets = @(
  @{ path="/api/health";  ok=@(200);        label="Health check"      }
  @{ path="/";            ok=@(200);         label="Home page"         }
  @{ path="/get-help";    ok=@(200);         label="Get Help"          }
  @{ path="/host-a-hub";  ok=@(200);         label="Host a Hub"        }
  @{ path="/about";       ok=@(200);         label="About"             }
  @{ path="/impact";      ok=@(200,307,302); label="Impact"            }
  @{ path="/dashboard";   ok=@(200,307,302); label="Dashboard"         }
  @{ path="/sign-in";     ok=@(200,302,307); label="Sign-In"           }
  @{ path="/partner";     ok=@(200,302,307); label="Partner (gated)"   }
  @{ path="/navigator";   ok=@(200,302,307); label="Navigator (gated)" }
)

$BaseUrl = Get-ProductionUrl
Write-Host "`n=== SMOKE TEST — $BaseUrl ===" -ForegroundColor Cyan

$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$headers = @{}
if ($Secret) {
  $headers["x-vercel-protection-bypass"] = $Secret
  $headers["x-vercel-set-bypass-cookie"] = "samesitenone"
  try {
    Invoke-WebRequest -Uri "$BaseUrl/?x-vercel-protection-bypass=$Secret&x-vercel-set-bypass-cookie=samesitenone" `
      -WebSession $session -MaximumRedirection 10 -SkipHttpErrorCheck -TimeoutSec 15 | Out-Null
  } catch {}
}

$pass = 0; $fail = 0
foreach ($t in $targets) {
  $resp  = Invoke-Check "$BaseUrl$($t.path)" $headers $session
  $code  = if ($resp) { [int]$resp.StatusCode } else { -1 }
  $ok    = ($t.ok -contains $code)
  if ($ok) { $pass++ } else { $fail++ }
  $title = if ($resp -and $resp.Content) { $x = Get-PageTitle $resp.Content; if ($x) { "  [$x]" } else { "" } } else { "" }
  $mark  = if ($ok) { "OK " } else { "ERR" }
  $color = if ($ok) { "Green" } else { "Red" }
  Write-Host ("  [$mark] $($code.ToString().PadLeft(3))  $($t.path.PadRight(20)) $($t.label)$title") -ForegroundColor $color
}

Write-Host ""
if ($fail -eq 0) {
  Write-Host "  ALL $pass/$pass PASSED — site is live!" -ForegroundColor Green
} else {
  Write-Host "  $pass passed / $fail FAILED" -ForegroundColor Red
  Write-Host "  Next: Get-Content .\app\layout.tsx | Select-String 'getSignedIn|auth'" -ForegroundColor Yellow
  exit 1
}
