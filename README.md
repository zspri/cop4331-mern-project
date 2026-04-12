# COP4331 MERN Project

Full-stack project with:

- Node/Express backend API (`backend/`)
- Expo React Native mobile app (`mobile-app/`)
- Docker setup for backend API + exported web frontend (`docker-compose.yml`)

## Runtime Requirements

- Node.js: `20.x` or `22.x`
- npm: `10+`
- MongoDB instance for backend (`MONGO_URI`)
- Android Studio + Android Emulator (for Android mobile testing)
- Expo Go on emulator/device (or Android SDK for `expo run:android`)

## Repository Structure

```text
cop4331-mern-project/
	docker-compose.yml
	package.json
	backend/
		server.js
		config/db.js
		controllers/
		middleware/
		models/
		routes/
	mobile-app/
		App.tsx
		app.json
		package.json
		src/
			components/
			data/
			features/
			screens/
			theme/
			types/
```

## Backend Setup (Local)

1. Create `backend/.env` with:

```env
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
PORT=5001
```

2. Install dependencies and run backend:

```bash
cd backend
npm install
npm run dev
```

3. Quick health check:

```bash
GET http://localhost:5001/api/ping
```

## Mobile App Setup (Local)

1. Install dependencies:

```bash
cd mobile-app
npm install
```

2. Start Metro bundler:

```bash
npm run start
```

3. Launch Android app from Metro terminal:

- Press `a` for Android emulator
- Or scan QR with Expo Go on physical device

### Important Stability Notes

- Run only one Metro server at a time.
- If port collisions happen, stop old Expo/Node processes and restart Metro.
- If emulator jumps back to Expo Go home, clear Metro cache:

```bash
cd mobile-app
npm run start -- --clear
```

## Top-Level Scripts

From repository root:

```bash
npm run mobile
npm run mobile:android
npm run mobile:ios
npm run mobile:web
```

These proxy into `mobile-app/` scripts.

## Docker Procedures

This compose setup runs:

- `backend`: Node API on port `5001` (host network mode)
- `frontend`: static exported web build from Expo (`mobile-app`), served by Nginx on port `80`

Start:

```bash
docker compose up --build
```

Notes:

- Docker frontend is web export, not Android emulator runtime.
- Backend container expects `backend/.env` to exist on host.

## Common Procedures

### Fresh Mobile Dependency Sync

```bash
cd mobile-app
npx expo-doctor
npx expo install --check
```

### Backend + Mobile Together (Local)

1. Terminal 1:

```bash
cd backend
npm run dev
```

2. Terminal 2:

```bash
cd mobile-app
npm run start
```