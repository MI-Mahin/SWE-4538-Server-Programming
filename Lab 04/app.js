const express = require("express");
const app = express();
const bodyParser = require("body-parser"); // parse the body of HTTP request
const cookieParser = require("cookie-parser"); //parse cookies that are sent with HTTP request
const session = require("express-session");
const flash = require('express-flash')
const passport = require("passport");
require("./config/passport")(passport);

app.use(flash());
app.use(
  session({
    secret:"secret",
    resave: false,  // we can resave the session if nothing is change
    saveUninitialized: false,  //we can save empty value
  })
);


app.use(passport.initialize());
app.use(passport.session());

// To store image/files
app.use(express.static('./uploads'))



//Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const cors = require("cors");   //Cross-origin resource sharing (CORS) is a browser mechanism which
                                  //  enables controlled access to resources located outside of a given domain.
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, // Allow cookies to be sent
}));

const authRoutes = require("./routes/auth.routes");
app.use(authRoutes);

const userRoutes = require("./routes/user.routes")
app.use(userRoutes)

const ensureAuthenticated = require("./middlewares/auth.middleware");
app.get("/welcome", ensureAuthenticated, (req, res) => {
  res.sendFile(__dirname + "/views/homePage.html");
});





//Connect to DB
const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Database!");
  })
  .catch((error) => {
    console.log(error);
  });




const helmet = require('helmet');
const xss = require('xss');

//xss
app.use(helmet()); // Adds security headers to prevent XSS and other attacks (https://blog.logrocket.com/using-helmet-node-js-secure-application/)

// Safe endpoint
// {"content": "<script>alert('You have been hacked!')</script>"}
app.post('/safe-input', (req, res) => {
  const sanitizedContent = xss(req.body.content);
  res.send(`Received: ${sanitizedContent}`);
});



//DDoS
const rateLimit = require('express-rate-limit');
// Apply rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (15 minutes)
  message: 'Too many requests, please try again later.'
});
app.use(limiter);  // Apply to all routes


//NoSQLi
app.get('/find-user', async (req, res) => {
  try {
    const { name } = req.query;
    // Directly embedding user input in the query without validation
    const user = await User.find({ name: name });
    res.json(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

// /find-user?name[$ne]=


module.exports = app;

