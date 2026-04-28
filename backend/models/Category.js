const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    icon: { type: String, required: true }, // e.g., 'fa-solid fa-flask'
    tag: { type: String, required: true, unique: true }, // e.g., 'science'
    desc: { type: String },
});

module.exports = mongoose.model('Category', CategorySchema);