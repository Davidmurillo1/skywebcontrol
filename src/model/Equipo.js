module.exports = (sequelize, DataTypes) => {
  // Definición del modelo Equipo
  const Equipo = sequelize.define('Equipo', {
    // Definición de campos del modelo
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    imagen: {
      type: DataTypes.BLOB,
      allowNull: true  // Permitir null ya que no todos los equipos podrían tener una imagen al inicio
    },
    categoria_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'CategoriaEquipo', // Este es el nombre del modelo, no el nombre de la tabla.
        key: 'id'
      }
    },
    marca: {
      type: DataTypes.STRING(200),
      allowNull: false
    }
  }, {
    tableName: 'equipo'  // Especifica el nombre exacto de la tabla en la base de datos
  });

  // Métodos Estáticos del Modelo

  // Método para obtener un equipo por ID
  Equipo.obtenerEquipoById = async function(equipoId){
    return await Equipo.findOne({
      where: { id: equipoId },
      include: [{
        model: sequelize.models.InstanciaEquipo // Referencia al modelo InstanciaEquipo
      }]
    });
  };

  // Método para obtener equipos por categoría
  Equipo.obtenerEquiposPorCategoria = async function(categoriaSeleccionada) {
    let queryConfig = {
      attributes: ['id', 'nombre', 'imagen', 'categoria_id'],
      include: [{
        model: sequelize.models.CategoriaEquipo,
        attributes: ['nombre']
      }]
    };

    if (categoriaSeleccionada) {
      queryConfig.where = { categoria_id: categoriaSeleccionada };
    }

    return await Equipo.findAll(queryConfig);
  };

  // Método para convertir imágenes a Data URI
  Equipo.convertirImagenesADataURI = function(equipos) {
    return equipos.map(equipo => {
      if (equipo.imagen) {
        let mimeType;
        // Aquí asumes que tienes el campo 'imagen' como extensión
        const extension = equipo.imagen; // Esto podría necesitar ser revisado

        switch(extension) {
          case 'jpg':
          case 'jpeg':
            mimeType = 'image/jpeg';
            break;
          case 'png':
            mimeType = 'image/png';
            break;
          case 'webp':
            mimeType = 'image/webp';
            break;
          default:
            mimeType = 'image/jpeg'; // Un valor por defecto
        }

        const imagenBase64 = Buffer.from(equipo.imagen).toString('base64');
        equipo.dataURI = `data:${mimeType};base64,${imagenBase64}`;
      }
      return equipo;
    });
  };

  // Retornar el modelo Equipo
  return Equipo;
};
