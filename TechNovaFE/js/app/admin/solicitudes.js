document.addEventListener("DOMContentLoaded", () => {
  // === Datos de ejemplo ===
  const emprendimientos = [
    { nombre: "Café Buen Día", tipo: "Cafetería", horario: "8:00 - 18:00", contacto: "cafebuendia@email.com", ubicacion: "San José" },
    { nombre: "Eco Limpio", tipo: "Servicios de Limpieza", horario: "7:00 - 17:00", contacto: "eco@email.com", ubicacion: "Cartago" },
    { nombre: "Tech Solutions", tipo: "Soporte TI", horario: "9:00 - 19:00", contacto: "tech@email.com", ubicacion: "Heredia" }
  ];

  const anuncios = [
    { titulo: "Promoción 2x1", descripcion: "Café al 2x1 todos los lunes", imagen: "promo1.jpg" },
    { titulo: "Nuevo Servicio", descripcion: "Limpieza ecológica de oficinas", imagen: "limpieza.jpg" },
    { titulo: "Actualización", descripcion: "Lanzamiento de app móvil", imagen: "app.jpg" }
  ];

  const reportes = [
    { titulo: "Reporte 001", descripcion: "Revisión de incidente menor", imagen: "reporte1.jpg", estado: "Pendiente" },
    { titulo: "Reporte 002", descripcion: "Análisis de seguridad", imagen: "reporte2.jpg", estado: "En Proceso" },
    { titulo: "Reporte 003", descripcion: "Problema de conexión", imagen: "reporte3.jpg", estado: "Resuelto" }
  ];

  // === Referencias de tbody ===
  const tbodyEmprendimientos = document.getElementById("emprendimientos-rows");
  const tbodyAnuncios = document.getElementById("anuncios-rows");
  const tbodyReportes = document.getElementById("reportes-rows");

  // === Renderizadores ===
  const renderEmprendimientos = () => {
    tbodyEmprendimientos.innerHTML = "";
    emprendimientos.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.nombre}</td>
        <td>${item.tipo}</td>
        <td>${item.horario}</td>
        <td>${item.contacto}</td>
        <td>${item.ubicacion}</td>
        <td>
          <button class="editar-emprendimiento edit-btn" data-index="${index}">Editar</button>
          <button class="eliminar-emprendimiento delete-btn" data-index="${index}">Eliminar</button>
        </td>
      `;
      tbodyEmprendimientos.appendChild(row);
    });
  };

  const renderAnuncios = () => {
    tbodyAnuncios.innerHTML = "";
    anuncios.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.titulo}</td>
        <td>${item.descripcion}</td>
        <td><img src="${item.imagen}" alt="${item.titulo}" width="50"></td>
        <td>
          <button class="editar-anuncio edit-btn" data-index="${index}">Editar</button>
          <button class="eliminar-anuncio delete-btn" data-index="${index}">Eliminar</button>
        </td>
      `;
      tbodyAnuncios.appendChild(row);
    });
  };

  const renderReportes = () => {
    tbodyReportes.innerHTML = "";
    reportes.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.titulo}</td>
        <td>${item.descripcion}</td>
        <td><img src="${item.imagen}" alt="${item.titulo}" width="50"></td>
        <td>
          <button class="editar-anuncio edit-btn" data-index="${index}">Editar</button>
          <button class="eliminar-anuncio delete-btn" data-index="${index}">Eliminar</button>
        </td>
      `;
      tbodyReportes.appendChild(row);
    });
  };

  // === Delegación de eventos ===
  tbodyEmprendimientos.addEventListener("click", (e) => {
    const index = e.target.dataset.index;

    if (e.target.classList.contains("editar-emprendimiento")) {
      alert(`✏️ Editar emprendimiento: ${emprendimientos[index].nombre}`);
    }

    if (e.target.classList.contains("eliminar-emprendimiento")) {
      alert(`🗑️ Eliminar emprendimiento: ${emprendimientos[index].nombre}`);
      emprendimientos.splice(index, 1);
      renderEmprendimientos();
    }
  });

  tbodyAnuncios.addEventListener("click", (e) => {
    const index = e.target.dataset.index;

    if (e.target.classList.contains("editar-anuncio")) {
      alert(`✏️ Editar anuncio: ${anuncios[index].titulo}`);
    }

    if (e.target.classList.contains("eliminar-anuncio")) {
      alert(`🗑️ Eliminar anuncio: ${anuncios[index].titulo}`);
      anuncios.splice(index, 1);
      renderAnuncios();
    }
  });

  // Los reportes solo se muestran (no tienen acciones en este ejemplo)
  // Si quieres, puedo agregar botones de cambiar estado o eliminar

  // === Inicializar ===
  renderEmprendimientos();
  renderAnuncios();
  renderReportes();
});
