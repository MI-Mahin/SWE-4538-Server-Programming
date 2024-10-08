const csvParser = require("csv-parser");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

const csvFilePath = path.join(__dirname, "../csv/users.csv");

// Middleware to check if the user is authenticated during login
const checkAuth = (req, res, next) => {
  const { email, password } = req.body;

  // Read the CSV to check if the user exists
  fs.createReadStream(csvFilePath)
    .pipe(csvParser())
    .on("data", async (row) => {
      if (row.email === email) {
        // Check if the password matches
        const match = await bcrypt.compare(password, row.password);
        if (match) {
          req.user = row; // Attach user data to the request object
          return next(); // Proceed to the next middleware or route handler
        }
      }
    })
    .on("end", () => {
      // If no match found, send an unauthorized response
      res.status(401).send("Invalid email or password");
    });
};

module.exports = {
  checkAuth,
};
