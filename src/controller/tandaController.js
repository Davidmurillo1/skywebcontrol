const { Tanda, Tour, Equipo, CategoriaEquipo, InstanciaEquipo, sequelize } = require('../model/db.js');
const moment = require("moment");
const { convertirHoraAMPM } = require('../public/js/horaAMPM.js');

exports.getCrearTanda = async (req, res) => {
    const tourId = req.params.id;

    const tour = await Tour.encontrarTourId(tourId);

    const fechaHoy = moment().format('YYYY-MM-DD');
    const usuario = req.session.usuario.usuario;

    try {
        let tanda = await Tanda.findOne({
            where: {
                tour_id: tourId,
                fecha: fechaHoy
            }
        });

        if (!tanda) {
            // Si no existe una tanda para el tour en el día presente, crear una nueva
            tanda = await Tanda.create({ 
                tour_id: tourId,
                fecha: fechaHoy,
                hora: tour.horario,
                usuario: usuario
                // Otros campos necesarios para crear la tanda
            });
        }

        res.render('crear-tanda', { tanda: tanda, tour: tour, usuarioSesion: req.session.usuario, moment });

    } catch (error) {
        console.error('Error al crear o recuperar tanda:', error);
        res.status(500).send('Error interno del servidor');
    }
};

exports.postActualizarDatosTour = async (req, res) => {
    const tandaId = req.params.id;
    const { cant_personas, tour_guide } = req.body;

    try {
        let tanda = await Tanda.findByPk(tandaId);
        if (!tanda) {
            return res.json({ success: false, message: 'Tanda no encontrada' });
        }

        tanda.cant_personas = cant_personas;
        tanda.tour_guide = tour_guide;
        await tanda.save();

        res.json({ success: true, message: 'Datos actualizados correctamente' });
    } catch (error) {
        console.error('Error al actualizar datos del tour:', error);
        res.json({ success: false, message: 'Error al actualizar los datos del tour' });
    }
};


