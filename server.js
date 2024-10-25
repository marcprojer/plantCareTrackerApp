const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = 3000; // Choose a port

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(bodyParser.json()); // Parse JSON request bodies

// Initialize SQLite Database
const db = new sqlite3.Database("database.sqlite", (err) => {
  if (err) {
    console.error("Error opening database", err);
  } else {
    console.log("Connected to SQLite database");
  }
});

// Create plants table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS plants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT,
    water_frequency INTEGER,
    last_watered TEXT
)`);

// API Routes
// GET all plants
app.get("/plants", (req, res) => {
  db.all("SELECT * FROM plants", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// POST a new plant
app.post("/plants", (req, res) => {
  const { name, type, water_frequency } = req.body;
  db.run(
    "INSERT INTO plants (name, type, water_frequency, last_watered) VALUES (?, ?, ?, ?)",
    [name, type, water_frequency, null],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ id: this.lastID, name, type, water_frequency });
      }
    }
  );
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
