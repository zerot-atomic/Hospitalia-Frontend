/* ============================================================
   API DE TERCEROS: LEAFLET (OpenStreetMap) - Integrante 2
   Muestra sedes del hospital y ubica al paciente.
   ============================================================ */

const SEDES = [
  { nombre: "Hospitalia - Sede Central", lat: 14.0723, lng: -87.1921, tel: "2222-0000" },
  { nombre: "Hospitalia - Clinica Norte", lat: 14.1005, lng: -87.2065, tel: "2222-0101" },
  { nombre: "Hospitalia - Farmacia Sur", lat: 14.0521, lng: -87.1750, tel: "2222-0202" },
];

let mapa = null;
let marcadorUsuario = null;

document.addEventListener("DOMContentLoaded", () => {
  if (typeof L === "undefined") {
    console.warn("Leaflet no cargo. Revisa la conexion a internet.");
    return;
  }
  iniciarMapa();
});

function iniciarMapa() {
  mapa = L.map("mapa").setView(
    [CONFIG.MAPA.LAT, CONFIG.MAPA.LNG],
    CONFIG.MAPA.ZOOM
  );

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap",
  }).addTo(mapa);

  SEDES.forEach((sede) => {
    L.marker([sede.lat, sede.lng])
      .addTo(mapa)
      .bindPopup(
        "<strong>" + UI.escapar(sede.nombre) + "</strong><br>Tel: " +
        UI.escapar(sede.tel)
      );
  });

  const btn = document.getElementById("btnMiUbicacion");
  if (btn) btn.addEventListener("click", ubicarUsuario);
}

function ubicarUsuario() {
  if (!navigator.geolocation) {
    UI.aviso("avisoMapa", "Tu navegador no soporta geolocalizacion.", "error");
    return;
  }
  UI.aviso("avisoMapa", "Buscando tu ubicacion...", "info");

  navigator.geolocation.getCurrentPosition(
    (posicion) => {
      const { latitude, longitude } = posicion.coords;
      if (marcadorUsuario) mapa.removeLayer(marcadorUsuario);
      marcadorUsuario = L.circleMarker([latitude, longitude], {
        radius: 9,
        color: "#1266b5",
        fillColor: "#1266b5",
        fillOpacity: .6,
      })
        .addTo(mapa)
        .bindPopup("Estas aqui")
        .openPopup();
      mapa.setView([latitude, longitude], 15);

      UI.aviso("avisoMapa", "Sede mas cercana: " + sedeMasCercana(latitude, longitude), "ok");
    },
    () => UI.aviso("avisoMapa", "No se pudo obtener tu ubicacion.", "error")
  );
}

/** Distancia recta simple para elegir la sede mas cercana. */
function sedeMasCercana(lat, lng) {
  let mejor = SEDES[0];
  let menor = Infinity;
  SEDES.forEach((s) => {
    const d = Math.pow(s.lat - lat, 2) + Math.pow(s.lng - lng, 2);
    if (d < menor) {
      menor = d;
      mejor = s;
    }
  });
  return mejor.nombre;
}
