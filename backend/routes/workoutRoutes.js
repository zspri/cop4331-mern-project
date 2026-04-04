const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

const {
    createWorkout,
    getWorkouts,
    getWorkoutById,
    updateWorkout,
    deleteWorkout,
    addExerciseToWorkout,
    updateExerciseInWorkout,
    deleteExerciseFromWorkout,
} = require('../controllers/workoutController');

router.route('/')
    .post(authMiddleware, createWorkout)
    .get(authMiddleware, getWorkouts);

router.route('/:id')
    .get(authMiddleware, getWorkoutById)
    .patch(authMiddleware, updateWorkout)
    .delete(authMiddleware, deleteWorkout);

router.post('/:id/exercises', authMiddleware, addExerciseToWorkout);
router.patch('/:id/exercises/:exerciseId', authMiddleware, updateExerciseInWorkout);
router.delete('/:id/exercises/:exerciseId', authMiddleware, deleteExerciseFromWorkout);

module.exports = router;