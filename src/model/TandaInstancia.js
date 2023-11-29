// models/TandaInstancia.js
module.exports = (sequelize, DataTypes) => {
  const TandaInstancia = sequelize.define("TandaInstancia", {
    tanda_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    instancia_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "tandainstancia",
  }
  
  );
  return TandaInstancia;
};
