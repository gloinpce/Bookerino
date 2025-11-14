# Creating Bookerino Executable (.exe)

This guide explains how to create a Windows executable (.exe) file for Bookerino with a custom icon.

## Prerequisites

1. **Java JDK 21+** (for jpackage method)
   - OR **Launch4j** (for Launch4j method)
   - Download Launch4j: http://launch4j.sourceforge.net/

2. **Built JAR file**
   ```bash
   mvn clean package
   ```

3. **Icon file**
   - Location: `attached_assets\logo bokkerino_1759435973381.png`
   - For jpackage: PNG works, but ICO is preferred
   - For Launch4j: PNG works fine

## Method 1: Using jpackage (Recommended - JDK 21+)

**Best for:** Modern Java applications, creates native executable

```powershell
# Run PowerShell script
.\create-exe.ps1
```

**Output:** `dist\exe\Bookerino.exe`

**Features:**
- Native Windows executable
- Custom icon support
- Windows Start Menu integration
- Self-contained (can bundle JRE)

## Method 2: Using Launch4j

**Best for:** Simple wrapper, works with any Java version

1. Install Launch4j from http://launch4j.sourceforge.net/

2. Run the batch script:
   ```batch
   create-exe-launch4j.bat
   ```

**Output:** `dist\exe\Bookerino.exe`

**Features:**
- Wraps JAR in EXE
- Custom icon support
- Version information
- Error handling

## Method 3: Simple VBS Launcher

**Best for:** Quick solution without external tools

```batch
create-exe-simple.bat
```

**Output:** `dist\exe\Bookerino.vbs`

**Note:** This creates a VBS file, not a true EXE. For proper EXE, use Method 1 or 2.

## Converting PNG to ICO (Optional)

If you need to convert the PNG icon to ICO format:

### Online Tools:
- https://convertio.co/png-ico/
- https://www.icoconverter.com/

### Using ImageMagick:
```bash
magick "attached_assets\logo bokkerino_1759435973381.png" -define icon:auto-resize=256,128,64,48,32,16 "dist\exe\bookerino.ico"
```

## Troubleshooting

### jpackage not found
- Ensure JDK 21+ is installed
- Add JDK bin directory to PATH
- Verify: `jpackage --version`

### Launch4j not found
- Install Launch4j from official website
- Update paths in `create-exe-launch4j.bat` if installed in custom location

### Icon not showing
- Ensure icon file path is correct
- For jpackage: Try converting PNG to ICO
- For Launch4j: PNG should work, but ICO is more reliable

### JAR file not found
- Run `mvn clean package` first
- Check that `target\bookerino-desktop.jar` exists

## Distribution

After creating the EXE:

1. **Test the executable:**
   ```batch
   dist\exe\Bookerino.exe
   ```

2. **Distribute:**
   - The EXE file can be distributed standalone
   - Users need Java 21+ installed (unless using bundled JRE with jpackage)
   - Include the `bookerino.db` file if using SQLite

3. **Optional: Create installer**
   - Use Inno Setup or NSIS to create an installer
   - Include Java runtime if needed
   - Add desktop shortcut and Start Menu entry

## File Structure

```
Bookerino/
├── target/
│   └── bookerino-desktop.jar    # Built JAR file
├── attached_assets/
│   └── logo bokkerino_1759435973381.png  # Icon file
├── dist/
│   └── exe/
│       └── Bookerino.exe         # Created executable
├── create-exe.ps1                # jpackage script
├── create-exe-launch4j.bat       # Launch4j script
└── create-exe-simple.bat         # Simple VBS script
```

