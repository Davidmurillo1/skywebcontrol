// models/CategoriaEquipo.js
module.exports = (sequelize, DataTypes) => {
    const CategoriaEquipo = sequelize.define('CategoriaEquipo', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true  // Permitir null, ya que la descripción podría ser opcional
        }
    }, {
      tableName: 'CategoriaEquipo'  // Esto especifica el nombre exacto de la tabla en tu base de datos
    });

    return CategoriaEquipo;
};

