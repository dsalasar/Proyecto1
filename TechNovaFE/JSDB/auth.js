const API_URL = "http://localhost:3000/api/auth"; //Ajustamos la url segun el backend

// funcion para mostrar errores con SweetAlert2
function showError(message) {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: message,
    confirmButtonText: "Entendido",
  });
}

// funcion para login
async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Error al iniciar sesión. Credenciales incorrectas."
      );
    }

    // Exito: almacenamos el token en localStorage
    localStorage.setItem("token", data.token);
    // SweetAlert de bienvenida
    await Swal.fire({
      icon: 'success',
      title: '¡Registro exitoso!',
    //   title: `¡Hola, ${data.user.nombre}!`,
      text: 'Has iniciado sesión',
      timer: 2000,
      showConfirmButton: false
    });
    window.location.href = "../app/dashboard/dashboard.html"; // Redirigimos al dashboard
  } catch (error) {
    showError(error.message);
  }
}

// Evento login
document.getElementById(`loginForm`)?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  login(email, password);
});
