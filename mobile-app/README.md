# MuscleMeter+ Mobile App

Expo React Native frontend for auth, dashboard, workouts, and nutrition workflows.

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

- Web local backend: http://localhost:5001
- Android emulator to host backend: http://10.0.2.2:5001

Notes:

- The app includes runtime host resolution logic and Android loopback handling.
- If you still see transport errors, explicitly set EXPO_PUBLIC_API_BASE_URL and restart Expo.

## Scripts

```bash
npm run start
npm run android
npm run ios
npm run web
```

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
4. For Android emulator, ensure API target resolves to 10.0.2.2 when backend is on host machine.

### Login should return verify-email but does not

- This usually means request transport failed before backend response.
- Fix connectivity first, then retry login.

### Nutrition screens load errors

- Backend /api/meals route must be mounted in backend/app.js for full nutrition API support.
