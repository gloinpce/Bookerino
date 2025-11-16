# Launch Scripts

This folder contains all scripts for launching and building the Bookerino application.

## Files

### Batch Files (.bat)
- `launch-bookerino.bat` - Main launcher script (enhanced with shortcut support)
- `launch-bookerino-simple.bat` - Simple launcher script
- `create-exe-launch4j.bat` - Creates executable using Launch4j
- `create-exe-launch4j-with-classpath.bat` - Creates executable with custom classpath
- `create-exe-simple.bat` - Simple executable creator
- `create-shortcut.bat` - Creates Windows shortcut for better taskbar icon support

### PowerShell Scripts (.ps1)
- `launch-bookerino.ps1` - PowerShell launcher script
- `create-exe.ps1` - PowerShell executable creator
- `create-shortcut.ps1` - PowerShell shortcut creator

### VBScript Files (.vbs)
- `launch-bookerino.vbs` - VBScript launcher (alternative method)

## Usage

### To Launch the Application
1. Double-click `launch-bookerino.bat` (recommended)
2. Or run `launch-bookerino.ps1` in PowerShell
3. Or double-click `launch-bookerino.vbs`

### To Create an Executable
1. Run `create-exe-launch4j.bat` (requires Launch4j installed)
2. Or run `create-exe.ps1` in PowerShell (requires JDK 21+)

### To Create a Shortcut
1. Run `create-shortcut.bat`
2. Or run `create-shortcut.ps1` in PowerShell

## Requirements

- Java Runtime Environment (JRE) or JDK 21+
- Maven (for building)
- Launch4j (optional, for creating executables)

## Notes

- The main launcher (`launch-bookerino.bat`) automatically creates a shortcut if one doesn't exist
- Shortcuts provide better Windows taskbar icon support
- All scripts assume the JAR file is located at `target/bookerino-desktop.jar`

