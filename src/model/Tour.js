// models/Tour.js
module.exports = (sequelize, DataTypes) => {
    const Tour = sequelize.define('Tour', {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER(11),
        allowNull: true
      },
      horario: {
        type: DataTypes.TIME,
        allowNull: false
      },
      fecha: {
        type: DataTypes.DATEONLY,
        allowNull: true  // Permitir null ya que puede ser un tour recurrente
      },
      repetir: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false  // Por defecto no se repite
      }
    }, {
      tableName: 'tour'
    });

    Tour.encontrarTourId = async function(id) {
      const tour = await Tour.findOne({
          where: {
              id: id
          }
      });
  
      // Verificar si se encontró un tour
      if (tour) {
          return tour;
      } else {
          // Manejar el caso en el que no se encuentra el tour, por ejemplo, devolver null o lanzar un error
          return null; // o lanzar un error, dependiendo de cómo quieras manejar este caso
      }
  };
  






    return Tour;
  };
  
  