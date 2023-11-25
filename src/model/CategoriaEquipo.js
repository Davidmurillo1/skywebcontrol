// models/CategoriaEquipo.js


module.exports = (sequelize, DataTypes) => {
    const CategoriaEquipo = sequelize.define('CategoriaEquipo', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING(200),
            allowNull: true  // Permitir null, ya que la descripción podría ser opcional
        }
    }, {
      tableName: 'categoriaequipo'  // Esto especifica el nombre exacto de la tabla en tu base de datos
    });


    // Intentar crear una nueva categoría en la base de datos
    CategoriaEquipo.crearNuevaCategoria = async function(nombre, descripcion){
        return await CategoriaEquipo.create({
            nombre: nombre,
            descripcion: descripcion
        });
    }

    CategoriaEquipo.obtenerCategoriaId = async function(id){
        const categoria= await CategoriaEquipo.findOne({
            where:{
                id: id
            }
        })

        return await categoria.nombre;
    };

    

    return CategoriaEquipo;
};


