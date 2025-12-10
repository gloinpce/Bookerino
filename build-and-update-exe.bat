@echo off
REM Automated build script to compile and update Bookerino.exe
REM This script will be run automatically whenever changes are made

setlocal enabledelayedexpansion

echo ========================================
echo   Bookerino Build and Update Script
echo ========================================
echo.

REM Step 1: Build the project with Maven
echo [1/3] Building project with Maven...
call mvn package -DskipTests
if errorlevel 1 (
    echo [ERROR] Maven build failed!
    pause
    exit /b 1
)
echo [OK] Build successful!
echo.

REM Step 2: Check if JAR exists
set "JAR_PATH=target\bookerino-desktop.jar"
if not exist "%JAR_PATH%" (
    echo [ERROR] JAR file not found: %JAR_PATH%
    pause
    exit /b 1
)
echo [OK] JAR file found: %JAR_PATH%
echo.

REM Step 3: Create/Update .exe using Launch4j
echo [2/3] Creating/Updating Bookerino.exe...
set "OUTPUT_EXE=dist\exe\Bookerino.exe"
set "ICON_PATH=attached_assets\logo bokkerino_1759435973381.png"

REM Create output directory if it doesn't exist
if not exist "dist\exe" mkdir "dist\exe"

REM Check if Launch4j is installed
set "LAUNCH4J_PATH="
if exist "C:\Program Files\Launch4j\launch4j.exe" (
    set "LAUNCH4J_PATH=C:\Program Files\Launch4j\launch4j.exe"
) else if exist "C:\Program Files (x86)\Launch4j\launch4j.exe" (
    set "LAUNCH4J_PATH=C:\Program Files (x86)\Launch4j\launch4j.exe"
) else (
    echo [WARNING] Launch4j not found in standard locations.
    echo [WARNING] Skipping .exe creation. JAR is ready at: %JAR_PATH%
    echo [INFO] To create .exe, install Launch4j from: http://launch4j.sourceforge.net/
    echo [INFO] Or run: launch-scripts\create-exe-launch4j.bat
    echo.
    goto :end
)

REM Create Launch4j configuration XML
set "LAUNCH4J_XML=dist\exe\bookerino-build.xml"
echo Creating Launch4j configuration...
(
echo ^<?xml version="1.0" encoding="UTF-8"?^>
echo ^<launch4jConfig^>
echo   ^<dontWrapJar^>false^</dontWrapJar^>
echo   ^<headerType^>gui^</headerType^>
echo   ^<jar^>%CD%\%JAR_PATH%^</jar^>
echo   ^<outfile^>%CD%\%OUTPUT_EXE%^</outfile^>
echo   ^<errTitle^>Bookerino Error^</errTitle^>
echo   ^<cmdLine^>^</cmdLine^>
echo   ^<chdir^>^</chdir^>
echo   ^<priority^>normal^</priority^>
echo   ^<downloadUrl^>http://java.com/download^</downloadUrl^>
echo   ^<supportUrl^>^</supportUrl^>
echo   ^<stayAlive^>false^</stayAlive^>
echo   ^<restartOnCrash^>false^</restartOnCrash^>
echo   ^<manifest^>^</manifest^>
if exist "%ICON_PATH%" (
    echo   ^<icon^>%CD%\%ICON_PATH%^</icon^>
)
echo   ^<jre^>
echo     ^<path^>^</path^>
echo     ^<bundledJre64Bit^>false^</bundledJre64Bit^>
echo     ^<bundledJreAsFallback^>false^</bundledJreAsFallback^>
echo     ^<minVersion^>21^</minVersion^>
echo     ^<maxVersion^>^</maxVersion^>
echo     ^<jdkPreference^>preferJre^</jdkPreference^>
echo     ^<runtimeBits^>64^</runtimeBits^>
echo   ^</jre^>
echo   ^<versionInfo^>
echo     ^<fileVersion^>1.0.0.0^</fileVersion^>
echo     ^<txtFileVersion^>1.0.0^</txtFileVersion^>
echo     ^<fileDescription^>Bookerino - HoReCa Management Solution^</fileDescription^>
echo     ^<copyright^>Copyright 2025 Bookerino^</copyright^>
echo     ^<productVersion^>1.0.0.0^</productVersion^>
echo     ^<txtProductVersion^>1.0.0^</txtProductVersion^>
echo     ^<productName^>Bookerino^</productName^>
echo     ^<companyName^>Bookerino^</companyName^>
echo     ^<internalName^>Bookerino^</internalName^>
echo     ^<originalFilename^>Bookerino.exe^</originalFilename^>
echo   ^</versionInfo^>
echo ^</launch4jConfig^>
) > "%LAUNCH4J_XML%"

REM Run Launch4j
"%LAUNCH4J_PATH%" "%LAUNCH4J_XML%"

REM Clean up temp XML file
del "%LAUNCH4J_XML%" 2>nul

if exist "%OUTPUT_EXE%" (
    echo [OK] Executable created/updated: %OUTPUT_EXE%
) else (
    echo [WARNING] .exe creation may have failed. Check Launch4j output above.
    echo [INFO] JAR file is ready at: %JAR_PATH%
)
echo.

:end
echo [3/3] Build process complete!
echo.
echo ========================================
echo   Summary
echo ========================================
echo JAR File: %JAR_PATH%
if exist "%OUTPUT_EXE%" (
    echo EXE File: %OUTPUT_EXE%
) else (
    echo EXE File: Not created (Launch4j not found)
)
echo.
echo All changes have been compiled and updated!
echo.

pause

