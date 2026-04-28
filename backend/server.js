
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// In-memory data
let categories = [
    { id: 1, name: 'Science', icon: 'fa-flask', tag: 'science', desc: 'Physics, chemistry, biology, and more.' },
    { id: 2, name: 'History', icon: 'fa-landmark', tag: 'history', desc: 'Events, people, and places from the past.' },
    { id: 3, name: 'Technology', icon: 'fa-microchip', tag: 'technology', desc: 'Computers, gadgets, and innovation.' },
    { id: 4, name: 'Geography', icon: 'fa-globe', tag: 'geography', desc: 'Countries, capitals, and nature.' },
    { id: 5, name: 'Pop Culture', icon: 'fa-music', tag: 'popculture', desc: 'Movies, music, and celebrities.' },
    { id: 6, name: 'Sports', icon: 'fa-futbol', tag: 'sports', desc: 'Games, teams, and athletes.' },
    { id: 7, name: 'Math', icon: 'fa-square-root-alt', tag: 'math', desc: 'Numbers, logic, and puzzles.' },
    { id: 8, name: 'Language', icon: 'fa-language', tag: 'language', desc: 'Words, grammar, and linguistics.' },
];
let quizzes = [];
let leaderboard = [];
let nextCatId = 9;
let nextQuizId = 1;
let nextLbId = 1;

// Root route
app.get('/', (req, res) => {
    res.send('QuizMaster Backend Running (In-Memory)');
});

// Categories API
app.get('/api/categories', (req, res) => {
    res.json(categories);
});
app.post('/api/categories', (req, res) => {
    const { name, icon, tag, desc } = req.body;
    const cat = { id: nextCatId++, name, icon, tag, desc };
    categories.push(cat);
    res.status(201).json(cat);
});
app.delete('/api/categories/:id', (req, res) => {
    categories = categories.filter(c => c.id !== parseInt(req.params.id));
    res.json({ success: true });
});

// Quizzes API
app.get('/api/quizzes', (req, res) => {
    const { cat, diff } = req.query;
    let data = quizzes;
    if (cat) data = data.filter(q => q.cat === cat);
    if (diff) data = data.filter(q => q.diff === diff);
    res.json(data);
});
app.post('/api/quizzes', (req, res) => {
    const { cat, diff, q, opts, correct, explanation } = req.body;
    const quiz = { id: nextQuizId++, cat, diff, q, opts, correct, explanation };
    quizzes.push(quiz);
    res.status(201).json(quiz);
});
app.delete('/api/quizzes/:id', (req, res) => {
    quizzes = quizzes.filter(q => q.id !== parseInt(req.params.id));
    res.json({ success: true });
});

// Leaderboard API
app.get('/api/leaderboard', (req, res) => {
    res.json(leaderboard.sort((a, b) => b.pct - a.pct || b.score - a.score));
});
app.post('/api/leaderboard', (req, res) => {
    const { name, score, total, pct, cat, date } = req.body;
    const entry = { id: nextLbId++, name, score, total, pct, cat, date };
    leaderboard.push(entry);
    res.status(201).json(entry);
});
app.delete('/api/leaderboard/:id', (req, res) => {
    leaderboard = leaderboard.filter(e => e.id !== parseInt(req.params.id));
    res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (in-memory)`);
});
