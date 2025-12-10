@echo off
REM Manual script to update Bookerino.exe with latest JAR
REM This copies the new JAR and provides instructions for updating the EXE

echo ========================================
echo   Updating Bookerino.exe
echo ========================================
echo.

REM Check if JAR exists
if not exist "target\bookerino-desktop.jar" (
    echo [ERROR] JAR file not found!
    echo Please run: mvn package -DskipTests
    pause
    exit /b 1
)

echo [OK] JAR file found: target\bookerino-desktop.jar
echo.

REM Copy JAR to dist/exe directory
if not exist "dist\exe" mkdir "dist\exe"
copy /Y "target\bookerino-desktop.jar" "dist\exe\bookerino-desktop.jar" >nul
echo [OK] JAR copied to dist\exe\
echo.

REM Check if Launch4j exists
set "LAUNCH4J_PATH="
if exist "C:\Program Files\Launch4j\launch4j.exe" (
    set "LAUNCH4J_PATH=C:\Program Files\Launch4j\launch4j.exe"
) else if exist "C:\Program Files (x86)\Launch4j\launch4j.exe" (
    set "LAUNCH4J_PATH=C:\Program Files (x86)\Launch4j\launch4j.exe"
)

if "%LAUNCH4J_PATH%"=="" (
    echo [INFO] Launch4j not found. To update the .exe file:
    echo.
    echo Option 1: Install Launch4j from http://launch4j.sourceforge.net/
    echo           Then run this script again.
    echo.
    echo Option 2: Use the existing script:
    echo           launch-scripts\create-exe-launch4j.bat
    echo.
    echo Option 3: Run the JAR directly:
    echo           java -jar dist\exe\bookerino-desktop.jar
    echo.
    pause
    exit /b 0
)

echo [INFO] Launch4j found. Updating .exe file...
echo.

REM Create updated Launch4j config
set "LAUNCH4J_XML=dist\exe\bookerino-update.xml"
set "JAR_PATH=%CD%\dist\exe\bookerino-desktop.jar"
set "OUTPUT_EXE=%CD%\dist\exe\Bookerino.exe"
set "ICON_PATH=%CD%\attached_assets\logo bokkerino_1759435973381.png"

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
echo   ^<downloadUrl^>http://java.com/download^</downloadUrl^>
echo   ^<supportUrl^>^</supportUrl^>
echo   ^<stayAlive^>false^</stayAlive^>
echo   ^<restartOnCrash^>false^</restartOnCrash^>
echo   ^<manifest^>^</manifest^>
if exist "%ICON_PATH%" (
    echo   ^<icon^>%ICON_PATH%^</icon^>
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

REM Clean up
del "%LAUNCH4J_XML%" 2>nul

if exist "%OUTPUT_EXE%" (
    echo.
    echo [SUCCESS] Bookerino.exe has been updated!
    echo Location: %OUTPUT_EXE%
) else (
    echo.
    echo [WARNING] .exe update may have failed.
    echo You can still run the application using:
    echo   java -jar dist\exe\bookerino-desktop.jar
)

echo.
pause

