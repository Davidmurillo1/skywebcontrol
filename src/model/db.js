const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('skycontrol', 'root', '', {
    host: 'localhost',
    dialect: "mysql",
    port: process.env.port || 3306
});

// async function testConnection(){
//     try {
//         await sequelize.authenticate();
//         console.log('Connection has been established successfully.');
//       } catch (error) {
//         console.error('Unable to connect to the database:', error);
//       }
// }
// testConnection();

const Equipo = require('./Equipo')(sequelize, Sequelize.DataTypes);
const InstanciaEquipo = require('./InstanciaEquipo')(sequelize, Sequelize.DataTypes);
const Tour = require('./Tour')(sequelize, Sequelize.DataTypes);
const Tanda = require('./Tanda')(sequelize, Sequelize.DataTypes);
const TandaInstancia = require('./TandaInstancia')(sequelize, Sequelize.DataTypes);
const Usuario = require('./Usuario')(sequelize, Sequelize.DataTypes);
const CategoriaEquipo = require('./CategoriaEquipo')(sequelize, Sequelize.DataTypes);


// Definición de relaciones
Equipo.hasMany(InstanciaEquipo, { foreignKey: 'equipo_id' });
InstanciaEquipo.belongsTo(Equipo, { foreignKey: 'equipo_id' });

Tour.hasMany(Tanda, { foreignKey: 'tour_id' });
Tanda.belongsTo(Tour, { foreignKey: 'tour_id' });

// Establece que una Tanda puede tener muchas InstanciaEquipo a través de TandaInstancia
Tanda.belongsToMany(InstanciaEquipo, { through: TandaInstancia, foreignKey: 'tanda_id' });

// Establece que una InstanciaEquipo puede pertenecer a muchas Tanda a través de TandaInstancia
InstanciaEquipo.belongsToMany(Tanda, { through: TandaInstancia, foreignKey: 'instancia_id' });



Tanda.belongsTo(Usuario, { foreignKey: 'usuario' });
Usuario.hasMany(Tanda, { foreignKey: 'usuario' });

Equipo.belongsTo(CategoriaEquipo, { foreignKey: 'categoria_id' });
CategoriaEquipo.hasMany(Equipo, { foreignKey: 'categoria_id' });

module.exports = {
  sequelize,
  Equipo,
  InstanciaEquipo,
  Tour,
  Tanda,
  Usuario,
  CategoriaEquipo,
  TandaInstancia
};