const express = require('express');
const Leaderboard = require('../models/Leaderboard');
const router = express.Router();

// Get leaderboard entries
router.get('/', async (req, res) => {
    const entries = await Leaderboard.find().sort({ pct: -1, score: -1 });
    res.json(entries);
});

// Add a leaderboard entry
router.post('/', async (req, res) => {
    const { name, score, total, pct, cat, date } = req.body;
    try {
        const entry = new Leaderboard({ name, score, total, pct, cat, date });
        await entry.save();
        res.status(201).json(entry);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete an entry (admin only)
router.delete('/:id', async (req, res) => {
    try {
        await Leaderboard.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
