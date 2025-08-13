// /TechNovaFE/scripts/login.js

document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      AuthValidator.clearErrors();
      
      // Obtener valores
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;
      
      // Validar campos
      const emailError = AuthValidator.validateEmail(email);
      const passwordError = AuthValidator.validatePassword(password);
      
      // Mostrar errores
      if (emailError) AuthValidator.showError('email', emailError);
      if (passwordError) AuthValidator.showError('password', passwordError);
      
      // Si no hay errores
      if (!emailError && !passwordError) {
        // Simulación de login exitoso
        const storedEmail = localStorage.getItem('userEmail');
        
        if (storedEmail === email) {
          // Mostrar mensaje de éxito
          Swal.fire({
            title: '¡Bienvenido!',
            text: 'Has iniciado sesión correctamente',
            icon: 'success',
            confirmButtonText: 'Continuar'
          }).then(() => {
            // Redirigir al dashboard o página principal
            window.location.href = '/TechNovaFE/pages/app/dashboard/dashboard.html';
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Email o contraseña incorrectos',
            icon: 'error',
            confirmButtonText: 'Intentar de nuevo'
          });
        }
      }
    });

    // Cargar email guardado si existe
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      document.getElementById('loginEmail').value = savedEmail;
    }
  }
});