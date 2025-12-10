# Automatic Build and Update System

## Overview
All new changes to the Bookerino application are automatically compiled and updated to `Bookerino.exe`.

## Build Scripts

### Windows Batch Script
Run `build-and-update-exe.bat` to:
1. Compile all Java source files with Maven
2. Create/update the JAR file (`target/bookerino-desktop.jar`)
3. Create/update the EXE file (`dist/exe/Bookerino.exe`) using Launch4j

### PowerShell Script
Run `build-and-update-exe.ps1` for the same functionality with better PowerShell output.

## Automatic Updates

### Option 1: Manual Build (Recommended)
After making any changes to the code, run:
```bash
.\build-and-update-exe.bat
```
or
```powershell
.\build-and-update-exe.ps1
```

### Option 2: Git Hook (Automatic)
A Git post-commit hook has been set up to automatically build after each commit. This requires:
- Launch4j installed on your system
- Maven configured in PATH

## Requirements

### Required
- **Java JDK 21+** - For compiling the application
- **Maven** - For building the project
- **Launch4j** (optional) - For creating the .exe file
  - Download from: http://launch4j.sourceforge.net/
  - Install to: `C:\Program Files\Launch4j\` or `C:\Program Files (x86)\Launch4j\`

### Build Output
- **JAR File**: `target/bookerino-desktop.jar` (always created)
- **EXE File**: `dist/exe/Bookerino.exe` (created if Launch4j is installed)

## Current Status

✅ **Latest Changes Compiled**: All new GUI changes (ModernAuthDialog, redesigned dashboard) are now in the JAR file.

✅ **JAR Updated**: `target/bookerino-desktop.jar` contains all latest changes.

⚠️ **EXE Update**: Requires Launch4j to be installed. If Launch4j is not found, the JAR file is still updated and ready to use.

## Manual EXE Creation

If Launch4j is installed but the automatic script doesn't find it, you can manually create the EXE:

1. Open Launch4j
2. Load the configuration from: `dist/exe/bookerino.xml`
3. Click "Build wrapper"

Or use the existing script:
```bash
.\launch-scripts\create-exe-launch4j.bat
```

## File Locations

- **Source Code**: `src/main/java/com/bookerino/`
- **Main Application**: `src/main/java/com/bookerino/MainGUI.java`
- **Modern Auth Dialog**: `src/main/java/com/bookerino/auth/ModernAuthDialog.java`
- **Compiled JAR**: `target/bookerino-desktop.jar`
- **Executable**: `dist/exe/Bookerino.exe`

## Notes

- The build process compiles all Java files and packages dependencies into a single JAR
- The EXE is a wrapper around the JAR file for easier distribution
- You can run the JAR directly with: `java -jar target/bookerino-desktop.jar`

