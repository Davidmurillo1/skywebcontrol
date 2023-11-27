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

        const EntradasNoRegistradas = await
            EntradaEquipo.findOne({
                where: {
                    registrada: false
                }
            })

        if (EntradasNoRegistradas) {

            req.flash('error', 'Ups, primero debes de completar esta entrada antes de intentar crear otra.');
            return res.redirect(`/mostrar-entrada/${EntradasNoRegistradas.id}`);

        } else {

            const equipoNuevo = await EntradaEquipo.create({
                fecha: fechaHoy,
                hora: hora,
                usuario: req.session.usuario.usuario
            });
            const equipoRegistrado = equipoNuevo.id;

            req.flash('exito', 'Nueva Entrada de equipo creada, guardala antes de crear otra.')
            return res.redirect(`/mostrar-entrada/${equipoRegistrado}`);

        }
    } catch (error) {
        console.log('Ha ocurrido un error: ', error);
        return res.redirect('/inicio');
    }

  };

  exports.getMostrarEntrada = async (req, res) => {
    const EntradaId = req.params.id;
    try {
        const entrada = await EntradaEquipo.findByPk(EntradaId);

        if (EntradaId) {
            return res.render('equipo-entrada', {
                entrada: entrada,
                messages: req.flash(),
                usuarioSesion: req.session.usuario,
                moment: moment
            })
        }
    } catch (error) {
        console.error('Ha ocurrido un error al mostrar la tanda: ', error);
    }
  }


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