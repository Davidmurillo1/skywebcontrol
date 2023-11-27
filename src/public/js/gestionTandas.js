//ACTUALIZAR DATOS DEL TOUR
//Manipular los input y el submit si se está editando
function editarCampo(campo) {
  document.getElementById(campo + "Texto").style.display = "none";
  document.getElementById(campo + "Input").style.display = "inline";
  document.getElementById(campo + "Input").value = document.getElementById(
    campo + "Texto"
  ).innerText;

  // Mostrar el botón de guardar
  document.getElementById("botonGuardar").style.display = "inline";
}

//ENVIAR LA INFORMACIÓN UTILIZANDO AJAX
function enviarDatosTour(tandaId) {
  const cantidadPersonas = document.getElementById(
    "cantidadPersonasInput"
  ).value;
  const headGuide = document.getElementById("headGuideInput").value;

  fetch(`/actualizar-datos-tour/${tandaId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cant_personas: cantidadPersonas,
      tour_guide: headGuide,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Actualizar el texto y ocultar los campos de entrada
        document.getElementById("cantidadPersonasTexto").innerText =
          cantidadPersonas;
        document.getElementById("headGuideTexto").innerText = headGuide;
        document.getElementById("cantidadPersonasTexto").style.display =
          "inline";
        document.getElementById("headGuideTexto").style.display = "inline";
        document.getElementById("cantidadPersonasInput").style.display = "none";
        document.getElementById("headGuideInput").style.display = "none";
        document.getElementById("botonGuardar").style.display = "none";
      } else {
        alert("Error al actualizar los datos");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/equipos/" + tandaId)
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
function actualizarTablas(tandaId) {
  fetch("/api/equipos/" + tandaId)
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
      tabla.innerHTML = `<thead><tr><th>Cod</th><th>Nombre</th><th>Eliminar</th></tr></thead>`;
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
      tr.innerHTML = `<td>${equipo.InstanciaEquipo.cod_propio}</td><td>${equipo.InstanciaEquipo.Equipo.nombre} N°${equipo.InstanciaEquipo.num_registro} | ${equipo.InstanciaEquipo.Equipo.marca}</td><td>Eliminar</td>`;
      document.querySelector(`#tabla-body-${categoria}`).appendChild(tr);
    });
  });
}

// Modificar el evento submit del formulario para llamar a actualizarTablas
document.getElementById("formDos").addEventListener("submit", function (event) {
  event.preventDefault();
  const tandaId = this.dataset.tandaId;
  const codigoBarras = document.getElementById("codigoBarras").value;

  fetch("/registrar-equipo-tanda/" + tandaId, {
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
        actualizarTablas(tandaId); // Actualizar tablas después de registrar con éxito
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

//ACCIÓN DEL BOTÓN PARA GUARDAR TANDA
document.getElementById("btnGuardar").addEventListener("click", function () {
  fetch("/guardar-tanda/" + tandaId, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: tandaId }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json(); // Suponiendo que el servidor responde con JSON
      }
      throw new Error("La solicitud no se completó exitosamente.");
    })
    .then((data) => {
      console.log("Success:", data);
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl; // Redirigir a la URL proporcionada
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
