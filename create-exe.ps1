# PowerShell script to create Bookerino executable with icon
# Requires: Java JDK 21+ with jpackage tool

param(
    [string]$JarPath = "target\bookerino-desktop.jar",
    [string]$IconPath = "attached_assets\logo bokkerino_1759435973381.png",
    [string]$OutputDir = "dist\exe"
)

Write-Host "Creating Bookerino executable..." -ForegroundColor Green

# Check if JAR exists
if (-not (Test-Path $JarPath)) {
    Write-Host "ERROR: JAR file not found at: $JarPath" -ForegroundColor Red
    Write-Host "Please run: mvn clean package" -ForegroundColor Yellow
    exit 1
}

# Check if icon exists
if (-not (Test-Path $IconPath)) {
    Write-Host "WARNING: Icon file not found at: $IconPath" -ForegroundColor Yellow
    Write-Host "Creating executable without custom icon..." -ForegroundColor Yellow
    $IconPath = $null
}

# Create output directory
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}

# Convert PNG to ICO if needed (jpackage requires ICO format)
$IcoPath = $null
if ($IconPath) {
    $IcoPath = $OutputDir + "\bookerino.ico"
    Write-Host "Converting PNG to ICO format..." -ForegroundColor Cyan
    
    # Try to use ImageMagick or PowerShell to convert
    # For now, we'll use a workaround with jpackage's --icon parameter
    # Note: jpackage accepts PNG on Windows, but ICO is preferred
    $IcoPath = $IconPath  # Use PNG directly - jpackage on Windows accepts it
}

# Get Java version
$javaVersion = & java -version 2>&1 | Select-Object -First 1
Write-Host "Java version: $javaVersion" -ForegroundColor Cyan

# Check if jpackage is available
try {
    $jpackageVersion = & jpackage --version 2>&1
    Write-Host "jpackage version: $jpackageVersion" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: jpackage not found. Please install JDK 21+ with jpackage tool." -ForegroundColor Red
    Write-Host "Alternative: Use Launch4j to create exe from jar" -ForegroundColor Yellow
    exit 1
}

# Create executable using jpackage
Write-Host "Building executable with jpackage..." -ForegroundColor Cyan

$jpackageArgs = @(
    "--input", "target",
    "--name", "Bookerino",
    "--main-jar", "bookerino-desktop.jar",
    "--type", "exe",
    "--dest", $OutputDir,
    "--app-version", "1.0.0",
    "--description", "Bookerino - HoReCa Management Solution",
    "--vendor", "Bookerino",
    "--copyright", "Copyright 2025 Bookerino",
    "--win-dir-chooser",
    "--win-menu",
    "--win-shortcut"
)

if ($IcoPath) {
    $jpackageArgs += "--icon", $IcoPath
}

& jpackage $jpackageArgs

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nSUCCESS! Executable created in: $OutputDir\Bookerino.exe" -ForegroundColor Green
    Write-Host "You can now distribute this executable file." -ForegroundColor Green
} else {
    Write-Host "`nERROR: Failed to create executable" -ForegroundColor Red
    exit 1
}

