# File Locations Guide

This document shows where every important file is located in the Bookerino project.

## 📁 Root Directory Files

### Documentation
- **WEBSITE-DESIGN-DOCUMENTATION.md** - Complete website design documentation for Figma
- **FILE-LOCATIONS.md** - This file (file locations guide)

## 📁 Launch Scripts Folder

**Location:** `launch-scripts/`

### Scripts
- `launch-bookerino.bat` - Main launcher script
- `launch-bookerino-simple.bat` - Simple launcher
- `launch-bookerino.ps1` - PowerShell launcher
- `launch-bookerino.vbs` - VBScript launcher
- `create-exe-launch4j.bat` - Create executable (Launch4j)
- `create-exe-launch4j-with-classpath.bat` - Create executable with classpath
- `create-exe-simple.bat` - Simple executable creator
- `create-exe.ps1` - PowerShell executable creator
- `create-shortcut.bat` - Create Windows shortcut
- `create-shortcut.ps1` - PowerShell shortcut creator
- `README.md` - Launch scripts documentation

## 📁 Figma Design Files Folder

**Location:** `figma-design-files/`

### Main Files
- `App.tsx` - Main application structure
- `main.tsx` - Application entry point
- `README.md` - Figma files guide

### Pages Folder
**Location:** `figma-design-files/pages/`
- `Index.tsx` - Homepage (main landing page) ⭐ MOST IMPORTANT
- `Auth.tsx` - Login/Registration page
- `Pricing.tsx` - Pricing plans page
- `Success.tsx` - Payment success page
- `Cancel.tsx` - Payment cancellation page
- `NotFound.tsx` - 404 error page

### Components Folder
**Location:** `figma-design-files/components/`
- `Navbar.tsx` - Navigation bar component
- `NavLink.tsx` - Navigation link component

### Styles Folder
**Location:** `figma-design-files/styles/`
- `index.css` - Global styles and design tokens

## 📁 Source Code Files (Original)

### Website Application
**Location:** `client/src/website/`

#### Main Files
- `App.tsx` - Main application router
- `main.tsx` - Application entry point
- `index.css` - Global styles
- `App.css` - Additional app styles

#### Pages
**Location:** `client/src/website/pages/`
- `Index.tsx` - Homepage
- `Auth.tsx` - Authentication page
- `Pricing.tsx` - Pricing page
- `Success.tsx` - Success page
- `Cancel.tsx` - Cancel page
- `NotFound.tsx` - 404 page
- `login.html` - HTML login page
- `Signup.html` - HTML signup page

#### Components
**Location:** `client/src/website/components/`
- `Navbar.tsx` - Navigation bar
- `NavLink.tsx` - Navigation link
- `ui/` - UI component library (47 components)

#### Configuration
**Location:** `client/src/website/config/`
- `database.ts` - Database configuration
- `index.ts` - Config exports

#### Libraries
**Location:** `client/src/website/lib/`
- `api.ts` - API client
- `index.ts` - Library exports
- `stackAuth.ts` - Stack Auth integration

## 📁 Shared Components

**Location:** `client/src/components/`
- `split-text.tsx` - Animated text component (used in homepage)
- `dark-veil.tsx` - Dark overlay component
- `ui/` - Shared UI components

## 📁 Hooks

**Location:** `client/src/hooks/`
- `use-toast.ts` - Toast notification hook

## 📁 Configuration Files

### Build Configuration
- `vite.config.ts` - Vite build configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `package.json` - NPM dependencies and scripts

### Deployment
- `netlify.toml` - Netlify deployment configuration

## 📁 Assets

**Location:** `attached_assets/`
- `logo bokkerino_1759435973381.png` - Logo file
- `header site_1759436834395.png` - Header image

**Location:** `client/public/attached_assets/`
- `logo bokkerino_1759435973381.png` - Public logo

## 📋 Quick Reference

### For Figma Designers
1. **Start with:** `figma-design-files/pages/Index.tsx` (Homepage)
2. **Check styles:** `figma-design-files/styles/index.css` (Design tokens)
3. **Read documentation:** `WEBSITE-DESIGN-DOCUMENTATION.md`

### For Developers
1. **Main app:** `client/src/website/App.tsx`
2. **Pages:** `client/src/website/pages/`
3. **Components:** `client/src/website/components/`
4. **Styles:** `client/src/website/index.css`

### For Launching Application
1. **Use:** `launch-scripts/launch-bookerino.bat`
2. **Read:** `launch-scripts/README.md`

## 📝 Summary

- **Documentation:** Root directory (`WEBSITE-DESIGN-DOCUMENTATION.md`)
- **Launch Scripts:** `launch-scripts/` folder
- **Figma Files:** `figma-design-files/` folder
- **Source Code:** `client/src/website/` folder
- **Design Tokens:** `figma-design-files/styles/index.css` or `client/src/website/index.css`

---

**Last Updated:** November 2025

