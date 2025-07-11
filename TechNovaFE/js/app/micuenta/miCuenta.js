document.addEventListener("DOMContentLoaded", () => {
  // Botones
  const btnAnuncios = document.getElementById("btn-anuncios");
  const btnReportes = document.getElementById("btn-reportes");
  const btnInfo = document.getElementById("btn-info");
  const btnEmprendimiento = document.getElementById("btn-emprendimiento");
  const btnPassword = document.getElementById("btn-password");

  // Lista de IDs de los componentes
  const componentes = [
    "componente-anuncios",
    "componente-reportes",
    "componente-info",
    "componente-emprendimiento",
    "componente-password"
  ];

  // Función para mostrar un componente y ocultar los demás
  function mostrarComponente(id) {
    componentes.forEach(compId => {
      const comp = document.getElementById(compId);
      if (compId === id) {
        comp.style.display = "flex";
      } else {
        comp.style.display = "none";
      }
    });
  }

  // Eventos
  btnAnuncios.addEventListener("click", () => mostrarComponente("componente-anuncios"));
  btnReportes.addEventListener("click", () => mostrarComponente("componente-reportes"));
  btnInfo.addEventListener("click", () => mostrarComponente("componente-info"));
  btnEmprendimiento.addEventListener("click", () => mostrarComponente("componente-emprendimiento"));
  btnPassword.addEventListener("click", () => mostrarComponente("componente-password"));

  // Marcar activo
  document.querySelectorAll(".menu-lateral .btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".menu-lateral .btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // Mostrar componente inicial
  mostrarComponente("componente-anuncios");
});
