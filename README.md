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

### Recently Added in Source

- Meal endpoints are mounted in backend/app.js in the source tree now.
- If your hosted backend was deployed before this change, it must be redeployed before the nutrition tab will work there.

### Backend (deployment note)

- The nutrition tab depends on /api/meals.
- Source is fixed in this repo, but any externally hosted backend must be rebuilt/redeployed to pick up the new route.

### Demo Deployment Note

- For the web demo, hosting the built web app and API behind a droplet/domain is the preferred presentation path.
- Keep the mobile emulator pointed at the hosted API so the emulator flow matches the web demo backend and avoids local networking issues.

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

### Mode 0: Hosted API demo (no local backend required)

```bash
cd mobile-app
npm install
npm run start:hosted
```

Use this mode for classroom demos when you want to avoid local backend startup.

Recommended demo strategy: use the droplet-hosted web demo for the browser presentation, and use the Android emulator only as a client against the same hosted API.

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
| Hosted API demo (no local backend) | `cd mobile-app && npm run start:hosted` | none | Expo mobile app talks to hosted API |
| Droplet web demo | `docker compose up -d` on the droplet | none | Nginx serves the web build and proxies API traffic |
| Native mobile dev (Android/iOS) | `cd backend && npm run dev` | `cd mobile-app && npx expo start -c` | Expo native app talks to local API |
| Mobile web dev | `cd backend && npm run dev` | `cd mobile-app && set EXPO_PUBLIC_API_BASE_URL=http://localhost:5001 && npx expo start --web` | Expo web app talks to local API |
| Docker web stack | `docker compose up -d` | none | Nginx serves web frontend and proxies /api |

Safety checks before login/signup testing:

1. Confirm backend health: `http://localhost:5001/api/ping`.
2. Ensure only one backend is bound to port 5001.
3. For Android emulator, ensure API host resolves to `10.0.2.2` when backend runs on host machine.
4. For hosted demos, confirm `https://cop4331mern.zachspri.ng/api/ping` before opening Expo.
5. For droplet web demos, confirm the droplet domain responds before you launch the browser presentation.

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

- If you are using a hosted backend, redeploy the backend so it includes the /api/meals route.
- If you are running locally, make sure backend/app.js includes app.use('/api/meals', mealRoutes).

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