// URL del backend
const API_URL_EMPRENDIMIENTOS = "http://localhost:3000/api/emprendimiento";

// Simulación de usuario logueado (reemplazar por la sesión real si hay login)
const USUARIO_LOGUEADO_ID = "64f1a3b5c1234567890abcd1"; // Reemplazar por el _id real

// Botón de registro
const registroBtn = document.querySelector(".registro-btn");

registroBtn.addEventListener("click", async () => {
  const { value: formValues } = await Swal.fire({
    title: "Registrar Emprendimiento",
    html: `
      <input id="swal-nombre" class="swal2-input" placeholder="Nombre del emprendimiento">
      <input id="swal-categoria" class="swal2-input" placeholder="Categoría">
      <input id="swal-telefono" class="swal2-input" placeholder="Teléfono">
      <input id="swal-horario" class="swal2-input" placeholder="Horario">
      <input id="swal-direccion" class="swal2-input" placeholder="Dirección">
      <textarea id="swal-descripcion" class="swal2-textarea" placeholder="Descripción"></textarea>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Registrar",
    preConfirm: () => {
      const nombre = document.getElementById("swal-nombre").value.trim();
      const categoria = document.getElementById("swal-categoria").value.trim();
      const telefono = document.getElementById("swal-telefono").value.trim();
      const horario = document.getElementById("swal-horario").value.trim();
      const direccion = document.getElementById("swal-direccion").value.trim();
      const descripcion = document.getElementById("swal-descripcion").value.trim();

      if (!nombre || !categoria || !telefono || !horario || !direccion || !descripcion) {
        Swal.showValidationMessage("Todos los campos son obligatorios");
        return false;
      }

      return {
        nombre,
        categoria,
        telefono,
        horario,
        direccion,
        descripcion,
        estado: "pendiente",
        emprendedor: USUARIO_LOGUEADO_ID
      };
    }
  });

  if (formValues) {
    try {
      const res = await fetch(API_URL_EMPRENDIMIENTOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues)
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.msg || JSON.stringify(data) || "Error al registrar el emprendimiento");
      }

      Swal.fire({
        icon: "success",
        title: "Emprendimiento registrado",
        text: "Tu emprendimiento se envió para revisión",
        timer: 1500,
        showConfirmButton: false
      });

    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message
      });
    }
  }
});
