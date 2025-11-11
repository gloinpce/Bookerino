# Netlify Configuration - Disable Next.js Auto-Detection

## Problem
Netlify detectează automat Next.js și instalează plugin-urile Next.js chiar dacă proiectul este Vite + React.

## Solution

### Option 1: Remove plugins manually in Netlify Dashboard (RECOMMENDED)

1. Go to **Netlify Dashboard** → Your site
2. Click **Site settings** → **Build & deploy** → **Build plugins**
3. Find and **DELETE** these plugins:
   - `@netlify/plugin-nextjs` ⚠️ MUST REMOVE
   - `netlify-plugin-html-validate` (optional)
   - `@netlify/plugin-lighthouse` (optional)
4. Click **Save** or **Update**

### Option 2: Create `.netlify/plugins.json` to explicitly disable

Create a file `.netlify/plugins.json` with:
```json
[]
```

This tells Netlify to not use any plugins.

### Option 3: Use environment variable

The `netlify.toml` now includes `NEXT_PRIVATE_TARGET = ""` to help prevent Next.js detection, but plugins installed in the dashboard will still run.

## Why this happens

Netlify auto-detects Next.js based on:
- Project structure (presence of `pages` or `app` directories)
- Package.json patterns
- File naming conventions

Even though this project doesn't have Next.js, Netlify's auto-detection can be triggered.

## Verification

After removing plugins, check the build logs:
- Should NOT see: "Installing plugins - @netlify/plugin-nextjs"
- Should NOT see: "Using Next.js Runtime"
- Should see: "vite build" running directly

