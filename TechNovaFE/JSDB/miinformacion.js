document.addEventListener("DOMContentLoaded", async () => {
  try {
    // 1. Consumir tu endpoint
    const res = await fetch("http://localhost:3000/api/miusuario/me", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"), // si usas token
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) throw new Error("Error al cargar usuario");

    const user = await res.json();

    console.log("Datos del usuario:", user);

    // 2. Llenar los inputs
    document.getElementById("nombre").value = user.nombre || "";
    document.getElementById("apellido1").value = user.apellido1 || "";
    document.getElementById("apellido2").value = user.apellido2 || "";
    // document.getElementById("cedula").value = user.cedula || "";
    document.getElementById("correo").value = user.email || "";

  } catch (err) {
    console.error("Error obteniendo datos:", err);
  }

  //2. guartar cambios put
  document.querySelector(".btn-save").addEventListener("click", async (e) => {
    e.preventDefault();

    const body = {
      nombre: document.getElementById("nombre").value,
      apellido1: document.getElementById("apellido1").value,
      apellido2: document.getElementById("apellido2").value,
      // cedula: document.getElementById("cedula").value,
      correo: document.getElementById("correo").value
    };

    try {
      const res = await fetch("http://localhost:3000/api/miusuario/me", {
        method: "PUT",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      console.log("Respuesta del servidor:", data);

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Datos actualizados correctamente"
        });
      } else {
        throw new Error(data.msg || "Error al actualizar datos");
      } 
    } catch (err) {
      console.error("Error actualizando datos:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "No se pudieron actualizar los datos"
      });
    }


    //cancelar cambios
    document.querySelector(".btn-cancel").addEventListener("click", () => {
      window.location.reload(); // Recargar la página para descartar cambios
    });
});
})