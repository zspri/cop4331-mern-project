const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema(
  {
    exerciseName: {
      type: String,
      required: true,
      trim: true,
    },
    sets: {
      type: Number,
      required: true,
      min: 1,
    },
    reps: {
      type: Number,
      required: true,
      min: 1,
    },
    weight: {
      type: Number,
      default: 0,
      min: 0,
    },
    restTime: {
      type: Number,
      default: 60, // seconds
      min: 0,
    },
  },
);

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: 'General',
      trim: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    exercises: {
      type: [exerciseSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Workout', workoutSchema);