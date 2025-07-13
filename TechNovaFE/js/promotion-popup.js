/* dom */
document.addEventListener('DOMContentLoaded', () => {
    const openPopupBtn = document.getElementById('openPopupBtn');
    const productPopup = document.getElementById('productPopup');
    const closeBtn = document.querySelector('.close-btn');
    const productForm = document.getElementById('productForm');

    function showPopup() {
        productPopup.style.display = 'flex';
        console.log("Pop-up mostrado.");
    }

    function hidePopup() {
        productPopup.style.display = 'none';
        console.log("Pop-up ocultado.");
    }

    if (openPopupBtn) {
        openPopupBtn.addEventListener('click', showPopup);
        console.log("Listener para abrir pop-up configurado.");
    } else {
        console.warn("Element with ID 'openPopupBtn' not found. Make sure it exists in your HTML.");
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', hidePopup);
        console.log("Listener para cerrar pop-up configurado.");
    } else {
        console.warn("Element with class 'close-btn' not found. Make sure it exists in your HTML.");
    }

    if (productPopup) {
        productPopup.addEventListener('click', (event) => {
            if (event.target === productPopup) {
                hidePopup();
            }
        });
        console.log("Listener para cerrar haciendo click fuera configurado.");
    }

    if (productForm) {
        productForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Evita que la página se recargue
            console.log("Formulario enviado (evento submit detectado). Previniendo default.");

            // Aquí recolectas los datos del formulario
            const nombre = document.getElementById('nombre').value;
            const precio = document.getElementById('precio').value;
            const descripcion = document.getElementById('descripcion').value;

            // Muestra los datos en consola (para fines de prueba)
            console.log('Datos del formulario:');
            console.log('Nombre:', nombre);
            console.log('Precio:', precio);
            console.log('Descripción:', descripcion);

            // Normalmente, aquí enviarías estos datos a un servidor (ej. usando fetch())

            Swal.fire({
                title: "¡Enviado exitosamente!",
                icon: "success",
                position: "top",
                timer: 1500,
                showConfirmButton: false,
                draggable: true,
                willClose: () => {
                    hidePopup(); // Oculta el pop-up
                    productForm.reset(); // Limpia el formulario
                }
            });
        });
        console.log("Listener para submit del formulario configurado.");
    } else {
        console.warn("No se encontró el elemento con ID 'productForm'. Asegúrate de que exista.");
    }
});