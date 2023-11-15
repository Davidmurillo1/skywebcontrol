const { Equipo, CategoriaEquipo, InstanciaEquipo, sequelize } = require('../model/db.js');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = require("../public/js/multerConfig.js");
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

exports.getMostrarEquipos = async (req, res) => {
    try {
        // Categoría seleccionada desde el sidebar
        const categoriaSeleccionada = req.query.categoria;

        const equipos = await Equipo.obtenerEquiposPorCategoria(categoriaSeleccionada);
        
        // No es necesario convertir las imágenes a Data URI

        // Recuperar todas las categorías
        const categorias = await CategoriaEquipo.findAll();
        
        // Agregar el conteo de instancias a cada equipo
        for (let equipo of equipos) {
            const sumaTotalEquipos = await InstanciaEquipo.sumaTotalEquipos(equipo.id);
            equipo.sumaTotalEquipos = sumaTotalEquipos;
        }

        // Pasa los equipos tal como están, ya que las rutas de las imágenes están almacenadas en la base de datos
        res.render('equipos', { equipos: equipos, categorias: categorias, usuarioSesion: req.session.usuario });
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
            const categorias = await CategoriaEquipo.findAll();
            return res.render('agregarEquipo', { 
                categorias: categorias, 
                usuarioSesion: req.session.usuario, 
                error: req.fileValidationError 
            });
        }

        const { nombre, categoria_id, marca } = req.body;
        let rutaRelativaImagen = null;

        if (req.file) {
            // Generar un identificador único para el nombre del archivo
            const extensionArchivo = path.extname(req.file.originalname);
            const nombreArchivo = uuidv4() + extensionArchivo; // Usar UUID

            // Ruta del directorio donde se guardarán las imágenes
            const directorioImagenes = path.join(__dirname, '..', 'public', 'img', 'equipo');

            // Asegurarse de que el directorio existe
            if (!fs.existsSync(directorioImagenes)){
                fs.mkdirSync(directorioImagenes, { recursive: true });
            }

            // Ruta completa donde se guardará la imagen en el sistema de archivos
            const rutaCompletaImagen = path.join(directorioImagenes, nombreArchivo);

            // Ruta relativa para guardar en la base de datos
            rutaRelativaImagen = path.join('img', 'equipo', nombreArchivo);

            // Guardar la imagen en el sistema de archivos
            fs.writeFileSync(rutaCompletaImagen, req.file.buffer);
        }

        // Añadir el equipo a la base de datos
        await Equipo.create({
            nombre: nombre,
            imagen: rutaRelativaImagen, // Guardar solo la ruta relativa de la imagen
            categoria_id: categoria_id,
            marca: marca
        });

        // Redireccionar a la lista de equipos
        res.redirect('/equipo');
    } catch (error) {
        console.error("Error al añadir el equipo:", error);
        res.status(500).send("Error al añadir el equipo");
    }
};

exports.getEditarEquipo = async (req, res) => {
    const equipoId = req.params.id;

    try {
        const equipo = await Equipo.obtenerEquipoById(equipoId);

        if (equipo) {
            await Equipo.update({
                where: { id: equipoId } 
            });

            req.flash('exito', 'Muy bien, se ha editado el equipo correctamente');
            return res.redirect(`/equipo-detalle/${equipoId}`, { usuarioSesion: req.session.usuario, messages: req.flash() });
        } else {
            req.flash('error', 'Ups, hubo un error al editar el equipo');
            return res.redirect(`/equipo-detalle/${equipoId}`, { usuarioSesion: req.session.usuario, messages: req.flash() });
        }
    } catch (error) {
        console.error('Ha ocurrido un error editar el equipo');
        return res.redirect(`/equipo-detalle/${equipoId}`);
    }
    
};

exports.postEditarEquipo = async (req, res) => {

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

        const sumaTotalEquipos = await InstanciaEquipo.sumaTotalEquipos(equipoId);

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


        // Renderiza la vista con los datos necesarios
        res.render('detalleEquipo', { equipo: equipo, usuarioSesion: req.session.usuario, conteoEstados: conteoEstados, sumaTotalEquipos: sumaTotalEquipos });
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
            console.log('INSTANCIA EXISTE!');
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
            console.log('EXITO!');
            req.flash('exito', 'Nueva instancia de equipo registrada con éxito.');
            return res.redirect(`/detalle-equipo/${equipoId}`, { exito, usuarioSesion: req.session.usuario, messages: req.flash() }); // Ajusta la ruta según tu aplicación
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

        res.render('crear-categoria', { categorias: categorias, usuarioSesion: req.session.usuario, messages: req.flash() });
    } catch (error) {
        console.error("Error al mostrar el formulario de categorías:", error);
        res.status(500).send("Error al mostrar el formulario de equipo");
    }
};

exports.postCrearCategoria = async (req, res) => {
    // Extraer los datos del formulario
    const { nombre, descripcion } = req.body;

    try {

        const existeCategoria = await CategoriaEquipo.findOne({
            where: {
                nombre: nombre
            }
        })

        if (existeCategoria) {
            req.flash('error', 'Ya existe una categoría con este nombre');
            return res.redirect('/crear-categoria');
        }
        
        const crearCategoria = await CategoriaEquipo.getCrearCategoria(nombre, descripcion);

        if (crearCategoria) {
            req.flash('exito', 'La categoría fue creada exitosamente');
            return res.redirect('/categorias');
        }

    } catch (error) {
        console.error("Error al crear la categoría:");

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


