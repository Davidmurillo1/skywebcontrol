// models/Usuario.js
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define(
    "Usuario",
    {
      usuario: {
        type: DataTypes.STRING(200),
        allowNull: false,
        primaryKey: true,
      },
      contrasena: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      nombre: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      tel: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      rol: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
    },
    {
      tableName: "usuario", // Esto especifica el nombre de la tabla manualmente
      hooks: {
        beforeCreate: async (usuario) => {
          const salt = await bcrypt.genSalt(10);
          usuario.contrasena = await bcrypt.hash(usuario.contrasena, salt);
        },
      },
    }
  );

  Usuario.prototype.validarContrasena = async function (contrasena) {
    return await bcrypt.compare(contrasena, this.contrasena);
  };

  return Usuario;
};
