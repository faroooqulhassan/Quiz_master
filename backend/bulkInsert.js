// bulkInsert.js - Run this script to add bulk questions
const fs = require('fs');
const path = require('path');

const QUIZZES_FILE = path.join(__dirname, 'data', 'quizzes.json');
const CATEGORIES_FILE = path.join(__dirname, 'data', 'categories.json');

// ============= BULK QUESTIONS DATA (ADD YOUR QUESTIONS HERE) =============
const bulkQuestions = [
  // SCIENCE QUESTIONS
  {
    category: "science",
    difficulty: "easy",
    question: "What is the hardest natural substance?",
    options: ["Iron", "Diamond", "Gold", "Platinum"],
    correct: 1,
    explanation: "Diamond is the hardest natural substance on Earth."
  },
  {
    category: "science",
    difficulty: "easy",
    question: "What is the boiling point of water?",
    options: ["90°C", "100°C", "110°C", "120°C"],
    correct: 1,
    explanation: "Water boils at 100°C (212°F) at sea level."
  },
  {
    category: "science",
    difficulty: "medium",
    question: "Which organ pumps blood through the human body?",
    options: ["Brain", "Liver", "Heart", "Kidney"],
    correct: 2,
    explanation: "The heart pumps blood throughout the body."
  },
  {
    category: "science",
    difficulty: "medium",
    question: "What gas do plants release during photosynthesis?",
    options: ["Carbon Dioxide", "Nitrogen", "Oxygen", "Hydrogen"],
    correct: 2,
    explanation: "Plants release oxygen during photosynthesis."
  },
  {
    category: "science",
    difficulty: "hard",
    question: "What is the pH value of pure water?",
    options: ["5", "6", "7", "8"],
    correct: 2,
    explanation: "Pure water has a neutral pH of 7."
  },

  // TECHNOLOGY QUESTIONS
  {
    category: "technology",
    difficulty: "easy",
    question: "What does CPU stand for?",
    options: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Core Processing Unit"],
    correct: 0,
    explanation: "CPU = Central Processing Unit"
  },
  {
    category: "technology",
    difficulty: "easy",
    question: "Who founded Microsoft?",
    options: ["Steve Jobs", "Bill Gates", "Mark Zuckerberg", "Jeff Bezos"],
    correct: 1,
    explanation: "Bill Gates co-founded Microsoft in 1975."
  },
  {
    category: "technology",
    difficulty: "medium",
    question: "What does 'HTTP' stand for?",
    options: ["HyperText Transfer Protocol", "High Transfer Text Protocol", "Hyper Transfer Text Protocol", "HyperText Transfer Program"],
    correct: 0,
    explanation: "HTTP = HyperText Transfer Protocol"
  },
  {
    category: "technology",
    difficulty: "medium",
    question: "Which company makes the Android operating system?",
    options: ["Apple", "Microsoft", "Google", "Samsung"],
    correct: 2,
    explanation: "Google develops Android OS."
  },
  {
    category: "technology",
    difficulty: "hard",
    question: "What does 'API' stand for?",
    options: ["Application Programming Interface", "Application Program Input", "Advanced Programming Interface", "Application Process Integration"],
    correct: 0,
    explanation: "API = Application Programming Interface"
  },

  // HISTORY QUESTIONS
  {
    category: "history",
    difficulty: "easy",
    question: "Who painted the Mona Lisa?",
    options: ["Van Gogh", "Picasso", "Da Vinci", "Rembrandt"],
    correct: 2,
    explanation: "Leonardo da Vinci painted the Mona Lisa."
  },
  {
    category: "history",
    difficulty: "easy",
    question: "Who discovered penicillin?",
    options: ["Marie Curie", "Alexander Fleming", "Louis Pasteur", "Isaac Newton"],
    correct: 1,
    explanation: "Alexander Fleming discovered penicillin in 1928."
  },
  {
    category: "history",
    difficulty: "medium",
    question: "In which year did World War I begin?",
    options: ["1912", "1914", "1916", "1918"],
    correct: 1,
    explanation: "World War I began in 1914."
  },
  {
    category: "history",
    difficulty: "medium",
    question: "Who was the first man to walk on the moon?",
    options: ["Buzz Aldrin", "Neil Armstrong", "Michael Collins", "Yuri Gagarin"],
    correct: 1,
    explanation: "Neil Armstrong walked on the moon in 1969."
  },
  {
    category: "history",
    difficulty: "hard",
    question: "What year did Pakistan become a republic?",
    options: ["1947", "1956", "1962", "1973"],
    correct: 1,
    explanation: "Pakistan became a republic in 1956."
  },

 
  {
    category: "geography",
    difficulty: "easy",
    question: "What is the smallest country in the world?",
    options: ["Monaco", "San Marino", "Vatican City", "Malta"],
    correct: 2,
    explanation: "Vatican City is the smallest country."
  },
  {
    category: "geography",
    difficulty: "easy",
    question: "Which desert is the largest in the world?",
    options: ["Gobi", "Sahara", "Arabian", "Kalahari"],
    correct: 1,
    explanation: "Sahara is the largest hot desert."
  },
  {
    category: "geography",
    difficulty: "medium",
    question: "What is the tallest mountain in the world?",
    options: ["K2", "Kangchenjunga", "Mount Everest", "Makalu"],
    correct: 2,
    explanation: "Mount Everest is 8,848m tall."
  },
  {
    category: "geography",
    difficulty: "medium",
    question: "Which river is the longest in the world?",
    options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
    correct: 1,
    explanation: "The Nile River is the longest."
  },

  // SPORTS QUESTIONS
  {
    category: "sports",
    difficulty: "easy",
    question: "How many players are in a cricket team?",
    options: ["9", "10", "11", "12"],
    correct: 2,
    explanation: "A cricket team has 11 players."
  },
  {
    category: "sports",
    difficulty: "easy",
    question: "Who won the FIFA World Cup 2022?",
    options: ["France", "Croatia", "Argentina", "Brazil"],
    correct: 2,
    explanation: "Argentina won the 2022 World Cup."
  },
  {
    category: "sports",
    difficulty: "medium",
    question: "What is the national sport of Pakistan?",
    options: ["Cricket", "Hockey", "Football", "Squash"],
    correct: 1,
    explanation: "Field Hockey is the national sport of Pakistan."
  },
  {
    category: "sports",
    difficulty: "medium",
    question: "Who has the most Ballon d'Or awards?",
    options: ["Cristiano Ronaldo", "Lionel Messi", "Neymar", "Mbappe"],
    correct: 1,
    explanation: "Lionel Messi has won 7 Ballon d'Or awards."
  },

  // POP CULTURE QUESTIONS
  {
    category: "popculture",
    difficulty: "easy",
    question: "Who played Iron Man in MCU?",
    options: ["Chris Evans", "Robert Downey Jr.", "Chris Hemsworth", "Scarlett Johansson"],
    correct: 1,
    explanation: "Robert Downey Jr. played Iron Man."
  },
  {
    category: "popculture",
    difficulty: "easy",
    question: "Which band sang 'Bohemian Rhapsody'?",
    options: ["The Beatles", "Queen", "Rolling Stones", "Nirvana"],
    correct: 1,
    explanation: "Queen sang Bohemian Rhapsody."
  },
  {
    category: "popculture",
    difficulty: "medium",
    question: "Who directed the movie 'Inception'?",
    options: ["Steven Spielberg", "James Cameron", "Christopher Nolan", "Quentin Tarantino"],
    correct: 2,
    explanation: "Christopher Nolan directed Inception."
  }
];

// ============= FUNCTION TO ADD BULK QUESTIONS =============
function addBulkQuestions() {
  console.log("📚 Reading current quizzes...");
  
  let currentQuizzes = [];
  if (fs.existsSync(QUIZZES_FILE)) {
    currentQuizzes = JSON.parse(fs.readFileSync(QUIZZES_FILE, 'utf8'));
    console.log(`✅ Found ${currentQuizzes.length} existing questions`);
  }
  
  let nextId = currentQuizzes.length > 0 
    ? Math.max(...currentQuizzes.map(q => q.id)) + 1 
    : 1;
  
  let addedCount = 0;
  let duplicateCount = 0;
  
  for (const newQuestion of bulkQuestions) {
    // Check if question already exists (by exact question text)
    const exists = currentQuizzes.some(q => 
      q.question.toLowerCase() === newQuestion.question.toLowerCase()
    );
    
    if (!exists) {
      const questionToAdd = {
        id: nextId++,
        ...newQuestion
      };
      currentQuizzes.push(questionToAdd);
      addedCount++;
      console.log(`  ✅ Added: ${newQuestion.question.substring(0, 50)}...`);
    } else {
      duplicateCount++;
      console.log(`  ⏭️ Skipped (duplicate): ${newQuestion.question.substring(0, 50)}...`);
    }
  }
  
  // Save to file
  fs.writeFileSync(QUIZZES_FILE, JSON.stringify(currentQuizzes, null, 2));
  
  console.log("\n" + "=".repeat(50));
  console.log("📊 BULK INSERT SUMMARY");
  console.log("=".repeat(50));
  console.log(`✅ Added: ${addedCount} new questions`);
  console.log(`⏭️ Skipped: ${duplicateCount} duplicates`);
  console.log(`📚 Total questions now: ${currentQuizzes.length}`);
  console.log(`💾 Saved to: ${QUIZZES_FILE}`);
  console.log("=".repeat(50));
}

// ============= FUNCTION TO ADD BULK CATEGORIES =============
const bulkCategories = [
  { name: "Science", icon: "🧪", tag: "science", desc: "Physics, Chemistry, Biology" },
  { name: "History", icon: "📚", tag: "history", desc: "World History & Events" },
  { name: "Technology", icon: "💻", tag: "technology", desc: "Computers, AI, Programming" },
  { name: "Geography", icon: "🌍", tag: "geography", desc: "Countries, Capitals, Maps" },
  { name: "Sports", icon: "⚽", tag: "sports", desc: "Cricket, Football, Olympics" },
  { name: "Pop Culture", icon: "🎬", tag: "popculture", desc: "Movies, Music, Celebrities" },
  { name: "Mathematics", icon: "📐", tag: "math", desc: "Numbers, Algebra, Calculus" },
  { name: "Language", icon: "🗣️", tag: "language", desc: "English, Urdu, Grammar" }
];

function addBulkCategories() {
  console.log("\n📁 Reading current categories...");
  
  let currentCategories = [];
  if (fs.existsSync(CATEGORIES_FILE)) {
    currentCategories = JSON.parse(fs.readFileSync(CATEGORIES_FILE, 'utf8'));
    console.log(`✅ Found ${currentCategories.length} existing categories`);
  }
  
  let nextId = currentCategories.length > 0 
    ? Math.max(...currentCategories.map(c => c.id)) + 1 
    : 1;
  
  let addedCount = 0;
  
  for (const newCategory of bulkCategories) {
    const exists = currentCategories.some(c => 
      c.tag.toLowerCase() === newCategory.tag.toLowerCase()
    );
    
    if (!exists) {
      currentCategories.push({
        id: nextId++,
        ...newCategory
      });
      addedCount++;
      console.log(`  ✅ Added category: ${newCategory.name}`);
    } else {
      console.log(`  ⏭️ Skipped (exists): ${newCategory.name}`);
    }
  }
  
  fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(currentCategories, null, 2));
  
  console.log(`\n✅ Added ${addedCount} new categories`);
  console.log(`📁 Total categories: ${currentCategories.length}`);
}

// ============= RUN THE SCRIPT =============
console.log("\n🚀 QUIZMASTER BULK DATA INSERTER");
console.log("=".repeat(50));

// Ask user what they want to do
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("\nWhat do you want to do?");
console.log("1. Add Bulk Questions");
console.log("2. Add Bulk Categories");
console.log("3. Add Both");
console.log("4. Exit");

rl.question("\nEnter your choice (1-4): ", (answer) => {
  switch(answer.trim()) {
    case '1':
      addBulkQuestions();
      break;
    case '2':
      addBulkCategories();
      break;
    case '3':
      addBulkCategories();
      addBulkQuestions();
      break;
    default:
      console.log("Exiting...");
  }
  rl.close();
});