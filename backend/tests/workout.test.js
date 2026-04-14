const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const connectDB = require('../config/db');
const User = require('../models/User');

jest.setTimeout(15000);

let token = '';
let workoutId = '';
let exerciseId = '';

const testUser = {
    firstName: 'Workout',
    lastName: 'Tester',
    email: `workout${Date.now()}@example.com`,
    password: 'Password123!'
};

beforeAll(async () => {
    await connectDB();

    // Register test user
    await request(app)
        .post('/api/auth/register')
        .send(testUser);

    // Mark verified if your app requires verification before login
    await User.findOneAndUpdate(
        { email: testUser.email },
        { isVerified: true }
    );

    // Login and save token
    const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
            email: testUser.email,
            password: testUser.password
        });

    token = loginRes.body.token;
});

describe('Workout API', () => {
    it('should create a new workout', async () => {
        const res = await request(app)
            .post('/api/workouts')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Leg Day',
                day: 'Monday',
                exercises: [
                    {
                        exerciseName: 'Squat',
                        sets: 4,
                        reps: 8,
                        weight: 185,
                        restTime: 90
                    }
                ]
            });

        expect([200, 201]).toContain(res.statusCode);
        expect(res.body).toBeDefined();

        // adjust these keys if your response shape is different
        workoutId = res.body._id || res.body.workout?._id;
        expect(workoutId).toBeDefined();

        const exercises = res.body.exercises || res.body.workout?.exercises || [];
        if (exercises.length > 0) {
            exerciseId = exercises[0]._id;
        }
    });

    it('should get all workouts for the logged-in user', async () => {
        const res = await request(app)
            .get('/api/workouts')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should get a single workout by id', async () => {
        const res = await request(app)
            .get(`/api/workouts/${workoutId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeDefined();
        expect(res.body._id || res.body.workout?._id).toBe(workoutId);
    });

    it('should update a workout', async () => {
        const res = await request(app)
            .patch(`/api/workouts/${workoutId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Updated Leg Day'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeDefined();

        const updatedName = res.body.name || res.body.workout?.name;
        expect(updatedName).toBe('Updated Leg Day');
    });

    it('should fail to create workout without token', async () => {
        const res = await request(app)
            .post('/api/workouts')
            .send({
                name: 'No Auth Workout'
            });

        expect(res.statusCode).toBe(401);
    });
});

describe('Exercise API', () => {
    it('should add an exercise to an existing workout', async () => {
        const addRes = await request(app)
            .post(`/api/workouts/${workoutId}/exercises`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                exerciseName: 'Leg Press',
                sets: 3,
                reps: 10,
                weight: 250,
                restTime: 60
            });

        expect([200, 201]).toContain(addRes.statusCode);

        // Get the workout again so we can grab the real exerciseId from DB response
        const getRes = await request(app)
            .get(`/api/workouts/${workoutId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(getRes.statusCode).toBe(200);

        const workout = getRes.body.workout || getRes.body;
        const exercises = workout.exercises || [];

        const addedExercise = exercises.find(
            (ex) => ex.exerciseName === 'Leg Press'
        );

        expect(addedExercise).toBeDefined();
        exerciseId = addedExercise._id.toString();
    });

    it('should update an exercise inside a workout', async () => {
        const res = await request(app)
            .patch(`/api/workouts/${workoutId}/exercises/${exerciseId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                weight: 275,
                reps: 12
            });

        expect(res.statusCode).toBe(200);

        const getRes = await request(app)
            .get(`/api/workouts/${workoutId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(getRes.statusCode).toBe(200);

        const workout = getRes.body.workout || getRes.body;
        const exercises = workout.exercises || [];

        const updatedExercise = exercises.find(
            (ex) => ex._id.toString() === exerciseId
        );

        expect(updatedExercise).toBeDefined();
        expect(updatedExercise.weight).toBe(275);
        expect(updatedExercise.reps).toBe(12);
    });

    it('should delete an exercise from a workout', async () => {
        const res = await request(app)
            .delete(`/api/workouts/${workoutId}/exercises/${exerciseId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);

        const getRes = await request(app)
            .get(`/api/workouts/${workoutId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(getRes.statusCode).toBe(200);

        const workout = getRes.body.workout || getRes.body;
        const exercises = workout.exercises || [];

        const deletedExercise = exercises.find(
            (ex) => ex._id.toString() === exerciseId
        );

        expect(deletedExercise).toBeUndefined();
    });
});

describe('Delete Workout', () => {
    it('should delete a workout', async () => {
        const res = await request(app)
            .delete(`/api/workouts/${workoutId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});