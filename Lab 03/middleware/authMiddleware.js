const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const csvParser = require("csv-parser");

const csvFilePath = path.join(__dirname, "../csv/users.csv");

// Middleware to check if the user is authenticated during login
const checkAuth = (req, res, next) => {
  const { email, password } = req.body;

  let userFound = false;

  // Read the CSV to check if the user exists
  fs.createReadStream(csvFilePath)
    .pipe(csvParser())
    .on("data", (row) => {
      // Check if the email matches
      if (row.email === email) {
        userFound = true; // Mark the user as found
        // Compare the hashed password with the provided password
        bcrypt.compare(password, row.password, (err, result) => {
          if (err) {
            return res.status(500).send("Server error");
          }
          if (result) {
            req.user = row; // Attach user data to the request object
            return next(); // Proceed to the next middleware or route handler
          } else {
            return res.status(401).send("Invalid email or password");
          }
        });
      }
    })
    .on("end", () => {
      // If no match found and user is not authenticated
      if (!userFound) {
        return res.status(401).send("Invalid email or password");
      }
    });
};

module.exports = {
  checkAuth,
};
