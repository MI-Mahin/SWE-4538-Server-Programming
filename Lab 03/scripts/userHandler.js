const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

const csvFilePath = path.join(__dirname, "../csv/users.csv");

// Function to hash password
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Function to register a new user
const registerUser = async (username, email, password) => {
  const hashedPassword = await hashPassword(password);
  const userRow = `${username},${email},${hashedPassword}\n`;

  fs.appendFile(csvFilePath, userRow, (err) => {
    if (err) throw err;
    console.log(`User ${username} registered successfully.`);
  });
};

module.exports = {
  registerUser,
};
