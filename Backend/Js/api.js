/**
 * Devuelve headers base + Authorization si hay token guardado.
 */
function construirHeaders() {
  const headers = { "Content-Type": "application/json" };
  const token = sessionStorage.getItem(CONFIG.STORAGE.TOKEN);
  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }
  return headers;
}

/**
 * Wrapper generico de fetch.
 * @param {string} ruta   - endpoint relativo, ej: "/citas"
 * @param {object} config - { metodo, cuerpo }
 * @returns {Promise<any>} JSON parseado (null si 204 No Content)
 * @throws {Error} con .status y .detalle si la API responde error
 */
async function peticion(ruta, config = {}) {
  const metodo = config.metodo || "GET";
  const url = CONFIG.API_BASE_URL + ruta;

  const opciones = {
    method: metodo,
    headers: construirHeaders(),
  };

  if (config.cuerpo !== undefined) {
    opciones.body = JSON.stringify(config.cuerpo);
  }

  let respuesta;
  try {
    respuesta = await fetch(url, opciones);
  } catch (e) {
    // Fallo de red / CORS / backend apagado
    const error = new Error(
      "No se pudo conectar con el servidor. Verifica que la API este encendida."
    );
    error.status = 0;
    throw error;
  }

  // Sesion vencida -> de vuelta al login
  if (respuesta.status === 401) {
    Auth.cerrarSesion();
    const error = new Error("Sesion expirada. Inicia sesion de nuevo.");
    error.status = 401;
    throw error;
  }

  if (!respuesta.ok) {
    let detalle = "";
    try {
      detalle = await respuesta.text();
    } catch (_) {}
    const error = new Error(
      "Error " + respuesta.status + " al llamar " + ruta
    );
    error.status = respuesta.status;
    error.detalle = detalle;
    throw error;
  }

  if (respuesta.status === 204) return null;

  const texto = await respuesta.text();
  return texto ? JSON.parse(texto) : null;
}

/* --- Atajos REST --- */
const Api = {
  obtener: (ruta) => peticion(ruta),
  crear: (ruta, cuerpo) => peticion(ruta, { metodo: "POST", cuerpo }),
  actualizar: (ruta, cuerpo) => peticion(ruta, { metodo: "PUT", cuerpo }),
  eliminar: (ruta) => peticion(ruta, { metodo: "DELETE" }),
};

/* ============================================================
   SERVICIOS POR MODULO
   ============================================================ */

/* --- Usuarios (Integrante 2) --- */
const UsuariosService = {
  login: (correo, contrasena) =>
    Api.crear(CONFIG.ENDPOINTS.LOGIN, { correo, contrasena }),
  listar: () => Api.obtener(CONFIG.ENDPOINTS.USUARIOS),
};

/* --- Citas (Integrante 2) --- */
const CitasService = {
  listar: () => Api.obtener(CONFIG.ENDPOINTS.CITAS),
  obtener: (id) => Api.obtener(CONFIG.ENDPOINTS.CITAS + "/" + id),
  crear: (cita) => Api.crear(CONFIG.ENDPOINTS.CITAS, cita),
  actualizar: (id, cita) =>
    Api.actualizar(CONFIG.ENDPOINTS.CITAS + "/" + id, cita),
  eliminar: (id) => Api.eliminar(CONFIG.ENDPOINTS.CITAS + "/" + id),
};

const MedicamentosService = {
  listar: () => Api.obtener(CONFIG.ENDPOINTS.MEDICAMENTOS),
  obtener: (id) => Api.obtener(CONFIG.ENDPOINTS.MEDICAMENTOS + "/" + id),
  crear: (medicamento) =>
    Api.crear(CONFIG.ENDPOINTS.MEDICAMENTOS, medicamento),
  actualizar: (id, medicamento) =>
    Api.actualizar(CONFIG.ENDPOINTS.MEDICAMENTOS + "/" + id, medicamento),
  eliminar: (id) => Api.eliminar(CONFIG.ENDPOINTS.MEDICAMENTOS + "/" + id),
};
