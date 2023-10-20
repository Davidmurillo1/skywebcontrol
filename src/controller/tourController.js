// controllers/authController.js
const { Tour } = require('../model/db');

exports.getCrearTour = (req, res) => {
  res.render('crear-tour', { error: null });
};


exports.postCrearTour = async (req, res) => {
  try {
      const { horaInicio, fecha, opcionFecha } = req.body;
      const repetir = opcionFecha === 'repetir';

      // Crear nuevo tour
      const newTour = await Tour.create({
          horario: horaInicio,
          fecha: repetir ? null : fecha,  // Si es un tour recurrente, fecha es null
          repetir: repetir
      });

      res.redirect('/inicio');
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al crear el tour');
  }
};

