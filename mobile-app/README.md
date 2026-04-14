# MuscleMeter+ Mobile Starter

Basic React Native (Expo + TypeScript) starter for workout + diet tracking.

## Quick Start

```bash
cd mobile-app
npm install
npm run start
```

Then open on Android emulator/device from Expo.

## Folder Schema

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
      WorkoutsScreen.tsx
      NutritionScreen.tsx
    theme/
      colors.ts
    types/
      models.ts
```

## Data Schema (Core Entities)

- `WorkoutEntry`: date, type, duration, effort
- `MealEntry`: calories + macro breakdown + quality score
- `RecoveryEntry`: sleep, soreness, stress
- `UserProfile`: calorie/protein targets + weekly workout goal

## Why This Stands Out

A simple tracker is common. The `readiness score` makes this more useful:

- It combines sleep + soreness + stress.
- It gives a daily coach tip (push hard, deload, or prioritize protein).
- It is lightweight to compute and easy to demo in a class project.

This gives your app a "smart coach" angle without requiring heavy ML.
