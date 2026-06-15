// Not used

require('dotenv').config();
const express = require('express');
const helmet = require('helmet'); // Web Security Requirement
const { body, validationResult } = require('express-validator'); // Input Validation Requirement
const connectDB = require('./config/db');
const User = require('./models/User');

const app = express();

// CONNECT TO MONGODB ATLAS
connectDB();

// --- MIDDLEWARE SECTION (Requirement: Web Security) ---
app.use(helmet()); // Sets secure HTTP headers (XSS protection, etc.)
app.use(express.json()); // Parses incoming JSON (Essential for API Security)

// --- ROUTES SECTION (Requirement: Input Validation & Security Testing) ---

// Dummy registration to test security
app.post('/api/auth/register', 
  // 1. Backend Validation & Sanitization
  body('username').isLength({ min: 3 }).trim().escape(), 
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, password } = req.body;
      res.status(201).json({ message: "User data validated and sanitized successfully" });
    } catch (err) {
      res.status(500).send("Server Error");
    }
});

// --- ERROR HANDLING SECTION (Requirement: Centralized Error Handling) ---
// This catch-all middleware ensures your app doesn't leak system secrets on crash
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    status: 'Error',
    message: 'Internal Server Error: Securely Handled' 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));