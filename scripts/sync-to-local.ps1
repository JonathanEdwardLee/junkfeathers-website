<#
.SYNOPSIS
    Guarded sync script for junkfeathers.com standalone repository.
.DESCRIPTION
    Syncs the custom themes/junkfeathers-machine directory from this repository
    to the Local WordPress site wp-content folder. Runs in Dry-Run mode by default.
.PARAMETER Apply
    Switch parameter to actually execute the copy and backup operations.
#>
[CmdletBinding()]
param(
    [switch]$Apply
)

$ErrorActionPreference = "Stop"

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "             JUNKFEATHERS.COM SITE SYNCHRONIZATION                    " -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan

# 1. Load Local Configuration
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$LocalConfigPath = Join-Path $ScriptDir "sync-config.local.ps1"

if (-not (Test-Path $LocalConfigPath)) {
    Write-Error "Configuration file not found: $LocalConfigPath. Please copy sync-config.example.ps1 to sync-config.local.ps1 and set your path."
    exit 1
}

# Source the configuration variables
. $LocalConfigPath

if (-not $LocalWpContentPath) {
    Write-Error "LocalWpContentPath is empty in sync-config.local.ps1."
    exit 1
}

# 2. Check path resolution and safety rules
$WpContentFolder = Get-Item $LocalWpContentPath -ErrorAction SilentlyContinue
if (-not $WpContentFolder) {
    Write-Error "Configured Local wp-content directory does not exist: $LocalWpContentPath"
    exit 1
}

# Confirm directory contains both themes and plugins folders
$ThemesPath = Join-Path $WpContentFolder.FullName "themes"
$PluginsPath = Join-Path $WpContentFolder.FullName "plugins"

if (-not (Test-Path $ThemesPath) -or -not (Test-Path $PluginsPath)) {
    Write-Error "Target directory does not appear to be a valid WordPress wp-content structure (missing 'themes' or 'plugins'): $LocalWpContentPath"
    exit 1
}

# Confirm path safety: Must contain "wp-content" and not point to root directories
if ($WpContentFolder.FullName -notlike "*wp-content*") {
    Write-Error "Path safety guard triggered: Target path must contain 'wp-content' to prevent accidental writes."
    exit 1
}

# Define source and target theme paths
$RepoThemePath = Resolve-Path (Join-Path $ScriptDir "..\themes\junkfeathers-machine")
$LocalThemeTarget = Join-Path $ThemesPath "junkfeathers-machine"

Write-Host "Source theme path: $RepoThemePath"
Write-Host "Destination path : $LocalThemeTarget"

# Verify source contains stylesheet with correct metadata
$SourceStyleCss = Join-Path $RepoThemePath "style.css"
if (-not (Test-Path $SourceStyleCss)) {
    Write-Error "Source child theme stylesheet not found at: $SourceStyleCss"
    exit 1
}

$StyleContent = Get-Content -Path $SourceStyleCss -Raw
if ($StyleContent -notlike "*Theme Name: Junkfeathers Machine*") {
    Write-Error "Source stylesheet at $SourceStyleCss does not contain 'Theme Name: Junkfeathers Machine'."
    exit 1
}

# 3. Dry-Run Verification and Comparison
Write-Host "`n--- Dry Run: Comparing Files ---" -ForegroundColor Yellow

$RepoFiles = Get-ChildItem -Path $RepoThemePath -Recurse -File
$LocalFiles = Get-ChildItem -Path $LocalThemeTarget -Recurse -File -ErrorAction SilentlyContinue

$FilesToCopy = @()
$ExtraLocalFiles = @()

foreach ($rf in $RepoFiles) {
    $RelativePath = $rf.FullName.Substring($RepoThemePath.FullName.Length + 1)
    $TargetFile = Join-Path $LocalThemeTarget $RelativePath
    
    if (-not (Test-Path $TargetFile)) {
        Write-Host "  [NEW] $RelativePath -> Will copy (File does not exist locally)" -ForegroundColor Green
        $FilesToCopy += $rf
    } else {
        # Check if contents differ
        $rfHash = (Get-FileHash $rf.FullName).Hash
        $lfHash = (Get-FileHash $TargetFile).Hash
        if ($rfHash -ne $lfHash) {
            Write-Host "  [MODIFIED] $RelativePath -> Will update (Contents differ)" -ForegroundColor Yellow
            $FilesToCopy += $rf
        } else {
            Write-Host "  [UNMODIFIED] $RelativePath -> Identical" -ForegroundColor Gray
        }
    }
}

foreach ($lf in $LocalFiles) {
    $RelativePath = $lf.FullName.Substring((Get-Item $LocalThemeTarget).FullName.Length + 1)
    $SourceFile = Join-Path $RepoThemePath $RelativePath
    if (-not (Test-Path $SourceFile)) {
        Write-Host "  [EXTRA LOCAL] $RelativePath -> Exists locally but not in repository. (Will NOT delete)" -ForegroundColor Magenta
        $ExtraLocalFiles += $lf
    }
}

if ($FilesToCopy.Count -eq 0) {
    Write-Host "`nNo files need to be synchronized." -ForegroundColor Green
} else {
    Write-Host "`nPending changes count: $($FilesToCopy.Count) file(s)" -ForegroundColor Yellow
}

# 4. Action Phase (If -Apply switch is active)
if ($Apply) {
    Write-Host "`nApplying changes..." -ForegroundColor Green
    
    # Create Local backup before applied sync
    if (Test-Path $LocalThemeTarget) {
        $Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
        # Place backup outside the Git repository
        $BackupRoot = Join-Path (Split-Path $WpContentFolder.FullName) "junkfeathers_backups"
        $BackupTarget = Join-Path $BackupRoot "theme_backup_$Timestamp"
        
        New-Item -ItemType Directory -Path $BackupTarget -Force | Out-Null
        Write-Host "Backing up existing Local theme: $LocalThemeTarget -> $BackupTarget" -ForegroundColor Yellow
        Copy-Item -Path "$LocalThemeTarget\*" -Destination $BackupTarget -Recurse -Force
    }
    
    # Execute the copy operation
    foreach ($f in $RepoFiles) {
        $RelativePath = $f.FullName.Substring($RepoThemePath.FullName.Length + 1)
        $TargetFile = Join-Path $LocalThemeTarget $RelativePath
        $TargetFolder = Split-Path $TargetFile
        
        if (-not (Test-Path $TargetFolder)) {
            New-Item -ItemType Directory -Path $TargetFolder -Force | Out-Null
        }
        
        Copy-Item -Path $f.FullName -Destination $TargetFile -Force
        Write-Host "Copied: $RelativePath -> $TargetFile" -ForegroundColor Green
    }
    Write-Host "`nSynchronization complete!" -ForegroundColor Green
} else {
    Write-Host "`nDry run complete. Use '.\scripts\sync-to-local.ps1 -Apply' to write these changes." -ForegroundColor Yellow
}

Write-Host "======================================================================" -ForegroundColor Cyan
