const express = require("express");
const app = express();
const path = require("path");

app.use(express.static("views"));

app.get("/", (req, res) => {
  res.send(`<h1> Welcome Marvel Fan!</h1>
    <ul>
      <li><a href="/comics">Comics</a></li>
      <li><a href="/movies">Movies</a></li>
      <li><a href="/animated-series">Animated Series</a></li>
    </ul>`);
});

app.get("/comics", (req, res) => {
  res.send("Hey, thanks for being a great fan of Marvel comics");
});

app.get("/animated-series", (req, res) => {
  res.sendFile("C:/Users/mahmu/Server Programming/Lab 01/animated-series.html");
});

app.get("/movies", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "movies.html"));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server is running on port ${PORT}");
});
