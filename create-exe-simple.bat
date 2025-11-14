@echo off
REM Simple batch file to create a VBS launcher that looks like an exe
REM This creates a .vbs file that can be renamed to .exe (but won't have icon)

setlocal

set "JAR_PATH=target\bookerino-desktop.jar"
set "OUTPUT_VBS=dist\exe\Bookerino.vbs"

REM Check if JAR exists
if not exist "%JAR_PATH%" (
    echo [ERROR] JAR file not found!
    echo Expected: %JAR_PATH%
    echo Please run: mvn clean package
    pause
    exit /b 1
)

REM Create output directory
if not exist "dist\exe" mkdir "dist\exe"

REM Create VBS launcher
(
echo Set WshShell = CreateObject^("WScript.Shell"^)
echo Set fso = CreateObject^("Scripting.FileSystemObject"^)
echo scriptDir = fso.GetParentFolderName^(WScript.ScriptFullName^)
echo jarPath = scriptDir ^& "\..\target\bookerino-desktop.jar"
echo If fso.FileExists^(jarPath^) Then
echo     WshShell.Run "javaw.exe -Dfile.encoding=UTF-8 -jar """ ^& jarPath ^& """", 0, False
echo Else
echo     MsgBox "JAR file not found: " ^& jarPath, vbCritical, "Bookerino Error"
echo End If
) > "%OUTPUT_VBS%"

echo Created VBS launcher: %OUTPUT_VBS%
echo Note: For a proper EXE with icon, use create-exe-launch4j.bat or create-exe.ps1
pause

