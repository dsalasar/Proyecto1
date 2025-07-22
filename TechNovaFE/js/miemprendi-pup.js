document.addEventListener('DOMContentLoaded', () => {
    // --- Referencias a elementos del DOM ---
    const tabAnuncios = document.getElementById('tabAnuncios');
    const tabProductos = document.getElementById('tabProductos');
    const anunciosContent = document.getElementById('anunciosContent');
    const productosContent = document.getElementById('productosContent');

   /*  const openAnuncioPrompt = document.getElementById('openAnuncioPrompt');
    const anuncioPromptModal = document.getElementById('anuncioPromptModal');
    const crearAnuncioBtn = document.getElementById('crearAnuncioBtn');
    const crearAnuncioModal = document.getElementById('crearAnuncioModal');
    const crearAnuncioForm = document.getElementById('crearAnuncioForm');
    const anuncioImageUpload = document.getElementById('anuncioImageUpload');
    const anuncioFileInput = document.getElementById('anuncioFileInput');
    const anuncioImagePreview = document.getElementById('anuncioImagePreview');
    const resumenAnuncioModal = document.getElementById('resumenAnuncioModal');
    const resumenAnuncioTitulo = document.getElementById('resumenAnuncioTitulo');
    const resumenAnuncioDescripcion = document.getElementById('resumenAnuncioDescripcion');
    const resumenAnuncioImages = document.getElementById('resumenAnuncioImages');
    const cerrarResumenAnuncio = document.getElementById('cerrarResumenAnuncio');
 */
    const openAgregarPromocion = document.getElementById('openAgregarPromocion');
    const agregarPromocionModal = document.getElementById('agregarPromocionModal');
    const agregarPromocionForm = document.getElementById('agregarPromocionForm');

    const promotionCards = document.querySelectorAll('.promotion-card');
    const productoOfertaModal = document.getElementById('productoOfertaModal');
    const closeProductoOfertaModal = document.getElementById('closeProductoOfertaModal');
    const ofertaTitulo = document.getElementById('ofertaTitulo');
    const ofertaEmprendimiento = document.getElementById('ofertaEmprendimiento');
    const ofertaDescripcion = document.getElementById('ofertaDescripcion');
    const ofertaProductoImage = document.getElementById('ofertaProductoImage'); 

    const openAgregarProducto = document.getElementById('openAgregarProducto');
    const agregarProductoModal = document.getElementById('agregarProductoModal');
    const agregarProductoForm = document.getElementById('agregarProductoForm');
    const productoImageUpload = document.getElementById('productoImageUpload');
    const productoFileInput = document.getElementById('productoFileInput');
    const productoImagePreview = document.getElementById('productoImagePreview');
    
    let uploadedAnnouncementImages = [];
    let uploadedProductImage = null;

    function openModal(modalElement) {
        modalElement.style.display = 'flex';
    }

    function closeModal(modalElement) {
        modalElement.style.display = 'none';
    }

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', (e) => {
            closeModal(e.target.closest('.modal'));
        });
    });

    // Pestañas (Anuncios/Productos) 
    tabAnuncios.addEventListener('click', () => {
        tabAnuncios.classList.add('active');
        tabProductos.classList.remove('active');
        anunciosContent.classList.remove('hidden');
        productosContent.classList.add('hidden');
    });

    tabProductos.addEventListener('click', () => {
        tabProductos.classList.add('active');
        tabAnuncios.classList.remove('active');
        productosContent.classList.remove('hidden');
        anunciosContent.classList.add('hidden');
    });

    // --- Funcionalidad de los Pop-ups 
    openAnuncioPrompt.addEventListener('click', () => {
        openModal(anuncioPromptModal);
    });

    crearAnuncioBtn.addEventListener('click', () => {
        closeModal(anuncioPromptModal);
        openModal(crearAnuncioModal);
    });

    anuncioImageUpload.addEventListener('click', () => {
        anuncioFileInput.click(); 
    });

    anuncioImageUpload.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        anuncioImageUpload.classList.add('dragover');
    });

    anuncioImageUpload.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        anuncioImageUpload.classList.remove('dragover');
    });

    anuncioImageUpload.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        anuncioImageUpload.classList.remove('dragover');
        handleAnuncioFiles(e.dataTransfer.files);
    });

    anuncioFileInput.addEventListener('change', (e) => {
        handleAnuncioFiles(e.target.files);
    });

    function handleAnuncioFiles(files) {
        anuncioImagePreview.innerHTML = ''; // Limpiar previsualizaciones anteriores
        uploadedAnnouncementImages = []; // Limpiar array de imágenes
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                uploadedAnnouncementImages.push(file); // Guarda el archivo
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imgContainer = document.createElement('div');
                    imgContainer.classList.add('image-preview-item');

                    const img = document.createElement('img');
                    img.src = e.target.result;
                    imgContainer.appendChild(img);

                    const removeBtn = document.createElement('span');
                    removeBtn.classList.add('remove-image');
                    removeBtn.innerHTML = '&times;';
                    removeBtn.addEventListener('click', () => {
                        imgContainer.remove();
                        uploadedAnnouncementImages = uploadedAnnouncementImages.filter(f => f !== file);
                    });
                    imgContainer.appendChild(removeBtn);

                    anuncioImagePreview.appendChild(imgContainer);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    crearAnuncioForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const titulo = document.getElementById('anuncioTitulo').value;
        const descripcion = document.getElementById('anuncioDescripcion').value;

        // Aquí simularías el envío de datos a un servidor
        console.log('Anuncio a subir:', { titulo, descripcion, images: uploadedAnnouncementImages });

        // Simulamos un retraso para la subida
        await new Promise(resolve => setTimeout(resolve, 1000));

        // SweetAlert de éxito
        await Swal.fire({
            icon: 'success',
            title: '¡Subido Exitosamente!',
            text: 'Tu anuncio ha sido creado.',
            confirmButtonText: 'Ok'
        });

        // Mostrar el resumen del anuncio
        resumenAnuncioTitulo.textContent = titulo;
        resumenAnuncioDescripcion.textContent = descripcion;
        resumenAnuncioImages.innerHTML = '';
        uploadedAnnouncementImages.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                resumenAnuncioImages.appendChild(img);
            };
            reader.readAsDataURL(file);
        });

        closeModal(crearAnuncioModal);
        openModal(resumenAnuncioModal);

        // Limpiar formulario y previsualizaciones
        crearAnuncioForm.reset();
        anuncioImagePreview.innerHTML = '';
        uploadedAnnouncementImages = [];
    });

    // 3. Pop-up "Resumen del Anuncio"
    cerrarResumenAnuncio.addEventListener('click', () => {
        closeModal(resumenAnuncioModal);
    });

    // 4. Pop-up "Agregar Promoción"
    openAgregarPromocion.addEventListener('click', () => {
        openModal(agregarPromocionModal);
    });

    agregarPromocionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const producto = document.getElementById('promoProducto').value;
        const descripcion = document.getElementById('promoDescripcion').value;
        const nuevoPrecio = document.getElementById('promoNuevoPrecio').value;

        // Aquí simularías el envío de datos a un servidor
        console.log('Promoción a agregar:', { producto, descripcion, nuevoPrecio });

        await new Promise(resolve => setTimeout(resolve, 1000));

        await Swal.fire({
            icon: 'success',
            title: '¡Promoción Agregada!',
            text: 'La promoción ha sido añadida exitosamente.',
            confirmButtonText: 'Ok'
        });

        closeModal(agregarPromocionModal);
        agregarPromocionForm.reset();
    });

    promotionCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.dataset.title;
            const emprendimiento = card.dataset.emprendimiento;
            const description = card.dataset.description 
            
            const cardImageElement = card.querySelector('img');
            const cardImageSrc = cardImageElement ? cardImageElement.src : '';

            ofertaTitulo.textContent = title;
            ofertaEmprendimiento.textContent = emprendimiento;
            ofertaDescripcion.textContent = description;

            if (ofertaProductoImage) {
                ofertaProductoImage.src = cardImageSrc; 
                ofertaProductoImage.alt = title; 

                if (!cardImageSrc) {
                    ofertaProductoImage.src = '../../../assets/img/dashboard/oferta_general.jpg'; 
                    ofertaProductoImage.alt = 'Imagen de Oferta Especial';
                }
            } else {
                console.error('Error: Elemento con ID "ofertaProductoImage" no encontrado en el DOM del modal.');
            }
            
            openModal(productoOfertaModal);
        });
    });

    openAgregarProducto.addEventListener('click', () => {
        openModal(agregarProductoModal);
    });

    productoImageUpload.addEventListener('click', () => {
        productoFileInput.click();
    });

    productoImageUpload.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        productoImageUpload.classList.add('dragover');
    });

    productoImageUpload.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        productoImageUpload.classList.remove('dragover');
    });

    productoImageUpload.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        productoImageUpload.classList.remove('dragover');
        handleProductoFile(e.dataTransfer.files[0]); // Solo una imagen para producto
    });

    productoFileInput.addEventListener('change', (e) => {
        handleProductoFile(e.target.files[0]);
    });

    function handleProductoFile(file) {
        productoImagePreview.innerHTML = '';
        uploadedProductImage = null; 
        if (file && file.type.startsWith('image/')) {
            uploadedProductImage = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                const imgContainer = document.createElement('div');
                imgContainer.classList.add('image-preview-item'); 
                const img = document.createElement('img');
                img.src = e.target.result;
                imgContainer.appendChild(img);

                const removeBtn = document.createElement('span');
                removeBtn.classList.add('remove-image');
                removeBtn.innerHTML = '&times;';
                removeBtn.addEventListener('click', () => {
                    imgContainer.remove();
                    uploadedProductImage = null;
                    productoFileInput.value = ''; 
                });
                imgContainer.appendChild(removeBtn);

                productoImagePreview.appendChild(imgContainer);
            };
            reader.readAsDataURL(file);
        }
    }

    agregarProductoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = document.getElementById('productoNombre').value;
        const precio = document.getElementById('productoPrecio').value;
        const descripcion = document.getElementById('productoDescripcion').value;

        console.log('Producto a agregar:', { nombre, precio, descripcion, image: uploadedProductImage });

        await new Promise(resolve => setTimeout(resolve, 1000));

        await Swal.fire({
            icon: 'success',
            title: '¡Producto Agregado!',
            text: 'El producto ha sido añadido exitosamente.',
            confirmButtonText: 'Ok'
        });

        closeModal(agregarProductoModal);
        agregarProductoForm.reset();
        productoImagePreview.innerHTML = '';
        uploadedProductImage = null;
        productoFileInput.value = ''; 
    });

});