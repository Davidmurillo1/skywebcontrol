module.exports = (sequelize, DataTypes) => {
  // Definición del modelo Equipo
  const Equipo = sequelize.define('Equipo', {
    // Definición de campos del modelo
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    cod_fabrica: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    nombre: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    imagen: {
      type: DataTypes.STRING(200),
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


  // Retornar el modelo Equipo
  return Equipo;
};
