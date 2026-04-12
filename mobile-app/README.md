# MuscleMeter+ Mobile App

React Native app built with Expo SDK 55 + TypeScript.

## Runtime Requirements

- Node.js `20.x` or `22.x`
- npm `10+`
- Android Studio with an Android Virtual Device (AVD) for emulator testing
- Expo Go installed in the emulator/device

## Current Tech Stack

- Expo `~55.0.14`
- React Native `^0.83.4`
- React `^19.2.0`
- TypeScript `~5.9.2`

## Local Setup

```bash
cd mobile-app
npm install
npm run start
```

Then use one of the following from the Metro terminal:

- Press `a` to open on Android emulator
- Press `w` to open web
- Scan QR code from Expo Go on physical device

## Available Scripts

```bash
npm run start      # Expo dev server (Metro)
npm run android    # Native Android run via expo run:android
npm run ios        # Native iOS run via expo run:ios
npm run web        # Expo web dev server
```

## Android Emulator Procedure

1. Start Android Studio and launch an emulator first.
2. Start Metro with `npm run start`.
3. Press `a` in the same terminal.

If `a` launches the app but Expo Go returns to its server list page, the app session likely disconnected or crashed. Use troubleshooting below.

## Troubleshooting

### 1. Clear Metro Cache

```bash
cd mobile-app
npm run start -- --clear
```

### 2. Ensure One Metro Server Only

Multiple Metro processes can cause reconnect loops and unstable behavior in Expo Go.

### 3. Verify Dependency Health

```bash
cd mobile-app
npx expo-doctor
npx expo install --check
```

### 4. Emulator Stability Issues

If the emulator screen flickers/resets:

- Cold boot the AVD
- Wipe emulator data
- Increase emulator RAM (2-4 GB)
- Switch graphics mode (Software/ANGLE)

## Folder Structure

```text
mobile-app/
  App.tsx
  app.json
  package.json
  tsconfig.json
  src/
    components/
      StatCard.tsx
    data/
      seed.ts
    features/
      recommendations.ts
    screens/
      DashboardScreen.tsx
      ForgotPasswordScreen.tsx
      LoginScreen.tsx
      NutritionScreen.tsx
      RegisterScreen.tsx
      ResetPasswordScreen.tsx
      WorkoutsScreen.tsx
    theme/
      colors.ts
    types/
      models.ts
```

## Core Data Models

- `WorkoutEntry`: date, type, duration, effort
- `MealEntry`: calories + macro breakdown + quality score
- `RecoveryEntry`: sleep, soreness, stress
- `UserProfile`: calorie/protein targets + weekly workout goal
