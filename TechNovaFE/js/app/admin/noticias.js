document.getElementById('crear-noticia-btn').addEventListener('click', () => {
  Swal.fire({
    title: 'Crear Noticia',
    html: `
      <input type="text" id="swal-titulo" class="swal2-input" placeholder="Título" required>
      <textarea id="swal-descripcion" class="swal2-textarea" placeholder="Descripción" required></textarea>
      <input type="file" id="swal-imagen" class="swal2-file" accept="image/*" required>
      <img id="swal-preview" style="max-width: 100%; margin-top: 10px;" />
    `,
    showCancelButton: true,
    confirmButtonText: 'Guardar',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const titulo = document.getElementById('swal-titulo').value.trim();
      const descripcion = document.getElementById('swal-descripcion').value.trim();
      const imagenInput = document.getElementById('swal-imagen');
      const imagen = imagenInput.files[0];

      if (!titulo || !descripcion || !imagen) {
        Swal.showValidationMessage('Todos los campos son obligatorios');
        return false;
      }

      return { titulo, descripcion, imagen };
    },
    didOpen: () => {
      const imagenInput = document.getElementById('swal-imagen');
      const preview = document.getElementById('swal-preview');

      imagenInput.addEventListener('change', () => {
        const file = imagenInput.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = e => {
            preview.src = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }).then(result => {
    if (result.isConfirmed) {
      const { titulo, descripcion, imagen } = result.value;

      // Aquí puedes manejar el guardado de la noticia
      console.log('Noticia creada:', titulo, descripcion, imagen);

      Swal.fire('¡Guardado!', 'La noticia ha sido creada exitosamente.', 'success');
    }
  });
});
