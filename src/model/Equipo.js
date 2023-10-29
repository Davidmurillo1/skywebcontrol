module.exports = (sequelize, DataTypes) => {
  const Equipo = sequelize.define('Equipo', {
    nombre: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    imagen: {
      type: DataTypes.BLOB,
      allowNull: true  // Permitir null ya que no todos los equipos podrían tener una imagen al inicio
    },
    categoria_id: {
      type: DataTypes.INTEGER,
      allowNull: true,  // Puedes ajustar esto según tus necesidades
      references: {
          model: 'CategoriaEquipo', // Este es el nombre del modelo, no el nombre de la tabla.
          key: 'id'
      }
    },  
  }, {
    tableName: 'equipo'  // Esto especifica el nombre exacto de la tabla en tu base de datos
  });

  return Equipo;
};
