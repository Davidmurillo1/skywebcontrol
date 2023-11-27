// models/EntradaInstancia.js
module.exports = (sequelize, DataTypes) => {
    const EntradaInstancia = sequelize.define("EntradaInstancia", {
      entrada_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      instancia_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "entrada_instancias", // Esto especifica el nombre exacto de la tabla en tu base de datos
    }
    );
    return EntradaInstancia;
  };