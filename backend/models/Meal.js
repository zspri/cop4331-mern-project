const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema(
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
    calories: {
      type: Number,
      default: 0,
      min: 0,
    },
    proteinG: {
      type: Number,
      default: 0,
      min: 0,
    },
    carbsG: {
      type: Number,
      default: 0,
      min: 0,
    },
    fatsG: {
      type: Number,
      default: 0,
      min: 0,
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Meal', mealSchema);
