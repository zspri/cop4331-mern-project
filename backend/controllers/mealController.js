const Meal = require('../models/Meal');

const createMeal = async (req, res) => {
    try {
        const { name, calories, proteinG, carbsG, fatsG, date } = req.body;
        if (!name) return res.status(400).json({ error: 'Meal name is required' });
        const meal = await Meal.create({
            user: req.user._id,
            name,
            calories: calories || 0,
            proteinG: proteinG || 0,
            carbsG: carbsG || 0,
            fatsG: fatsG || 0,
            date: date || new Date().toISOString().split('T')[0],
        });
        return res.status(201).json(meal);
    } catch (error) {
        console.error('createMeal error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

const getMeals = async (req, res) => {
    try {
        const meals = await Meal.find({ user: req.user._id }).sort({ createdAt: -1 });
        return res.status(200).json(meals);
    } catch (error) {
        console.error('getMeals error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

const getMealById = async (req, res) => {
    try {
        const meal = await Meal.findOne({ _id: req.params.id, user: req.user._id });
        if (!meal) return res.status(404).json({ error: 'Meal not found' });
        return res.status(200).json(meal);
    } catch (error) {
        console.error('getMealById error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

const updateMeal = async (req, res) => {
    try {
        const meal = await Meal.findOne({ _id: req.params.id, user: req.user._id });
        if (!meal) return res.status(404).json({ error: 'Meal not found' });
        const { name, calories, proteinG, carbsG, fatsG, date } = req.body;
        if (name !== undefined) meal.name = name;
        if (calories !== undefined) meal.calories = calories;
        if (proteinG !== undefined) meal.proteinG = proteinG;
        if (carbsG !== undefined) meal.carbsG = carbsG;
        if (fatsG !== undefined) meal.fatsG = fatsG;
        if (date !== undefined) meal.date = date;
        await meal.save();
        return res.status(200).json(meal);
    } catch (error) {
        console.error('updateMeal error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

const deleteMeal = async (req, res) => {
    try {
        const meal = await Meal.findOne({ _id: req.params.id, user: req.user._id });
        if (!meal) return res.status(404).json({ error: 'Meal not found' });
        await meal.deleteOne();
        return res.status(200).json({ message: 'Meal deleted successfully' });
    } catch (error) {
        console.error('deleteMeal error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { createMeal, getMeals, getMealById, updateMeal, deleteMeal };
