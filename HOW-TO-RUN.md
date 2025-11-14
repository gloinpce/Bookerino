# How to Run Bookerino

This guide explains all the ways to run the Bookerino application.

## 🌐 Option 1: Run the Website (React/Vite)

### Development Mode (with hot reload)
```bash
npm run dev
```
- Opens at: `http://localhost:5173`
- Website app runs automatically
- Hot reload enabled for development

### Production Build
```bash
# Build the website
npm run build

# Preview the built website
npm run preview
```
- Build output: `dist/public/`
- Preview runs at: `http://localhost:4173`

### Access Routes
- `/` or `/lander` - Homepage (Index page)
- `/auth` - Authentication page
- `/pricing` - Pricing page
- `/success` - Success page
- `/cancel` - Cancel page

---

## 🖥️ Option 2: Run Java Desktop Application

### Method A: Using Batch File (Easiest)
```batch
launch-bookerino.bat
```
- Automatically finds and runs the JAR
- Creates shortcut if needed for better icon support
- Uses `target\bookerino-desktop.jar`

### Method B: Run JAR Directly
```batch
java -jar target\bookerino-desktop.jar
```

Or using javaw (no console window):
```batch
javaw -jar target\bookerino-desktop.jar
```

### Method C: PowerShell Script
```powershell
.\launch-bookerino.ps1
```

### Prerequisites
1. **Build the JAR first:**
   ```batch
   mvn clean package
   ```
   - Creates: `target\bookerino-desktop.jar`

2. **Java 21+ installed**
   - Check: `java -version`

---

## 🚀 Option 3: Run Executable (.exe)

### If you've created an executable:

**Using jpackage:**
```batch
dist\exe\Bookerino.exe
```

**Using Launch4j:**
```batch
dist\exe\Bookerino.exe
```

### Create Executable First:
See `README-EXE.md` for detailed instructions:
- `create-exe.ps1` - Using jpackage (JDK 21+)
- `create-exe-launch4j.bat` - Using Launch4j
- `create-exe-simple.bat` - Simple VBS launcher

---

## 📋 Quick Start Checklist

### For Website Development:
1. ✅ Install Node.js and npm
2. ✅ Run `npm install` (if not done)
3. ✅ Run `npm run dev`
4. ✅ Open `http://localhost:5173`

### For Java Desktop App:
1. ✅ Install Java JDK 21+
2. ✅ Run `mvn clean package`
3. ✅ Run `launch-bookerino.bat`
4. ✅ App window opens

### For Executable:
1. ✅ Build JAR: `mvn clean package`
2. ✅ Create EXE: `.\create-exe.ps1` or `create-exe-launch4j.bat`
3. ✅ Run: `dist\exe\Bookerino.exe`

---

## 🔧 Troubleshooting

### Website won't start
- Check Node.js: `node --version` (should be 20+)
- Install dependencies: `npm install`
- Check port 5173 is available

### Java app won't start
- Check Java: `java -version` (should be 21+)
- Build JAR: `mvn clean package`
- Check JAR exists: `target\bookerino-desktop.jar`

### Executable not found
- Build JAR first: `mvn clean package`
- Run creation script: `.\create-exe.ps1`
- Check output: `dist\exe\Bookerino.exe`

---

## 📁 File Locations

- **Website source:** `client/src/website/`
- **Website entry:** `client/website.html`
- **Java source:** `src/main/java/com/bookerino/`
- **JAR file:** `target/bookerino-desktop.jar`
- **Executable:** `dist/exe/Bookerino.exe`
- **Database:** `bookerino.db` (SQLite)

---

## 🌍 Netlify Deployment

The website is automatically deployed to Netlify:
- **Preview:** `https://deploy-preview-*.bookerino.net`
- **Production:** `https://bookerino.net`
- **Lander page:** `https://bookerino.net/lander`

No manual deployment needed - pushes to `main` branch trigger automatic builds.

