// URL base de tu API
// const API_URL = "http://localhost:3000/api/anuncios";

// Función para cargar solicitudes de reportes
async function cargarReportes() {
  try {
    const res = await fetch(`${API_URL}?estado=pendiente&categoria=reporte`);
    if (!res.ok) throw new Error("Error al cargar reportes");

    const reportes = await res.json();
    const tbody = document.getElementById("reportes-rows");
    // tbody.innerHTML = "";

    reportes.forEach(reporte => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${reporte.titulo}</td>
        <td>${reporte.descripcion}</td>
        <td>
          ${reporte.imagenes && reporte.imagenes.length
            ? `<img src="../../../assets/img/dashboard/${reporte.imagenes[0]}" alt="Imagen" style="width:80px; height:60px; object-fit:cover;">`
            : "Sin imagen"}
        </td>
        <td>
          <button class="edit-btn" data-id="${reporte._id}">Aprobar</button>
          <button class="delete-btn" data-id="${reporte._id}">Rechazar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Agregar eventos a botones
    document.querySelectorAll(".edit-btn").forEach(btn => {
      btn.addEventListener("click", () => handleCambioEstado(btn.dataset.id, "aprobado"));
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", () => handleCambioEstado(btn.dataset.id, "rechazado"));
    });

  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudieron cargar los reportes"
    });
  }
}

// Función para cambiar estado con SweetAlert
function handleCambioEstado(id, nuevoEstado) {
  const accion = nuevoEstado === "aprobado" ? "aprobar" : "rechazar";

  Swal.fire({
    title: `¿Estás seguro de ${accion} este reporte?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: `Sí, ${accion}`,
    cancelButtonText: "Cancelar",
  }).then(result => {
    if (result.isConfirmed) {
      actualizarEstado(id, nuevoEstado);
    }
  });
}

// Función para actualizar estado en backend
async function actualizarEstado(reporteId, nuevoEstado) {
  try {
    const res = await fetch(`${API_URL}/${reporteId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ estado: nuevoEstado })
    });

    if (!res.ok) {
      let errorMsg = "Error al actualizar el estado";

      try {
        const errorData = await res.json();
        errorMsg = errorData.msg || errorMsg;
      } catch {
        // no es JSON, usar mensaje por defecto
      }

      throw new Error(errorMsg);
    }

    Swal.fire({
      icon: "success",
      title: "Éxito",
      text: `Estado actualizado a "${nuevoEstado}"`,
      timer: 1500,
      showConfirmButton: false
    });

    cargarReportes();

  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: err.message
    });
  }
}

// Inicializar carga al abrir la página
cargarReportes();
