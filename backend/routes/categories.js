const express = require('express');
const Category = require('../models/Category');
const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
    const cats = await Category.find();
    res.json(cats);
});

// Add a category (admin only)
router.post('/', async (req, res) => {
    const { name, icon, tag, desc } = req.body;
    try {
        const cat = new Category({ name, icon, tag, desc });
        await cat.save();
        res.status(201).json(cat);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a category (admin only)
router.delete('/:id', async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
