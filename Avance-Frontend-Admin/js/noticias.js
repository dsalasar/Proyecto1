document.addEventListener("DOMContentLoaded", () => {
  const noticias = [];

  const tabla = document.getElementById("noticias-rows");
  const modal = document.getElementById("noticia-modal");
  const form = document.getElementById("noticia-form");
  const crearBtn = document.getElementById("crear-noticia-btn");
  const cancelarBtn = document.getElementById("cancelar-btn");
  const imagenInput = document.getElementById("imagen");
  const preview = document.getElementById("preview");

  let editIndex = null;

  // Abrir modal
  crearBtn.addEventListener("click", () => {
    form.reset();
    preview.src = "";
    preview.style.display = "none";
    editIndex = null;
    modal.style.display = "flex";
  });

  // Cerrar modal
  cancelarBtn.addEventListener("click", () => {
    modal.style.display = "none";
    form.reset();
    preview.src = "";
    preview.style.display = "none";
  });

  // Previsualizar imagen
  imagenInput.addEventListener("change", () => {
    const file = imagenInput.files[0];
    if (file) {
      preview.src = URL.createObjectURL(file);
      preview.style.display = "block";
    } else {
      preview.src = "";
      preview.style.display = "none";
    }
  });

  // Renderiza noticias en la tabla
  const renderNoticias = () => {
    tabla.innerHTML = "";

    noticias.forEach((item, index) => {
      const fila = document.createElement("tr");

      fila.innerHTML = `
        <td>${item.titulo}</td>
        <td>${item.descripcion}</td>
        <td><img src="${item.imagen}" alt="Imagen" style="height: 60px; border-radius: 6px;" /></td>
        <td>
          <button class="editar-btn" data-index="${index}">Editar</button>
          <button class="eliminar-btn" data-index="${index}">Eliminar</button>
        </td>
      `;

      tabla.appendChild(fila);
    });
  };

  // Delegación de eventos: Editar y Eliminar
  tabla.addEventListener("click", (e) => {
    const index = e.target.dataset.index;

    if (e.target.classList.contains("editar-btn")) {
      editIndex = index;
      const noticia = noticias[index];
      document.getElementById("titulo").value = noticia.titulo;
      document.getElementById("descripcion").value = noticia.descripcion;
      preview.src = noticia.imagen;
      preview.style.display = "block";
      modal.style.display = "flex";
    }

    if (e.target.classList.contains("eliminar-btn")) {
      const confirmado = confirm("¿Estás seguro de eliminar esta noticia?");
      if (confirmado) {
        noticias.splice(index, 1);
        renderNoticias();
      }
    }
  });

  // Guardar o editar noticia
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const titulo = document.getElementById("titulo").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const file = imagenInput.files[0];
    const imagenURL = file ? URL.createObjectURL(file) : preview.src;

    if (!imagenURL) {
      alert("Por favor selecciona una imagen");
      return;
    }

    if (editIndex !== null) {
      noticias[editIndex] = { titulo, descripcion, imagen: imagenURL };
    } else {
      noticias.push({ titulo, descripcion, imagen: imagenURL });
    }

    form.reset();
    preview.src = "";
    preview.style.display = "none";
    modal.style.display = "none";
    renderNoticias();
  });

  // Inicializa tabla
  renderNoticias();
});
