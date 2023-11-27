// controllers/authController.js
const { Tour } = require("../model/db");
const { Op } = require("sequelize"); // Importar Op de sequelize
const moment = require("moment");
const { convertirHoraAMPM } = require("../public/js/horaAMPM");

exports.getCrearTour = (req, res) => {
  res.render("crear-tour", { error: null, usuarioSesion: req.session.usuario });
};

exports.postCrearTour = async (req, res) => {
  try {
    const { horaInicio, fecha, opcionFecha } = req.body;
    const repetir = opcionFecha === "repetir";

    // Crear nuevo tour
    const newTour = await Tour.create({
      horario: horaInicio,
      fecha: repetir ? null : fecha, // Si es un tour recurrente, fecha es null
      repetir: repetir,
    });

    res.redirect("/inicio");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al crear el tour");
  }
};

exports.getTours = async (req, res) => {
  try {
    // Obtén la fecha del query string, o usa la fecha actual si no se proporciona una
    const fechaQuery = req.query.fecha || moment().format("YYYY-MM-DD");

    // Define el rango de fechas para la consulta
    const fechaInicio = moment(fechaQuery).startOf("day").toDate();
    const fechaFin = moment(fechaQuery).endOf("day").toDate();

    // Consulta los tours recurrentes y los tours específicos para la fecha seleccionada
    const toursRecurrentes = await Tour.findAll({ where: { repetir: true } });
    const toursDelDia = await Tour.findAll({
      where: {
        fecha: {
          [Op.between]: [fechaInicio, fechaFin],
        },
        repetir: false, // Asumiendo que solo quieres tours no recurrentes para esta consulta
      },
    });

    // Renderiza la vista, pasando los datos de los tours como variables
    res.render("inicio", {
      toursRecurrentes,
      toursDelDia,
      fecha: fechaQuery,
      moment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error del servidor");
  }
};

exports.getMostrarTours = async (req, res) => {
  try {
    const tours = await Tour.findAll({
      order: [
        ["repetir", "DESC"],
        ["horario", "ASC"],
        ["fecha", "ASC"],
      ],
    });

    // Convertir datos según lo solicitado
    const toursMapeados = tours.map((tour) => {
      tour.dataValues.repetir = tour.repetir ? "Sí" : "No";
      tour.dataValues.horario = convertirHoraAMPM(tour.horario);
      return tour;
    });

    res.render("tours", {
      tours: toursMapeados,
      usuarioSesion: req.session.usuario,
    });
  } catch (error) {
    console.error("Error al obtener tours:", error);
    res.status(500).send("Error al obtener los tours");
  }
};
