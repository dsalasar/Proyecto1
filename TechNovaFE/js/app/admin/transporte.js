document.addEventListener("DOMContentLoaded", () => {
  const BASE_URL = 'http://localhost:5000/api/transporte';
  const tabla = document.getElementById("tabla-transporte");
  const crearBtn = document.getElementById("crear-ruta-btn");
  const PLACEHOLDER_URL = 'https://via.placeholder.com/60';

  // Función mejorada para obtener rutas
  const fetchRutas = async () => {
    try {
      const response = await fetch(BASE_URL);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener rutas');
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener rutas:', error);
      Swal.fire("Error", error.message || "No se pudieron cargar las rutas", "error");
      return [];
    }
  };

  // Función para renderizar la tabla
const renderTabla = async () => {
  try {
    const rutasGuardadas = await fetchRutas();
    
    tabla.innerHTML = rutasGuardadas.length === 0 ? 
      `<tr><td colspan="7" style="text-align:center;">No hay rutas registradas.</td></tr>` : 
      rutasGuardadas.map(ruta => {
        const imagenCell = ruta.imagen ? 
          `<td><img src="${ruta.imagen.startsWith('data:image') ? ruta.imagen : `data:image/png;base64,${ruta.imagen}`}" 
                 style="height:60px; border-radius:6px; object-fit:cover;"></td>` : 
          `<td></td>`;

        return `
          <tr data-id="${ruta._id}">
            <td>${ruta.empresa}</td>
            <td>${ruta.tipo}</td>
            <td>${ruta.horario}</td>
            <td>${ruta.contacto}</td>
            <td>${ruta.rutas}</td>
            ${imagenCell}
            <td>
              <button class="btn btn-edit">Editar</button>
              <button class="btn btn-delete">Eliminar</button>
            </td>
          </tr>
        `;
      }).join('');

    // Agregar event delegation para los botones
    tabla.addEventListener('click', (e) => {
      const row = e.target.closest('tr');
      if (!row) return;
      
      const id = row.dataset.id;
      
      if (e.target.classList.contains('btn-edit')) {
        editarRuta(id);
      } else if (e.target.classList.contains('btn-delete')) {
        eliminarRuta(id);
      }
    });
    
  } catch (error) {
    console.error('Error al renderizar tabla:', error);
    tabla.innerHTML = `<tr><td colspan="7" style="text-align:center;color:red;">Error al cargar las rutas</td></tr>`;
  }
};
  // Función para eliminar ruta
async function eliminarRuta(id) {
  try {
    const result = await Swal.fire({
      title: '¿Eliminar esta ruta?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar');
      }

      await Swal.fire(
        '¡Eliminada!',
        'La ruta ha sido eliminada correctamente.',
        'success'
      );
      await renderTabla();
    }
  } catch (error) {
    console.error('Error al eliminar:', error);
    Swal.fire(
      'Error',
      error.message || 'No se pudo eliminar la ruta',
      'error'
    );
  }
}

  // Función para editar ruta
async function editarRuta(id) {
  try {
    // Verificar primero que la ruta existe
    const response = await fetch(`${BASE_URL}/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('La ruta no existe. Recarga la página para ver los cambios.');
      }
      throw new Error('Error al cargar la ruta');
    }

    const ruta = await response.json();
    await abrirFormulario(ruta, id);
  } catch (error) {
    console.error('Error al editar:', error);
    await Swal.fire('Error', error.message, 'error');
    await renderTabla(); // Recargar la tabla por si la ruta fue eliminada
  }
}

  // Función para abrir formulario (crear/editar)
async function abrirFormulario(ruta = {}, id = null) {
  try {
    const { value: formData } = await Swal.fire({
      title: id ? 'Editar Ruta' : 'Crear Ruta',
      html: `
        <div class="form-group">
          <input type="text" id="swal-empresa" class="swal2-input" 
                 placeholder="Empresa" value="${ruta.empresa || ''}" required>
        </div>
        <div class="form-group">
          <select id="swal-tipo" class="swal2-select" required>
            <option value="">Tipo de transporte</option>
            <option value="Bus" ${ruta.tipo === "Bus" ? "selected" : ""}>Bus</option>
            <option value="Taxi" ${ruta.tipo === "Taxi" ? "selected" : ""}>Taxi</option>
            <option value="Tren" ${ruta.tipo === "Tren" ? "selected" : ""}>Tren</option>
          </select>
        </div>
        <div class="form-group">
          <input type="text" id="swal-horario" class="swal2-input" 
                 placeholder="Horario" value="${ruta.horario || ''}" required>
        </div>
        <div class="form-group">
          <input type="text" id="swal-contacto" class="swal2-input" 
                 placeholder="Contacto" value="${ruta.contacto || ''}" required>
        </div>
        <div class="form-group">
          <textarea id="swal-rutas" class="swal2-textarea" 
                    placeholder="Descripción de rutas" required>${ruta.rutas || ''}</textarea>
        </div>
        <div class="form-group">
          <input type="file" id="swal-imagen" class="swal2-file" accept="image/*">
        </div>
        ${ruta.imagen ? `
          <div class="image-preview">
            <img src="${ruta.imagen}" id="swal-preview" 
                 style="max-width:100%; max-height:200px; margin-top:10px;">
            <button type="button" id="swal-remove-img" class="btn-remove-img">
              Eliminar imagen
            </button>
          </div>
        ` : ''}
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: id ? 'Actualizar' : 'Crear',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        // Obtener valores de los inputs de forma segura
        const getValue = (id) => {
          const element = document.getElementById(id);
          return element ? element.value.trim() : '';
        };

        // Definir todas las variables necesarias
        const empresa = getValue('swal-empresa');
        const tipo = getValue('swal-tipo');
        const horario = getValue('swal-horario');
        const contacto = getValue('swal-contacto');
        const rutas = getValue('swal-rutas');
        const imagenInput = document.getElementById('swal-imagen');

        // Validación de campos obligatorios
        if (!empresa || !tipo || !horario || !contacto || !rutas) {
          Swal.showValidationMessage('Todos los campos son obligatorios');
          return false;
        }

        // Procesar imagen (si se subió una nueva)
        if (imagenInput.files.length > 0) {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve({
              empresa,
              tipo,
              horario,
              contacto,
              rutas,
              imagen: e.target.result
            });
            reader.readAsDataURL(imagenInput.files[0]);
          });
        }

        return {
          empresa,
          tipo,
          horario,
          contacto,
          rutas,
          imagen: ruta.imagen || null
        };
      },
      didOpen: () => {
        // Manejar eliminación de imagen
        const removeBtn = document.getElementById('swal-remove-img');
        if (removeBtn) {
          removeBtn.addEventListener('click', () => {
            const preview = document.getElementById('swal-preview');
            if (preview) preview.remove();
            removeBtn.remove();
            ruta.imagen = null;
          });
        }
      }
    });

    if (formData) {
      const url = id ? `${BASE_URL}/${id}` : BASE_URL;
      const method = id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al guardar los cambios');
      }

      await Swal.fire(
        '¡Éxito!',
        id ? 'Ruta actualizada correctamente' : 'Ruta creada correctamente',
        'success'
      );
      await renderTabla();
    }
  } catch (error) {
    console.error('Error en formulario:', error);
    await Swal.fire(
      'Error',
      error.message || 'Hubo un problema al procesar el formulario',
      'error'
    );
  }
}

  // Event listeners iniciales
  crearBtn.addEventListener("click", () => abrirFormulario());
  renderTabla();
});