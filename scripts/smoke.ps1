param([string]$BaseUrl="")

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function LatestPreviewUrl {
  (vercel ls --status READY --yes |
    Select-String -AllMatches "https://[^ ]+\.vercel\.app" |
    ForEach-Object { $_.Matches } |
    Select-Object -First 1).Value
}

if (-not $BaseUrl) { $BaseUrl = LatestPreviewUrl }
Write-Host "BaseUrl: $BaseUrl"

$secret = $env:VERCEL_AUTOMATION_BYPASS_SECRET
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession

function TryRequest([string]$url) {
  $headers = @{}
  if ($secret) {
    $headers["x-vercel-protection-bypass"] = $secret
    $headers["x-vercel-set-bypass-cookie"] = "true"
  }

  try {
    $resp = Invoke-WebRequest -Uri $url -Headers $headers -WebSession $session -Method GET -MaximumRedirection 2 -SkipHttpErrorCheck
    return [pscustomobject]@{ Code = [int]$resp.StatusCode; Ok = $true; Error = "" }
  } catch {
    $e = $_.Exception
    # If it's a redirect loop or other transport error, code may be unknown
    return [pscustomobject]@{ Code = -1; Ok = $false; Error = $e.Message }
  }
}

# Bootstrap bypass via query param (cookie set), so later requests can work without special headers too
if ($secret) {
  $bootstrap = "$BaseUrl/?x-vercel-protection-bypass=$secret&x-vercel-set-bypass-cookie=true"
  [void](TryRequest $bootstrap)
} else {
  Write-Host "Hint: set `$env:VERCEL_AUTOMATION_BYPASS_SECRET (Deployment Protection Automation secret) to avoid 401."
}

Start-Process $BaseUrl

$checks = @(
  @{ path="/api/health";        ok=@(200)      }
  @{ path="/impact/dashboard";  ok=@(200)      }
  @{ path="/sign-in";           ok=@(200,302)  }
  @{ path="/partner";           ok=@(200,302)  }
)

foreach ($c in $checks) {
  $url = "$BaseUrl$($c.path)"
  $r = TryRequest $url

  $ok = ($c.ok -contains $r.Code)
  $mark = if ($ok) { "✅" } else { "❌" }

  if ($r.Code -eq -1) {
    Write-Host "$mark ERR $($c.path) — $($r.Error)"
  } else {
    Write-Host "$mark $($r.Code) $($c.path)"
  }

  if (($r.Code -eq 401 -or $r.Code -eq -1) -and -not $secret) {
    Write-Host "   ↳ Hint: likely Deployment Protection. Set `$env:VERCEL_AUTOMATION_BYPASS_SECRET and rerun."
  }
}
