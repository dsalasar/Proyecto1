document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token"); // JWT del login
  const componenteReportes = document.getElementById("componente-reportes");

  async function cargarReportesUsuario() {
    try {
      const res = await fetch("http://localhost:3000/api/anuncios?categoria=reporte", { // Endpoint para tus reportes
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) throw new Error("Error al obtener reportes");
      const reportes = await res.json();

      componenteReportes.innerHTML = "";

      if (reportes.length === 0) {
        componenteReportes.innerHTML = `<p style="color:#666;font-family:Montserrat;">No tienes reportes creados.</p>`;
        return;
      }

      reportes.forEach(reporte => {
        let imagenesHTML = "";
        if (reporte.imagenes && reporte.imagenes.length > 0) {
          imagenesHTML = `
            <div class="image-row">
              ${reporte.imagenes.map(img => `<img src="${img}" alt="Imagen reporte">`).join("")}
            </div>
          `;
        }

        const fecha = new Date(reporte.createdAt);
        const dia = fecha.toLocaleDateString();
        const hora = fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        let estado = reporte.estado || "Pendiente";
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
                  <p><strong>${reporte.autor?.nombre || "Usuario"}</strong></p>
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
                                  <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
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
              <p>${reporte.descripcion}</p>
              ${imagenesHTML}
          </div>
        `;

        // Menú
        const btnMenu = card.querySelector(".btn-menu");
        const menu = card.querySelector(".menu-ellipsis");

        btnMenu.addEventListener("click", (e) => {
          e.stopPropagation();
          menu.style.display = menu.style.display === "block" ? "none" : "block";
        });

        document.addEventListener("click", () => {
          menu.style.display = "none";
        });

        // Editar reporte
        card.querySelector(".edit-btn").addEventListener("click", async () => {
          menu.style.display = "none";
          const { value: formValues } = await Swal.fire({
            title: 'Editar Reporte',
            html:
              `<textarea id="swal-descripcion" class="swal2-textarea" placeholder="Descripción">${reporte.descripcion || ''}</textarea>`,
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => ({
              descripcion: document.getElementById('swal-descripcion').value
            })
          });

          if (formValues) {
            try {
              const res = await fetch(`http://localhost:3000/api/anuncios/${reporte._id}`, {
                method: "PUT",
                headers: {
                  "Authorization": `Bearer ${token}`,
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(formValues)
              });

              if (!res.ok) throw new Error("Error al actualizar reporte");

              Swal.fire('Actualizado', 'Tu reporte ha sido modificado.', 'success');
              cargarReportesUsuario();
            } catch (err) {
              console.error(err);
              Swal.fire('Error', 'No se pudo actualizar el reporte.', 'error');
            }
          }
        });

        // Eliminar reporte
        card.querySelector(".delete-btn").addEventListener("click", async () => {
          menu.style.display = "none";
          const result = await Swal.fire({
            title: "¿Deseas eliminar este reporte?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
          });
          if (result.isConfirmed) {
            try {
              const res = await fetch(`http://localhost:3000/api/anuncios/${reporte._id}`, {
                method: "DELETE",
                headers: {
                  "Authorization": `Bearer ${token}`,
                  "Content-Type": "application/json"
                }
              });
              if (!res.ok) throw new Error("Error al eliminar reporte");
              Swal.fire("Eliminado", "Tu reporte ha sido eliminado.", "success");
              cargarReportesUsuario();
            } catch (err) {
              console.error(err);
              Swal.fire("Error", "No se pudo eliminar el reporte.", "error");
            }
          }
        });

        componenteReportes.appendChild(card);
      });
    } catch (error) {
      console.error(error);
      componenteReportes.innerHTML = `<p style="color:red;">Error al cargar reportes.</p>`;
    }
  }

  cargarReportesUsuario();
});
