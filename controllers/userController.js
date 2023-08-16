const User = require("../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { body, check, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");

// logging in
exports.log_in = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  })(req, res, next);
};

// render sign-up form
exports.render_signup_form = (req, res) => {
  let context = {
    errors: [], // stope the form from breaking when not rendered with errors
  };
  res.render("sign-up-form", context);
};

// validate sign-up form data
exports.validate_signup_form = [
  check("username")
    .isAlphanumeric()
    .withMessage("Username must be alphanumeric")
    .isLength({ min: 0 })
    .withMessage("Username must be at least 2 chars long")
    .custom(async (value) => {
      const user = await User.findOne({ username: value });
      if (user) {
        throw new Error("Username already in use");
      }
    }),
  check("password")
    .isLength({ min: 2 })
    .withMessage("Password must be at least 2 chars long"),
  check("password-confirm")
    .exists()
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
  body("username").trim().escape(),
  body("password").trim().escape(),
];

// handle sign-up form submit
exports.create_user = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("sign-up-form", {
      errors: errors.array(),
      body: req.body,
    });
  }
  bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
    if (err) {
      return next(err);
    }
    try {
      const user = new User({
        username: req.body.username,
        password: hashedPassword,
      });
      const result = await user.save();

      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }

        res.locals.currentUser = user;
        let context = {
          newEntry: {},
          newEntryErrors: [],
          entries: [],
        };
        res.render("dashboard", context);
      });
    } catch (err) {
      return next(err);
    }
  });
});

// log out our user
exports.logout_user = asyncHandler(async (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
