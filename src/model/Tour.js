// models/Tour.js
module.exports = (sequelize, DataTypes) => {
    const Tour = sequelize.define('Tour', {
      horario: {
        type: DataTypes.TIME,
        allowNull: false
      }
    });
    return Tour;
  };
  
  