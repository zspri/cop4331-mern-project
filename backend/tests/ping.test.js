const request = require('supertest');
const app = require('../app');

describe('GET /api/ping', () => {
    it('should return API working message', async () => {
        const res = await request(app).get('/api/ping');

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: 'API is working' });
    });
});