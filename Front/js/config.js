/* ============================================================
   CONFIG GLOBAL - Hospitalia
   ============================================================ */

const CONFIG = {
  // Puerto al levantar la API (c#)
  API_BASE_URL: "https://localhost:44387/api",

  ENDPOINTS: {
    LOGIN: "/usuarios",
    USUARIOS: "/usuarios",
    CITAS: "/cita",
    MEDICAMENTOS: "/medicamento",
  },

  // Claves de sessionStorage
  STORAGE: {
    USUARIO: "hospitalia_usuario",
  },

  // Coordenadas por defecto del mapa (centro hospital)
  MAPA: {
    LAT: 14.0723,
    LNG: -87.1921,
    ZOOM: 13,
  },
};