document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.getElementById("tabla-transporte");

  // Obtener rutas guardadas por el administrador
  const rutasRegistradas = JSON.parse(localStorage.getItem("rutasTransporte")) || [];

  if (rutasRegistradas.length === 0) {
    const fila = document.createElement("tr");
    fila.innerHTML = `<td colspan="6" style="text-align:center;">No hay rutas registradas aún.</td>`;
    tabla.appendChild(fila);
    return;
  }

  rutasRegistradas.forEach(ruta => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${ruta.empresa}</td>
      <td>${ruta.tipo}</td>
      <td>${ruta.horario}</td>
      <td>${ruta.contacto}</td>
      <td>${ruta.rutas}</td>
      <td><img src="${ruta.imagen}" alt="Imagen de parada" style="height:60px; border-radius:6px;" /></td>
    `;
    tabla.appendChild(fila);
  });
});
