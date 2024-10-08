const path = require("path");
const bcrypt = require("bcrypt");
const passport = require("passport");
const fs = require("fs");
const { createObjectCsvWriter } = require("csv-writer");

// CSV Writer Setup
const csvWriter = createObjectCsvWriter({
  path: path.join(__dirname, "..", "users.csv"), // Adjust path as needed
  header: [
    { id: "id", title: "ID" },
    { id: "name", title: "Name" },
    { id: "email", title: "Email" },
    { id: "password", title: "Password" },
  ],
});

// Initialize users array from CSV if exists
const users = [];
const csvFilePath = path.join(__dirname, "..", "users.csv");

if (fs.existsSync(csvFilePath)) {
  const csvData = fs.readFileSync(csvFilePath, "utf8");
  csvData.split("\n").forEach((line, index) => {
    if (index > 0 && line.trim()) {
      // Skip header
      const [id, name, email, password] = line.split(",");
      users.push({ id, name, email, password });
    }
  });
}

const initializePassport = require("../config/passport");

initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

const getLogin = async (req, res) => {
  const filePath = path.join(__dirname, "..", "views", "login.html");
  res.sendFile(filePath);
};

const getRegister = async (req, res) => {
  const filePath = path.join(__dirname, "..", "views", "register.html");
  res.sendFile(filePath);
};

const postRegister = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = {
      id: Date.now().toString(),
      name: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    };
    users.push(newUser); // Add user to in-memory array

    // Write to CSV
    await csvWriter.writeRecords([newUser]); // Write new user record to CSV

    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
  console.log(users); // Show the user list
};

const postLogin = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/welcome",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
};

module.exports = {
  getLogin,
  getRegister,
  postRegister,
  postLogin,
};
