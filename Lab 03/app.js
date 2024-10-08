const express = require("express");
const bodyParser = require("body-parser");
const { registerUser } = require("./middleware/userHandler");
const { checkAuth } = require("./middleware/authMiddleware");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Serve the registration and login pages
app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/views/register.html");
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/views/login.html");
});

// Registration route
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  await registerUser(username, email, password);
  res.send("Registration successful! You can now log in.");
});

// Login route with auth middleware
app.post("/login", checkAuth, (req, res) => {
  // If checkAuth passed, the user will be attached to req.user
  res.redirect("/welcome"); // Redirect to the welcome page
});

// Serve the welcome page
app.get("/welcome", (req, res) => {
  res.sendFile(__dirname + "/views/welcome.html");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
