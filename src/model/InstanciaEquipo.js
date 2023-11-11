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
      },
      valor: {
        type: DataTypes.FLOAT,
        allowNull: false
      }
    }, {
      tableName: 'instancia_equipo'  // Esto especifica el nombre exacto de la tabla en tu base de datos
    });

    
    return InstanciaEquipo;
  };
  
  