# Quick Fix Instructions - "bound must be positive" Error

## ✅ Problem Fixed!
The error has been fixed in the source code. The JAR file is updated: `target/bookerino-desktop.jar`

## 🔧 To Update Bookerino.exe:

### Option 1: Run JAR Directly (Easiest - No Launch4j needed)
```bash
java -jar target\bookerino-desktop.jar
```
or
```bash
java -jar dist\exe\bookerino-desktop.jar
```

### Option 2: Update .exe with Launch4j (If installed)
1. Install Launch4j from: http://launch4j.sourceforge.net/
2. Run: `.\update-exe-manual.bat`
   OR
3. Run: `.\launch-scripts\create-exe-launch4j.bat`

### Option 3: Manual Update
1. Open Launch4j
2. Load config: `dist\exe\bookerino.xml`
3. Update JAR path to: `dist\exe\bookerino-desktop.jar`
4. Click "Build wrapper"

## 📝 What Was Fixed:
- Changed `AnimatedBackgroundPanel` to initialize orbs only when component dimensions are available
- Added safety checks to ensure `Random.nextInt()` always receives positive values
- Orbs now initialize in `paintComponent()` instead of constructor

## ✅ Current Status:
- ✅ Source code fixed
- ✅ JAR file updated (`target/bookerino-desktop.jar`)
- ⚠️ .exe needs to be rebuilt (requires Launch4j)

The application will work perfectly when run from the JAR file!

