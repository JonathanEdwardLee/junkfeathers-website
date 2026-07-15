# ==============================================================================
# JUNKFEATHERS.COM - REPOSITORY VERIFICATION & SECRET SCANNING SCRIPT
# ==============================================================================
$ErrorActionPreference = "Stop"

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "             JUNKFEATHERS REPOSITORY SECURITY CHECK                   " -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan

# Define allowed root files and directories
$AllowedRootPaths = @(
    ".gitignore",
    ".gitattributes",
    "README.md",
    "WELCOME_AG.md",
    "CHANGELOG.md",
    "docs",
    "scripts",
    "themes",
    "plugins"
)

# Forbidden extensions and files (including keys, credentials, and backups)
$ForbiddenExtensions = @(
    ".sql", ".zip", ".tar", ".gz", ".db", ".sqlite", ".log", ".bak", ".backup",
    ".pem", ".key", ".p12", ".pfx", ".crt", ".cer", ".jks"
)
$ForbiddenNames = @(
    "wp-config.php", ".env", "credentials.json", ".env.local", "sync-config.local.ps1"
)

$RepoRoot = Resolve-Path (Join-Path (Split-Path $MyInvocation.MyCommand.Definition) "..")
$AllFiles = Get-ChildItem -Path $RepoRoot -Recurse -File

$VerificationPassed = $true
$TrackedTree = @()

# 1. Structure and File Type Audits
Write-Host "Checking repository structure and file suffixes..." -ForegroundColor Yellow

foreach ($f in $AllFiles) {
    $RelativePath = $f.FullName.Substring($RepoRoot.Path.Length + 1)

    # Skip checking git metadata folder
    if ($RelativePath -like ".git\*") {
        continue
    }

    $RootFolder = ($RelativePath -split "\\")[0]

    # Check root structures
    if ($AllowedRootPaths -notcontains $RootFolder -and $AllowedRootPaths -notcontains $RelativePath) {
        Write-Host "  [FAIL] Unrecognized root file/folder detected: $RelativePath" -ForegroundColor Red
        $VerificationPassed = $false
    }

    # Check forbidden extensions
    $Ext = [System.IO.Path]::GetExtension($f.Name).ToLower()
    if ($ForbiddenExtensions -contains $Ext) {
        Write-Host "  [FAIL] Forbidden file type extension detected: $RelativePath ($Ext)" -ForegroundColor Red
        $VerificationPassed = $false
    }

    # Check forbidden filenames (e.g. credentials.json, sync-config.local.ps1)
    if ($ForbiddenNames -contains $f.Name.ToLower()) {
        # Check if the file is tracked in Git or just present
        $IsTracked = & git -C $RepoRoot.Path ls-files $RelativePath 2>$null
        if ($IsTracked) {
            Write-Host "  [FAIL] Forbidden file is tracked in Git: $RelativePath" -ForegroundColor Red
            $VerificationPassed = $false
        } else {
            # File exists but is ignored (like sync-config.local.ps1)
            Write-Host "  [INFO] Ignored local file present but not tracked: $RelativePath" -ForegroundColor Gray
        }
    }

    # Check forbidden subscriber data export patterns
    if (($RelativePath -like "private-data\*") -or
        ($RelativePath -like "exports\subscribers\*") -or
        (($f.Name.ToLower() -like "*subscriber-export*.csv") -or
         ($f.Name.ToLower() -like "*contact-export*.csv") -or
         ($f.Name.ToLower() -like "*reach-export*.csv"))) {

        # Check if the file is tracked in Git
        $IsTracked = & git -C $RepoRoot.Path ls-files $RelativePath 2>$null
        if ($IsTracked) {
            Write-Host "  [FAIL] Forbidden subscriber export is tracked in Git: $RelativePath" -ForegroundColor Red
            $VerificationPassed = $false
        } else {
            Write-Host "  [INFO] Ignored subscriber data export present locally: $RelativePath" -ForegroundColor Gray
        }
    }


    # Only collect tracked/intended files for the ledger
    $IsGitTracked = & git -C $RepoRoot.Path ls-files $RelativePath 2>$null
    if ($IsGitTracked) {
        $TrackedTree += $RelativePath
    }
}

# 2. Secret Scanning (Text Search for Keys/Credentials)
Write-Host "`nScanning text files for credentials, salts, and secrets..." -ForegroundColor Yellow

# Common secret regex patterns using single quotes
$SecretPatterns = @{
    'DatabasePassword' = 'DB_PASSWORD\s*,\s*[''"].+[''"]'
    'WordPressSalt'    = 'define\(\s*[''"](AUTH_KEY|SECURE_AUTH_KEY|LOGGED_IN_KEY|NONCE_KEY|AUTH_SALT|SECURE_AUTH_SALT|LOGGED_IN_SALT|NONCE_SALT)[''"].+[''"]'
    'GenericPassword'  = 'password\s*=\s*[''"].+[''"]'
    'PrivatePEM'       = '-----BEGIN (RSA |EC |dsa |)?PRIVATE KEY-----'
    'APIKey'           = 'api_key\s*=\s*[''"].+[''"]'
}

$ScannedCount = 0
foreach ($f in $AllFiles) {
    $RelativePath = $f.FullName.Substring($RepoRoot.Path.Length + 1)
    if ($RelativePath -like ".git\*") {
        continue
    }

    # Only scan readable text formats
    $Ext = [System.IO.Path]::GetExtension($f.Name).ToLower()
    if ($Ext -in @(".txt", ".md", ".php", ".css", ".js", ".json", ".ps1", "")) {
        $ScannedCount++
        $FileContent = Get-Content -Path $f.FullName -Raw -ErrorAction SilentlyContinue
        if ($FileContent) {
            foreach ($key in $SecretPatterns.Keys) {
                $Pattern = $SecretPatterns[$key]
                if ($FileContent -match $Pattern) {
                    Write-Host "  [FAIL] Secret leak pattern matched ($key) in file: $RelativePath" -ForegroundColor Red
                    $VerificationPassed = $false
                }
            }
        }
    }
}
Write-Host "Scanned $ScannedCount text-based files." -ForegroundColor Gray

# 3. External Secret Scan Verification
$GitleaksExists = Get-Command gitleaks -ErrorAction SilentlyContinue
$GitleaksPassed = $false

if ($GitleaksExists) {
    Write-Host "`nRunning Gitleaks audit..." -ForegroundColor Yellow
    $GitleaksOutput = & gitleaks detect --source=$RepoRoot.Path --verbose 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  [FAIL] Gitleaks detected secrets in history!" -ForegroundColor Red
        $VerificationPassed = $false
    } else {
        Write-Host "  [PASS] Gitleaks scan passed." -ForegroundColor Green
        $GitleaksPassed = $true
    }
}

# 4. Final Verdict and File Ledger
Write-Host "`n======================================================================" -ForegroundColor Cyan
if ($VerificationPassed) {
    if (-not $GitleaksExists) {
        Write-Host "  VERIFICATION RESULT: Passes built-in local checks.                  " -ForegroundColor Green
        Write-Host "  [WARNING] Remote publication remains BLOCKED pending an external     " -ForegroundColor Yellow
        Write-Host "            secret scan (Gitleaks is currently not installed).        " -ForegroundColor Yellow
    } else {
        Write-Host "  VERIFICATION SUCCESS: Repository passes all checks.                 " -ForegroundColor Green
    }
    Write-Host "======================================================================" -ForegroundColor Cyan
    Write-Host "`nStaged/Tracked File Ledger:" -ForegroundColor Green
    foreach ($path in $TrackedTree) {
        Write-Host "  - $path" -ForegroundColor Gray
    }
    exit 0
} else {
    Write-Host "  VERIFICATION FAILURE: Forbidden files or secret strings found!        " -ForegroundColor Red
    Write-Host "======================================================================" -ForegroundColor Cyan
    exit 1
}
