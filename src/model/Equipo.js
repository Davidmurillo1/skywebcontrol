// models/Equipo.js
module.exports = (sequelize, DataTypes) => {
    const Equipo = sequelize.define('Equipo', {
      nombre: {
        type: DataTypes.STRING(200),
        allowNull: false
      },
      tipo: {
        type: DataTypes.STRING(200),
        allowNull: false
      }
    });
    return Equipo;
  };
  