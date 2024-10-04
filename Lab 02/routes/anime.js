const express = require("express");
const fs = require("fs");
const path = require("path");
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

// Middleware to authenticate the user using JWT
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ error: "No token provided!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.email = decoded.email;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token!" });
  }
};

// Get the user's anime list
router.get("/", authMiddleware, (req, res) => {
  const users = loadUsers();
  const user = users.find((user) => user.email === req.email);

  if (!user) {
    return res.status(400).json({ error: "User not found!" });
  }

  res.json(user.favoriteAnime);
});

// Add a new anime to the user's list
router.post("/", authMiddleware, (req, res) => {
  const { name, description } = req.body;
  const users = loadUsers();
  const user = users.find((user) => user.email === req.email);

  if (!user) {
    return res.status(400).json({ error: "User not found!" });
  }

  user.favoriteAnime.push({ name, description });
  saveUsers(users);

  res.status(201).json({ message: "Anime added successfully!" });
});

// Delete an anime from the user's list
router.delete("/:name", authMiddleware, (req, res) => {
  const animeName = req.params.name;
  const users = loadUsers();
  const user = users.find((user) => user.email === req.email);

  if (!user) {
    return res.status(400).json({ error: "User not found!" });
  }

  user.favoriteAnime = user.favoriteAnime.filter(
    (anime) => anime.name !== animeName
  );
  saveUsers(users);

  res.json({ message: "Anime deleted successfully!" });
});

module.exports = router;
