/* ============================================================
   CONFIG GLOBAL - Hospitalia
   Editar SOLO aqui la URL del backend (Integrante 1, API C#).
   ============================================================ */

const CONFIG = {
  // Cambiar por la URL real del backend cuando este levantado.
  // Ej: "https://localhost:7001/api" o "http://localhost:5000/api"
  API_BASE_URL: "http://localhost:5000/api",

  // Endpoints. Si el Integrante 1 usa otros nombres, se cambian aqui
  // y NO hay que tocar el resto del codigo.
  ENDPOINTS: {
    LOGIN: "/usuarios/login",
    USUARIOS: "/usuarios",
    CITAS: "/citas",
    MEDICAMENTOS: "/medicamentos", // <-- lo usa el Integrante 3
  },

  // Claves de sessionStorage
  STORAGE: {
    TOKEN: "hospitalia_token",
    USUARIO: "hospitalia_usuario",
  },

  // Coordenadas por defecto del mapa (centro hospital)
  MAPA: {
    LAT: 14.0723,
    LNG: -87.1921,
    ZOOM: 13,
  },
};
