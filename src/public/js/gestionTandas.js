function editarCampo(campo) {
    document.getElementById(campo + 'Texto').style.display = 'none';
    document.getElementById(campo + 'Input').style.display = 'inline';
    document.getElementById(campo + 'Input').value = document.getElementById(campo + 'Texto').innerText;

    // Mostrar el botón de guardar
    document.getElementById('botonGuardar').style.display = 'inline';
}



function enviarDatosTour(tandaId) {
    const cantidadPersonas = document.getElementById('cantidadPersonasInput').value;
    const headGuide = document.getElementById('headGuideInput').value;

    fetch(`/actualizar-datos-tour/${tandaId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cant_personas: cantidadPersonas, tour_guide: headGuide })
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            // Actualizar el texto y ocultar los campos de entrada
            document.getElementById('cantidadPersonasTexto').innerText = cantidadPersonas;
            document.getElementById('headGuideTexto').innerText = headGuide;
            document.getElementById('cantidadPersonasTexto').style.display = 'inline';
            document.getElementById('headGuideTexto').style.display = 'inline';
            document.getElementById('cantidadPersonasInput').style.display = 'none';
            document.getElementById('headGuideInput').style.display = 'none';
            document.getElementById('botonGuardar').style.display = 'none';
        } else {
            alert('Error al actualizar los datos');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

