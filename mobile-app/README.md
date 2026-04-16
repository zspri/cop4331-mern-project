# MuscleMeter+ Mobile App

Expo React Native frontend for auth, dashboard, workouts, and nutrition workflows.

Default API target: hosted backend at https://cop4331mern.zachspri.ng

For the presentation, the safest plan is to keep the emulator and the web demo pointed at the same hosted API or droplet-backed API endpoint so the client path is consistent.

## Platform Targets

- Android emulator/device
- iOS simulator/device
- Web (Expo web)

## Tech Stack

- Expo SDK 55
- React Native 0.83.x
- React 19
- TypeScript
- AsyncStorage session persistence

## Current Mobile Capabilities

- Authentication UI:
  - Login
  - Register
  - Verify email
  - Resend verification email
- Dashboard summary cards and readiness guidance
- Workouts CRUD screens
- Nutrition CRUD screens (requires /api/meals on backend)
- Theme toggling and persisted session state

## Backend Dependency

The app expects the backend API base URL and calls endpoints like:

- /api/auth/*
- /api/workouts/*
- /api/meals/*

Important:

- Auth and workouts are mounted in backend/app.js.
- Meals routes exist in backend files but are not mounted by default, so nutrition API operations can fail until backend wiring is completed.

## Safe Run Workflow (Recommended)

### Option A: Hosted API demo mode (no local backend required)

```bash
cd mobile-app
npm install
npm run start:hosted
```

This is the safest demo path when you do not want to run backend locally.

If your web demo is deployed to a droplet/domain, use that hosted backend for the presentation and keep the emulator pointed at the same API.

For the most production-like demo runtime (fewer dev-only overlays and faster interaction after bundle):

```bash
cd mobile-app
npm install
npm run start:demo
```

### Option B: Local backend mode (for backend debugging)

1. Start backend first:

```bash
cd ../backend
npm install
npm run dev
```

2. Verify backend health:

```bash
curl http://localhost:5001/api/ping
```

3. Start Expo with clean cache:

```bash
cd ../mobile-app
npm install
npx expo start -c
```

4. Launch target platform from Expo UI.

## Environment Configuration

Optional override:

- EXPO_PUBLIC_API_BASE_URL

Examples:

- Hosted backend: https://cop4331mern.zachspri.ng
- Android emulator local backend: http://10.0.2.2:5001

Notes:

- The app defaults to hosted API when EXPO_PUBLIC_API_BASE_URL is not provided.
- On Android, EXPO_PUBLIC_API_BASE_URL values using localhost/127.0.0.1/::1 are auto-mapped to 10.0.2.2.
- If you still see transport errors, explicitly set EXPO_PUBLIC_API_BASE_URL and restart Expo.
- For demo day, prefer a single hosted API endpoint for both the emulator and web demo rather than mixing hosted and local backends.

## Scripts

```bash
npm run start
npm run start:hosted
npm run start:local
npm run start:demo
npm run start:demo:local
npm run android
npm run ios
npm run web
npm run verify
```

## Pre-Demo Fast Verification

Run this once before presenting:

```bash
cd mobile-app
npm run verify
```

This runs TypeScript checks and Expo doctor checks to catch configuration regressions before launch.

## Project Layout

```text
mobile-app/
  App.tsx
  app.json
  package.json
  tsconfig.json
  src/
    components/
    config/
      api.ts
    data/
    features/
    screens/
      DashboardScreen.tsx
      LoginScreen.tsx
      NutritionScreen.tsx
      RegisterScreen.tsx
      VerifyEmailScreen.tsx
      WorkoutsScreen.tsx
      nutrition/
      workouts/
    theme/
    types/
```

## Troubleshooting

### Network request failed

1. Confirm backend is running on port 5001.
2. Confirm /api/ping returns API is working.
3. Restart Expo with npx expo start -c.
4. If using hosted mode, confirm https://cop4331mern.zachspri.ng/api/ping is reachable.
5. If using local mode, ensure API target is http://10.0.2.2:5001 on Android emulator.

### Login should return verify-email but does not

- This usually means request transport failed before backend response.
- Fix connectivity first, then retry login.

### Nutrition screens load errors

- If the backend is local, make sure /api/meals is mounted in backend/app.js.
- If the backend is hosted, the deployment must include the latest backend build with /api/meals.
