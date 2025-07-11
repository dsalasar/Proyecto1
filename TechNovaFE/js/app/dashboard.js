function crearAnuncio() {
  let archivosSeleccionados = [];      // ← lista viva de imágenes
  const esDuplicado = f =>
    archivosSeleccionados.some(a => a.name === f.name && a.lastModified === f.lastModified);

  Swal.fire({
    title:
      '<h2 style="color:#1C1F4C;font:700 30px Montserrat;margin-bottom:10px">Crear Anuncio</h2>',
    html: `
      <div style="display:flex;flex-direction:column;font-family:Montserrat">
        <label style="font-weight:600; margin-bottom: 5px; text-align: left;font-size:15px;color:#1C1F4C">Descripción</label>
        <textarea id="descripcion" class="swal2-textarea"
                  placeholder="Escribe la descripción"
                  style="height:90px; font-size:14px; margin-bottom:20px; width:100%; margin-left:0; margin-right:0;"></textarea>

        <label style="font-weight:600;font-size:15px;; margin-bottom:20px;color:#1C1F4C;text-align: left">Imágenes</label>

        <div class="custum-file-upload" style="margin-bottom:20px;" id="dropZone">
          <div class="icon-upload">
            <!-- ícono -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fill="currentColor"
                d="M10 1a1 1 0 0 0-.71.29L3.29 7.29A1 1 0 0 0 3 8v12a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-1a3 3 0 0 0-3-3h-1v-.5A4.5 4.5 0 0 0 16.5 11a4.49 4.49 0 0 0-4.48 4H11v-7a1 1 0 0 0-1-1H6.41L9 4.41V7h2V3a2 2 0 0 0-2-2Zm6.5 12A2.5 2.5 0 0 1 19 15.5V17h1a1 1 0 0 1 0 2H13a1 1 0 0 1 0-2h1v-1.5A2.5 2.5 0 0 1 16.5 13ZM20 21H6a1 1 0 0 1-1-1V9h4a1 1 0 0 0 1-1V4h8a1 1 0 0 1 1 1v4a1 1 0 0 0 2 0V4a3 3 0 0 0-3-3H10Z"/>
            </svg>
          </div>
          <div class="text"><span>Haz clic o arrastra imágenes aquí</span></div>
          <input type="file" id="fileInput" multiple accept="image/*" style="display:none">
        </div>

        <div id="previews"
             style="display:flex;flex-wrap:wrap;gap:10px;min-height:60px"></div>
      </div>
    `,
    confirmButtonText: 'Subir',
    confirmButtonColor: '#007379',
    customClass: { confirmButton: 'montserrat-btn', popup: 'montserrat-popup' },
    preConfirm: () => {
      const descripcion = document.getElementById('descripcion').value.trim();
      if (!descripcion || archivosSeleccionados.length === 0) {
        Swal.showValidationMessage('Por favor completa todos los campos');
        return false;
      }

      return Promise.all(
        archivosSeleccionados.map(
          f =>
            new Promise(res => {
              const r = new FileReader();
              r.onload = () => res({ name: f.name, url: r.result });
              r.readAsDataURL(f);
            })
        )
      ).then(imagenes => ({ descripcion, imagenes }));
    },
    didOpen: () => {
      const dropZone  = document.getElementById('dropZone');
      const fileInput = document.getElementById('fileInput');
      const previews  = document.getElementById('previews');

      // --- helpers ---
      const agregaArchivos = files => {
        [...files]
          .filter(f => f.type.startsWith('image/') && !esDuplicado(f))
          .forEach(f => archivosSeleccionados.push(f));
        dibujaPreviews();
      };

      const dibujaPreviews = () => {
        previews.innerHTML = archivosSeleccionados
          .map(
            (f, i) => `
            <div style="position:relative">
              <img src="${URL.createObjectURL(f)}"
                   style="width:90px;height:90px;object-fit:cover;border-radius:6px">
              <button data-idx="${i}"
                      style="position:absolute;top:-6px;right:-6px;
                             width:20px;height:20px;border:none;border-radius:50%;
                             background:#e11d48;color:#fff;cursor:pointer;font-size:12px;
                             line-height:20px;padding:0">✕</button>
            </div>`
          )
          .join('');
      };

      // --- eventos ---
      dropZone.addEventListener('click', () => fileInput.click());

      fileInput.addEventListener('change', e => {
        agregaArchivos(e.target.files);
        fileInput.value = '';               // ← permite seleccionar de nuevo
      });

      dropZone.addEventListener('dragover', e => {
        e.preventDefault();
        dropZone.classList.add('dragover');
      });

      ['dragleave', 'drop'].forEach(evt =>
        dropZone.addEventListener(evt, () => dropZone.classList.remove('dragover'))
      );

      dropZone.addEventListener('drop', e => {
        e.preventDefault();
        agregaArchivos(e.dataTransfer.files);
      });

      // eliminar individual
      previews.addEventListener('click', e => {
        if (e.target.tagName === 'BUTTON') {
          const idx = +e.target.dataset.idx;
          archivosSeleccionados.splice(idx, 1);
          dibujaPreviews();
        }
      });
    }
  }).then(r => {
    if (r.isConfirmed && r.value) {
      const { descripcion, imagenes } = r.value;
      Swal.fire({
        title: '<h2 style="color:#1C1F4C;font:700 30px Montserrat;margin-bottom:10px">Resumen del Anuncio</h2>',
        html: `
          <p style="font-weight:600; width:100%; margin-bottom: 5px; text-align: left;font-size:15px;color:#1C1F4C">Descripción:</p>
          <p style="font-family: 'Montserrat', sans-serif; font-size:14px; color:#1C1F4C; line-height:1.5; margin:10px 0; padding-bottom:10px; text-align:left; border-radius:8px;">
  ${descripcion}
</p>

          <div>${imagenes
            .map(
              i =>
                `<img src="${i.url}" alt="${i.name}"
                      style="max-width:100%;max-height:160px;margin:4px;border-radius:6px">`
            )
            .join('')}</div>`,
        confirmButtonText: 'Confirmar',
        confirmButtonColor: '#007379'
      });
    }
  });
}
