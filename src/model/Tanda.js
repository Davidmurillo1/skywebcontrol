// models/Tanda.js
module.exports = (sequelize, DataTypes) => {
    const Tanda = sequelize.define('Tanda', {
      tour_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      tour_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        // Si tienes una relación con otra tabla, puedes usar references: { model: 'OtraTabla', key: 'id' }
      },
      fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      hora: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      cant_personas: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      tour_guide: {
        type: DataTypes.STRING(200),
        allowNull: true
      },
      usuario: {
        type: DataTypes.STRING(200),
        allowNull: false
      }
    }, {
      tableName: 'tanda'
    });



    return Tanda;
  };
  