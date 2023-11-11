// models/Tanda.js
module.exports = (sequelize, DataTypes) => {
    const Tanda = sequelize.define('Tanda', {
      tour_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      tour_guide: {
        type: DataTypes.STRING(200),
        allowNull: false
      },
      usuario: {
        type: DataTypes.STRING(200),
        allowNull: false
      }
    });
    return Tanda;
  };
  