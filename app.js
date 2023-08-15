const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
require('./passport-config')(passport);
const mongoose = require("mongoose");
require('dotenv').config();
const indexRouter = require('./routes/index');
const dashboardRouter = require('./routes/dashboard');

const mongoDb = process.env.MONGODB_KEY;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const app = express();
app.set("views", path.join(__dirname, 'views'));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(function (req, res, next) {
  if(req.user) {
    res.locals.currentUser = req.user;
  }
  next();
});

app.use("/", indexRouter)
app.use("/dashboard", dashboardRouter)

app.use(function(err, req, res, next) {
  console.error(err.stack); // log the stack trace of the error
  res.status(500).send('Something broke!');
});

app.listen(3000, () => console.log(`${new Date().toISOString()} - app listening on port 3000!`));