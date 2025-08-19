  // URL de tu API
  const API_URLEMP = 'http://localhost:3000/api/emprendimiento';

  // Función para crear la carta HTML de cada emprendimiento
  function crearCarta(emprendimiento) {
    const card = document.createElement('div');
    card.classList.add('emprendimiento'); // clase que mencionaste

     card.innerHTML = `
    <div class="emprendimiento-header">
      <h3>${emprendimiento.nombre}</h3>
      <p class="emprendimiento-tagline">${emprendimiento.categoria}</p>
    </div>

    <div class="emprendimiento-content">
      <div class="emprendimiento-info">
        <i class="fas fa-phone-alt"></i> ${emprendimiento.telefono}
      </div>

      <div class="emprendimiento-info">
        <i class="far fa-clock"></i> ${emprendimiento.horario}
      </div>

      <div class="emprendimiento-info">
        <i class="fas fa-map-marker-alt"></i> ${emprendimiento.direccion}
      </div>
    </div>
  `;
    return card;
  }

  // Función para cargar los emprendimientos y agregarlos al contenedor
  async function cargarEmprendimientos() {
    try {
      const response = await fetch(API_URLEMP);
      const data = await response.json();

      const container = document.querySelector('.emprendimientos-container');
      container.innerHTML = ''; // limpiar antes de agregar

      // Filtramos solo los aprobados
      console.log('Emprendimientos cargados:', data);
    const aprobados = data.filter(emprendimiento => emprendimiento.estado === 'aprobado');

    console.log('Emprendimientos aprobados:', aprobados);
      aprobados.forEach(emprendimiento => {
        const carta = crearCarta(emprendimiento);
        container.appendChild(carta);
      });
    } catch (error) {
      console.error('Error al cargar los emprendimientos:', error);
    }
  }

  // Llamar a la función al cargar la página
  document.addEventListener('DOMContentLoaded', cargarEmprendimientos);