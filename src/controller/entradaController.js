const {
  Tanda,
  Tour,
  Equipo,
  CategoriaEquipo,
  TandaInstancia,
  InstanciaEquipo,
  EntradaEquipo,
  EntradaInstancias,
  sequelize,
} = require("../model/db.js");
const { Op } = require("sequelize");
const moment = require("moment");

exports.getEntrada = async (req, res) => {
  const fechaHoy = moment().format("YYYY-MM-DD");
  const hora = moment().format("HH:mm");

  try {
    const entradaNoRegistrada = await EntradaEquipo.findOne({
      where: { registrada: false },
    });

    if (entradaNoRegistrada) {
      req.flash("error", "Primero completa la entrada pendiente.");
      return res.redirect(`/mostrar-entrada/${entradaNoRegistrada.id}`);
    }

    const nuevaEntrada = await EntradaEquipo.create({
      fecha: fechaHoy,
      hora: hora,
      usuario: req.session.usuario?.usuario || "Invitado", // Asegura que siempre haya un usuario
    });

    req.flash("exito", "Nueva entrada creada.");
    return res.redirect(`/mostrar-entrada/${nuevaEntrada.id}`);
  } catch (error) {
    console.error("Error en getEntrada:", error);
    req.flash("error", "Error al procesar la solicitud.");
    return res.redirect("/inicio");
  }
};

exports.getMostrarEntrada = async (req, res) => {
  const entradaId = req.params.id;

  try {
    const entrada = await EntradaEquipo.findByPk(entradaId);

    if (!entrada) {
      req.flash("error", "Entrada no encontrada.");
      return res.redirect("/inicio");
    }

    return res.render("equipo-entrada", {
      entrada: entrada,
      messages: req.flash(),
      usuarioSesion: req.session.usuario,
      moment: moment,
    });
  } catch (error) {
    console.error("Error en getMostrarEntrada:", error);
    req.flash("error", "Error al mostrar la entrada.");
    return res.redirect("/inicio");
  }
};

//REGISTRAR EQUIPO DE VUELTA
exports.registrarEquipoEntrada = async (req, res) => {
  const entradaId = req.params.id;
  const { cod_propio } = req.body;

  try {
    //BUSCAR INSTANCIA DEL EQUIPO
    const instancia = await InstanciaEquipo.findOne({
      where: { cod_propio: cod_propio },
    });

    if (!instancia) {
      return res.json({ success: false, message: "Instancia no encontrada." });
    }

    //VERIFICAR SI EL EQUIPO YA EXISTE EN LA ENTRADA

    //VERIFICAR EL ESTADO DEL EQUIPO
    if (instancia.estado === "disponible") {
      return res.json({
        success: false,
        message: `Instancia no disponible. Estado actual: ${instancia.estado}`,
      });
    }

    await InstanciaEquipo.update(
      {
        estado: "disponible",
      },
      {
        where: {
          id: instancia.id,
        },
      }
    );

    //REGISTRAR EQUIPO EN LA TANDA
    await EntradaInstancias.create({
      entrada_id: entradaId,
      instancia_id: instancia.id,
    });

    //MANDAR INFORMACIÓN DE LAS INSTANCIAS DEL EQUIPO REGISTRADO

    const equipo = await Equipo.obtenerEquipoById(instancia.equipo_id); // Suponiendo que tienes equipo_id en InstanciaEquipo
    const categoria = await CategoriaEquipo.obtenerCategoriaId(
      equipo.categoria_id
    ); // Suponiendo que equipo tiene categoria_id

    res.json({
      success: true,
      message: "Instancia registrada en la entrada de equipo.",
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

exports.getEquiposPorEntrada = async (req, res) => {
  const entradaId = req.params.entradaId;

  try {
    const equipos = await EntradaInstancias.findAll({
      where: { entrada_id: entradaId },
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

exports.postguardarEntrada = async (req, res) => {
  const entradaId = req.body.id;

  try {
    // Verificar si la Tanda existe y no está registrada
    const EntradaExiste = await EntradaEquipo.findOne({
      where: {
        id: entradaId,
        registrada: false,
      },
    });

    if (!EntradaExiste) {
      return res
        .status(404)
        .send("Entrada no encontrada o ya está registrada.");
    }

    // Actualizar el estado de la Tanda
    await EntradaEquipo.update(
      { registrada: true },
      { where: { id: entradaId } }
    );

    //REDIRIGIR HACIA EL COMPROBANTE DE LA TANDA
    req.flash("exito", "Has guardado la entrada exitosamente");
    return res.json({
      redirectUrl: `/mostrar-entrada-registrada/${entradaId}`,
    });
  } catch (error) {
    console.error("Ha ocurrido un error:", error);
    req.flash("error", "Ups, no se pudo guardar la entrada, ocurrió un error");
  }
};

exports.getEntradaRegistrada = async (req, res) => {
  const entradaId = req.params.id;
  const entrada = await EntradaEquipo.findByPk(entradaId);
  if (!entrada) {
    console.log("Entrada No Existe");
  }
  res.render("mostrar-entrada-registrada", {
    usuarioSesion: req.session.usuario,
    moment,
    entrada: entrada,
  });
};
