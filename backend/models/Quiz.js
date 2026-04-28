const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    cat: { type: String, required: true }, // category tag
    diff: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    q: { type: String, required: true },
    opts: [{ type: String, required: true }],
    correct: { type: Number, required: true }, // index of correct option
    explanation: { type: String },
});

module.exports = mongoose.model('Quiz', QuizSchema);