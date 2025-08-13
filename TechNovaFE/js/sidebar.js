function cargarSidebar(esAdmin) {
  fetch('../../component/sidebar.html') // Ajusta la ruta según tu proyecto
    .then(res => res.text())
    .then(html => {
      document.getElementById('sidebar-container').innerHTML = html;

      // Ocultar botón admin si no es admin
      if (!esAdmin) {
        const adminBtn = document.getElementById('admin-btn');
        if (adminBtn) adminBtn.style.display = 'none';
      }

      // Variables para eventos
      const sidebar = document.getElementById("sidebar");
      const toggleBtn = document.getElementById("toggleCollapse");
      const hamburger = document.getElementById("hamburger");
      const overlay = document.getElementById("overlay");
      const menuItem = document.querySelectorAll(".menu-item");
      const logoutBtn = document.getElementById("logout-btn");

      toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
        menuItem.forEach((item) => {
          item.classList.toggle("collapsed");
        });
      });

      hamburger.addEventListener("click", () => {
        sidebar.classList.toggle("open");
        overlay.classList.toggle("show");
      });

      overlay.addEventListener("click", () => {
        sidebar.classList.remove("open");
        overlay.classList.remove("show");
      });

      logoutBtn.addEventListener("click", () => {
        Swal.fire({
          title: '¿Cerrar sesión?',
          text: "Se cerrará tu sesión actual.",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, cerrar',
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33'
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = '../../landing.html'; // Redirige a la página de inicio de sesión
          }
        });
      });
    })
    .catch(err => console.error('Error cargando sidebar:', err));
}
