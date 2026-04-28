const mongoose = require('mongoose');

const LeaderboardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    pct: { type: Number, required: true },
    cat: { type: String, required: true },
    date: { type: String, required: true },
});

module.exports = mongoose.model('Leaderboard', LeaderboardSchema);