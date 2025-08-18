const API_URL = "http://localhost:3000/api/anuncios?estado=aprobado";

async function cargarAnuncios() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error al cargar anuncios");

    const anuncios = await res.json();
    const contenedor = document.querySelector(".anuncios");
    contenedor.innerHTML = "";

    anuncios.forEach(anuncio => {
      const card = document.createElement("div");
      card.className = "card";

      const fecha = new Date(anuncio.createdAt);
      const hora = fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dia = fecha.toLocaleDateString();

      card.innerHTML = `
        <div class="card-header">
          <a href="perfil.html">
            <img src="../../../assets/img/dashboard/profile.webp" alt="Perfil" class="profile-img">
          </a>
          <div class="user-info">
            <p><strong>${anuncio.autor.nombre}</strong></p>
            <span> ${dia} ${hora}</span>
          </div>
        </div>
        <div class="card-body">
          <h3 class="card-title" style="padding: 20px 0 0 0;">${anuncio.titulo}</h3>  <!-- Aquí agregamos el título -->
          <p >${anuncio.descripcion}</p>
          <div class="image-row">
            ${anuncio.imagenes.map(img => `<img src="../../../assets/img/dashboard/${img}" alt="Imagen">`).join('')}
          </div>
        </div>
      `;
      contenedor.appendChild(card);
    });

  } catch (err) {
    console.error("Error cargando anuncios:", err);
  }
}

cargarAnuncios();
