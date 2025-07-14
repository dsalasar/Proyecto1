document.addEventListener("DOMContentLoaded", () => {
  // Lista de solicitudes con una solicitud de prueba
  const solicitudes = [
    {
      nombre: "María",
      apellido: "Fernández",
      correo: "maria@email.com",
      motivo: "Registro de emprendimiento",
      ubicacion: "Alajuela"
    },
    {
      nombre: "Carlos",
      apellido: "Ramírez",
      correo: "carlos@email.com",
      motivo: "Acceso a noticias",
      ubicacion: "Cartago"
    },
    {
      nombre: "Laura",
      apellido: "Vargas",
      correo: "laura@email.com",
      motivo: "Gestión de transporte",
      ubicacion: "Heredia"
    },
    {
      nombre: "Sofía",
      apellido: "Castro",
      correo: "sofia.prueba@email.com",
      motivo: "Solicitud de prueba",
      ubicacion: "San Isidro"
    } // ✅ Solicitud dummy
  ];

  const tbody = document.getElementById("solicitudes-rows");

  const renderTabla = () => {
    tbody.innerHTML = "";
    solicitudes.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.nombre}</td>
        <td>${item.apellido}</td>
        <td>${item.correo}</td>
        <td>${item.motivo}</td>
        <td>${item.ubicacion}</td>
        <td>
          <button class="aceptar-btn" data-index="${index}">Aceptar</button>
          <button class="denegar-btn" data-index="${index}">Denegar</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  };

  tbody.addEventListener("click", (e) => {
    const index = e.target.dataset.index;

    if (e.target.classList.contains("aceptar-btn")) {
      alert(`✅ Solicitud aceptada de ${solicitudes[index].nombre}`);
      solicitudes.splice(index, 1);
      renderTabla();
    }

    if (e.target.classList.contains("denegar-btn")) {
      alert(`❌ Solicitud denegada de ${solicitudes[index].nombre}`);
      solicitudes.splice(index, 1);
      renderTabla();
    }
  });

  renderTabla();
});

