const app = require("./src/app");
const connectDB = require("./src/models/db");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
