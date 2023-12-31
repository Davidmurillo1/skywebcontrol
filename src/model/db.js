const { Sequelize } = require("sequelize");

// Utilizar variables de entorno para la configuración
const sequelize = new Sequelize(
  process.env.DB_NAME || "skycontrol", 
  process.env.DB_USER || "root", 
  process.env.DB_PASSWORD, {
    host: process.env.DB_HOST || "localhost",
    dialect: process.env.DB_DIALECT || "mysql",
    port: process.env.DB_PORT || 3306,
});


const Equipo = require("./Equipo")(sequelize, Sequelize.DataTypes);
const InstanciaEquipo = require("./InstanciaEquipo")(sequelize, Sequelize.DataTypes);
const Tour = require("./Tour")(sequelize, Sequelize.DataTypes);
const Tanda = require("./Tanda")(sequelize, Sequelize.DataTypes);
const TandaInstancia = require("./TandaInstancia")(sequelize, Sequelize.DataTypes);
const Usuario = require("./Usuario")(sequelize, Sequelize.DataTypes);
const CategoriaEquipo = require("./CategoriaEquipo")(sequelize, Sequelize.DataTypes);
const EntradaEquipo = require("./EntradaEquipo")(sequelize, Sequelize.DataTypes);
const EntradaInstancias = require("./EntradaInstancias")(sequelize, Sequelize.DataTypes);







// Definición de relaciones
Equipo.hasMany(InstanciaEquipo, { foreignKey: "equipo_id" });
InstanciaEquipo.belongsTo(Equipo, { foreignKey: "equipo_id" });

Tour.hasMany(Tanda, { foreignKey: "tour_id" });
Tanda.belongsTo(Tour, { foreignKey: "tour_id" });

// Relaciones para Tanda, TandaInstancia e InstanciaEquipo
Tanda.hasMany(TandaInstancia, { foreignKey: "tanda_id" });
TandaInstancia.belongsTo(Tanda, { foreignKey: "tanda_id" });

InstanciaEquipo.hasMany(TandaInstancia, { foreignKey: "instancia_id" });
TandaInstancia.belongsTo(InstanciaEquipo, { foreignKey: "instancia_id" });

Tanda.belongsTo(Usuario, { foreignKey: "usuario" });
Usuario.hasMany(Tanda, { foreignKey: "usuario" });

Equipo.belongsTo(CategoriaEquipo, { foreignKey: "categoria_id" });
CategoriaEquipo.hasMany(Equipo, { foreignKey: "categoria_id" });


// Relaciones para Entrada, EntradaInstancias e InstanciaEquipo
EntradaEquipo.hasMany(EntradaInstancias, { foreignKey: "entrada_id" });
EntradaInstancias.belongsTo(EntradaEquipo, { foreignKey: "entrada_id" });

InstanciaEquipo.hasMany(EntradaInstancias, { foreignKey: "instancia_id" });
EntradaInstancias.belongsTo(InstanciaEquipo, { foreignKey: "instancia_id" });



module.exports = {
  sequelize,
  Equipo,
  InstanciaEquipo,
  Tour,
  Tanda,
  Usuario,
  CategoriaEquipo,
  TandaInstancia,
  EntradaEquipo,
  EntradaInstancias
};
