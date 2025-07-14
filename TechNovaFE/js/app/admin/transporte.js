document.addEventListener("DOMContentLoaded", () => {
  // === Inicializar mapa de San Isidro de Heredia ===
  const sanIsidroCoords = [10.0032, -84.1141]; // Coordenadas aproximadas
  const map = L.map("map").setView(sanIsidroCoords, 14);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
  }).addTo(map);

  L.marker(sanIsidroCoords)
    .addTo(map)
    .bindPopup("San Isidro de Heredia")
    .openPopup();

  // === Datos y renderización de transportes ===
  const transporteForm = document.getElementById("transporte-form");
  const tablaBody = document.getElementById("tabla-transporte");
  const transportes = [];

  const renderTabla = () => {
    tablaBody.innerHTML = "";
    transportes.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.empresa}</td>
        <td>${item.tipo}</td>
        <td>${item.horario}</td>
        <td>${item.contacto}</td>
        <td>${item.rutas}</td>
        <td>
          <button class="edit-btn" data-index="${index}">Editar</button>
          <button class="delete-btn" data-index="${index}">Eliminar</button>
        </td>
      `;
      tablaBody.appendChild(row);
    });
  };

  // === Manejo del formulario ===
  transporteForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const empresa = document.getElementById("empresa").value.trim();
    const tipo = document.getElementById("tipo").value.trim();
    const horario = document.getElementById("horario").value.trim();
    const contacto = document.getElementById("contacto").value.trim();
    const rutas = document.getElementById("rutas").value.trim();

    if (empresa && tipo && horario && contacto && rutas) {
      transportes.push({ empresa, tipo, horario, contacto, rutas });
      transporteForm.reset();
      renderTabla();
    }
  });

  // === Botones de eliminar y editar (básico) ===
  tablaBody.addEventListener("click", (e) => {
    const index = e.target.dataset.index;
    if (e.target.classList.contains("delete-btn")) {
      transportes.splice(index, 1);
      renderTabla();
    } else if (e.target.classList.contains("edit-btn")) {
      alert(`Función de edición pendiente para: ${transportes[index].empresa}`);
    }
  });

  // Render inicial
  renderTabla();
});
