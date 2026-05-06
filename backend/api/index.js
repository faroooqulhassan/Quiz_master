const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

/* ================= CORS FIX (VERCEL SAFE) ================= */
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// Force headers manually (IMPORTANT for Vercel)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

/* ================= DATA PATH ================= */
const dataPath = path.join(process.cwd(), "data");

/* ================= HELPERS ================= */
function readJSON(file) {
  const filePath = path.join(dataPath, file);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]");
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeJSON(file, data) {
  const filePath = path.join(dataPath, file);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

/* ================= ROOT TEST ================= */
app.get("/", (req, res) => {
  res.json({
    message: "QuizMaster API Running ✔",
    status: "OK"
  });
});

/* ================= CATEGORIES ================= */
app.get("/api/categories", (req, res) => {
  try {
    const data = readJSON("categories.json");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to load categories" });
  }
});

/* ================= QUIZZES ================= */
app.get("/api/quizzes", (req, res) => {
  try {
    const data = readJSON("quizzes.json");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to load quizzes" });
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

    res.json(sorted);
  } catch (err) {
    res.status(500).json({ error: "Failed to load leaderboard" });
  }
});

/* ================= LEADERBOARD POST ================= */
app.post("/api/leaderboard", (req, res) => {
  try {
    const data = readJSON("leaderboard.json");

    const newEntry = {
      id: Date.now(),
      ...req.body,
      date: new Date().toISOString()
    };

    data.push(newEntry);

    writeJSON("leaderboard.json", data);

    res.json({ message: "Saved", data: newEntry });
  } catch (err) {
    res.status(500).json({ error: "Failed to save score" });
  }
});

/* ================= 404 HANDLER ================= */
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

/* ================= EXPORT (VERCEL IMPORTANT) ================= */
module.exports = app;