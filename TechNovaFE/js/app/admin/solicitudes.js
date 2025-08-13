document.addEventListener("DOMContentLoaded", () => {
  const solicitudes = [
    {
      nombre: "Lucía",
      apellido: "Ramírez",
      correo: "lucia@example.com",
      motivo: "Registro de transporte",
      ubicacion: "San José"
    },
    {
      nombre: "Andrés",
      apellido: "González",
      correo: "andres@example.com",
      motivo: "Solicitud para feria",
      ubicacion: "Cartago"
    },
    {
      nombre: "Sofía",
      apellido: "Castro",
      correo: "sofia@example.com",
      motivo: "Inscripción cultural",
      ubicacion: "Heredia"
    }
  ];

  const solicitudesBody = document.getElementById("solicitudes-emprendimientos-rows");

  const renderSolicitudes = () => {
    solicitudesBody.innerHTML = "";
    solicitudes.forEach((item, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td contenteditable="true">${item.nombre}</td>
        <td contenteditable="true">${item.apellido}</td>
        <td contenteditable="true">${item.correo}</td>
        <td contenteditable="true">${item.motivo}</td>
        <td contenteditable="true">${item.ubicacion}</td>
        <td>
          <button class="edit-btn" data-index="${index}">Aprobar</button>
          <button class="delete-btn" data-index="${index}">Rechazar</button>
        </td>
      `;

      solicitudesBody.appendChild(row);
    });
  };

  solicitudesBody.addEventListener("click", (e) => {
    const index = e.target.dataset.index;
    const btn = e.target;

    if (btn.classList.contains("edit-btn")) {
      alert(`✅ Solicitud aprobada de ${solicitudes[index].nombre}`);
      solicitudes.splice(index, 1);
      renderSolicitudes();
    }

    if (btn.classList.contains("delete-btn")) {
      const confirmado = confirm(`❌ ¿Estás seguro de rechazar la solicitud de ${solicitudes[index].nombre}?`);
      if (confirmado) {
        alert(`Solicitud rechazada`);
        solicitudes.splice(index, 1);
        renderSolicitudes();
      }
    }
  });

  renderSolicitudes();
});
