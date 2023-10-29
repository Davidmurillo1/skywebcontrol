const { Equipo, CategoriaEquipo } = require('../model/db.js');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = require("../public/js/multerConfig.js");

exports.getMostrarEquipos = async (req, res) => {
    try {
        // Categoría seleccionada desde el sidebar
        const categoriaSeleccionada = req.query.categoria;

        // Configuración de la consulta
        let queryConfig = {
            attributes: ['id', 'nombre', 'imagen', 'categoria_id'],
            include: [{
                model: CategoriaEquipo,
                attributes: ['nombre']
            }]
        };

        // Si se seleccionó una categoría, añadimos la condición a la consulta
        if (categoriaSeleccionada) {
            queryConfig.where = { categoria_id: categoriaSeleccionada };
        }

        const equipos = await Equipo.findAll(queryConfig);
        
        // Convertir cada imagen en un Data URI
        const equiposConImagen = equipos.map(equipo => {
            if (equipo.imagen) {
                
                let mimeType;
                switch(equipo.imagen) {
                    case '.jpg':
                    case '.jpeg':
                        mimeType = 'image/jpeg';
                        break;
                    case '.png':
                        mimeType = 'image/png';
                        break;
                    case '.webp':
                        mimeType = 'image/webp';
                        break;
                    default:
                        mimeType = 'image/jpeg'; // Un valor por defecto
                }
                
                const imagenBase64 = Buffer.from(equipo.imagen).toString('base64');
                equipo.dataURI = `data:${mimeType};base64,${imagenBase64}`;
                console.log(equipo.dataURI.substring(0, 50));  // mostrará los primeros 50 caracteres del Data URI
            }
            return equipo;
        });

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
        res.redirect('/equipo');
    } catch (error) {
        console.error("Error al crear la categoría:", error);

        // Si hay un error, puedes redirigir al usuario de nuevo al formulario con un mensaje de error
        // o manejarlo de la manera que prefieras.
        res.status(500).render('crearCategoria', { error: 'Error al crear la categoría. Por favor, inténtalo de nuevo.' });
    }
};


exports.upload = upload;


