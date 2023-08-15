const express = require("express");
const router = express.Router();
const passport = require("passport");

const user_controller = require("../controllers/userController");

// show user entries or log in screen
router.get('/', function(req, res) {
  if (req.isAuthenticated()) {
    res.redirect(`/dashboard/${req.user._id}`);
  } else {
    res.render("index", { user: req.user });
  }
});


// handle login attempt
router.post("/log-in", user_controller.log_in);

// show sign up form
router.get("/sign-up", user_controller.render_signup_form);

// handle sign up attempt
router.post("/sign-up", user_controller.validate_signup_form, user_controller.create_user);

// log the user out
router.get("/log-out", user_controller.logout_user);

module.exports = router;
