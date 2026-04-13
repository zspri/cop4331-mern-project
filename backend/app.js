const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const workoutRoutes = require('./routes/workoutRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log('Incoming request:', req.method, req.originalUrl);
    next();
});

app.get('/api/ping', (req, res) => {
    res.status(200).json({ message: 'API is working' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/workouts', workoutRoutes);

module.exports = app;