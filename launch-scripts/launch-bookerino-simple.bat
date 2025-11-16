@echo off
setlocal enabledelayedexpansion

REM Get the full path of this batch file
set "SCRIPT_DIR=%~dp0"
set "SCRIPT_DIR=%SCRIPT_DIR:~0,-1%"

REM Change to script directory
cd /d "%SCRIPT_DIR%"

REM Set JAR path
set "JAR_FILE=%SCRIPT_DIR%\target\bookerino-desktop.jar"

echo ========================================
echo   Bookerino Desktop Launcher
echo ========================================
echo.
echo Script directory: %SCRIPT_DIR%
echo JAR file: %JAR_FILE%
echo.

REM Check Java
where java >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Java is not installed or not in PATH!
    echo Please install Java 21 or later.
    echo.
    pause
    exit /b 1
)

REM Check JAR exists
if not exist "%JAR_FILE%" (
    echo [ERROR] JAR file not found!
    echo.
    echo Expected: %JAR_FILE%
    echo.
    echo Please build the application first:
    echo   mvn clean package
    echo.
    pause
    exit /b 1
)

REM Set database URL
if "%DATABASE_URL%"=="" set "DATABASE_URL=jdbc:sqlite:./bookerino.db"

echo Starting application...
echo.

REM Run Java with full path
"%JAVA_HOME%\bin\java.exe" -jar "%JAR_FILE%" 2>nul
if errorlevel 1 (
    java -jar "%JAR_FILE%"
)

if errorlevel 1 (
    echo.
    echo [ERROR] Failed to start application
    echo Error code: %errorlevel%
    echo.
    pause
)

endlocal

