// ../../bakend/api/public/login.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  if (!form) return;
  const btn = form.querySelector('.btn-auth');
  if (btn) btn.setAttribute('type', 'button');

  let sending = false;
  const handle = async (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();

    if (sending) return;
    sending = true;

    const email = (document.getElementById('loginEmail')?.value || '').trim();
    const password = document.getElementById('loginPassword')?.value || '';

    if (!email || !password) {
      sending = false;
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debe llenar los campos requeridos.'
      });
    }

    try {
      const res = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        sending = false;
        return Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.msg || 'Credenciales inválidas'
        });
      }

      const rol = data?.user?.rol || 'usuario';

      Swal.fire({
        icon: 'success',
        title: 'Inicio de sesión exitoso',
        text: `Rol: ${rol}`
      }).then(() => {
        window.location.href = '../app/dashboard/dashboard.html';
      });
    } catch (err) {
      sending = false;
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo conectar con el servidor.'
      });
    }
  };

  form.addEventListener('submit', handle, true);
  btn?.addEventListener('click', handle, true);
});
