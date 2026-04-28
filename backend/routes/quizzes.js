const express = require('express');
const Quiz = require('../models/Quiz');
const router = express.Router();

// Get quizzes by category and difficulty
router.get('/', async (req, res) => {
    const { cat, diff } = req.query;
    const filter = {};
    if (cat) filter.cat = cat;
    if (diff) filter.diff = diff;
    const quizzes = await Quiz.find(filter);
    res.json(quizzes);
});

// Add a quiz (admin only)
router.post('/', async (req, res) => {
    const { cat, diff, q, opts, correct, explanation } = req.body;
    try {
        const quiz = new Quiz({ cat, diff, q, opts, correct, explanation });
        await quiz.save();
        res.status(201).json(quiz);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a quiz (admin only)
router.delete('/:id', async (req, res) => {
    try {
        await Quiz.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
