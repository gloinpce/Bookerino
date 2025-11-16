@echo off
REM Script to create Windows shortcut with icon for Bookerino
setlocal enabledelayedexpansion

set "SCRIPT_DIR=%~dp0"
set "SCRIPT_DIR=%SCRIPT_DIR:~0,-1%"
cd /d "%SCRIPT_DIR%"

set "JAR_PATH=%SCRIPT_DIR%\target\bookerino-desktop.jar"
set "ICON_PATH=%SCRIPT_DIR%\attached_assets\logo bokkerino_1759435973381.png"
set "SHORTCUT_PATH=%SCRIPT_DIR%\Bookerino.lnk"

REM Check if JAR exists
if not exist "%JAR_PATH%" (
    echo ERROR: JAR file not found!
    echo Please run: mvn package
    pause
    exit /b 1
)

REM Create VBScript to create shortcut with icon
set "VBS_SCRIPT=%TEMP%\create_bookerino_shortcut.vbs"
(
echo Set oWS = WScript.CreateObject^("WScript.Shell"^)
echo sLinkFile = "%SHORTCUT_PATH%"
echo Set oLink = oWS.CreateShortcut^(sLinkFile^)
echo oLink.TargetPath = "javaw.exe"
echo oLink.Arguments = "-jar ""%JAR_PATH%"""
echo oLink.WorkingDirectory = "%SCRIPT_DIR%"
echo oLink.Description = "Bookerino Desktop Application"
echo oLink.IconLocation = "%ICON_PATH%"
echo oLink.WindowStyle = 1
echo oLink.Save
) > "%VBS_SCRIPT%"

REM Execute VBScript
cscript //nologo "%VBS_SCRIPT%"

REM Clean up
del "%VBS_SCRIPT%" 2>nul

if exist "%SHORTCUT_PATH%" (
    echo.
    echo ========================================
    echo Shortcut created successfully!
    echo ========================================
    echo Shortcut: %SHORTCUT_PATH%
    echo.
    echo You can now:
    echo   1. Pin the shortcut to your taskbar
    echo   2. Double-click it to launch Bookerino
    echo   3. The icon will appear in the taskbar
    echo.
) else (
    echo.
    echo WARNING: Shortcut creation may have failed.
    echo You can manually create a shortcut and set the icon.
    echo.
)

pause

