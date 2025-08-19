document.addEventListener('DOMContentLoaded', async () => {
  const API = 'http://localhost:3000/api/miusuario';
  const userTableBody = document.getElementById('user-rows');
  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    userTableBody.innerHTML = '<tr><td colspan="6">Cargando...</td></tr>';
    try {
      const res = await fetch(`${API}/`, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (!res.ok) throw new Error('No se pudo obtener la lista de usuarios');

      const usuarios = await res.json();
      if (!usuarios.length) {
        userTableBody.innerHTML = '<tr><td colspan="6">No hay usuarios registrados.</td></tr>';
        return;
      }

      userTableBody.innerHTML = '';
      usuarios.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${user.nombre || ''}</td>
          <td>${user.apellido1 || ''}</td>
          <td>${user.apellido2 || ''}</td>
          <td>${user.email || ''}</td>
          <td>${user.role || 'usuario'}</td>
          <td>
            <button class="edit-btn" data-id="${user._id}">Editar</button>
            <button class="delete-btn" data-id="${user._id}">Eliminar</button>
          </td>
        `;
        userTableBody.appendChild(row);
      });

      // Agregar eventos a los botones
      document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', () => editUser(button.dataset.id));
      });

        document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', () => deleteUser(button.dataset.id));
        });

    } catch (err) {
      console.error(err);
      userTableBody.innerHTML = `<tr><td colspan="6">Error al cargar usuarios: ${err.message}</td></tr>`;
    }
  };

  const deleteUser = async (userId) => {
  try {
    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (confirm.isConfirmed) {
      const res = await fetch(`${API}/eliminar/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.msg || 'Error al eliminar usuario');

      Swal.fire('Eliminado', 'Usuario eliminado correctamente', 'success');
      fetchUsers(); // recargar tabla
    }
  } catch (err) {
    console.error(err);
    Swal.fire('Error', err.message, 'error');
  }
};


  const editUser = async (userId) => {
  try {
    // Traer datos del usuario
    const res = await fetch(`${API}/obtener/${userId}`, {
      headers: { 
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) throw new Error('No se pudo obtener el usuario');
    const user = await res.json();

    // Mostrar SweetAlert con inputs
    const { value: formValues } = await Swal.fire({
      title: 'Editar Usuario',
      html:
        `<input id="swal-nombre" class="swal2-input" placeholder="Nombre" value="${user.nombre || ''}">` +
        `<input id="swal-apellido1" class="swal2-input" placeholder="Apellido 1" value="${user.apellido1 || ''}">` +
        `<input id="swal-apellido2" class="swal2-input" placeholder="Apellido 2" value="${user.apellido2 || ''}">` +
        `<input id="swal-correo" class="swal2-input" placeholder="Correo" value="${user.email || ''}">` +
        `<input id="swal-role" class="swal2-input" placeholder="Admin, ciudadano, emprendedor" value="${user.role || 'usuario'}">`,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        return {
          nombre: document.getElementById('swal-nombre').value,
          apellido1: document.getElementById('swal-apellido1').value,
          apellido2: document.getElementById('swal-apellido2').value,
          email: document.getElementById('swal-correo').value,
          role: document.getElementById('swal-role').value
        };
      }
    });

    if (formValues) {
      const updateRes = await fetch(`${API}/actualizar/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(formValues)
      });

      const result = await updateRes.json();
      if (!updateRes.ok) throw new Error(result.msg || 'Error al actualizar el usuario');

      Swal.fire('¡Actualizado!', 'Usuario actualizado correctamente.', 'success');
      fetchUsers(); // recargar tabla
    }

  } catch (err) {
    console.error(err);
    Swal.fire('Error', err.message, 'error');
  }
};


  fetchUsers();
});
