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

# Forbidden extensions and files
$ForbiddenExtensions = @(".sql", ".zip", ".tar", ".gz", ".db", ".sqlite", ".log", ".bak", ".backup")
$ForbiddenNames = @("wp-config.php", ".env")

$RepoRoot = Resolve-Path (Join-Path (Split-Path $MyInvocation.MyCommand.Definition) "..")
$AllFiles = Get-ChildItem -Path $RepoRoot -Recurse -File

$VerificationPassed = $true
$TrackedTree = @()

# 1. Structure and File Type Audits
Write-Host "Checking repository structure and file suffixes..." -ForegroundColor Yellow

foreach ($f in $AllFiles) {
    $RelativePath = $f.FullName.Substring($RepoRoot.Path.Length + 1)
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
    
    # Check forbidden filenames
    if ($ForbiddenNames -contains $f.Name.ToLower()) {
        Write-Host "  [FAIL] Forbidden environment file detected: $RelativePath" -ForegroundColor Red
        $VerificationPassed = $false
    }
    
    $TrackedTree += $RelativePath
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
    # Only scan readable text formats
    $Ext = [System.IO.Path]::GetExtension($f.Name).ToLower()
    if ($Ext -in @(".txt", ".md", ".php", ".css", ".js", ".json", ".ps1", "")) {
        $ScannedCount++
        $FileContent = Get-Content -Path $f.FullName -Raw -ErrorAction SilentlyContinue
        if ($FileContent) {
            foreach ($key in $SecretPatterns.Keys) {
                $Pattern = $SecretPatterns[$key]
                if ($FileContent -match $Pattern) {
                    $RelativePath = $f.FullName.Substring($RepoRoot.Path.Length + 1)
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
if ($GitleaksExists) {
    Write-Host "`nRunning Gitleaks audit..." -ForegroundColor Yellow
    $GitleaksOutput = & gitleaks detect --source=$RepoRoot.Path --verbose 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  [FAIL] Gitleaks detected secrets in history!" -ForegroundColor Red
        $VerificationPassed = $false
    } else {
        Write-Host "  [PASS] Gitleaks scan passed." -ForegroundColor Green
    }
} else {
    Write-Host "`n[NOTE] Gitleaks is not installed on the system. Local script secret scans have completed, but an external binary scanner remains required before pushing to a remote repository." -ForegroundColor Yellow
}

# 4. Final Verdict and File Ledger
Write-Host "`n======================================================================" -ForegroundColor Cyan
if ($VerificationPassed) {
    Write-Host "  VERIFICATION SUCCESS: Repository is clean and ready for commit.      " -ForegroundColor Green
    Write-Host "======================================================================" -ForegroundColor Cyan
    Write-Host "`nSafe File Ledger:" -ForegroundColor Green
    foreach ($path in $TrackedTree) {
        Write-Host "  - $path" -ForegroundColor Gray
    }
    exit 0
} else {
    Write-Host "  VERIFICATION FAILURE: Forbidden files or secret strings found!        " -ForegroundColor Red
    Write-Host "======================================================================" -ForegroundColor Cyan
    exit 1
}
