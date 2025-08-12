// RF1.2  Login
document.addEventListener("DOMContentLoaded", () => {
    // Obtenemos el formulario y el botón de ingreso
    const loginForm = document.getElementById("loginForm");
    const loginBtn = loginForm ? loginForm.querySelector("a.btn-auth") : null;

    // Se asegura de que el formulario y el botón existan
    if (loginForm && loginBtn) {

        loginBtn.addEventListener("click", async (e) => {
            e.preventDefault(); 

            const emailInput = loginForm.querySelector('input[name="email"]');
            const passwordInput = loginForm.querySelector('input[name="password"]');

            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            emailInput.classList.remove('input-error');
            passwordInput.classList.remove('input-error');
            if (!email || !password) {
                if (!email) emailInput.classList.add('input-error');
                if (!password) passwordInput.classList.add('input-error');
                
                if (typeof Swal !== 'undefined') {
                    Swal.fire({ 
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Debe llenar los campos requeridos.'
                    });
                } else {
                    alert('Debe llenar los campos requeridos');
                }
                return;
            }

            try {
                const res = await fetch("http://localhost:3000/api/users/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();

                if (res.ok) {
                    if (typeof Swal !== 'undefined') {
                        Swal.fire({
                            icon: 'success',
                            title: 'Éxito',
                            text: data.msg, 
                            timer: 3000,
                            timerProgressBar: true
                        }).then(() => {
                            // Guarda el rol del usuario si el backend lo envía
                            if (data.user && data.user.rol) {
                                localStorage.setItem('userRol', data.user.rol);
                            }
                            // Redirige al dashboard
                            window.location.href = loginBtn.href;
                        });
                    } else {
                        alert(data.msg);
                        if (data.user && data.user.rol) {
                            localStorage.setItem('userRol', data.user.rol);
                        }
                        window.location.href = loginBtn.href;
                    }
                } else {
                    // Curso Alterno 2: Usuario y/o contraseña inválidos
                    // Muestra el mensaje de error del backend
                    if (typeof Swal !== 'undefined') {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: data.msg 
                        });
                    } else {
                        alert(data.msg);
                    }
                    emailInput.classList.add('input-error');
                    passwordInput.classList.add('input-error');
                }
            } catch (error) {
                console.error("Error en la conexión:", error);
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de Conexión',
                        text: 'Hubo un problema al conectar con el servidor. Inténtalo de nuevo más tarde.',
                    });
                } else {
                    alert("Error de conexión con el servidor");
                }
            }
        });
    }
});

