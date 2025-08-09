// /TechNovaFE/scripts/signup.js

document.addEventListener('DOMContentLoaded', function() {
  const registerForm = document.getElementById('registerForm');
  
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      AuthValidator.clearErrors();
      
      // Obtener valores
      const nombre = document.getElementById('nombre').value.trim();
      const apellido = document.getElementById('apellido').value.trim();
      const cedula = document.getElementById('cedula').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      
      // Validar campos
      const nombreError = AuthValidator.validateName(nombre, 'El nombre');
      const apellidoError = AuthValidator.validateName(apellido, 'El apellido');
      const cedulaError = AuthValidator.validateCedula(cedula);
      const emailError = AuthValidator.validateEmail(email);
      const passwordError = AuthValidator.validatePassword(password);
      
      // Mostrar errores
      if (nombreError) AuthValidator.showError('nombre', nombreError);
      if (apellidoError) AuthValidator.showError('apellido', apellidoError);
      if (cedulaError) AuthValidator.showError('cedula', cedulaError);
      if (emailError) AuthValidator.showError('email', emailError);
      if (passwordError) AuthValidator.showError('password', passwordError);
      
      // Si no hay errores
      if (!nombreError && !apellidoError && !cedulaError && !emailError && !passwordError) {
        // Guardar datos en localStorage (simulación)
        localStorage.setItem('userEmail', email);
        
        // Mostrar mensaje de éxito
        Swal.fire({
          title: '¡Registro exitoso!',
          text: 'Bienvenido a la Comunidad San Isidro',
          icon: 'success',
          confirmButtonText: 'Continuar'
        }).then(() => {
          // Redirigir al dashboard o página principal
          window.location.href = '/TechNovaFE/pages/app/dashboard.html';
        });
      }
    });
  }
});