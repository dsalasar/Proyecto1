async function crearAnuncio() {
  let archivosSeleccionados = []; // lista viva de imágenes
  const esDuplicado = f =>
    archivosSeleccionados.some(a => a.name === f.name && a.lastModified === f.lastModified);

  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const token = localStorage.getItem('token');
  const API_URL = 'http://localhost:3000/api/anuncios'; // ajustar según tu backend

  Swal.fire({
    title: '<h2 style="color:#1C1F4C;font:700 30px Montserrat;margin-bottom:10px">Crear Anuncio</h2>',
    html: `
      <div style="display:flex;flex-direction:column;font-family:Montserrat">
  <label style="font-weight:600; margin-bottom: 5px; text-align:left;font-size:15px;color:#1C1F4C">
    Título
  </label>
  <input id="titulo" class="swal2-input" placeholder="Escribe el título">

  <label style="font-weight:600; margin-bottom: 5px; text-align:left;font-size:15px;color:#1C1F4C">
    Categoría
  </label>
  <select id="categoria" class="swal2-input" 
    style="appearance:none; background-color:#fff; background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 width=%2220%22 height=%2220%22><path fill=%22%23545454%22 d=%22M7 10l5 5 5-5z%22/></svg>'); background-repeat:no-repeat; background-position:right 10px center; background-size:16px; cursor:pointer;">
    <option value="" disabled selected>Seleccione una categoría</option>
    <option value="reporte">Reporte</option>
    <option value="noticia">Noticia</option>
    <option value="anuncio">Anuncio</option>
  </select>

  <label style="font-weight:600; margin-bottom: 5px; text-align:left;font-size:15px;color:#1C1F4C">
    Descripción
  </label>
  <textarea id="descripcion" class="swal2-textarea" placeholder="Escribe la descripción" style="height:90px;"></textarea>

  <label style="font-weight:600; margin-bottom:5px; text-align:left;font-size:15px;color:#1C1F4C">
    Imágenes (opcional)
  </label>
  <div class="custum-file-upload" id="dropZone" style="margin-bottom:20px;">
    <div class="icon-upload">📁</div>
    <div class="text"><span>Haz clic o arrastra imágenes aquí</span></div>
    <input type="file" id="fileInput" multiple accept="image/*" style="display:none">
  </div>
  <div id="previews" style="display:flex;flex-wrap:wrap;gap:10px;"></div>
</div>

    `,
    confirmButtonText: 'Subir',
    confirmButtonColor: '#007379',
    customClass: { confirmButton: 'montserrat-btn', popup: 'montserrat-popup' },
    preConfirm: async () => {
      const titulo = document.getElementById('titulo').value.trim();
      const descripcion = document.getElementById('descripcion').value.trim();
      const categoria = document.getElementById('categoria').value.trim();

      if (!descripcion) {
        Swal.showValidationMessage('La descripción es obligatoria');
        return false;
      }

      // Procesar imágenes
      const imagenes = await Promise.all(
        archivosSeleccionados.map(
          f =>
            new Promise(res => {
              const r = new FileReader();
              r.onload = () => res({ name: f.name, url: r.result });
              r.readAsDataURL(f);
            })
        )
      );

      return { titulo, descripcion, categoria, imagenes };
    },
    didOpen: () => {
      const dropZone  = document.getElementById('dropZone');
      const fileInput = document.getElementById('fileInput');
      const previews  = document.getElementById('previews');

      const dibujaPreviews = () => {
        previews.innerHTML = archivosSeleccionados
          .map(
            (f, i) => `
            <div style="position:relative">
              <img src="${URL.createObjectURL(f)}" style="width:90px;height:90px;object-fit:cover;border-radius:6px">
              <button data-idx="${i}" style="position:absolute;top:-6px;right:-6px;width:20px;height:20px;border:none;border-radius:50%;background:#e11d48;color:#fff;cursor:pointer;font-size:12px;line-height:20px;padding:0">✕</button>
            </div>`
          )
          .join('');
      };

      const agregaArchivos = files => {
        [...files].filter(f => f.type.startsWith('image/') && !esDuplicado(f)).forEach(f => archivosSeleccionados.push(f));
        dibujaPreviews();
      };

      dropZone.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', e => { agregaArchivos(e.target.files); fileInput.value = ''; });
      dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
      ['dragleave', 'drop'].forEach(evt => dropZone.addEventListener(evt, () => dropZone.classList.remove('dragover')));
      dropZone.addEventListener('drop', e => { e.preventDefault(); agregaArchivos(e.dataTransfer.files); });

      previews.addEventListener('click', e => {
        if (e.target.tagName === 'BUTTON') {
          const idx = +e.target.dataset.idx;
          archivosSeleccionados.splice(idx, 1);
          dibujaPreviews();
        }
      });
    }
  }).then(async r => {
    if (r.isConfirmed && r.value) {
      const { titulo, descripcion, categoria, imagenes } = r.value;

      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ titulo, descripcion, categoria, imagenes })
        });
        const data = await res.json();

        if (res.ok) {
          Swal.fire('Éxito', 'Anuncio creado correctamente', 'success');
          cargarAnuncios(); // refresca lista de anuncios
        } else {
          Swal.fire('Error', data.msg || 'No se pudo crear el anuncio', 'error');
        }
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
      }
    }
  });
}
