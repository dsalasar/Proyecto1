const userData = JSON.parse(localStorage.getItem("usuario"));

if (userData) {
    console.log("Usuario autenticado:", userData);
  document.getElementById("nombreUsuario").textContent = userData.nombre;
}