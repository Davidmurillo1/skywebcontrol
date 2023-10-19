// models/Usuario.js
module.exports = (sequelize, DataTypes) => {
    const Usuario = sequelize.define('Usuario', {
      usuario: {
        type: DataTypes.STRING(200),
        allowNull: false,
        primaryKey: true
      },
      contrasena: {
        type: DataTypes.STRING(200),
        allowNull: false
      },
      nombre: {
        type: DataTypes.STRING(200),
        allowNull: false
      },
      tel: {
        type: DataTypes.STRING(200),
        allowNull: false
      },
      rol: {
        type: DataTypes.STRING(200),
        allowNull: false
      }
    });
    return Usuario;
  };
  
  