const express = require("express");
const router = express.Router();

// Import functions from controller
const {
  getLogin,
  postLogin,
  getRegister,
  postRegister,
} = require("../controllers/controller"); // Adjust the path as needed

// Define routes
router.get("/login", getLogin);
router.post("/login", postLogin);
router.get("/register", getRegister);
router.post("/register", postRegister);

module.exports = router;
