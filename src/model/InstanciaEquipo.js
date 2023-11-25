// models/InstanciaEquipo.js
module.exports = (sequelize, DataTypes) => {
    const InstanciaEquipo = sequelize.define('InstanciaEquipo', {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER(11),
        allowNull: true
      },
      equipo_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      num_registro: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      cod_propio: {
        type: DataTypes.STRING(200),
        allowNull: false
      },
      estado: {
        type: DataTypes.STRING(200),
        allowNull: false
      },
      fecha_ingreso: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      valor: {
        type: DataTypes.FLOAT,
        allowNull: false
      }
    }, {
      tableName: 'instancia_equipo'  // Esto especifica el nombre exacto de la tabla en tu base de datos
    });

    InstanciaEquipo.sumaTotalEquipos = async function(equipoId){
      return await InstanciaEquipo.count({
        where: {equipo_id: equipoId}
      });
    };

    InstanciaEquipo.generarCodigoPropio = async function(categoria_nombre) {
      const primeraLetra = categoria_nombre.charAt(0).toUpperCase();
      const ultimaInstancia = await InstanciaEquipo.findOne({
          where: {
              cod_propio: sequelize.where(
                  sequelize.fn('substring', sequelize.col('cod_propio'), 1, 1),
                  primeraLetra
              )
          },
          order: [['cod_propio', 'DESC']]
      });
  
      let nuevoNumero = 101; // Número inicial
      if (ultimaInstancia) {
          const ultimoNumero = parseInt(ultimaInstancia.cod_propio.substring(1));
          if (!isNaN(ultimoNumero)) {
              nuevoNumero = ultimoNumero + 1;
          }
      }
  
      return primeraLetra + nuevoNumero;
  };
    
    return InstanciaEquipo;
  };
  
  