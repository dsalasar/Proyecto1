document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token"); // JWT del login
  const componenteAnuncios = document.getElementById("componente-anuncios");

  async function cargarAnunciosUsuario() {
    try {
      const res = await fetch("http://localhost:3000/api/anuncios?categoria=anuncio", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) throw new Error("Error al obtener anuncios");
      const anuncios = await res.json();

      componenteAnuncios.innerHTML = "";

      if (anuncios.length === 0) {
        componenteAnuncios.innerHTML = `<p style="color:#666;font-family:Montserrat;">No tienes anuncios creados.</p>`;
        return;
      }

      anuncios.forEach(anuncio => {
        let imagenesHTML = "";
        if (anuncio.imagenes && anuncio.imagenes.length > 0) {
          imagenesHTML = `
            <div class="image-row">
              ${anuncio.imagenes.map(img => `<img src="${img}" alt="Imagen anuncio">`).join("")}
            </div>
          `;
        }

        const fecha = new Date(anuncio.createdAt);
        const tiempo = fecha.toLocaleDateString("es-CR", {
          day: "2-digit", month: "short", year: "numeric"
        });
        const hora = fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dia = fecha.toLocaleDateString();

        let estado = anuncio.estado || "Pendiente";
        let color = "";
        if (estado.toLowerCase() === "rechazado") color = "background:#e74c3c;color:white;padding:4px 8px;border-radius:6px;font-size:12px;";
        else if (estado.toLowerCase() === "pendiente") color = "background:#f1990f;color:white;padding:4px 8px;border-radius:6px;font-size:12px;";
        else if (estado.toLowerCase() === "aprobado") color = "background:#27ae60;color:white;padding:4px 8px;border-radius:6px;font-size:12px;";

        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
          <div class="card-header">
              <a href="perfil.html">
                  <img src="../../../assets/img/dashboard/profile.webp" alt="Perfil" class="profile-img" />
              </a>
              <div class="user-info">
                  <p><strong>${anuncio.autor?.nombre || "Usuario"}</strong></p>
                  <span>${dia} ${hora}</span>
              </div>
              <div class="category-menu">
                  <div>
                      <span class="category" style="${color}">${estado}</span>
                  </div>
                  <div class="btn-menu-container" style="position:relative;">
                      <button class="btn-menu">
                          <span class="elipsis">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512">
                                  <path
                                      d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                              </svg>
                          </span>
                      </button>
                      <div class="menu-ellipsis" style="display:none;position:absolute;top:100%;right:0;background:white;border:1px solid #ccc;border-radius:6px;box-shadow:0 2px 6px rgba(0,0,0,0.15);z-index:1000;">
                          <button class="edit-btn" style="display:block;padding:6px 12px;width:100%;text-align:left;border:none;background:none;cursor:pointer;">Editar</button>
                          <button class="delete-btn" style="display:block;padding:6px 12px;width:100%;text-align:left;border:none;background:none;cursor:pointer;color:#e74c3c;">Eliminar</button>
                      </div>
                  </div>
              </div>
          </div>
          <div class="card-body">
              <p>${anuncio.descripcion}</p>
              ${imagenesHTML}
          </div>
        `;

        // Eventos del menú
        const btnMenu = card.querySelector(".btn-menu");
        const menu = card.querySelector(".menu-ellipsis");

        btnMenu.addEventListener("click", (e) => {
          e.stopPropagation();
          menu.style.display = menu.style.display === "block" ? "none" : "block";
        });

        document.addEventListener("click", () => {
          menu.style.display = "none";
        });

        // Editar anuncio
        card.querySelector(".edit-btn").addEventListener("click", async () => {
          menu.style.display = "none";
          const { value: formValues } = await Swal.fire({
            title: 'Editar Anuncio',
            html:
              `<input id="swal-title" class="swal2-input" placeholder="Título" value="${anuncio.titulo || ''}">` +
              `<input id="swal-categoria" class="swal2-input" placeholder="Categoría" value="${anuncio.categoria || ''}">` +
              `<textarea id="swal-descripcion" class="swal2-textarea" placeholder="Descripción">${anuncio.descripcion || ''}</textarea>`,
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
              return {
                titulo: document.getElementById('swal-title').value,
                categoria: document.getElementById('swal-categoria').value,
                descripcion: document.getElementById('swal-descripcion').value
              }
            }
          });

          if (formValues) {
            try {
              const res = await fetch(`http://localhost:3000/api/anuncios/${anuncio._id}`, {
                method: "PUT",
                headers: {
                  "Authorization": `Bearer ${token}`,
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(formValues)
              });

              if (!res.ok) throw new Error("Error al actualizar anuncio");

              Swal.fire('Actualizado', 'Tu anuncio ha sido modificado.', 'success');
              cargarAnunciosUsuario();

            } catch (err) {
              console.error(err);
              Swal.fire('Error', 'No se pudo actualizar el anuncio.', 'error');
            }
          }
        });

        // Eliminar anuncio
        card.querySelector(".delete-btn").addEventListener("click", async () => {
          menu.style.display = "none";
          const result = await Swal.fire({
            title: "¿Deseas eliminar este anuncio?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
          });
          if (result.isConfirmed) {
            try {
              const res = await fetch(`http://localhost:3000/api/anuncios/${anuncio._id}`, {
                method: "DELETE",
                headers: {
                  "Authorization": `Bearer ${token}`,
                  "Content-Type": "application/json"
                }
              });
              if (!res.ok) throw new Error("Error al eliminar anuncio");
              Swal.fire("Eliminado", "Tu anuncio ha sido eliminado.", "success");
              cargarAnunciosUsuario();
            } catch (err) {
              console.error(err);
              Swal.fire("Error", "No se pudo eliminar el anuncio.", "error");
            }
          }
        });

        componenteAnuncios.appendChild(card);
      });
    } catch (error) {
      console.error(error);
      componenteAnuncios.innerHTML = `<p style="color:red;">Error al cargar anuncios.</p>`;
    }
  }

  cargarAnunciosUsuario();
});
