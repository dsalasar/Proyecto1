// /TechNovaFE/scripts/authValidation.js

class AuthValidator {
  static validateName(name, fieldName) {
    if (!name) {
      return `${fieldName} es obligatorio`;
    }
    if (name.length < 2) {
      return `${fieldName} debe tener al menos 2 caracteres`;
    }
    return '';
  }

  static validateEmail(email) {
    if (!email) {
      return 'El email es obligatorio';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Ingrese un email válido';
    }
    return '';
  }

  static validatePassword(password) {
    if (!password) {
      return 'La contraseña es obligatoria';
    }
    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    if (!/[A-Z]/.test(password)) {
      return 'La contraseña debe contener al menos una mayúscula';
    }
    if (!/\d/.test(password)) {
      return 'La contraseña debe contener al menos un número';
    }
    return '';
  }

  static validateCedula(cedula) {
    if (!cedula) {
      return 'La cédula es obligatoria';
    }
    if (!/^\d{9}$/.test(cedula)) {
      return 'La cédula debe tener 9 dígitos';
    }
    return '';
  }

  static showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  static clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
      el.textContent = '';
    });
  }
}