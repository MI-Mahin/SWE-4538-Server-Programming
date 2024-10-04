const express = require("express");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();
const usersFilePath = path.join(__dirname, "../data/users.json");

// Load all users from the file
const loadUsers = () => {
  const dataBuffer = fs.readFileSync(usersFilePath);
  const dataJSON = dataBuffer.toString();
  return JSON.parse(dataJSON);
};

// Save users to the file
const saveUsers = (users) => {
  const dataJSON = JSON.stringify(users, null, 2);
  fs.writeFileSync(usersFilePath, dataJSON);
};

// Sign-up route
router.post("/signup", async (req, res) => {
  const { name, email, password, favoriteAnime } = req.body;
  const users = loadUsers();

  // Check if the user already exists
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(400).json({ error: "User already exists!" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Add the new user
  users.push({
    name,
    email,
    password: hashedPassword,
    favoriteAnime,
  });

  // Save to the file
  saveUsers(users);
  res.status(201).json({ message: "User registered successfully!" });
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const users = loadUsers();

  // Find the user
  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(400).json({ error: "Invalid email or password!" });
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ error: "Invalid email or password!" });
  }

  // Generate JWT token
  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ message: "Login successful!", token });
});

module.exports = router;
