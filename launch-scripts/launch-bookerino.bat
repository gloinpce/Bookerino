@echo off
REM Enhanced launcher that uses shortcut for better Windows taskbar icon support
setlocal enabledelayedexpansion

REM Get the full path of this batch file and normalize it
set "SCRIPT_DIR=%~dp0"
set "SCRIPT_DIR=%SCRIPT_DIR:~0,-1%"

REM Change to script directory
cd /d "%SCRIPT_DIR%"

REM Build absolute path to JAR file
set "JAR_PATH=%SCRIPT_DIR%\target\bookerino-desktop.jar"
set "SHORTCUT_PATH=%SCRIPT_DIR%\Bookerino.lnk"

REM Check if JAR file exists
if not exist "%JAR_PATH%" (
    echo [ERROR] JAR file not found!
    echo Expected: %JAR_PATH%
    echo.
    echo Please run: mvn clean package
    echo.
    pause
    exit /b 1
)

REM Set the DATABASE_URL environment variable if not set
if "%DATABASE_URL%"=="" (
    set "DATABASE_URL=jdbc:sqlite:./bookerino.db"
)

REM Check if shortcut exists - if so, use it for better icon support
if exist "%SHORTCUT_PATH%" (
    echo Launching via shortcut for better Windows taskbar icon support...
    start "" "%SHORTCUT_PATH%"
) else (
    echo Shortcut not found. Creating it now...
    call create-shortcut.bat
    timeout /t 2 >nul
    if exist "%SHORTCUT_PATH%" (
        start "" "%SHORTCUT_PATH%"
    ) else (
        echo Launching directly...
        REM Launch the application using start command with proper title
        start "Bookerino" javaw.exe -Dfile.encoding=UTF-8 -jar "%JAR_PATH%"
    )
)

REM Exit immediately
exit /b 0
