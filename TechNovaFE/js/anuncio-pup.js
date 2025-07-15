document.addEventListener('DOMContentLoaded', () => {
    const abrirVentanaBtn = document.getElementById('abrirVentanaBtn'); 
    const ventanaAnuncio = document.getElementById('ventanaAnuncio');  
    const cerrarBtn = document.querySelector('.cerrar-btn');  
    const formularioAnuncio = document.getElementById('formularioAnuncio'); 

    function mostrarVentana() {
        ventanaAnuncio.style.display = 'flex'; 
    }

    function ocultarVentana() {
        ventanaAnuncio.style.display = 'none';
    }

    if (abrirVentanaBtn) {
        abrirVentanaBtn.addEventListener('click', mostrarVentana);
    }

    // Event listener para el botón de cerrar (la 'X')
    if (cerrarBtn) {
        cerrarBtn.addEventListener('click', ocultarVentana);
    }

    // Event listener para cerrar la ventana si se hace clic fuera del contenido
    if (ventanaAnuncio) {
        ventanaAnuncio.addEventListener('click', (event) => {
            if (event.target === ventanaAnuncio) { // Si el clic es directamente sobre la capa oscura
                ocultarVentana();
            }
        });
    }

    // Event listener para el envío del formulario
    if (formularioAnuncio) {
        formularioAnuncio.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevenimos el envío tradicional del formulario

            //  valores de los campos del formulario con los nuevos IDs
            const titulo = document.getElementById('titulo').value;
            const precioAnuncio = document.getElementById('precioAnuncio').value;
            const descripcionAnuncio = document.getElementById('descripcionAnuncio').value;
            const imagenAnuncioFile = document.getElementById('imagenAnuncio').files[0];
                /* alert */
            Swal.fire({
                title: "¡Anuncio Publicado!", 
                text: "Tu anuncio se ha enviado exitosamente.", 
                icon: "success", 
                position: "top", 
                timer: 2000, 
                showConfirmButton: false, 
                draggable: true, 
                willClose: () => { 
                    ocultarVentana();       
                    formularioAnuncio.reset(); 
                }
            });

            //agregar la lógica para enviar los datos a un servidor quitar ,
            console.log('Datos del anuncio:', {
                titulo,
                precioAnuncio,
                descripcionAnuncio,
                imagenAnuncioFile: imagenAnuncioFile ? imagenAnuncioFile.name : 'No seleccionada'
            });
        });
    }
});