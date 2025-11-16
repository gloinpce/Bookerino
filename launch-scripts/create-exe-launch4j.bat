@echo off
REM Create Bookerino executable using Launch4j
REM Download Launch4j from: http://launch4j.sourceforge.net/

setlocal enabledelayedexpansion

set "JAR_PATH=target\bookerino-desktop.jar"
set "ICON_PATH=attached_assets\logo bokkerino_1759435973381.png"
set "OUTPUT_EXE=dist\exe\Bookerino.exe"
set "LAUNCH4J_XML=launch4j-config.xml"

REM Classpath items (additional JARs or directories to add to classpath)
REM Format: semicolon-separated paths relative to executable location
REM Example: "lib\extra.jar;lib\another.jar"
set "CLASSPATH_ITEMS="

REM Environment variables (will be available to the Java application)
REM Format: NAME=VALUE pairs separated by semicolons
REM Example: "DATABASE_URL=jdbc:sqlite:./bookerino.db;LOG_LEVEL=INFO"
REM Available: DATABASE_URL, LOG_LEVEL, APP_MODE, JAVA_OPTS, APP_HOME
set "ENV_VARS=DATABASE_URL=jdbc:sqlite:./bookerino.db"

REM Check if JAR exists
if not exist "%JAR_PATH%" (
    echo [ERROR] JAR file not found!
    echo Expected: %JAR_PATH%
    echo.
    echo Please run: mvn clean package
    echo.
    pause
    exit /b 1
)

REM Check if icon exists
if not exist "%ICON_PATH%" (
    echo [WARNING] Icon file not found: %ICON_PATH%
    set "ICON_PATH="
)

REM Create output directory
if not exist "dist\exe" mkdir "dist\exe"

REM Create Launch4j configuration XML
echo Creating Launch4j configuration...
(
echo ^<?xml version="1.0" encoding="UTF-8"?^>
echo ^<launch4jConfig^>
echo   ^<dontWrapJar^>false^</dontWrapJar^>
echo   ^<headerType^>gui^</headerType^>
echo   ^<jar^>%JAR_PATH%^</jar^>
echo   ^<outfile^>%OUTPUT_EXE%^</outfile^>
echo   ^<errTitle^>Bookerino Error^</errTitle^>
echo   ^<cmdLine^>^</cmdLine^>
echo   ^<chdir^>^</chdir^>
echo   ^<priority^>normal^</priority^>
REM Note: To add classpath items, edit CLASSPATH_ITEMS variable at the top of this file
REM or use create-exe-launch4j-with-classpath.bat for easier configuration
if not "!CLASSPATH_ITEMS!"=="" (
    echo   ^<classPath^>
    echo     ^<mainClass^>^</mainClass^>
    REM Parse semicolon-separated classpath items
    set "CP_ITEMS=!CLASSPATH_ITEMS!"
    :parse_cp
    for /f "tokens=1* delims=;" %%A in ("!CP_ITEMS!") do (
        echo     ^<cp^>%%A^</cp^>
        set "CP_ITEMS=%%B"
        if not "!CP_ITEMS!"=="" goto parse_cp
    )
    echo   ^</classPath^>
)
REM Add environment variables if specified
if not "!ENV_VARS!"=="" (
    echo   ^<env^>
    REM Parse semicolon-separated environment variables
    set "ENV_ITEMS=!ENV_VARS!"
    :parse_env
    for /f "tokens=1* delims=;" %%A in ("!ENV_ITEMS!") do (
        REM Split NAME=VALUE
        for /f "tokens=1* delims==" %%C in ("%%A") do (
            echo     ^<envVar name="%%C" value="%%D"/^>
        )
        set "ENV_ITEMS=%%B"
        if not "!ENV_ITEMS!"=="" goto parse_env
    )
    echo   ^</env^>
)
echo   ^<downloadUrl^>http://java.com/download^</downloadUrl^>
echo   ^<supportUrl^>^</supportUrl^>
echo   ^<stayAlive^>false^</stayAlive^>
echo   ^<restartOnCrash^>false^</restartOnCrash^>
echo   ^<manifest^>^</manifest^>
echo   ^<icon^>%ICON_PATH%^</icon^>
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

REM Check if Launch4j is installed
set "LAUNCH4J_PATH="
if exist "C:\Program Files\Launch4j\launch4j.exe" (
    set "LAUNCH4J_PATH=C:\Program Files\Launch4j\launch4j.exe"
) else if exist "C:\Program Files (x86)\Launch4j\launch4j.exe" (
    set "LAUNCH4J_PATH=C:\Program Files (x86)\Launch4j\launch4j.exe"
) else (
    echo.
    echo [ERROR] Launch4j not found!
    echo.
    echo Please install Launch4j from: http://launch4j.sourceforge.net/
    echo Or use the PowerShell script: create-exe.ps1 (requires JDK 21+)
    echo.
    pause
    exit /b 1
)

REM Run Launch4j
echo Running Launch4j...
"%LAUNCH4J_PATH%" "%LAUNCH4J_XML%"

if exist "%OUTPUT_EXE%" (
    echo.
    echo SUCCESS! Executable created: %OUTPUT_EXE%
    echo.
    del "%LAUNCH4J_XML%" 2>nul
) else (
    echo.
    echo [ERROR] Failed to create executable
    echo Check Launch4j output above for errors
    echo.
    pause
    exit /b 1
)

pause

