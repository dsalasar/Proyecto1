document.addEventListener("DOMContentLoaded", () => {
  const map = L.map("map").setView([10.0032, -84.1141], 13); // San Isidro de Heredia

  // Capa base OpenStreetMap
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(map);

  // Marcadores de ejemplo
  L.marker([10.0032, -84.1141])
    .addTo(map)
    .bindPopup("Parada Principal - San Isidro");

  L.marker([10.0080, -84.1200])
    .addTo(map)
    .bindPopup("Ruta TUASA");

  L.marker([10.0120, -84.1100])
    .addTo(map)
    .bindPopup("Ruta INCOFER");
});
