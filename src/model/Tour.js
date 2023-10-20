// models/Tour.js
module.exports = (sequelize, DataTypes) => {
    const Tour = sequelize.define('Tour', {
      horario: {
        type: DataTypes.TIME,
        allowNull: false
      },
      fecha: {
        type: DataTypes.DATEONLY,
        allowNull: true  // Permitir null ya que puede ser un tour recurrente
      },
      repetir: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false  // Por defecto no se repite
      }
    }, {
      tableName: 'tour'
    });
    return Tour;
  };
  
  