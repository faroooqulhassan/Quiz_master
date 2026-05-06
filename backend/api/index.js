const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

/* ================= CORS FIX (VERCEL SAFE) ================= */
const corsOptions = {
  origin: "*",
  credentials: false,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200
};

// CORS middleware MUST run first
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Manual headers as backup
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(express.json());

/* ================= DATA PATH ================= */
const dataPath = path.join(__dirname, "../data");

/* ================= HELPERS ================= */
function readJSON(file) {
  try {
    const filePath = path.join(dataPath, file);
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found, creating: ${filePath}`);
      fs.writeFileSync(filePath, "[]");
    }
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (err) {
    console.error(`Error reading ${file}:`, err.message);
    return [];
  }
}

function writeJSON(file, data) {
  try {
    const filePath = path.join(dataPath, file);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error writing ${file}:`, err.message);
    throw err;
  }
}

/* ================= ROOT TEST ================= */
app.get("/", (req, res) => {
  res.json({
    message: "QuizMaster API Running ✔",
    status: "OK",
    timestamp: new Date().toISOString()
  });
});

/* ================= DEBUG ENDPOINT ================= */
app.get("/api/debug", (req, res) => {
  res.status(200).json({
    status: "OK",
    cors: "Enabled",
    dataPath: dataPath,
    filesExist: {
      categories: fs.existsSync(path.join(dataPath, "categories.json")),
      quizzes: fs.existsSync(path.join(dataPath, "quizzes.json")),
      leaderboard: fs.existsSync(path.join(dataPath, "leaderboard.json"))
    },
    timestamp: new Date().toISOString()
  });
});

/* ================= CATEGORIES ================= */
app.get("/api/categories", (req, res) => {
  try {
    const data = readJSON("categories.json");
    res.status(200).json(data);
  } catch (err) {
    console.error("Categories error:", err);
    res.status(500).json({ error: "Failed to load categories", details: err.message });
  }
});

/* ================= QUIZZES ================= */
app.get("/api/quizzes", (req, res) => {
  try {
    const data = readJSON("quizzes.json");
    const { cat, diff } = req.query;

    let filtered = data;
    if (cat) {
      filtered = filtered.filter(q => q.category === cat);
    }
    if (diff) {
      filtered = filtered.filter(q => q.difficulty === diff);
    }

    res.status(200).json(filtered);
  } catch (err) {
    console.error("Quizzes error:", err);
    res.status(500).json({ error: "Failed to load quizzes", details: err.message });
  }
});

/* ================= LEADERBOARD GET ================= */
app.get("/api/leaderboard", (req, res) => {
  try {
    const data = readJSON("leaderboard.json");

    const sorted = [...data].sort((a, b) => {
      if (b.pct !== a.pct) return b.pct - a.pct;
      return b.score - a.score;
    });

    res.status(200).json(sorted);
  } catch (err) {
    console.error("Leaderboard GET error:", err);
    res.status(500).json({ error: "Failed to load leaderboard", details: err.message });
  }
});

/* ================= LEADERBOARD POST ================= */
app.post("/api/leaderboard", (req, res) => {
  try {
    // Vercel has read-only file system, so we can't save to JSON
    // Return success but don't actually save
    const newEntry = {
      id: Date.now(),
      ...req.body,
      date: new Date().toISOString()
    };

    console.log("Leaderboard entry received:", newEntry);

    res.status(201).json({
      message: "Score saved locally (Vercel read-only)",
      data: newEntry,
      note: "Data stored in localStorage on client side"
    });
  } catch (err) {
    console.error("Leaderboard POST error:", err);
    res.status(500).json({ error: "Failed to save score", details: err.message });
  }
});

/* ================= 404 HANDLER ================= */
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

/* ================= EXPORT (VERCEL IMPORTANT) ================= */
module.exports = app;