# DailyMath iOS App

## Project Information

**App Name:** DailyMath  
**Bundle ID:** com.davidgraham.dailymath  
**Platform:** iOS (Capacitor)  
**Location:** `ios/` folder (generated, not in Git)

## Project Structure

```
sonic-filament/
├── ios/                    # Native iOS project (Xcode workspace)
│   └── App/
│       └── App.xcworkspace # Open this in Xcode
├── capacitor.config.ts     # Capacitor configuration
├── src/                    # React source code
└── dist/                   # Built web assets (synced to iOS)
```

## How It Works

The iOS app is a **wrapper** around the web app:
1. Your React code in `src/` gets built to `dist/`
2. Capacitor copies `dist/` content to the native iOS project
3. The iOS app displays your web app in a native WebView
4. Capacitor provides bridge to native iOS APIs (like Preferences for storing API key)

## Common Commands

### Development
```bash
# Build web app and sync to iOS
npm run build && npx cap sync ios

# Open in Xcode
npx cap open ios
```

### Making Changes
1. Edit your React code in `src/`
2. Run `npm run build`
3. Run `npx cap sync ios`
4. In Xcode, click Run ▶️

## Important Files

- **capacitor.config.ts** - App ID, name, and configuration
- **ios/** - Native Xcode project (auto-generated, don't edit manually)
- **dist/** - Built web assets (auto-generated from src/)

## Why iOS Folder is Hidden from Git

The `ios/` folder is added to `.gitignore` because:
- It's auto-generated from your source code
- Can be recreated with `npx cap add ios`
- Keeps the Git repo clean
- Only source files (src/, capacitor.config.ts) are tracked

## Regenerating iOS Project

If you need to start fresh:
```bash
# Remove iOS folder
rm -rf ios/

# Recreate it
npx cap add ios

# Build and sync
npm run build && npx cap sync ios
```

## Publishing to App Store

1. Open in Xcode: `npx cap open ios`
2. Select "Any iOS Device (arm64)" as target
3. Product → Archive
4. Upload to App Store Connect
5. Submit for review

## Settings & Configuration

The app includes a Settings screen (⚙️ icon) where users can:
- Save their OpenAI API key persistently
- The key is stored using Capacitor Preferences API
- Key persists across app restarts
