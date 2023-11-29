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

  // Método para obtener un equipo por ID
  TandaInstancia.obtenerUsosInstancia = async function (instanciaId) {
    return await TandaInstancia.count({
      where: { instancia_id: instanciaId }
    });
  };



  return TandaInstancia;
};
