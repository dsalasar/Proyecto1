document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("transporte-form");
  const tabla = document.getElementById("tabla-transporte");
  const preview = document.getElementById("preview");
  const imagenInput = document.getElementById("imagen");

  // Previsualizar imagen
  imagenInput.addEventListener("change", () => {
    const file = imagenInput.files[0];
    if (file) {
      preview.src = URL.createObjectURL(file);
      preview.style.display = "block";
    } else {
      preview.src = "";
      preview.style.display = "none";
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const empresa = document.getElementById("empresa").value.trim();
    const tipo = document.getElementById("tipo").value;
    const horario = document.getElementById("horario").value.trim();
    const contacto = document.getElementById("contacto").value.trim();
    const rutas = document.getElementById("rutas").value.trim();
    const imagenFile = imagenInput.files[0];

    // Validaciones JS
    if (!empresa || !tipo || !horario || !contacto || !rutas || !imagenFile) {
      alert("Por favor completa todos los campos y selecciona una imagen.");
      return;
    }

    const imagenURL = URL.createObjectURL(imagenFile);

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${empresa}</td>
      <td>${tipo}</td>
      <td>${horario}</td>
      <td>${contacto}</td>
      <td>${rutas}</td>
      <td><img src="${imagenURL}" style="height:60px; border-radius:6px;" /></td>
      <td><button class="eliminar-btn">Eliminar</button></td>
    `;

    tabla.appendChild(fila);
    form.reset();
    preview.src = "";
    preview.style.display = "none";
  });

  // Eliminar fila
  tabla.addEventListener("click", (e) => {
    if (e.target.classList.contains("eliminar-btn")) {
      e.target.closest("tr").remove();
    }
  });
});
