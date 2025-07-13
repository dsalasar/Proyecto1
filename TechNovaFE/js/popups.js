// class AuthPopup {
//   constructor() {
//     this.popupsContainer = document.getElementById('authPopupsContainer');
//     if (!this.popupsContainer) {
//       this.popupsContainer = document.createElement('div');
//       this.popupsContainer.id = 'authPopupsContainer';
//       document.body.appendChild(this.popupsContainer);
//     }

//     this.registerPopup = this.createPopup('register');
//     this.loginPopup = this.createPopup('login');
//     this.initEvents();
//   }

//   createPopup(type) {
//     const popup = document.createElement('div');
//     popup.className = `auth-popup ${type}-popup`;
//     popup.id = `${type}Popup`;
//     popup.innerHTML = `
//       <div class="auth-container">
//         <div class="auth-welcome">
//           <h2>${type === 'register' ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}</h2>
//           <p>${type === 'register' ? 'Inicia sesión aquí' : 'Regístrate aquí'}</p>
//           <button class="btn-auth outline switch-to-${type === 'register' ? 'login' : 'register'}">
//             ${type === 'register' ? 'Ingresar' : 'Crear cuenta'}
//           </button>
//         </div>
        
//         <div class="auth-form-container">
//           <button class="close-auth">&times;</button>
//           <h2>${type === 'register' ? 'Crear Cuenta' : 'Iniciar Sesión'}</h2>
//           <form class="auth-form ${type}-form">
//             ${type === 'register' ? `
//               <div class="form-group">
//                 <input type="text" placeholder="Nombre" required>
//               </div>
//               <div class="form-group">
//                 <input type="text" placeholder="Apellido" required>
//               </div>
//               <div class="form-group">
//                 <input type="text" placeholder="Cédula" required>
//               </div>
//             ` : ''}
//             <div class="form-group">
//               <input type="email" placeholder="Correo" required>
//             </div>
//             <div class="form-group">
//               <input type="password" placeholder="Contraseña" required>
//             </div>
//             <button type="submit" class="btn-auth primary">
//               ${type === 'register' ? 'Registrarse' : 'Ingresar'}
//             </button>
//           </form>
//         </div>
//       </div>
//     `;
//     this.popupsContainer.appendChild(popup);
//     return popup;
//   }

//   initEvents() {
//     // Switch between popups
//     document.addEventListener('click', (e) => {
//       if (e.target.classList.contains('switch-to-login')) {
//         this.registerPopup.classList.remove('active');
//         this.loginPopup.classList.add('active');
//       }
//       if (e.target.classList.contains('switch-to-register')) {
//         this.loginPopup.classList.remove('active');
//         this.registerPopup.classList.add('active');
//       }
//     });

//     // Close buttons
//     document.addEventListener('click', (e) => {
//       if (e.target.classList.contains('close-auth')) {
//         this.registerPopup.classList.remove('active');
//         this.loginPopup.classList.remove('active');
//       }
//     });

//     // Form submissions
//     document.addEventListener('submit', (e) => {
//       if (e.target.classList.contains('register-form')) {
//         e.preventDefault();
//         // Handle registration
//         console.log('Register form submitted');
//         this.registerPopup.classList.remove('active');
//       }

//       if (e.target.classList.contains('login-form')) {
//         e.preventDefault();
//         // Handle login
//         console.log('Login form submitted');
//         this.loginPopup.classList.remove('active');
//       }
//     });

//     // Connect buttons from landing page
//     document.addEventListener('click', (e) => {
//       if (e.target.classList.contains('btn-register')) {
//         e.preventDefault();
//         this.registerPopup.classList.add('active');
//       }

//       if (e.target.classList.contains('btn-signin')) {
//         e.preventDefault();
//         this.loginPopup.classList.add('active');
//       }
//     });
//   }
// }

// // Initialize when DOM is loaded
// document.addEventListener('DOMContentLoaded', () => {
//   window.authPopup = new AuthPopup();
// });