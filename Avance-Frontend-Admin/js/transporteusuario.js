document.addEventListener("DOMContentLoaded", () => {
  // Referencia al contenedor del mapa
  const mapa = L.map("map").setView([10.0032, -84.1141], 13); // Coordenadas de San Isidro de Heredia

  // Capa base de OpenStreetMap
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap | Datos abiertos"
  }).addTo(mapa);

  // Marcador principal
  L.marker([10.0032, -84.1141])
    .addTo(mapa)
    .bindPopup("📍 San Isidro de Heredia<br>Zona de partida")
    .openPopup();

  // Marcador adicional de ejemplo
  L.marker([10.0100, -84.1080])
    .addTo(mapa)
    .bindPopup("🚌 Parada 2: Ruta de transporte")
    .closePopup();
});
