const API_URL = "http://localhost:3000/api/auth";

// ========== VALIDACIONES ========== //
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(password) {
  return password.length >= 8; // Mínimo 8 caracteres
}

function validateCedula(cedula) {
  // Eliminar espacios o guiones si los hubiera (opcional)
  const cedulaLimpia = cedula.replace(/\D/g, ''); // Elimina todo lo que no sea dígito
  return /^\d{9}$/.test(cedulaLimpia); // Exactamente 9 dígitos
}

function validateText(text) {
  return text.trim() !== ""; // No vacío
}

// ========== MANEJO DE ERRORES (SweetAlert2) ========== //
function showError(message) {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: message,
    confirmButtonText: "Entendido",
  });
}

// ========== FUNCIONES DE API (Login/Registro) ========== //
async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Email o contraseña incorrectas.");

    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(
        { 
            _id: data._id,
            nombre: data.nombre, 
            apellido1: data.apellido1, 
            apellido2: data.apellido2, 
            // cedula: data.cedula, 
            email: data.email,
            role: data.role
          }));
        await Swal.fire({ icon: 'success', title: '¡Bienvenido!', timer: 2000 });
        window.location.href = "../app/dashboard/dashboard.html";
        console.log(data.token);
  } catch (error) {
    showError(error.message);
  }
}

async function register(nombre, apellido1, apellido2, email, password) {
  try {
    // Validar campos antes de enviar al backend
    if (!validateText(nombre)) throw new Error("Nombre no agregado.");
    if (!validateText(apellido1)) throw new Error("Primer apellido no agregado.");
    // if (!validateText(apellido2)) throw new Error("Segundo apellido no agregado.");
    // if (!validateCedula(cedula)) throw new Error("Cédula debe contener solo números y debe tener 9 digitos.");
    if (!validateEmail(email)) throw new Error("Email no válido.");
    if (!validatePassword(password)) throw new Error("La contraseña debe tener al menos 8 caracteres.");

    const response = await fetch(`${API_URL}/registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, apellido1, apellido2, email, password }),
    });
    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Error en el registro.");

    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(
        { 
            _id: data._id,
            nombre: data.nombre, 
            apellido1: data.apellido1, 
            apellido2: data.apellido2, 
            // cedula: data.cedula, 
            email: data.email,
            role: data.role
          }));
    await Swal.fire({ icon: 'success', title: '¡Registro exitoso!', timer: 2000 });
    window.location.href = "../app/dashboard/dashboard.html";
  } catch (error) {
    showError(error.message);
  }
}

// ========== EVENTOS ========== //
document.getElementById("loginForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  
  // Validaciones rápidas para login
  if (!validateEmail(email)) {
    showError("Email no válido.");
    return;
  }
  if (!validatePassword(password)) {
    showError("La contraseña debe tener al menos 8 caracteres.");
    return;
  }

  login(email, password);
});

document.getElementById("registerForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value;
  const apellido1 = document.getElementById("apellido1").value;
  const apellido2 = document.getElementById("apellido2").value;
  // const cedula = document.getElementById("cedula").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  register(nombre, apellido1, apellido2, email, password);
});