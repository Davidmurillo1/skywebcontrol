// models/InstanciaEquipo.js
module.exports = (sequelize, DataTypes) => {
    const InstanciaEquipo = sequelize.define('InstanciaEquipo', {
      equipo_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      num_registro: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      estado: {
        type: DataTypes.STRING(200),
        allowNull: false
      },
      fecha_ingreso: {
        type: DataTypes.DATEONLY,
        allowNull: false
      }
    });
    return InstanciaEquipo;
  };
  
  