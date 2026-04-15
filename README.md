# COP4331 MERN Project (MuscleMeter+)

Full-stack fitness tracking project with:

- Node/Express + MongoDB backend API
- Expo React Native mobile app (Android, iOS, Web)
- Dockerized web deployment behind Nginx

## Current Repository Structure

- backend: Express API, Mongo models/controllers/routes, auth middleware, tests
- mobile-app: Expo React Native app with auth, dashboard, workouts, nutrition UI
- nginx: reverse proxy config for Docker deployment
- docker-compose.yml: production-style multi-container web stack

Backend-specific setup and route docs: backend/README.md

## Current Capabilities

### Backend (mounted and active)

- Auth endpoints under /api/auth
  - register, login, verify email, resend verification, forgot/reset password, me
- Workout endpoints under /api/workouts
  - CRUD workouts
  - nested exercise add/update/delete
- Health endpoint: GET /api/ping

### Backend (implemented but not mounted by default)

- Meal endpoints exist in route/controller files, but /api/meals is not currently mounted in backend/app.js.
- The mobile nutrition screens call /api/meals, so nutrition API calls will fail until meals are mounted.

### Mobile App

- Login/Register/Verify email screens
- Dashboard with readiness/coaching summary
- Workout management screens
- Nutrition screens (UI complete; depends on backend meals route mounting)
- Theme support and persisted session state

## Safest Practices Before Running

1. Use one backend mode at a time:
	- Local Node backend on port 5001, or Docker backend through Nginx.
	- Do not run both against the same ports simultaneously.
2. Keep secrets out of git:
	- Store secrets only in backend/.env.
	- Never commit API keys or production credentials.
3. Validate backend health first:
	- Confirm http://localhost:5001/api/ping responds before mobile login testing.
4. Start backend before frontend/mobile:
	- Avoid app booting with stale/unreachable API base URLs.
5. Use clean restarts after dependency or config changes:
	- Expo: npx expo start -c.
6. Emulator networking:
	- Android emulator cannot call host localhost directly.
	- Use 10.0.2.2 for host machine APIs when needed.
7. Configure email safely:
	- Set RESEND_API_KEY and RESEND_EMAIL_ADDRESS in backend/.env if using email flows.

## Environment Setup

Create backend/.env:

```env
MONGO_URI=<your_mongodb_uri>
PORT=5001
JWT_SECRET=<strong_secret>
RESEND_API_KEY=<optional_but_required_for_email_flows>
RESEND_EMAIL_ADDRESS=<verified_sender_email>
BACKEND_URL=http://localhost:5001
CLIENT_URL=http://localhost:19006
```

Notes:

- If RESEND values are missing, registration/verification email flows will fail.
- Login for existing verified users still depends on backend availability and DB connectivity.

## Run Modes

### Mode A: Local Backend + Mobile Native (recommended for development)

Terminal 1:

```bash
cd backend
npm install
npm run dev
```

Terminal 2:

```bash
cd mobile-app
npm install
npx expo start -c
```

Then launch Android/iOS from Expo.

### Mode B: Local Backend + Mobile Web

Terminal 1:

```bash
cd backend
npm run dev
```

Terminal 2:

```bash
cd mobile-app
set EXPO_PUBLIC_API_BASE_URL=http://localhost:5001
npx expo start --web
```

### Mode C: Docker Web Stack (Nginx + frontend + backend)

```bash
docker compose up -d
```

Open http://localhost.

Notes:

- This serves the exported web frontend, not Expo native runtime.
- Mobile emulator should still use Expo workflow (Mode A), not Docker web frontend.

## Quick Startup Matrix

Use this section when you want the fastest safe command set by scenario.

| Scenario | Terminal 1 | Terminal 2 | Result |
| --- | --- | --- | --- |
| Native mobile dev (Android/iOS) | `cd backend && npm run dev` | `cd mobile-app && npx expo start -c` | Expo native app talks to local API |
| Mobile web dev | `cd backend && npm run dev` | `cd mobile-app && set EXPO_PUBLIC_API_BASE_URL=http://localhost:5001 && npx expo start --web` | Expo web app talks to local API |
| Docker web stack | `docker compose up -d` | none | Nginx serves web frontend and proxies /api |

Safety checks before login/signup testing:

1. Confirm backend health: `http://localhost:5001/api/ping`.
2. Ensure only one backend is bound to port 5001.
3. For Android emulator, ensure API host resolves to `10.0.2.2` when backend runs on host machine.

## Verification Checklist

1. Backend logs show MongoDB connected and Server running on port 5001.
2. GET http://localhost:5001/api/ping returns API is working.
3. Mobile login request reaches backend (not Network request failed).
4. Unverified user login returns 403 with verify-email message.

## Troubleshooting

### Network request failed in mobile

1. Confirm backend is running: npm run dev in backend.
2. Test health endpoint: /api/ping.
3. Restart Expo with cache clear: npx expo start -c.
4. Confirm API base resolution for Android emulator (10.0.2.2 behavior).

### Nutrition requests fail

- /api/meals is not mounted in backend/app.js currently.
- Mount meal routes before expecting nutrition CRUD to work end-to-end.

### Email verification/register errors

- Set RESEND_API_KEY and RESEND_EMAIL_ADDRESS in backend/.env.

## Useful Commands

From repo root:

```bash
npm run mobile
npm run mobile:android
npm run mobile:ios
npm run mobile:web
```