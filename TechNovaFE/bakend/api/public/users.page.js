/* RF1.4 – Edición de perfil (Admin) 
 * RF1.5 – Eliminación de perfil (soft delete, 30 días de gracia)
 * Soporta listado solo activos (apoya panel de administración). */
document.addEventListener('DOMContentLoaded', () => {
  const API = 'http://localhost:3000/api/users';
  const userTableBody = document.getElementById('user-rows');
  const editModal = document.getElementById('edit-modal');
  const editForm = document.getElementById('edit-form');
  const cancelBtn = document.getElementById('cancel-btn');

  let currentUserId = null;
  let currentUserCedula = null;

  const getUserId = (u) => u._id || u.id;

  const fetchAndRenderUsers = async () => {
    userTableBody.innerHTML = '';
    try {
      const resp = await fetch(`${API}`);
      if (!resp.ok) throw new Error('No se pudo obtener la lista de usuarios');
      

      let usuarios = await resp.json();

      usuarios = usuarios.filter(u =>
        (u.estado ?? 'ACTIVO') !== 'PENDIENTE_ELIMINACION' &&
        (u.deleted ?? false) === false &&
        (u.activo ?? true) !== false
      );

      if (usuarios.length === 0) {
        userTableBody.innerHTML = '<tr><td colspan="6">No hay usuarios registrados.</td></tr>';
        return;
      }

      usuarios.forEach(user => {
        const id = getUserId(user);
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${user.cedula}</td>
          <td>${user.nombre}</td>
          <td>${user.apellido}</td>
          <td>${user.email}</td>
          <td>${user.ubicacion || 'N/A'}</td>
          <td>
            <button class="edit-btn" data-id="${id}">Editar</button>
            <button class="delete-btn" data-id="${id}">Eliminar</button>
          </td>
        `;
        userTableBody.appendChild(row);
      });

      addTableEventListeners();
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      userTableBody.innerHTML = `<tr><td colspan="6">Error al cargar usuarios: ${err.message}</td></tr>`;
    }
  };

  const addTableEventListeners = () => {
    // Editar
    document.querySelectorAll('.edit-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const userId = e.target.dataset.id;
        const row = e.target.closest('tr');
        const [cedula, nombre, apellido, correo, ubicacion] =
          Array.from(row.querySelectorAll('td')).map(td => td.textContent);

        currentUserId = userId;
        currentUserCedula = cedula;

        document.getElementById('edit-nombre').value = nombre;
        document.getElementById('edit-apellido').value = apellido;
        document.getElementById('edit-correo').value = correo;
        document.getElementById('edit-ubicacion').value = ubicacion;

        editModal.style.display = 'flex';
      });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', async (e) => {
        const userId = e.target.dataset.id;
        const row = e.target.closest('tr');

        if (!confirm('¿Estás seguro de eliminar este usuario? Se podrá recuperar por 30 días.')) return;

        // Borrado optimista: ocultar ya
        row.style.opacity = '0.5';
        row.style.pointerEvents = 'none';

        try {
          const resp = await fetch(`${API}/${userId}`, { method: 'DELETE' });

          if (resp.status !== 204) {
            let data = {};
            try { data = await resp.json(); } catch (_) {}
            if (!resp.ok) throw new Error(data.msg || 'Error al eliminar el usuario.');
            Swal.fire({
              title: 'Usuario marcado para eliminación',
              text: 'La cuenta podrá recuperarse durante los próximos 30 días antes de ser eliminada permanentemente.',
              icon: 'warning',
              confirmButtonText: 'Entendido',
              confirmButtonColor: '#3085d6'
            });
          }  

          await fetchAndRenderUsers();
        } catch (err) {
          row.style.opacity = '';
          row.style.pointerEvents = '';
          console.error('Error al eliminar el usuario:', err);
          alert(err.message);
        }
      });
    });
  };

  //Editar (PUT)
  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const updatedData = {
      nombre: document.getElementById('edit-nombre').value,
      apellido: document.getElementById('edit-apellido').value,
      cedula: currentUserCedula,
      email: document.getElementById('edit-correo').value,
      ubicacion: document.getElementById('edit-ubicacion').value
    };

    try {
      const resp = await fetch(`${API}/${currentUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });

      const result = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(result.msg || 'Error al actualizar el usuario.');

      alert('Usuario actualizado exitosamente');
      editModal.style.display = 'none';
      fetchAndRenderUsers();
    } catch (err) {
      console.error('Error al actualizar el usuario:', err);
      alert(err.message);
    }
  });

  cancelBtn.addEventListener('click', () => editModal.style.display = 'none');
  window.addEventListener('click', (e) => { if (e.target === editModal) editModal.style.display = 'none'; });

  fetchAndRenderUsers();
});
