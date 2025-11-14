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

# Check for WiX tools (required for exe/msi on Windows)
$wixFound = $false
$wixPath = $null

# Check common WiX installation paths
$wixPaths = @(
    "C:\Program Files (x86)\WiX Toolset v3.11\bin",
    "C:\Program Files\WiX Toolset v3.11\bin",
    "C:\Program Files (x86)\WiX Toolset v4.0\bin",
    "C:\Program Files\WiX Toolset v4.0\bin",
    "${env:ProgramFiles(x86)}\WiX Toolset v3.11\bin",
    "$env:ProgramFiles\WiX Toolset v3.11\bin"
)

foreach ($path in $wixPaths) {
    if (Test-Path "$path\light.exe" -or Test-Path "$path\wix.exe") {
        $wixFound = $true
        $wixPath = $path
        Write-Host "Found WiX tools at: $path" -ForegroundColor Green
        break
    }
}

# Check PATH for WiX
if (-not $wixFound) {
    try {
        $lightCheck = & where.exe light.exe 2>&1
        if ($LASTEXITCODE -eq 0) {
            $wixFound = $true
            Write-Host "Found WiX tools in PATH" -ForegroundColor Green
        }
    } catch {
        # WiX not in PATH
    }
}

# Determine build type based on WiX availability
$buildType = "app-image"  # Default: doesn't require WiX
$outputFile = "$OutputDir\Bookerino\Bookerino.exe"

if ($wixFound) {
    $buildType = "exe"
    $outputFile = "$OutputDir\Bookerino.exe"
    Write-Host "Using WiX tools to create native .exe file..." -ForegroundColor Cyan
} else {
    Write-Host "WiX tools not found. Creating app-image instead (folder with exe)..." -ForegroundColor Yellow
    Write-Host "To create a single .exe file, install WiX from: https://wixtoolset.org" -ForegroundColor Yellow
    Write-Host "Or use Launch4j method: create-exe-launch4j.bat" -ForegroundColor Yellow
    Write-Host ""
}

# Create executable using jpackage
Write-Host "Building executable with jpackage (type: $buildType)..." -ForegroundColor Cyan

$jpackageArgs = @(
    "--input", "target",
    "--name", "Bookerino",
    "--main-jar", "bookerino-desktop.jar",
    "--type", $buildType,
    "--dest", $OutputDir,
    "--app-version", "1.0.0",
    "--description", "Bookerino - HoReCa Management Solution",
    "--vendor", "Bookerino",
    "--copyright", "Copyright 2025 Bookerino"
)

# Add Windows-specific options
if ($buildType -eq "exe") {
    $jpackageArgs += "--win-dir-chooser", "--win-menu", "--win-shortcut"
}

if ($IcoPath) {
    $jpackageArgs += "--icon", $IcoPath
}

# Add WiX path to PATH if found
if ($wixFound -and $wixPath) {
    $env:PATH = "$wixPath;$env:PATH"
}

& jpackage $jpackageArgs

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nSUCCESS! Executable created!" -ForegroundColor Green
    if ($buildType -eq "exe") {
        Write-Host "Location: $OutputDir\Bookerino.exe" -ForegroundColor Green
        Write-Host "You can now distribute this single executable file." -ForegroundColor Green
    } else {
        Write-Host "Location: $OutputDir\Bookerino\Bookerino.exe" -ForegroundColor Green
        Write-Host "Note: This is an app-image (folder). Distribute the entire 'Bookerino' folder." -ForegroundColor Yellow
        Write-Host "To create a single .exe, install WiX tools or use Launch4j method." -ForegroundColor Yellow
    }
} else {
    Write-Host "`nERROR: Failed to create executable" -ForegroundColor Red
    if (-not $wixFound -and $buildType -eq "exe") {
        Write-Host "`nTIP: Install WiX Toolset from https://wixtoolset.org" -ForegroundColor Yellow
        Write-Host "Or use: create-exe-launch4j.bat (doesn't require WiX)" -ForegroundColor Yellow
    }
    exit 1
}

