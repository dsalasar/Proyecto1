// Asegúrate de tener cors habilitado en tu backend:
// const cors = require('cors');
// app.use(cors());

const API_URL_EMPRENDIMIENTOS = "http://localhost:3000/api/emprendimiento";

// Cargar solicitudes pendientes al cargar la página
async function cargarSolicitudesEmprendimientos() {
  try {
    const res = await fetch(API_URL_EMPRENDIMIENTOS, { method: "GET" });
    if (!res.ok) throw new Error("Error al cargar emprendimientos");

    const data = await res.json();
    const pendientes = data.filter(emp => emp.estado === "pendiente");

    const tbody = document.getElementById("solicitudes-emprendimientos-rows");
    tbody.innerHTML = "";

    pendientes.forEach(emprendimiento => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${emprendimiento.nombre}</td>
        <td>${emprendimiento.categoria}</td>
        <td>${emprendimiento.horario}</td>
        <td>${emprendimiento.telefono}</td>
        <td>${emprendimiento.direccion}</td>
        <td>
  <button class="aprobar-btn-emp" data-id="${emprendimiento._id}">Aprobar</button>
  <button class="rechazar-btn-emp" data-id="${emprendimiento._id}">Rechazar</button>
</td>

      `;
      tbody.appendChild(tr);
    });

    // Eventos para los botones
    document.querySelectorAll(".aprobar-btn-emp").forEach(btn => {
  btn.addEventListener("click", () => handleCambioEstadoEmprendimiento(btn.dataset.id, "aprobado"));
});

document.querySelectorAll(".rechazar-btn-emp").forEach(btn => {
  btn.addEventListener("click", () => handleCambioEstadoEmprendimiento(btn.dataset.id, "rechazado"));
});


  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudieron cargar las solicitudes de emprendimientos"
    });
  }
}

// Función para manejar confirmación con SweetAlert
function handleCambioEstadoEmprendimiento(id, nuevoEstado) {
  const accion = nuevoEstado === "aprobado" ? "aprobar" : "rechazar";

  Swal.fire({
    title: `¿Estás seguro de ${accion} este emprendimiento?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: `Sí, ${accion}`,
    cancelButtonText: "Cancelar",
  }).then(result => {
    if (result.isConfirmed) {
      actualizarEstadoEmprendimiento(id, nuevoEstado);
    }
  });
}

// Función para actualizar el estado en el backend
async function actualizarEstadoEmprendimiento(id, nuevoEstado) {
  try {
    const res = await fetch(`${API_URL_EMPRENDIMIENTOS}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: nuevoEstado })
    });

    if (!res.ok) throw new Error("Error al actualizar el estado");

    Swal.fire({
      icon: "success",
      title: "Éxito",
      text: `Estado actualizado a "${nuevoEstado}"`,
      timer: 1500,
      showConfirmButton: false
    });

    cargarSolicitudesEmprendimientos(); // recargar tabla
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: err.message
    });
  }
}

// Inicializar al cargar la página
document.addEventListener("DOMContentLoaded", cargarSolicitudesEmprendimientos);
