document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.getElementById("tabla-transporte");
  const crearBtn = document.getElementById("crear-ruta-btn");

  const rutasGuardadas = JSON.parse(localStorage.getItem("rutasTransporte")) || [];

  const renderTabla = () => {
    tabla.innerHTML = "";
    if (rutasGuardadas.length === 0) {
      tabla.innerHTML = `<tr><td colspan="7" style="text-align:center;">No hay rutas registradas.</td></tr>`;
      return;
    }

    rutasGuardadas.forEach((ruta, index) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${ruta.empresa}</td>
        <td>${ruta.tipo}</td>
        <td>${ruta.horario}</td>
        <td>${ruta.contacto}</td>
        <td>${ruta.rutas}</td>
        <td><img src="${ruta.imagen}" style="height:60px; border-radius:6px;" /></td>
        <td>
          <button class="editar-btn" data-index="${index}">✏️</button>
          <button class="eliminar-btn" data-index="${index}">🗑️</button>
        </td>
      `;
      tabla.appendChild(fila);
    });

    document.querySelectorAll(".editar-btn").forEach(btn => {
      btn.addEventListener("click", () => editarRuta(btn.dataset.index));
    });

    document.querySelectorAll(".eliminar-btn").forEach(btn => {
      btn.addEventListener("click", () => eliminarRuta(btn.dataset.index));
    });
  };

  crearBtn.addEventListener("click", () => {
    abrirFormulario();
  });

  function abrirFormulario(ruta = {}, index = null) {
    Swal.fire({
      title: index !== null ? 'Editar Ruta' : 'Crear Ruta de Transporte',
      html: `
        <input type="text" id="swal-empresa" class="swal2-input" placeholder="Empresa" value="${ruta.empresa || ''}">
        <select id="swal-tipo" class="swal2-select">
          <option value="">Tipo de transporte</option>
          <option value="Bus" ${ruta.tipo === "Bus" ? "selected" : ""}>Bus</option>
          <option value="Taxi" ${ruta.tipo === "Taxi" ? "selected" : ""}>Taxi</option>
          <option value="Tren" ${ruta.tipo === "Tren" ? "selected" : ""}>Tren</option>
        </select>
        <input type="text" id="swal-horario" class="swal2-input" placeholder="Horario" value="${ruta.horario || ''}">
        <input type="text" id="swal-contacto" class="swal2-input" placeholder="Contacto" value="${ruta.contacto || ''}">
        <textarea id="swal-rutas" class="swal2-textarea" placeholder="Descripción de rutas">${ruta.rutas || ''}</textarea>
        <input type="file" id="swal-imagen" class="swal2-file" accept="image/*">
        <img id="swal-preview" src="${ruta.imagen || ''}" style="max-width:100%; margin-top:10px;" />
      `,
      showCancelButton: true,
      confirmButtonText: index !== null ? 'Guardar cambios' : 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const empresa = document.getElementById("swal-empresa").value.trim();
        const tipo = document.getElementById("swal-tipo").value;
        const horario = document.getElementById("swal-horario").value.trim();
        const contacto = document.getElementById("swal-contacto").value.trim();
        const rutas = document.getElementById("swal-rutas").value.trim();
        const imagenInput = document.getElementById("swal-imagen");
        const imagen = imagenInput.files[0];

        if (!empresa || !tipo || !horario || !contacto || !rutas) {
          Swal.showValidationMessage("Todos los campos son obligatorios");
          return false;
        }

        return new Promise(resolve => {
          if (imagen) {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({ empresa, tipo, horario, contacto, rutas, imagen: reader.result });
            };
            reader.readAsDataURL(imagen);
          } else {
            resolve({ empresa, tipo, horario, contacto, rutas, imagen: ruta.imagen || '' });
          }
        });
      },
      didOpen: () => {
        const imagenInput = document.getElementById("swal-imagen");
        const preview = document.getElementById("swal-preview");

        imagenInput.addEventListener("change", () => {
          const file = imagenInput.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = e => {
              preview.src = e.target.result;
            };
            reader.readAsDataURL(file);
          }
        });
      }
    }).then(result => {
      if (result.isConfirmed && result.value) {
        if (index !== null) {
          rutasGuardadas[index] = result.value;
          Swal.fire("¡Ruta actualizada!", "Los cambios han sido guardados.", "success");
        } else {
          rutasGuardadas.push(result.value);
          Swal.fire("¡Ruta registrada!", "La información ha sido guardada.", "success");
        }
        localStorage.setItem("rutasTransporte", JSON.stringify(rutasGuardadas));
        renderTabla();
      }
    });
  }

  function editarRuta(index) {
    const ruta = rutasGuardadas[index];
    abrirFormulario(ruta, index);
  }

  function eliminarRuta(index) {
    Swal.fire({
      title: '¿Eliminar esta ruta?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        rutasGuardadas.splice(index, 1);
        localStorage.setItem("rutasTransporte", JSON.stringify(rutasGuardadas));
        renderTabla();
        Swal.fire("¡Ruta eliminada!", "La ruta ha sido borrada.", "success");
      }
    });
  }

  renderTabla();
});

