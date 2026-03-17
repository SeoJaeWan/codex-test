$ErrorActionPreference = "Stop"

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptRoot "../..")

& (Join-Path $repoRoot "test/scripts/prepare-workspace.ps1") `
    -Source (Join-Path $scriptRoot "origin-workspace") `
    -Destination (Join-Path $scriptRoot "workspace")
