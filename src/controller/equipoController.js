const { Equipo, CategoriaEquipo, InstanciaEquipo, sequelize } = require('../model/db.js');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = require("../public/js/multerConfig.js");

exports.getMostrarEquipos = async (req, res) => {
    try {
        // Categoría seleccionada desde el sidebar
        const categoriaSeleccionada = req.query.categoria;

        const equipos = await Equipo.obtenerEquiposPorCategoria(categoriaSeleccionada);
        
        // Convertir las imágenes a Data URI
        const equiposConImagen = Equipo.convertirImagenesADataURI(equipos);

        // Recuperar todas las categorías
        const categorias = await CategoriaEquipo.findAll();

        res.render('equipos', { equipos: equiposConImagen, categorias: categorias, usuarioSesion: req.session.usuario });
    } catch (error) {
        console.error("Error al obtener equipos y categorías:", error);
        res.status(500).send("Error al obtener los equipos y categorías");
    }
};





// Mostrar el formulario para añadir un equipo
exports.getAgregarEquipo = async (req, res) => {
    try {
        // Obtener todas las categorías para el dropdown en el formulario
        const categorias = await CategoriaEquipo.findAll();

        res.render('agregarEquipo', { categorias: categorias, usuarioSesion: req.session.usuario });
    } catch (error) {
        console.error("Error al mostrar el formulario de equipo:", error);
        res.status(500).send("Error al mostrar el formulario de equipo");
    }
};

// Procesar el formulario y añadir el equipo a la base de datos
exports.postAgregarEquipo = async (req, res) => {
    try {
        // Verificar si hay un error de validación de archivo
        if (req.fileValidationError) {
            // Renderiza nuevamente la página de carga con el mensaje de error
            const categorias = await CategoriaEquipo.findAll();
            return res.render('agregarEquipo', { 
                categorias: categorias, 
                usuarioSesion: req.session.usuario, 
                error: req.fileValidationError 
            });
        }
        
        const { nombre, categoria_id } = req.body;
        const imagen = req.file ? req.file.buffer : null;

        // Añadir el equipo a la base de datos
        await Equipo.create({
            nombre: nombre,
            imagen: imagen, 
            categoria_id: categoria_id
        });

        // Redireccionar a la lista de equipos o a donde prefieras
        res.redirect('/equipo');
    } catch (error) {
        console.error("Error al añadir el equipo:", error);
        res.status(500).send("Error al añadir el equipo");
    }
};


//VISTA DETALLADA DEL EQUIPO

exports.getDetalleEquipo = async (req, res) => {
    try {
        const equipoId = req.params.id;
        const equipo = await Equipo.obtenerEquipoById(equipoId);

        if (!equipo) {
            // Si no se encuentra el equipo, envía una respuesta 404
            return res.status(404).send("Equipo no encontrado");
        }

        const sumaTotalEquipos = await InstanciaEquipo.count({
            where: { equipo_id: equipoId }
        });

        // Contar equipos según su estado, filtrando por el modeloId
        const conteoEstados = await InstanciaEquipo.findAll({
            where: { equipo_id: equipoId },
            attributes: ['estado', [sequelize.fn('COUNT', sequelize.col('estado')), 'cantidad']],
            group: ['estado']
        });

        // Convertir a un objeto para un acceso fácil por estado
        let conteoPorEstado = {};
        conteoEstados.forEach(estado => {
            conteoPorEstado[estado.estado] = estado.cantidad;
        });

        // Convertir la imagen a Data URI si existe
        // Considera manejar diferentes tipos de imágenes (no solo jpeg)
        if (equipo.imagen) {
            const imagenBase64 = Buffer.from(equipo.imagen).toString('base64');
            equipo.dataURI = `data:image/jpeg;base64,${imagenBase64}`;
        }

        // Renderiza la vista con los datos necesarios
        res.render('detalleEquipo', { equipo: equipo, equipoImagen: equipo.dataURI, usuarioSesion: req.session.usuario, conteoEstados: conteoEstados, sumaTotalEquipos: sumaTotalEquipos });
        console.log(conteoEstados);
    } catch (error) {
        console.error("Error al obtener detalles del equipo:", error);
        res.status(500).send("Error interno del servidor");
    }
};

//AGREGAR INSTANCIAS DEL EQUIPO
exports.getNuevaInstanciaEquipo = async (req, res) => {
    const equipoId = req.params.id;
    const equipo = await Equipo.obtenerEquipoById(equipoId);

    if (equipo) {
        res.render('agregarInstancia', {equipo, usuarioSesion: req.session.usuario});
    } else {
        req.flash('error', 'No se pudo encontrar ningún equipo');
        res.redirect('/equipo', { flash });
    }
}
exports.postNuevaInstanciaEquipo = async (req, res) => {
    const equipoId = req.params.id;
    
    
    try {

        const { numeroRegistro, estado, fechaIngreso, valor } = req.body;
        console.log("estado:", estado);

        // Verificar si ya existe una instancia con el mismo num_registro para el mismo equipo
        const instanciaExistente = await InstanciaEquipo.findOne({
            where: {
                equipo_id: equipoId,
                num_registro: numeroRegistro
            }
        });

        if (instanciaExistente) {
            // Si ya existe, usa flash para enviar un mensaje
            console.log('INSTANCIA EXISTE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
            req.flash('error', 'Ya existe una instancia del equipo con este número de registro para el equipo seleccionado.');
            return res.redirect(`/registrar-instancia/${equipoId}`); // Ajusta la ruta según tu aplicacion
        }

        // Crear nueva instancia de equipo
        const nuevaInstancia = await InstanciaEquipo.create({
            equipo_id: equipoId,
            num_registro: numeroRegistro,
            estado: estado,
            fecha_ingreso: fechaIngreso,
            valor: valor
        });

        if (nuevaInstancia) {
            // Mensaje de éxito y redirección
            console.log('EXITOOOOOOOOOOOOOO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
            req.flash('exito', 'Nueva instancia de equipo registrada con éxito.');
            return res.redirect(`/detalle-equipo/${equipoId}`, { exito, usuarioSesion: req.session.usuario }); // Ajusta la ruta según tu aplicación
        }
        
    } catch (error) {
        console.log('CATCH ERRORRRRRRRRRRRRRRRRRRRRRRRRR!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        console.error('Error al registrar nueva instancia de equipo:', error);
        req.flash('error', 'Error interno del servidor');
        res.redirect(`/detalle-equipo/${equipoId}`); // Ajusta la ruta según tu aplicación
    }
};
















// Mostrar el formulario para añadir una categoría
exports.getCrearCategoria = async (req, res) => {
    try {
        // Obtener todas las categorías para el dropdown en el formulario
        const categorias = await CategoriaEquipo.findAll();

        res.render('crear-categoria', { categorias: categorias, usuarioSesion: req.session.usuario });
    } catch (error) {
        console.error("Error al mostrar el formulario de categorías:", error);
        res.status(500).send("Error al mostrar el formulario de equipo");
    }
};

exports.postCrearCategoria = async (req, res) => {
    // Extraer los datos del formulario
    const { nombre, descripcion } = req.body;

    try {
        // Intentar crear una nueva categoría en la base de datos
        await CategoriaEquipo.create({
            nombre: nombre,
            descripcion: descripcion
        });

        // Redirigir al usuario a la lista de categorías (o donde prefieras)
        // Esto es solo un ejemplo, deberías redirigir donde tenga sentido en tu aplicación.
        res.redirect('/categorias');
    } catch (error) {
        console.error("Error al crear la categoría:", error);

        // Si hay un error, puedes redirigir al usuario de nuevo al formulario con un mensaje de error
        // o manejarlo de la manera que prefieras.
        res.status(500).render('crearCategoria', { error: 'Error al crear la categoría. Por favor, inténtalo de nuevo.' });
    }
};


//GESTIÓN DE CATEGORÍAS

exports.getCategorias = async (req, res) => {
    const categorias = await CategoriaEquipo.findAll();

    res.render('categorias', { categorias: categorias, messages: req.flash(), usuarioSesion: req.session.usuario })
}

exports.getEditarCategoria = async (req, res) => {
    try {
      const categoria = await CategoriaEquipo.findOne({
        where: { id: req.params.categoria }
      });
      if (categoria) {
        res.render('editar-categoria', { categoria: categoria, usuarioSession: req.session.usuario });
      } else {
        res.status(404).send('Categoría no encontrada');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Hubo un error al obtener el usuario');
    }
  };

exports.postEditarCategoria = async (req, res) => {
     const categoria = req.params.categoriaId
    try {
      await CategoriaEquipo.update(
        {
          nombre: req.body.nombre,
          descripcion: req.body.descripcion,
        },
        {
          where: { id: categoria }
        }
      );
      res.redirect('/categorias');
    } catch (error) {
      console.error(error);
      res.status(500).send('Hubo un error al editar la categoría');
    }
  };

exports.postEliminarCategoria = async (req, res) => {
    //Extraer datos del formulario
    const {categoria} = req.body;


    try {
        const resultado = await CategoriaEquipo.destroy({
            where: {id: categoria}
        });

        if (resultado) {
            req.flash('success', 'Categoría eliminada exitosamente');
            res.redirect("/categorias");
        } else {
            req.flash('error', 'Categoría no encontrada');
            res.redirect("/categorias");
        }
    } catch (error) {
        req.flash('error', 'Error al eliminar la categoría');
        res.redirect("/categorias");
    }
}

exports.upload = upload;


