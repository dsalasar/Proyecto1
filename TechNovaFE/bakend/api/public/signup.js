/* 
 * RF1.1 – Registro de usuario (con ID/cédula)
 * RF1.3 – Creación de perfil de usuario al registrarse
 * Validaciones de campos y envío a /api/register. */
const validations = {
  nombre: (input) =>/^[a-zA-ZáéíóúÁÉÍÓÚ\s]+$/.test(input.value.trim())? true: "El nombre solo puede contener letras y espacios.",
  apellido: (input) =>/^[a-zA-ZáéíóúÁÉÍÓÚ\s]+$/.test(input.value.trim())? true: "El apellido solo puede contener letras y espacios.",
  email: (input) =>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())? true: "El formato del correo no es válido.",
  password: (input) =>/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=?]).{8,}$/.test(input.value)? true: "Contraseña inválida. Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un caracter especial.",
  cedula: (input) => {
    const value = input.value.trim();
    const tipoIdInput = document.querySelector('input[name="tipoIdentificacion"]:checked');
    const tipoId = tipoIdInput ? tipoIdInput.value : 'nacional';
    if (tipoId === 'nacional') {
      return /^[1-9]\d{8}$/.test(value)? true: "La cédula nacional debe tener 9 dígitos y no empezar con cero.";
    } else {
      return /^\d{12}$/.test(value)? true: "El DIMEX debe tener 12 dígitos.";
    }
  },
};

let _form, _overlay;
const _active = new Set();

const ensureOverlay = () => {
  if (_overlay) return _overlay;
  _overlay = document.createElement('div');
  Object.assign(_overlay.style, {
    position: 'absolute',
    inset: '0 0 0 0',
    pointerEvents: 'none',
    zIndex: '2',
  });
  if (getComputedStyle(_form).position === 'static') _form.style.position = 'relative';
  _form.appendChild(_overlay);
  return _overlay;
};

const placeErrorNearInput = (input, el) => {
  const formRect = _form.getBoundingClientRect();
  const r = input.getBoundingClientRect();
  const top = (r.top - formRect.top) + input.offsetHeight + 4;
  const left = (r.left - formRect.left);
  el.style.top = `${top}px`;
  el.style.left = `${left}px`;
  el.style.width = `${r.width}px`;
};

const getOrCreateErrorEl = (input) => {
  ensureOverlay();
  let el = _overlay.querySelector(`span[data-for="${input.name}"]`);
  if (!el) {
    el = document.createElement('span');
    el.dataset.for = input.name || Math.random().toString(36).slice(2);
    Object.assign(el.style, {
      position: 'absolute',
      color: 'red',
      fontSize: '.85em',
      lineHeight: '1.2',
      whiteSpace: 'normal',
      wordBreak: 'break-word',
      margin: '0',
      display: 'block',
      pointerEvents: 'none',
    });
    _overlay.appendChild(el);
  }
  placeErrorNearInput(input, el);
  return el;
};

const reserveSlotForPassword = (passwordInput) => {
  if (!passwordInput) return;
  const p = passwordInput.parentNode;
  if (p.dataset.pwdSlotReady) return;
  const SLOT_PWD = 40;  
  const SLOT_BOTTOM = 4;
  const cs = getComputedStyle(p);
  const mb = parseFloat(cs.marginBottom || '0') || 0;
  const pb = parseFloat(cs.paddingBottom || '0') || 0;
  p.style.paddingBottom = (pb + SLOT_PWD + SLOT_BOTTOM) + 'px';
  if (mb >= SLOT_PWD) p.style.marginBottom = (mb - SLOT_PWD) + 'px';
  if (getComputedStyle(p).position === 'static') p.style.position = 'relative';
  p.dataset.pwdSlotReady = '1';
};

const showError = (input, message) => {
  _active.add(input);
  const el = getOrCreateErrorEl(input);
  el.textContent = message;
  placeErrorNearInput(input, el);
};

const clearError = (input) => {
  _active.delete(input);
  if (!_overlay) return;
  const el = _overlay.querySelector(`span[data-for="${input.name}"]`);
  if (el) el.textContent = '';
};

const repositionAll = () => {
  if (!_overlay) return;
  _active.forEach((inp) => {
    const el = _overlay.querySelector(`span[data-for="${inp.name}"]`);
    if (el) placeErrorNearInput(inp, el);
  });
};
window.addEventListener('resize', repositionAll);
window.addEventListener('scroll', repositionAll, true);

document.addEventListener('DOMContentLoaded', () => {
  _form = document.getElementById('registerForm');

  let registerButton =
    _form.querySelector('.btn-auth') ||
    Array.from(document.querySelectorAll('.btn-auth')).find(b => /registrar/i.test(b.textContent)) ||
    Array.from(document.querySelectorAll('.btn-auth')).slice(-1)[0];

  const formInputs = {
    nombre: _form.querySelector('input[name="nombre"]'),
    apellido: _form.querySelector('input[name="apellido"]'),
    cedula: _form.querySelector('input[name="cedula"]'),
    email: _form.querySelector('input[name="email"]'),
    password: _form.querySelector('input[name="password"]'),
  };
  reserveSlotForPassword(formInputs.password);

  for (const key in formInputs) {
    const input = formInputs[key];
    if (!input) continue;

    input.addEventListener('blur', () => {
      if (input.value.trim() !== '') {
        const res = validations[key](input);
        if (res !== true) showError(input, res);
        else clearError(input);
      } else {
        clearError(input);
      }
    });

    input.addEventListener('input', () => {
      if (input.classList.contains('error-field') || input.value.trim() !== '') {
        const res = validations[key](input);
        if (res !== true) showError(input, res);
        else clearError(input);
      } else {
        clearError(input);
      }
      repositionAll();
    });
  }

  registerButton?.addEventListener('click', async (event) => {
    event.preventDefault();

    let allFieldsValid = true;
    let firstBad = null;

    for (const key in formInputs) if (formInputs[key]) clearError(formInputs[key]);

    for (const key in formInputs) {
      const input = formInputs[key];
      if (!input) continue;

      if (input.value.trim() === '') {
        showError(input, "Este campo es obligatorio.");
        allFieldsValid = false;
        if (!firstBad) firstBad = input;
      } else {
        const res = validations[key](input);
        if (res !== true) {
          showError(input, res);
          allFieldsValid = false;
          if (!firstBad) firstBad = input;
        }
      }
    }

    if (!allFieldsValid) {  
      firstBad?.focus();
      return;
    }

    const userData = {
      nombre: formInputs.nombre.value.trim(),
      apellido: formInputs.apellido.value.trim(),
      cedula: formInputs.cedula.value.trim(),
      email: formInputs.email.value.trim(),
      password: formInputs.password.value,
    };

    try {
      const response = await axios.post('http://localhost:3000/api/users/register', userData);
      if (typeof Swal !== 'undefined') {
        await Swal.fire({
          icon: 'success',
          title: 'Registro Exitoso',
          text: response.data?.msg || 'Tu cuenta fue creada correctamente.',
        });
      /* } else { */  
       /* alert('¡Registro exitoso! Ahora puedes iniciar sesión.'); */
      } 
      window.location.href = './login.html';
    } catch (error) {
      const backendErrorMessage =
        error?.response?.data?.msg || error?.message || 'Error desconocido al registrar.';

      if (/correo/i.test(backendErrorMessage) || /Email ya registrado/i.test(backendErrorMessage)) {
        showError(formInputs.email, "El correo electrónico ya está registrado.");
        formInputs.email.focus();
      } else if (/c[eé]dula/i.test(backendErrorMessage) || /Cédula ya registrada/i.test(backendErrorMessage)) {
        showError(formInputs.cedula, "La cédula ya está registrada.");
        formInputs.cedula.focus();
      }

      if (typeof Swal !== 'undefined') {
        Swal.fire({
          icon: 'error',
          title: 'Error de Registro',
          text: backendErrorMessage,
        });
      } else {
        alert('Error al registrar: ' + backendErrorMessage);
      }
    }
  });
});