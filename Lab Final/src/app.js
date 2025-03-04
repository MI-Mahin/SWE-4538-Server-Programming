const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const petRoutes = require("./routes/petRoutes");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/", petRoutes);

module.exports = app;
