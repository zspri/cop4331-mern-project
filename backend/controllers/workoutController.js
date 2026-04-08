const Workout = require('../models/Workout');

const createWorkout = async (req, res) => {
    try {
        const { name, category, notes, exercises } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Workout name is required' });
        }

        const workout = await Workout.create({
            user: req.user.userId,
            name,
            category,
            notes,
            exercises: exercises || [],
        });

        return res.status(201).json(workout);
    } catch (error) {
        console.error('createWorkout error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

const getWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.find({ user: req.user.userId }).sort({
            createdAt: -1,
        });

        return res.status(200).json(workouts);
    } catch (error) {
        console.error('getWorkouts error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

const getWorkoutById = async (req, res) => {
    try {
        const workout = await Workout.findOne({
            _id: req.params.id,
            user: req.user.userId,
        });

        if (!workout) {
            return res.status(404).json({ error: 'Workout not found' });
        }

        return res.status(200).json(workout);
    } catch (error) {
        console.error('getWorkoutById error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

const updateWorkout = async (req, res) => {
    try {
        const workout = await Workout.findOne({
            _id: req.params.id,
            user: req.user.userId,
        });

        if (!workout) {
            return res.status(404).json({ error: 'Workout not found' });
        }

        const { name, category, notes, exercises } = req.body;

        if (name !== undefined) workout.name = name;
        if (category !== undefined) workout.category = category;
        if (notes !== undefined) workout.notes = notes;
        if (exercises !== undefined) workout.exercises = exercises;

        await workout.save();

        return res.status(200).json(workout);
    } catch (error) {
        console.error('updateWorkout error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

const deleteWorkout = async (req, res) => {
    try {
        const workout = await Workout.findOne({
            _id: req.params.id,
            user: req.user.userId,
        });

        if (!workout) {
            return res.status(404).json({ error: 'Workout not found' });
        }

        await workout.deleteOne();

        return res.status(200).json({ message: 'Workout deleted successfully' });
    } catch (error) {
        console.error('deleteWorkout error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

const addExerciseToWorkout = async (req, res) => {
    try {
        const { exerciseName, sets, reps, weight, restTime } = req.body;

        if (!exerciseName || !sets || !reps) {
            return res.status(400).json({
                error: 'exerciseName, sets, and reps are required',
            });
        }

        const workout = await Workout.findOne({
            _id: req.params.id,
            user: req.user.userId,
        });

        if (!workout) {
            return res.status(404).json({ error: 'Workout not found' });
        }

        const newExercise = {
            exerciseName,
            sets,
            reps,
            weight: weight || 0,
            restTime: restTime || 60,
        };

        workout.exercises.push(newExercise);
        await workout.save();

        return res.status(200).json({
            message: 'Exercise added successfully',
            workout,
        });
    } catch (error) {
        console.error('addExerciseToWorkout error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

const updateExerciseInWorkout = async (req, res) => {
    try {
        const workout = await Workout.findOne({
            _id: req.params.id,
            user: req.user.userId,
        });

        if (!workout) {
            return res.status(404).json({ error: 'Workout not found' });
        }

        const exercise = workout.exercises.id(req.params.exerciseId);

        if (!exercise) {
            return res.status(404).json({ error: 'Exercise not found' });
        }

        const { exerciseName, sets, reps, weight, restTime } = req.body;

        if (exerciseName !== undefined) exercise.exerciseName = exerciseName;
        if (sets !== undefined) exercise.sets = sets;
        if (reps !== undefined) exercise.reps = reps;
        if (weight !== undefined) exercise.weight = weight;
        if (restTime !== undefined) exercise.restTime = restTime;

        await workout.save();

        return res.status(200).json({
            message: 'Exercise updated successfully',
            workout,
        });
    } catch (error) {
        console.error('updateExerciseInWorkout error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

const deleteExerciseFromWorkout = async (req, res) => {
    try {
        const workout = await Workout.findOne({
            _id: req.params.id,
            user: req.user.userId,
        });

        if (!workout) {
            return res.status(404).json({ error: 'Workout not found' });
        }

        const exercise = workout.exercises.id(req.params.exerciseId);

        if (!exercise) {
            return res.status(404).json({ error: 'Exercise not found' });
        }

        exercise.deleteOne();
        await workout.save();

        return res.status(200).json({
            message: 'Exercise deleted successfully',
            workout,
        });
    } catch (error) {
        console.error('deleteExerciseFromWorkout error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    createWorkout,
    getWorkouts,
    getWorkoutById,
    updateWorkout,
    deleteWorkout,
    addExerciseToWorkout,
    updateExerciseInWorkout,
    deleteExerciseFromWorkout,
};