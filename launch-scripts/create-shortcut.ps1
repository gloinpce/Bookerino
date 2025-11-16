# PowerShell script to create Windows shortcut with icon for Bookerino
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$jarPath = Join-Path $scriptDir "target\bookerino-desktop.jar"
$iconPath = Join-Path $scriptDir "attached_assets\logo bokkerino_1759435973381.png"
$shortcutPath = Join-Path $scriptDir "Bookerino.lnk"

# Check if JAR exists
if (-not (Test-Path $jarPath)) {
    Write-Host "ERROR: JAR file not found!" -ForegroundColor Red
    Write-Host "Please run: mvn package" -ForegroundColor Yellow
    exit 1
}

# Create WScript Shell object
$WshShell = New-Object -ComObject WScript.Shell

# Create shortcut
$Shortcut = $WshShell.CreateShortcut($shortcutPath)
$Shortcut.TargetPath = "javaw.exe"
$Shortcut.Arguments = "-jar `"$jarPath`""
$Shortcut.WorkingDirectory = $scriptDir
$Shortcut.Description = "Bookerino Desktop Application"
$Shortcut.IconLocation = $iconPath
$Shortcut.WindowStyle = 1
$Shortcut.Save()

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Shortcut created successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "Shortcut: $shortcutPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now:" -ForegroundColor Yellow
Write-Host "  1. Pin the shortcut to your taskbar" -ForegroundColor White
Write-Host "  2. Double-click it to launch Bookerino" -ForegroundColor White
Write-Host "  3. The icon will appear in the taskbar" -ForegroundColor White
Write-Host ""

