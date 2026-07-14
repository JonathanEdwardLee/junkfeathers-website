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
$RepoRoot = Get-Item (Join-Path $ScriptDir "..")
$LocalConfigPath = Join-Path $ScriptDir "sync-config.local.ps1"

if (-not (Test-Path $LocalConfigPath)) {
    Write-Error "Configuration file not found: $LocalConfigPath. Please copy sync-config.example.ps1 to sync-config.local.ps1 and configure your local paths."
    exit 1
}

# Source the configuration variables
. $LocalConfigPath

# 2. Path Safety Checks on Configurations
if (-not $LocalSiteRootPath) {
    Write-Error "LocalSiteRootPath is empty in sync-config.local.ps1."
    exit 1
}
if (-not $LocalBackupRootPath) {
    Write-Error "LocalBackupRootPath is empty in sync-config.local.ps1."
    exit 1
}

# Resolve target root
$SiteRoot = Get-Item $LocalSiteRootPath -ErrorAction SilentlyContinue
if (-not $SiteRoot) {
    Write-Error "Configured Local site root path does not exist: $LocalSiteRootPath"
    exit 1
}

$BackupRoot = Get-Item $LocalBackupRootPath -ErrorAction SilentlyContinue
if (-not $BackupRoot -and $Apply) {
    # If Apply is true, try to create the backup directory
    try {
        New-Item -ItemType Directory -Path $LocalBackupRootPath -Force | Out-Null
        $BackupRoot = Get-Item $LocalBackupRootPath
    } catch {
        Write-Error "Failed to create backup root directory at: $LocalBackupRootPath"
        exit 1
    }
}

# 3. Derive and verify expected WordPress layout paths
$PublicRoot = Join-Path $SiteRoot.FullName "app\public"
$WpAdmin = Join-Path $PublicRoot "wp-admin"
$WpIncludes = Join-Path $PublicRoot "wp-includes"
$WpContent = Join-Path $PublicRoot "wp-content"
$ThemesPath = Join-Path $WpContent "themes"
$PluginsPath = Join-Path $WpContent "plugins"
$LocalThemeTarget = Join-Path $ThemesPath "junkfeathers-machine"

Write-Host "Verifying target WordPress folder structure..." -ForegroundColor Yellow
$RequiredPaths = @($PublicRoot, $WpAdmin, $WpIncludes, $WpContent, $ThemesPath, $PluginsPath)
foreach ($p in $RequiredPaths) {
    if (-not (Test-Path $p)) {
        Write-Error "Required WordPress structure missing: $p"
        exit 1
    }
}

# 4. Strict Safety Guardrails
# Guard: Do not write directly to the Git repository itself
if ($LocalThemeTarget -like "$($RepoRoot.FullName)*") {
    Write-Error "Path Safety Guard: Target resolves inside the repository root! ($LocalThemeTarget)"
    exit 1
}

# Guard: Do not target drive roots (e.g. C:\)
if ($LocalThemeTarget -match '^[a-zA-Z]:\\?$') {
    Write-Error "Path Safety Guard: Target cannot be a drive root directory."
    exit 1
}

# Guard: Do not target user profile roots (e.g. C:\Users\username)
$UserProfile = [System.Environment]::GetFolderPath([System.Environment+SpecialFolder]::UserProfile)
if ($LocalThemeTarget -eq $UserProfile) {
    Write-Error "Path Safety Guard: Target cannot be the user profile root."
    exit 1
}

# Guard: Target must exactly resolve to wp-content\themes\junkfeathers-machine
$ExpectedSubPath = "app\public\wp-content\themes\junkfeathers-machine"
if (-not $LocalThemeTarget.EndsWith($ExpectedSubPath, [System.StringComparison]::OrdinalIgnoreCase)) {
    Write-Error "Path Safety Guard: Target does not resolve exactly to ...\$ExpectedSubPath. Actual: $LocalThemeTarget"
    exit 1
}

# Verify Source theme style sheet metadata
$RepoThemePath = Get-Item (Join-Path $RepoRoot.FullName "themes\junkfeathers-machine")
$SourceStyleCss = Join-Path $RepoThemePath.FullName "style.css"
if (-not (Test-Path $SourceStyleCss)) {
    Write-Error "Source child theme stylesheet not found at: $SourceStyleCss"
    exit 1
}

$StyleContent = Get-Content -Path $SourceStyleCss -Raw
if ($StyleContent -notlike "*Theme Name: Junkfeathers Machine*" -or $StyleContent -notlike "*Template: generatepress*") {
    Write-Error "Source stylesheet metadata validation failed. Must contain 'Theme Name: Junkfeathers Machine' and 'Template: generatepress'."
    exit 1
}

# Guard: Backup path verification (must be outside repo, local site, app, and wp-content)
if ($Apply) {
    $ForbiddenLocations = @($RepoRoot.FullName, $SiteRoot.FullName, $PublicRoot, $WpContent)
    foreach ($fl in $ForbiddenLocations) {
        if ($BackupRoot.FullName -like "$fl*") {
            Write-Error "Backup Safety Guard: Backup root resolves inside forbidden path: $fl"
            exit 1
        }
    }
}

# Print resolved paths
Write-Host "Source Path      : $($RepoThemePath.FullName)" -ForegroundColor Gray
Write-Host "Destination Path : $LocalThemeTarget" -ForegroundColor Gray
if ($Apply) {
    Write-Host "Backup Path      : $($BackupRoot.FullName)" -ForegroundColor Gray
}

# 5. Dry-Run Comparison
Write-Host "`nComparing repository files with Local target..." -ForegroundColor Yellow

$RepoFiles = Get-ChildItem -Path $RepoThemePath.FullName -Recurse -File
$LocalFiles = Get-ChildItem -Path $LocalThemeTarget -Recurse -File -ErrorAction SilentlyContinue

$FilesToCopy = @()
$ExtraLocalFiles = @()

foreach ($rf in $RepoFiles) {
    $RelativePath = $rf.FullName.Substring($RepoThemePath.FullName.Length + 1)
    $TargetFile = Join-Path $LocalThemeTarget $RelativePath

    if (-not (Test-Path $TargetFile)) {
        Write-Host "  [NEW] $RelativePath -> Will copy (does not exist locally)" -ForegroundColor Green
        $FilesToCopy += $rf
    } else {
        $rfHash = (Get-FileHash $rf.FullName).Hash
        $lfHash = (Get-FileHash $TargetFile).Hash
        if ($rfHash -ne $lfHash) {
            Write-Host "  [MODIFIED] $RelativePath -> Will update (content differs)" -ForegroundColor Yellow
            $FilesToCopy += $rf
        } else {
            Write-Host "  [IDENTICAL] $RelativePath" -ForegroundColor Gray
        }
    }
}

foreach ($lf in $LocalFiles) {
    $RelativePath = $lf.FullName.Substring((Get-Item $LocalThemeTarget).FullName.Length + 1)
    $SourceFile = Join-Path $RepoThemePath.FullName $RelativePath
    if (-not (Test-Path $SourceFile)) {
        Write-Host "  [EXTRA LOCAL] $RelativePath -> Exists locally but not in repository (will NOT delete)" -ForegroundColor Magenta
        $ExtraLocalFiles += $lf
    }
}

# 6. Apply Execution Block
if ($Apply) {
    if ($FilesToCopy.Count -eq 0) {
        Write-Host "`nNo changes detected. Sync skipped." -ForegroundColor Green
        exit 0
    }

    Write-Host "`nExecuting safe backup..." -ForegroundColor Yellow
    $Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $BackupTarget = Join-Path $BackupRoot.FullName "theme_backup_$Timestamp"

    try {
        if (Test-Path $LocalThemeTarget) {
            New-Item -ItemType Directory -Path $BackupTarget -Force | Out-Null
            Copy-Item -Path "$LocalThemeTarget\*" -Destination $BackupTarget -Recurse -Force
            Write-Host "Backup created: $BackupTarget" -ForegroundColor Green
        }
    } catch {
        Write-Error "Backup creation failed: $_"
        exit 1
    }

    Write-Host "`nCopying theme files..." -ForegroundColor Yellow
    try {
        foreach ($f in $FilesToCopy) {
            $RelativePath = $f.FullName.Substring($RepoThemePath.FullName.Length + 1)
            $TargetFile = Join-Path $LocalThemeTarget $RelativePath
            $TargetFolder = Split-Path $TargetFile

            if (-not (Test-Path $TargetFolder)) {
                New-Item -ItemType Directory -Path $TargetFolder -Force | Out-Null
            }

            Copy-Item -Path $f.FullName -Destination $TargetFile -Force
            Write-Host "  Synced: $RelativePath" -ForegroundColor Green
        }
        Write-Host "`nSync completed successfully!" -ForegroundColor Green
    } catch {
        Write-Error "Sync copy failed: $_"
        exit 1
    }
} else {
    Write-Host "`n[DRY RUN COMPLETE] Use '.\scripts\sync-to-local.ps1 -Apply' to apply these changes." -ForegroundColor Yellow
}

Write-Host "======================================================================" -ForegroundColor Cyan
exit 0
