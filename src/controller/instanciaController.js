const { Equipo, CategoriaEquipo, InstanciaEquipo } = require("../model/db.js");

const getInstancias = {
  // Método para mostrar la lista de equipos con sus instancias
  listEquipments: async (req, res) => {
    try {
      const equipments = await InstanciaEquipo.findAll({
        include: [
          {
            model: instanciaEquipo,
            as: "instancias",
          },
        ],
      });
      res.render("equipments/list", { equipments }); // Renderiza la vista 'list' en la carpeta 'equipments'
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  // Método para obtener las instancias de un equipo y mostrar el modal
  getInstances: async (req, res) => {
    try {
      const { equipoId } = req.params;
      const instances = await models.InstanciaEquipo.findAll({
        where: { equipoId },
      });
      res.json(instances); // Envia las instancias como respuesta en formato JSON
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  // Método para actualizar el estado de las instancias seleccionadas
  updateInstances: async (req, res) => {
    try {
      const { selectedInstances } = req.body; // IDs de las instancias seleccionadas
      await Promise.all(
        selectedInstances.map(async (id) => {
          await models.InstanciaEquipo.update(
            { estado: "en uso" },
            {
              where: { id },
            }
          );
        })
      );
      res.send("Instancias actualizadas con éxito");
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
};
