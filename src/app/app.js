const express = require('express');
const session = require('express-session');
const authRoutes = require('../router/auth.router');
const morgan = require("morgan");

const app = express();

const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));




app.use(morgan("dev"));

app.use(session({
  secret: 'tu_secreto',
  resave: false,
  saveUninitialized: true
}));

app.use(authRoutes);

module.exports = app;