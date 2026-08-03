/**
 * Devuelve headers base. puro JSON.
 */
function construirHeaders() {
  return { "Content-Type": "application/json" };
}

/**
 * Wrapper de fetch
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
    throw new Error("No se pudo conectar con el servidor. Verifica que la API esté encendida.");
  }

  if (respuesta.status === 401) {
    // Si el backend te bota por correo o contraseña mal
    throw new Error("Credenciales incorrectas.");
  }

  if (!respuesta.ok) {
    throw new Error("Error " + respuesta.status + " al llamar " + ruta);
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
   SERVICIOS POR MÓDULO
   ============================================================ */

const UsuariosService = {
  login: (correo, contrasena) =>
    Api.crear(CONFIG.ENDPOINTS.LOGIN, { correo, contrasena }),
  listar: () => Api.obtener(CONFIG.ENDPOINTS.USUARIOS),
};

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