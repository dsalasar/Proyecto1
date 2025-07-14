const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleCollapse");
const hamburger = document.getElementById("hamburger");
const overlay = document.getElementById("overlay");
const menuItem = document.querySelectorAll(".menu-item");
const logoutBtn = document.getElementById("logout-btn");


toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
  
  menuItem.forEach ((item) => {
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
        // Aquí va la acción real, como redireccionar o llamar a logout
        window.location.href = '../pages/landing.html'; // o 'cerrar_sesion.php', etc.
      }
      });
});

