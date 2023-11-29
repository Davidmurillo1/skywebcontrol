// models/Tanda.js
module.exports = (sequelize, DataTypes) => {
  const Tanda = sequelize.define(
    "Tanda",
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER(11),
        allowNull: true,
      },
      tour_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      registrada: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
        allowNull: true,
        defaultValue: 0
      },
      tour_guide: {
        type: DataTypes.STRING(200),
        allowNull: true,
        defaultValue: ""
      },
      usuario: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
    },
    {
      tableName: "tanda",
    }
  );

  return Tanda;
};
