# Automated build script to compile and update Bookerino.exe
# This script will be run automatically whenever changes are made

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Bookerino Build and Update Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Build the project with Maven
Write-Host "[1/3] Building project with Maven..." -ForegroundColor Yellow
& mvn package -DskipTests
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Maven build failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "[OK] Build successful!" -ForegroundColor Green
Write-Host ""

# Step 2: Check if JAR exists
$jarPath = "target\bookerino-desktop.jar"
if (-not (Test-Path $jarPath)) {
    Write-Host "[ERROR] JAR file not found: $jarPath" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "[OK] JAR file found: $jarPath" -ForegroundColor Green
Write-Host ""

# Step 3: Create/Update .exe using Launch4j
Write-Host "[2/3] Creating/Updating Bookerino.exe..." -ForegroundColor Yellow
$outputExe = "dist\exe\Bookerino.exe"
$iconPath = "attached_assets\logo bokkerino_1759435973381.png"

# Create output directory if it doesn't exist
if (-not (Test-Path "dist\exe")) {
    New-Item -ItemType Directory -Path "dist\exe" | Out-Null
}

# Check if Launch4j is installed
$launch4jPath = $null
$possiblePaths = @(
    "C:\Program Files\Launch4j\launch4j.exe",
    "C:\Program Files (x86)\Launch4j\launch4j.exe"
)

foreach ($path in $possiblePaths) {
    if (Test-Path $path) {
        $launch4jPath = $path
        break
    }
}

if (-not $launch4jPath) {
    Write-Host "[WARNING] Launch4j not found in standard locations." -ForegroundColor Yellow
    Write-Host "[WARNING] Skipping .exe creation. JAR is ready at: $jarPath" -ForegroundColor Yellow
    Write-Host "[INFO] To create .exe, install Launch4j from: http://launch4j.sourceforge.net/" -ForegroundColor Cyan
    Write-Host "[INFO] Or run: launch-scripts\create-exe-launch4j.bat" -ForegroundColor Cyan
    Write-Host ""
} else {
    # Create Launch4j configuration XML
    $launch4jXml = "dist\exe\bookerino-build.xml"
    $currentDir = (Get-Location).Path
    
    $xmlContent = @"
<?xml version="1.0" encoding="UTF-8"?>
<launch4jConfig>
  <dontWrapJar>false</dontWrapJar>
  <headerType>gui</headerType>
  <jar>$currentDir\$jarPath</jar>
  <outfile>$currentDir\$outputExe</outfile>
  <errTitle>Bookerino Error</errTitle>
  <cmdLine></cmdLine>
  <chdir></chdir>
  <priority>normal</priority>
  <downloadUrl>http://java.com/download</downloadUrl>
  <supportUrl></supportUrl>
  <stayAlive>false</stayAlive>
  <restartOnCrash>false</restartOnCrash>
  <manifest></manifest>
"@
    
    if (Test-Path $iconPath) {
        $xmlContent += "`n  <icon>$currentDir\$iconPath</icon>"
    }
    
    $xmlContent += @"

  <jre>
    <path></path>
    <bundledJre64Bit>false</bundledJre64Bit>
    <bundledJreAsFallback>false</bundledJreAsFallback>
    <minVersion>21</minVersion>
    <maxVersion></maxVersion>
    <jdkPreference>preferJre</jdkPreference>
    <runtimeBits>64</runtimeBits>
  </jre>
  <versionInfo>
    <fileVersion>1.0.0.0</fileVersion>
    <txtFileVersion>1.0.0</txtFileVersion>
    <fileDescription>Bookerino - HoReCa Management Solution</fileDescription>
    <copyright>Copyright 2025 Bookerino</copyright>
    <productVersion>1.0.0.0</productVersion>
    <txtProductVersion>1.0.0</txtProductVersion>
    <productName>Bookerino</productName>
    <companyName>Bookerino</companyName>
    <internalName>Bookerino</internalName>
    <originalFilename>Bookerino.exe</originalFilename>
  </versionInfo>
</launch4jConfig>
"@
    
    $xmlContent | Out-File -FilePath $launch4jXml -Encoding UTF8
    
    # Run Launch4j
    & $launch4jPath $launch4jXml
    
    # Clean up temp XML file
    Remove-Item $launch4jXml -ErrorAction SilentlyContinue
    
    if (Test-Path $outputExe) {
        Write-Host "[OK] Executable created/updated: $outputExe" -ForegroundColor Green
    } else {
        Write-Host "[WARNING] .exe creation may have failed. Check Launch4j output above." -ForegroundColor Yellow
        Write-Host "[INFO] JAR file is ready at: $jarPath" -ForegroundColor Cyan
    }
    Write-Host ""
}

Write-Host "[3/3] Build process complete!" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "JAR File: $jarPath"
if (Test-Path $outputExe) {
    Write-Host "EXE File: $outputExe" -ForegroundColor Green
} else {
    Write-Host "EXE File: Not created (Launch4j not found)" -ForegroundColor Yellow
}
Write-Host ""
Write-Host "All changes have been compiled and updated!" -ForegroundColor Green
Write-Host ""

Read-Host "Press Enter to exit"

