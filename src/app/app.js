const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const authRoutes = require('../router/auth.router');
const usuariosRoutes = require('../router/usuario.router');
const toursRoutes = require('../router/tour.router');
const equipoRoutes = require('../router/equipo.router');
const morgan = require("morgan");
const { sequelize } = require('../model/db');
const path = require('path');

const app = express();



// Configura el almacenamiento de sesión utilizando Sequelize
const myStore = new SequelizeStore({
  db: sequelize,
  expiration: 24 * 60 * 60 * 1000,
  checkExpirationInterval: 15 * 60 * 1000,
});

// Sincroniza la tabla de sesión con la base de datos
myStore.sync();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Configuración de express-session con SequelizeStore
app.use(session({
  secret: 'tu secreto aquí',
  store: myStore,
  resave: false,
  saveUninitialized: false,
}));

app.use(flash());

// Pasar mensajes de flash a la vista
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// Middleware para hacer el usuario disponible en las vistas
app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario;
  next();
});

// Configuración de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

// Rutas
app.use(authRoutes);
app.use(usuariosRoutes);
app.use(toursRoutes);
app.use(equipoRoutes);

module.exports = app;