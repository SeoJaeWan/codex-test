param(
    [Parameter(Mandatory = $true)]
    [string]$Source,

    [Parameter(Mandatory = $true)]
    [string]$Destination
)

$ErrorActionPreference = "Stop"

$resolvedSource = (Resolve-Path $Source).Path
$destinationPath = [System.IO.Path]::GetFullPath($Destination)
$destinationParent = Split-Path -Parent $destinationPath

if (-not (Test-Path $resolvedSource -PathType Container)) {
    throw "Source directory does not exist: $Source"
}

if ([string]::IsNullOrWhiteSpace($destinationParent)) {
    throw "Destination parent directory could not be resolved: $Destination"
}

if (-not (Test-Path $destinationParent -PathType Container)) {
    New-Item -ItemType Directory -Path $destinationParent -Force | Out-Null
}

if (Test-Path $destinationPath) {
    Remove-Item $destinationPath -Recurse -Force
}

Copy-Item -Path $resolvedSource -Destination $destinationPath -Recurse -Force
