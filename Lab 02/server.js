const express = require("express");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Load users from JSON file
const loadUsers = () => {
  if (fs.existsSync("data/users.json")) {
    const data = fs.readFileSync("data/users.json");
    return JSON.parse(data);
  }
  return [];
};

// Save users to JSON file
const saveUsers = (users) => {
  fs.writeFileSync("data/users.json", JSON.stringify(users, null, 2));
};

// Sign Up
app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password, favoriteAnime } = req.body; // Accept favoriteAnime
  const users = loadUsers();

  // Check if user already exists
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(400).send("User already exists.");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    name,
    email,
    password: hashedPassword,
    favoriteAnime, // Store the favoriteAnime
  };

  users.push(newUser);
  saveUsers(users);
  res.redirect("/login.html");
});

// Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const users = loadUsers();

  const user = users.find((u) => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send("Invalid credentials.");
  }

  // Redirect to the anime page on successful login
  res.redirect("/anime.html");
});

// Get anime for logged-in user
app.get("/api/anime", (req, res) => {
  const { email } = req.query; // For demo purposes, we're using query parameters
  const users = loadUsers();
  const user = users.find((u) => u.email === email);

  if (user) {
    res.json(user.favoriteAnime);
  } else {
    res.status(404).send("User not found");
  }
});

// Edit anime description
app.post("/api/anime/edit", (req, res) => {
  const { email, index, description } = req.body;
  const users = loadUsers();
  const user = users.find((u) => u.email === email);

  if (user && user.favoriteAnime[index]) {
    user.favoriteAnime[index].description = description;
    saveUsers(users);
    res.send("Anime description updated.");
  } else {
    res.status(404).send("Anime not found");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
