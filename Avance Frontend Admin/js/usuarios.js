document.addEventListener("DOMContentLoaded", () => {
  const usuarios = [
    {
      cedula: "1-111-111",
      nombre: "Ana",
      apellido: "Gómez",
      correo: "ana@email.com",
      ubicacion: "Heredia"
    },
    {
      cedula: "2-222-222",
      nombre: "Luis",
      apellido: "Rodríguez",
      correo: "luis@email.com",
      ubicacion: "San José"
    },
    {
      cedula: "3-333-333",
      nombre: "Usuario",
      apellido: "Prueba",
      correo: "dummy@email.com",
      ubicacion: "San Isidro"
    } // Usuario dummy
  ];

  const tbody = document.getElementById("user-rows");
  const modal = document.getElementById("edit-modal");
  const editForm = document.getElementById("edit-form");
  const cancelBtn = document.getElementById("cancel-btn");

  let editIndex = null;

  function renderUsuarios() {
    tbody.innerHTML = "";
    usuarios.forEach((usuario, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${usuario.cedula}</td>
        <td>${usuario.nombre}</td>
        <td>${usuario.apellido}</td>
        <td>${usuario.correo}</td>
        <td>${usuario.ubicacion}</td>
        <td>
          <button class="edit-btn" data-index="${index}">Editar</button>
          <button class="delete-btn" data-index="${index}">Eliminar</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  tbody.addEventListener("click", (e) => {
    const index = e.target.dataset.index;

    if (e.target.classList.contains("delete-btn")) {
      usuarios.splice(index, 1);
      renderUsuarios();
    }

    if (e.target.classList.contains("edit-btn")) {
      editIndex = index;
      const usuario = usuarios[index];
      document.getElementById("edit-nombre").value = usuario.nombre;
      document.getElementById("edit-apellido").value = usuario.apellido;
      document.getElementById("edit-correo").value = usuario.correo;
      document.getElementById("edit-ubicacion").value = usuario.ubicacion;
      modal.style.display = "flex";
    }
  });

  cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
    editForm.reset();
  });

  editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    usuarios[editIndex].nombre = document.getElementById("edit-nombre").value.trim();
    usuarios[editIndex].apellido = document.getElementById("edit-apellido").value.trim();
    usuarios[editIndex].correo = document.getElementById("edit-correo").value.trim();
    usuarios[editIndex].ubicacion = document.getElementById("edit-ubicacion").value.trim();

    modal.style.display = "none";
    editForm.reset();
    renderUsuarios();
  });

  renderUsuarios();
});
