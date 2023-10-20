const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const authRoutes = require('../router/auth.router');
const usuariosRoutes = require('../router/usuario.router');
const toursRoutes = require('../router/tour.router');
const morgan = require("morgan");
const { sequelize } = require('../model/db');

const app = express();

// Configura el almacenamiento de sesión utilizando Sequelize
const myStore = new SequelizeStore({
  db: sequelize,
  expiration: 24 * 60 * 60 * 1000,  // 1 día
  checkExpirationInterval: 15 * 60 * 1000,  // 15 minutos
});

// Sincroniza la tabla de sesión con la base de datos
myStore.sync();

// Configura express-session para usar el almacenamiento de sequelize
app.use(session({
  secret: 'tu secreto aquí',  // Reemplaza esto con tu propia frase secreta
  store: myStore,
  resave: false,  // No guardar la sesión si no se modificó
  saveUninitialized: false,  // No guardar la sesión si es nueva y no se modificó
}));


app.use(express.json()); 

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
app.use(usuariosRoutes);
app.use(toursRoutes);

module.exports = app;