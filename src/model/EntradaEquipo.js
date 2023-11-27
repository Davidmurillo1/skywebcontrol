// models/EntradaEquipo.js

module.exports = (sequelize, DataTypes) => {
    const EntradaEquipo = sequelize.define(
      "EntradaEquipo",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        fecha: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        hora: {
          type: DataTypes.TIME,
          allowNull: false, // Permitir null, ya que la descripción podría ser opcional
        },
        registrada: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        usuario: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
      },
      {
        tableName: "entrada_equipo", // Esto especifica el nombre exacto de la tabla en tu base de datos
      }
    );
  
    return EntradaEquipo;
  };