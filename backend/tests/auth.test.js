const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

jest.setTimeout(15000);

beforeAll(async () => {
    await connectDB();
});

describe('Auth API', () => {
    const testUser = {
        firstName: 'Test',
        lastName: 'User',
        email: `test${Date.now()}@example.com`,
        password: 'Password123!'
    };

    let token = '';

    beforeAll(async () => {
        await request(app)
            .post('/api/auth/register')
            .send(testUser);

        // Make the test user verified so login is allowed
        await User.findOneAndUpdate(
            { email: testUser.email },
            { isVerified: true }
        );
    });

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                firstName: 'Another',
                lastName: 'User',
                email: `another${Date.now()}@example.com`,
                password: 'Password123!'
            });

        expect([200, 201]).toContain(res.statusCode);
        expect(res.body).toBeDefined();
    });

    it('should fail if required fields are missing', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                email: '',
                password: ''
            });

        expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });

    it('should login successfully', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();

        token = res.body.token;
    });

    it('should fail with wrong password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: 'wrongpassword'
            });

        expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });

    it('should get current user with valid token', async () => {
        const res = await request(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeDefined();
    });

    it('should fail without token', async () => {
        const res = await request(app).get('/api/auth/me');
        expect(res.statusCode).toBe(401);
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});