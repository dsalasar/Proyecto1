document.addEventListener("DOMContentLoaded", () => {
  // 📰 Noticias iniciales con una de ejemplo
  const noticias = [
    {
      titulo: "Inauguración del Centro Cultural",
      descripcion: "El nuevo centro ofrece espacios para talleres, exposiciones y actividades comunitarias.",
      imagen: "centro-cultural.jpg"
    },
    {
      titulo: "Campeón nacional de ciclismo",
      descripcion: "Luis Mora gana la copa nacional de ciclismo.",
      imagen: "ciclismo.jpg"
    }
  ];

  const tablaBody = document.getElementById("noticias-rows");
  const modal = document.getElementById("noticia-modal");
  const form = document.getElementById("noticia-form");
  const cancelarBtn = document.getElementById("cancelar-btn");
  const crearBtn = document.getElementById("crear-noticia-btn");

  let editIndex = null;

  // Renderiza la tabla con todas las noticias
  const renderNoticias = () => {
    tablaBody.innerHTML = "";
    noticias.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.titulo}</td>
        <td>${item.descripcion}</td>
        <td>${item.imagen}</td>
        <td class="table-actions">
          <button class="editar-btn" data-index="${index}">Editar</button>
          <button class="eliminar-btn" data-index="${index}">Eliminar</button>
        </td>
      `;
      tablaBody.appendChild(row);
    });
  };

  // Delegación de eventos para los botones de la tabla
  tablaBody.addEventListener("click", (e) => {
    const index = e.target.dataset.index;

    if (e.target.classList.contains("eliminar-btn")) {
      noticias.splice(index, 1);
      renderNoticias();
    }

    if (e.target.classList.contains("editar-btn")) {
      editIndex = index;
      const noticia = noticias[index];
      document.getElementById("titulo").value = noticia.titulo;
      document.getElementById("descripcion").value = noticia.descripcion;
      document.getElementById("imagen").value = noticia.imagen;
      modal.style.display = "flex";
    }
  });

  // Abre el modal para crear nueva noticia
  crearBtn.addEventListener("click", () => {
    editIndex = null;
    form.reset();
    modal.style.display = "flex";
  });

  // Cierra el modal
  cancelarBtn.addEventListener("click", () => {
    modal.style.display = "none";
    form.reset();
  });

  // Guarda la noticia (nueva o editada)
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const titulo = document.getElementById("titulo").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const imagen = document.getElementById("imagen").value.trim();

    if (editIndex !== null) {
      noticias[editIndex] = { titulo, descripcion, imagen };
    } else {
      noticias.push({ titulo, descripcion, imagen });
    }

    form.reset();
    modal.style.display = "none";
    renderNoticias();
  });

  // Inicializa la tabla
  renderNoticias();
});