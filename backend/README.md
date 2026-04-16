# Backend API (MuscleMeter+)

Express + MongoDB backend for authentication, workouts, and supporting account flows.

## Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT auth middleware
- Resend for transactional email

## Current Mounted Routes

- GET /api/ping
- /api/auth
  - POST /register
  - POST /login
  - GET /verify-email/:token
  - POST /resend-verification
  - POST /forgot-password
  - POST /reset-password/:token
  - GET /me (auth required)
- /api/workouts (auth required)
  - POST /
  - GET /
  - GET /:id
  - PATCH /:id
  - DELETE /:id
  - POST /:id/exercises
  - PATCH /:id/exercises/:exerciseId
  - DELETE /:id/exercises/:exerciseId

## Nutrition Routes

- /api/meals routes exist in backend/routes/mealRoutes.js and backend/controllers/mealController.js.
- They are mounted in backend/app.js in this source tree.
- If you are using an externally hosted backend, redeploy it so the new route is included.

## Environment Variables

Create backend/.env:

```env
MONGO_URI=<your_mongodb_uri>
PORT=5001
JWT_SECRET=<strong_secret>
RESEND_API_KEY=<required_for_email_flows>
RESEND_EMAIL_ADDRESS=<verified_sender_address>
BACKEND_URL=http://localhost:5001
CLIENT_URL=http://localhost:19006
DISABLE_EMAIL_VERIFICATION_FALLBACK=false
```

Notes:

- Register, verify, resend, forgot/reset password flows depend on email service configuration.
- In non-production environments, register will auto-verify users when email is not configured unless DISABLE_EMAIL_VERIFICATION_FALLBACK=true.

## Safe Local Run

```bash
cd backend
npm install
npm run dev
```

Expected startup logs:

- Server running on port 5001
- MongoDB connected

Health check:

```bash
curl http://localhost:5001/api/ping
```

## Tests

```bash
cd backend
npm test
```

## Operational Safety Practices

1. Keep .env out of version control.
2. Validate /api/ping before frontend/mobile testing.
3. Use only one backend instance bound to port 5001 at a time.
4. Do not use production credentials in local development.
5. Restart server after .env or dependency changes.

## Troubleshooting

### App crashes on startup

- Verify dependencies are installed: npm install.
- Check missing module errors in logs.
- Confirm .env values are present and formatted correctly.

### Login/register requests fail from mobile

1. Confirm backend is running and /api/ping works.
2. Confirm mobile points to reachable API host for its platform.
3. Check backend logs for incoming request lines and route errors.

### Email-related endpoints fail

- Ensure RESEND_API_KEY and RESEND_EMAIL_ADDRESS are configured.
- Confirm sender domain/address is valid in Resend.

### Nutrition tab still reports a server problem

- Make sure the backend version you are using includes /api/meals.
- If you are using the hosted deployment, rebuild/redeploy the backend after pulling this change.
