const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createMeal, getMeals, getMealById, updateMeal, deleteMeal } = require('../controllers/mealController');

router.route('/')
    .post(authMiddleware, createMeal)
    .get(authMiddleware, getMeals);

router.route('/:id')
    .get(authMiddleware, getMealById)
    .patch(authMiddleware, updateMeal)
    .delete(authMiddleware, deleteMeal);

module.exports = router;
