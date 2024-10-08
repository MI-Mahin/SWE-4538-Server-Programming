const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user = await getUserByEmail(email); // Ensure this is awaited
    if (user == null) {
      return done(null, false, { message: "No user with that email" });
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        console.log("Incorrect password for email:", email); // More descriptive logging
        return done(null, false, { message: "Password incorrect" });
      }
    } catch (e) {
      return done(e);
    }
  };

  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
  passport.serializeUser((user, done) => {
    done(null, user.id); // Specify what user data should be stored in the session
  });
  passport.deserializeUser(async (id, done) => {
    const user = await getUserById(id); // Retrieve user data based on the stored user identifier
    done(null, user); // Pass the user object to the done callback
  });
}

module.exports = initialize;
