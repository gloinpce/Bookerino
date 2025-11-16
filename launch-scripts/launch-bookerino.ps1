# Bookerino Desktop Launcher (PowerShell) - Silent Mode
# This script launches the Bookerino application without showing a console window

# Load Windows Forms for error dialogs
Add-Type -AssemblyName System.Windows.Forms

# Hide PowerShell window
Add-Type -Name Window -Namespace Console -MemberDefinition '
[DllImport("Kernel32.dll")]
public static extern IntPtr GetConsoleWindow();
[DllImport("user32.dll")]
public static extern bool ShowWindow(IntPtr hWnd, Int32 nCmdShow);
'
$consolePtr = [Console.Window]::GetConsoleWindow()
[Console.Window]::ShowWindow($consolePtr, 0) | Out-Null

# Get script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$jarPath = Join-Path $scriptDir "target\bookerino-desktop.jar"

# Check if JAR exists
if (-not (Test-Path $jarPath)) {
    [System.Windows.Forms.MessageBox]::Show(
        "JAR file not found at: $jarPath`n`nPlease run 'mvn clean package' first to build the application.",
        "Bookerino - Error",
        [System.Windows.Forms.MessageBoxButtons]::OK,
        [System.Windows.Forms.MessageBoxIcon]::Error
    )
    exit 1
}

# Set DATABASE_URL if not set
if (-not $env:DATABASE_URL) {
    $env:DATABASE_URL = "jdbc:sqlite:./bookerino.db"
}

# Launch using javaw (no console window)
Set-Location $scriptDir
Start-Process -FilePath "javaw.exe" -ArgumentList "-jar", "`"$jarPath`"" -WindowStyle Hidden

# Exit immediately
exit 0

