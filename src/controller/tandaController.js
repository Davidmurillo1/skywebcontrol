const {
  Tanda,
  Tour,
  Equipo,
  CategoriaEquipo,
  TandaInstancia,
  InstanciaEquipo,
  sequelize,
} = require("../model/db.js");
const { Op } = require("sequelize");
const moment = require("moment");

exports.getTanda = async (req, res) => {
  const tourId = req.params.id;
  const fechaSeleccionada = req.query.fecha || moment().format("YYYY-MM-DD"); // Usa la fecha actual como predeterminada si no se proporciona

  try {
    const fechaHoy = moment().format("YYYY-MM-DD");
    const usuario = req.session.usuario.usuario;

    // Encuentra el tour o maneja la situación en la que el tour no existe
    const tour = await Tour.encontrarTourId(tourId);

    if (!tour) {
      // Manejar el caso en que no se encuentra el tour (p.ej., redirigir o mostrar un mensaje de error)
      return res.status(404).send("Tour no encontrado");
    }

    //TANDA YA ESTÁ REGISTRADA
    const tandaRegistrada = await Tanda.findOne({
      where: {
        registrada: true,
        tour_id: tourId,
        fecha: fechaSeleccionada,
      },
    });

    if (tandaRegistrada) {
      // Si la tanda ya está registrada para esa fecha
      req.flash("error", "Ya existe una tanda registrada para esta fecha.");
      return res.render("mostrar-tanda-registrada", {
        tanda: tandaRegistrada,
        tour: tour,
        usuarioSesion: req.session.usuario,
        moment,
        flash: req.flash(),
      });
    }

    const tandaPendienteSeleccionada = await Tanda.findOne({
      where: {
        registrada: false,
        tour_id: tourId,
        fecha: fechaSeleccionada,
      },
    });

    if (tandaPendienteSeleccionada) {
      // Hay una tanda pendiente para este tour específico
      console.log("Tanda Seleccionada está pendiente de registrar");
      req.flash("info", "Tanda pendiente de registrar");
      return res.render("mostrar-tanda", {
        tanda: tandaPendienteSeleccionada,
        tour: tour,
        usuarioSesion: req.session.usuario,
        moment,
        messages: req.flash(),
      });
    } else {
      // Verifica si hay cualquier otra tanda pendiente
      const cualquierTandaPendiente = await Tanda.findOne({
        where: {
          registrada: false,
          tour_id: { [Op.ne]: tourId }, // Excluir el tourId actual usando Op.ne
        },
      });

      if (cualquierTandaPendiente) {
        // Hay otra tanda pendiente que no es del tour actual
        console.log(
          "Existe otra tanda que no fue la seleccionada que necesita ser registrada"
        );
        req.flash(
          "error",
          "Primero debes de registrar esta Tanda para intentar crear otra."
        );
        return res.redirect(
          `/mostrar-tanda/${cualquierTandaPendiente.tour_id}`
        );
      } else {
        // No hay tandas pendientes en absoluto
        console.log(
          "Puedes crear una tanda, ya que no existe ninguna tanda pendiente"
        );
        return res.redirect(`/registrar-nueva-tanda/${tourId}`);
      }
    }
  } catch (error) {
    console.error("Error al crear o recuperar tanda:", error);
    res.status(500).send("Error interno del servidor");
  }
};

exports.getRegistrarTanda = async (req, res) => {
  const tourId = req.params.id;

  try {
    const fechaHoy = moment().format("YYYY-MM-DD");
    const usuario = req.session.usuario.usuario;

    // Encuentra el tour o maneja la situación en la que el tour no existe
    const tour = await Tour.encontrarTourId(tourId);

    if (!tour) {
      // Manejar el caso en que no se encuentra el tour (p.ej., redirigir o mostrar un mensaje de error)
      return res.status(404).send("Tour no encontrado");
    }

    res.render("registrar-tanda", {
      tour: tour,
      usuarioSesion: req.session.usuario,
      moment,
      fechaHoy: fechaHoy,
    });
  } catch (error) {
    console.error("Error al crear la tanda:", error);
    res.status(500).send("Error interno del servidor");
  }
};

exports.postRegistrarTanda = async (req, res) => {
  const tourId = req.params.id;
  const { fecha, hora } = req.body;

  try {
    await Tanda.create({
      tour_id: tourId,
      fecha: fecha,
      hora: hora,
      usuario: req.session.usuario.usuario,
    });

    return res.redirect(`/mostrar-tanda/${tourId}?fecha=${fecha}`);
  } catch (error) {
    console.error("Hubo un error al momento de crear la tanda", error);
  }
};

exports.postguardarTanda = async (req, res) => {
  const tandaId = req.body.id;

  try {
    // Verificar si la Tanda existe y no está registrada
    const TandaExiste = await Tanda.findOne({
      where: {
        id: tandaId,
        registrada: false,
      },
    });

    if (!TandaExiste) {
      return res.status(404).send("Tanda no encontrada o ya está registrada.");
    }

    // Actualizar el estado de la Tanda
    await Tanda.update({ registrada: true }, { where: { id: tandaId } });

    //REDIRIGIR HACIA EL COMPROBANTE DE LA TANDA
    req.flash("exito", "Has guardado la tanda exitosamente");
    return res.json({ redirectUrl: `/mostrar-tanda-registrada/${tandaId}` });
  } catch (error) {
    console.error("Ha ocurrido un error:", error);
    req.flash("error", "Ups, no se pudo guardar la tanda, ocurrió un error");
  }
};

exports.getTandaRegistrada = async (req, res) => {
  const tandaId = req.params.id;
  const tanda = await Tanda.findByPk(tandaId);
  res.render("mostrar-tanda-registrada", {
    usuarioSesion: req.session.usuario,
    moment,
    tanda: tanda,
  });
};

exports.getEquiposPorTanda = async (req, res) => {
  const tandaId = req.params.tandaId;

  try {
    const equipos = await TandaInstancia.findAll({
      where: { tanda_id: tandaId },
      include: [
        {
          model: InstanciaEquipo,
          attributes: ["cod_propio", "num_registro"],
          include: [
            {
              model: Equipo,
              attributes: ["nombre", "marca"],
              include: [
                {
                  model: CategoriaEquipo,
                  attributes: ["nombre"],
                },
              ],
            },
          ],
        },
      ],
    });

    res.json(equipos);
  } catch (error) {
    console.error("Error en getEquiposPorTanda:", error);
    res.status(500).send("Error interno del servidor");
  }
};

exports.postActualizarDatosTour = async (req, res) => {
  const tandaId = req.params.id;
  const { cant_personas, tour_guide } = req.body;

  try {
    let tanda = await Tanda.findByPk(tandaId);
    if (!tanda) {
      return res.json({ success: false, message: "Tanda no encontrada" });
    }

    tanda.cant_personas = cant_personas;
    tanda.tour_guide = tour_guide;
    await tanda.save();

    res.json({ success: true, message: "Datos actualizados correctamente" });
  } catch (error) {
    console.error("Error al actualizar datos del tour:", error);
    res.json({
      success: false,
      message: "Error al actualizar los datos del tour",
    });
  }
};

exports.registrarEquipoTanda = async (req, res) => {
  const tandaId = req.params.id;
  const { cod_propio } = req.body;

  try {
    //BUSCAR INSTANCIA DEL EQUIPO
    const instancia = await InstanciaEquipo.findOne({
      where: { cod_propio: cod_propio },
    });

    if (!instancia) {
      return res.json({ success: false, message: "Instancia no encontrada." });
    }

    //VERIFICAR SI EL EQUIPO YA EXISTE EN LA TANDA

    //VERIFICAR EL ESTADO DEL EQUIPO
    if (instancia.estado !== "disponible") {
      return res.json({
        success: false,
        message: `Instancia no disponible. Estado actual: ${instancia.estado}`,
      });
    }

    await InstanciaEquipo.update(
      {
        estado: "en uso",
      },
      {
        where: {
          id: instancia.id,
        },
      }
    );

    //REGISTRAR EQUIPO EN LA TANDA
    await TandaInstancia.create({
      tanda_id: tandaId,
      instancia_id: instancia.id,
    });

    //MANDAR INFORMACIÓN DE LAS INSTANCIAS DEL EQUIPO REGISTRADO

    const equipo = await Equipo.obtenerEquipoById(instancia.equipo_id); // Suponiendo que tienes equipo_id en InstanciaEquipo
    const categoria = await CategoriaEquipo.obtenerCategoriaId(
      equipo.categoria_id
    ); // Suponiendo que equipo tiene categoria_id

    res.json({
      success: true,
      message: "Instancia registrada en la tanda.",
      equipo: {
        nombre: equipo.nombre,
        cod_propio: instancia.cod_propio,
        num_registro: instancia.num_registro,
        categoria: categoria.nombre,
      },
    });
  } catch (error) {
    console.error("Error al registrar la instancia en la tanda:", error);
    res.json({
      success: false,
      message: "Error al registrar la instancia en la tanda.",
    });
  }
};
