# Mini Games Arcade — Store Metadata

## App Identity
- **App Name:** Mini Games Arcade
- **Bundle ID / App ID:** `com.minigamesarcade.app`
- **Version:** 1.0.0
- **Build:** 1

---

## Short Description (80 chars max)
> Three fun mini games with global leaderboards. Free to play!

## Full Description (4000 chars max)
Mini Games Arcade is a collection of three fun and addictive mini games, each with global leaderboards so you can compete with players worldwide.

### Games Included:

**🎴 Memory Match**
Flip cards to find matching pairs! Choose from 1 or 2 players, and three difficulty levels (Easy, Medium, Hard). Race against the clock and beat your best time. Two-player mode lets you challenge a friend on the same device.

**🧱 Tetris**
The classic falling blocks puzzle! Rotate and place tetrominoes to complete lines and score points. Difficulty increases as levels progress. Full mobile controls with swipe support.

**🏰 Typing Defense**
Defend your castle by typing falling words before they reach you! Choose your grade level (1–6) and speed. Build combos to multiply your score. A fun and educational way to improve your typing speed.

### Features:
- 3 complete, polished mini games
- Global leaderboards powered by real-time database
- Works offline after first load (Progressive Web App)
- Dark theme designed for comfortable extended play
- Fully responsive — looks great on phone, tablet, and desktop
- No account required to play

---

## Keywords
games, mini games, arcade, tetris, memory match, typing game, puzzle, family, kids, leaderboard, free, offline

## Category
- **iOS:** Games > Puzzle
- **Android:** Games > Puzzle

## Content Rating
- **iOS:** 4+
- **Android:** Everyone

## Privacy Policy URL
https://[your-github-username].github.io/minigame/privacy-policy.html

---

## iOS-Specific

### App Store Screenshots (6.7" — iPhone 15 Pro Max: 1290×2796)
Required: 3–10 screenshots
Suggested scenes:
1. Home screen showing all 3 game cards
2. Memory Match gameplay (cards mid-flip)
3. Memory Match win screen with leaderboard
4. Tetris gameplay with pieces falling
5. Typing Defense mid-game with words falling

### iPad Screenshots (12.9" — iPad Pro: 2048×2732)
Required if supporting iPad: 3–10 screenshots

### App Preview Video (optional)
30-second video showing all 3 games

---

## Android-Specific

### Google Play Screenshots (Phone: 1080×1920 minimum)
Required: 2–8 screenshots
Same 5 scenes as iOS.

### Feature Graphic (1024×500 PNG)
Dark background (#1a1a2e) with app name "Mini Games Arcade" in large white text,
three game icons arranged left-to-right, tagline "3 Games · Global Leaderboards".

### Hi-res Icon (512×512 PNG)
Use `/icons/icon-512.png`

---

## iOS Submission Checklist

- [ ] Bundle ID `com.minigamesarcade.app` registered in Apple Developer Portal
- [ ] `ios/App/App/Info.plist` updated:
  - `GADApplicationIdentifier` — AdMob App ID
  - `NSUserTrackingUsageDescription` — "We use advertising IDs to show you relevant ads and support free access to the app."
  - `NSAppTransportSecurity` — `NSAllowsArbitraryLoads: false`
- [ ] Icons set via Xcode Asset Catalog (use generated `icons/*.png`)
- [ ] Version `1.0.0` / Build `1` set in Xcode target settings
- [ ] Tested on physical device or Xcode simulator (iOS 16+)
- [ ] Archive → Upload via Xcode Organizer
- [ ] App Store Connect listing complete (description, screenshots, privacy URL)
- [ ] Submit for review

## Android Submission Checklist

- [ ] Google Play Developer account created at play.google.com/console ($25 one-time fee)
- [ ] `android/app/build.gradle` updated:
  - `applicationId "com.minigamesarcade.app"`
  - `versionCode 1`
  - `versionName "1.0.0"`
  - `signingConfigs` pointing to `android/keystore.properties`
- [ ] `android/keystore.properties` created locally (NOT committed — already in .gitignore):
  ```
  storePassword=<your-keystore-password>
  keyPassword=<your-key-password>
  keyAlias=<your-key-alias>
  storeFile=<path-to-keystore.jks>
  ```
- [ ] `android/app/src/main/AndroidManifest.xml` updated:
  - AdMob App ID `<meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"/>`
- [ ] Build release AAB:
  ```bash
  cd android && ./gradlew bundleRelease
  ```
- [ ] Upload AAB to Play Console
- [ ] Complete store listing (description, screenshots, feature graphic)
- [ ] Content rating questionnaire completed
- [ ] Privacy policy URL added
- [ ] Submit for review

---

## AdMob Setup (do before submission)

1. Create AdMob account at admob.google.com
2. Add new app (iOS + Android separately)
3. Create ad units:
   - Banner (Home screen)
   - Interstitial (Game over)
   - Rewarded Video (Bonus button)
4. Replace test IDs in `js/ad-manager.js`:
   - `TEST_IDS.banner` → real banner ad unit ID
   - `TEST_IDS.interstitial` → real interstitial ad unit ID
   - `TEST_IDS.rewarded` → real rewarded ad unit ID
   - `ADSENSE_CLIENT` → real AdSense publisher ID (web)
5. Add AdMob App IDs to iOS `Info.plist` and Android `AndroidManifest.xml`
