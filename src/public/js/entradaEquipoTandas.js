// Modificar el evento submit del formulario para llamar a actualizarTablas
document.getElementById("formDos").addEventListener("submit", function (event) {
    event.preventDefault();
    const entradaId = this.dataset.entradaId;
    const codigoBarras = document.getElementById("codigoBarras").value;
  
    fetch("/registrar-equipo-entrada/" + entradaId, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cod_propio: codigoBarras }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          document.getElementById("codigoBarras").value = "";
          document.getElementById("sonidoExito").play();
          document.getElementById("mensajeExito").textContent = data.message;
          document.getElementById("mensajeExito").style.display = "block";
          setTimeout(function () {
            document.getElementById("mensajeExito").style.display = "none";
          }, 1000);
          actualizarTablas(entradaId); // Actualizar tablas después de registrar con éxito
        } else {
          document.getElementById("codigoBarras").value = "";
          document.getElementById("sonidoError").play();
          document.getElementById("mensajeError").textContent = data.message;
          document.getElementById("mensajeError").style.display = "block";
          setTimeout(function () {
            document.getElementById("mensajeError").style.display = "none";
          }, 3000);
        }
      })
      .catch((error) => console.error("Error:", error));
  });



//CODIGO PARA MOSTRAR LOS EQUIPOS QUE SE VAN REGISTRANDO
document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/equipos-entrada/" + entradaId)
    .then((response) => response.json())
    .then((equipos) => {
      const equiposPorCategoria = equipos.reduce((categorias, equipo) => {
        // Asumiendo que 'equipo' tiene una propiedad 'categoria'
        const categoria = equipo.InstanciaEquipo.Equipo.CategoriaEquipo.nombre;
        if (!categorias[categoria]) {
          categorias[categoria] = [];
        }
        categorias[categoria].push(equipo);
        return categorias;
      }, {});

      crearTablas(equiposPorCategoria);
    })
    .catch((error) => console.error("Error:", error));
});

// Función para actualizar las tablas de equipos
function actualizarTablas(entradaId) {
  fetch("/api/equipos-entrada/" + entradaId)
    .then((response) => response.json())
    .then((equipos) => {
      const equiposPorCategoria = equipos.reduce((categorias, equipo) => {
        const categoria = equipo.InstanciaEquipo.Equipo.CategoriaEquipo.nombre;
        if (!categorias[categoria]) {
          categorias[categoria] = [];
        }
        categorias[categoria].push(equipo);
        return categorias;
      }, {});

      crearTablas(equiposPorCategoria);
    })
    .catch((error) => console.error("Error:", error));
}

// Modificación en la función crearTablas para verificar si ya existe la tabla de la categoría
function crearTablas(equiposPorCategoria) {
  const contenedor = document.getElementById("contenedor-tablas");

  Object.keys(equiposPorCategoria).forEach((categoria) => {
    let card = contenedor.querySelector(`.card[data-categoria="${categoria}"]`);
    if (!card) {
      // Crear la card si no existe
      card = document.createElement("div");
      card.classList.add("card", "mb-3");
      card.style.maxWidth = "30rem";
      card.style.minWidth = "30rem";
      card.setAttribute("data-categoria", categoria);

      const cardHeader = document.createElement("div");
      cardHeader.classList.add("card-header");
      cardHeader.textContent = categoria;
      card.appendChild(cardHeader);

      const cardBody = document.createElement("div");
      cardBody.classList.add("card-body");

      const tabla = document.createElement("table");
      tabla.classList.add("table", "table-borderless", "table", "table-hover");
      tabla.innerHTML = `<thead><tr><th>Cod</th><th>Nombre</th><th><i class="fa-solid fa-trash"></i></th></tr></thead>`;
      const tbody = document.createElement("tbody");
      tbody.setAttribute("id", `tabla-body-${categoria}`);
      tabla.appendChild(tbody);
      cardBody.appendChild(tabla);
      card.appendChild(cardBody);
      contenedor.appendChild(card);
    } else {
      // Limpiar el tbody existente
      const tbody = card.querySelector(`#tabla-body-${categoria}`);
      tbody.innerHTML = "";
    }

    // Añadir filas para cada equipo en la categoría
    equiposPorCategoria[categoria].forEach((equipo) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${equipo.InstanciaEquipo.cod_propio}</td><td>${equipo.InstanciaEquipo.Equipo.nombre} N°${equipo.InstanciaEquipo.num_registro} | ${equipo.InstanciaEquipo.Equipo.marca}</td><td><i style="color: red;" class="fa-solid fa-trash"></i></td>`;
      document.querySelector(`#tabla-body-${categoria}`).appendChild(tr);
    });
  });
}