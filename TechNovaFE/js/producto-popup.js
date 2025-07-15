/* dom */
document.addEventListener('DOMContentLoaded', () => {
    const openPopupBtn = document.getElementById('openPopupBtn');
    const productPopup = document.getElementById('productPopup');
    const closeBtn = document.querySelector('.close-btn');
    const productForm = document.getElementById('productForm');

    function showPopup() {
        productPopup.style.display = 'flex';
    }

    function hidePopup() {
        productPopup.style.display = 'none';
    }

    if (openPopupBtn) {
        openPopupBtn.addEventListener('click', showPopup);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', hidePopup);
    }

    if (productPopup) {
        productPopup.addEventListener('click', (event) => {
            if (event.target === productPopup) {
                hidePopup();
            }
        });
    }

    if (productForm) {
        productForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const nombre = document.getElementById('nombre').value;
            const precio = document.getElementById('precio').value;
            const descripcion = document.getElementById('descripcion').value;
            const imagenFile = document.getElementById('imagen').files[0];

            Swal.fire({
                title: "¡Enviado exitosamente!",
                icon: "success",
                position: "top",
                timer: 1500,
                showConfirmButton: false,
                draggable: true,
                willClose: () => {
                hidePopup();
                    productForm.reset();
                }
            });

        });
    }
});