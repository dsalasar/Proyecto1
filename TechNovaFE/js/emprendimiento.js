document.addEventListener("DOMContentLoaded", function () {
  const popup = document.getElementById("popupEmprendimiento");
  const abrirBtn = document.querySelector(".btn-registrar"); // Botón que ya tienes
  const cerrarBtn = document.getElementById("cerrarPopup");

  // Abrir el popup
  abrirBtn.addEventListener("click", function () {
    popup.style.display = "flex";
  });

  // Cerrar el popup
  cerrarBtn.addEventListener("click", function () {
    popup.style.display = "none";
  });

  // Cerrar si se hace clic fuera del contenido
  window.addEventListener("click", function (e) {
    if (e.target === popup) {
      popup.style.display = "none";
    }
  });
});
