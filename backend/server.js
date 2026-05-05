const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const dataDir = path.join(__dirname, 'data');
const quizzesPath = path.join(dataDir, 'quizzes.json');
const categoriesPath = path.join(dataDir, 'categories.json');
const leaderboardPath = path.join(dataDir, 'leaderboard.json');

const defaultCategories = [
  { id: 1, name: 'Science', icon: 'fa-flask', tag: 'science', desc: 'Physics, chemistry, biology' },
  { id: 2, name: 'History', icon: 'fa-landmark', tag: 'history', desc: 'Past events' },
  { id: 3, name: 'Technology', icon: 'fa-microchip', tag: 'technology', desc: 'Computers & innovation' },
  { id: 4, name: 'Geography', icon: 'fa-globe', tag: 'geography', desc: 'Countries & nature' }
];

const defaultQuizzes = [
  {
    id: 1,
    category: 'science',
    difficulty: 'easy',
    question: 'What planet is known as the Red Planet?',
    options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
    correct: 1,
    explanation: 'Mars is called the Red Planet.'
  },
  {
    id: 2,
    category: 'science',
    difficulty: 'easy',
    question: 'Water chemical formula?',
    options: ['H2O', 'CO2', 'O2', 'NaCl'],
    correct: 0,
    explanation: 'Water = H2O'
  }
];

const defaultLeaderboard = [
  {
    id: 1,
    name: 'Ali',
    score: 8,
    total: 10,
    pct: 80,
    cat: 'science',
    date: new Date().toISOString()
  }
];

function ensureDataDirectory() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function safeReadJson(filePath, defaultData) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf8');
      return defaultData;
    }
    const raw = fs.readFileSync(filePath, 'utf8').trim();
    if (!raw) {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf8');
      return defaultData;
    }
    return JSON.parse(raw);
  } catch (err) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf8');
    return defaultData;
  }
}

function saveJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function loadDataFiles() {
  ensureDataDirectory();
  const categories = safeReadJson(categoriesPath, defaultCategories);
  const quizzes = safeReadJson(quizzesPath, defaultQuizzes);
  const leaderboard = safeReadJson(leaderboardPath, defaultLeaderboard);
  return { categories, quizzes, leaderboard };
}

app.get('/', (req, res) => {
  res.send('QuizMaster Backend Running ✔');
});

app.get('/api/quizzes', (req, res) => {
  const { quizzes } = loadDataFiles();
  const { cat, diff } = req.query;
  let result = quizzes;
  if (cat) result = result.filter((q) => q.category === cat || q.cat === cat);
  if (diff) result = result.filter((q) => q.difficulty === diff || q.diff === diff);
  res.json(result);
});

app.post('/api/quizzes', (req, res) => {
  const { category, difficulty, question, options, correct, explanation } = req.body;
  if (!category || !difficulty || !question || !options || options.length !== 4 || correct === undefined) {
    return res.status(400).json({ error: 'Invalid quiz payload' });
  }

  const data = loadDataFiles();
  const nextId = data.quizzes.length > 0 ? Math.max(...data.quizzes.map((q) => q.id)) + 1 : 1;
  const newQuiz = {
    id: nextId,
    category,
    difficulty,
    question,
    options,
    correct,
    explanation: explanation || ''
  };
  data.quizzes.push(newQuiz);
  saveJson(quizzesPath, data.quizzes);
  res.status(201).json(newQuiz);
});

app.put('/api/quizzes/:id', (req, res) => {
  const quizId = parseInt(req.params.id, 10);
  const { category, difficulty, question, options, correct, explanation } = req.body;
  const data = loadDataFiles();
  const quiz = data.quizzes.find((q) => q.id === quizId);
  if (!quiz) {
    return res.status(404).json({ error: 'Quiz not found' });
  }
  if (category) quiz.category = category;
  if (difficulty) quiz.difficulty = difficulty;
  if (question) quiz.question = question;
  if (options && Array.isArray(options) && options.length === 4) quiz.options = options;
  if (typeof correct === 'number') quiz.correct = correct;
  if (explanation !== undefined) quiz.explanation = explanation;
  saveJson(quizzesPath, data.quizzes);
  res.json(quiz);
});

app.delete('/api/quizzes/:id', (req, res) => {
  const quizId = parseInt(req.params.id, 10);
  const data = loadDataFiles();
  const index = data.quizzes.findIndex((q) => q.id === quizId);
  if (index === -1) {
    return res.status(404).json({ error: 'Quiz not found' });
  }
  data.quizzes.splice(index, 1);
  saveJson(quizzesPath, data.quizzes);
  res.json({ success: true });
});

app.get('/api/categories', (req, res) => {
  const { categories } = loadDataFiles();
  res.json(categories);
});

app.post('/api/categories', (req, res) => {
  const { name, icon, tag, desc } = req.body;
  if (!name || !tag) {
    return res.status(400).json({ error: 'Invalid category payload' });
  }
  const data = loadDataFiles();
  const nextId = data.categories.length > 0 ? Math.max(...data.categories.map((c) => c.id)) + 1 : 1;
  const newCategory = { id: nextId, name, icon: icon || '', tag, desc: desc || '' };
  data.categories.push(newCategory);
  saveJson(categoriesPath, data.categories);
  res.status(201).json(newCategory);
});

app.delete('/api/categories/:id', (req, res) => {
  const categoryId = parseInt(req.params.id, 10);
  const data = loadDataFiles();
  const index = data.categories.findIndex((c) => c.id === categoryId);
  if (index === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }
  data.categories.splice(index, 1);
  saveJson(categoriesPath, data.categories);
  res.json({ success: true });
});

app.get('/api/leaderboard', (req, res) => {
  const { leaderboard } = loadDataFiles();
  const sorted = [...leaderboard].sort((a, b) => {
    if (b.pct !== a.pct) return b.pct - a.pct;
    return b.score - a.score;
  });
  res.json(sorted);
});

app.post('/api/leaderboard', (req, res) => {
  const { name, score, total, pct, cat, date } = req.body;
  if (!name || typeof score !== 'number' || typeof total !== 'number' || typeof pct !== 'number') {
    return res.status(400).json({ error: 'Invalid leaderboard payload' });
  }
  const data = loadDataFiles();
  const nextId = data.leaderboard.length > 0 ? Math.max(...data.leaderboard.map((l) => l.id)) + 1 : 1;
  const entry = { id: nextId, name, score, total, pct, cat: cat || '', date: date || new Date().toISOString() };
  data.leaderboard.push(entry);
  saveJson(leaderboardPath, data.leaderboard);
  res.status(201).json(entry);
});

app.delete('/api/leaderboard/:id', (req, res) => {
  const entryId = parseInt(req.params.id, 10);
  const data = loadDataFiles();
  const index = data.leaderboard.findIndex((l) => l.id === entryId);
  if (index === -1) {
    return res.status(404).json({ error: 'Leaderboard entry not found' });
  }
  data.leaderboard.splice(index, 1);
  saveJson(leaderboardPath, data.leaderboard);
  res.json({ success: true });
});

ensureDataDirectory();
loadDataFiles();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
