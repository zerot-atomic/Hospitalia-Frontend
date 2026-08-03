/* ============================================================
   MODULO CITAS - Integrante 2
   Consume la API de Citas y Usuarios con fetch() (via api.js).
   ============================================================ */

let citasEnMemoria = [];

document.addEventListener("DOMContentLoaded", () => {
  if (!Auth.protegerPagina()) return;

  document
    .getElementById("formCita")
    .addEventListener("submit", guardarCita);
  document
    .getElementById("btnRecargar")
    .addEventListener("click", cargarCitas);
  document
    .getElementById("filtroEstado")
    .addEventListener("change", pintarCitas);

  ponerFechaMinimaHoy();
  cargarMedicos();
  cargarCitas();
});

/** El input datetime-local no acepta fechas pasadas. */
function ponerFechaMinimaHoy() {
  const campo = document.getElementById("fecha");
  const ahora = new Date();
  ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());
  campo.min = ahora.toISOString().slice(0, 16);
}

/* ---------- Cargar medicos en el <select> ---------- */
async function cargarMedicos() {
  const select = document.getElementById("medicoId");
  try {
    const usuarios = await UsuariosService.listar();
    const medicos = (usuarios || []).filter(
      (u) => (u.rol || u.tipo || "").toLowerCase().includes("medic")
    );
    const lista = medicos.length ? medicos : usuarios || [];

    select.innerHTML = '<option value="">Selecciona un medico</option>';
    lista.forEach((m) => {
      const opcion = document.createElement("option");
      opcion.value = m.id ?? m.usuarioId ?? "";
      opcion.textContent = m.nombre || m.correo || "Medico " + opcion.value;
      select.appendChild(opcion);
    });
  } catch (error) {
    // Si el endpoint de usuarios aun no existe, se escribe el nombre a mano.
    select.innerHTML = '<option value="">(sin lista, escribe el nombre)</option>';
    console.warn("No se pudieron cargar medicos:", error.message);
  }
}

/* ---------- Listar citas ---------- */
async function cargarCitas() {
  const tbody = document.getElementById("cuerpoTablaCitas");
  UI.filaVacia(tbody, 6, "Cargando citas...");
  try {
    citasEnMemoria = (await CitasService.listar()) || [];
    pintarCitas();
    UI.limpiarAviso("avisoCitas");
  } catch (error) {
    citasEnMemoria = [];
    UI.filaVacia(tbody, 6, "No se pudieron cargar las citas.");
    UI.aviso("avisoCitas", error.message, "error");
  }
  actualizarIndicadores();
}

function pintarCitas() {
  const tbody = document.getElementById("cuerpoTablaCitas");
  const filtro = document.getElementById("filtroEstado").value;

  const lista = citasEnMemoria.filter((c) => {
    if (!filtro) return true;
    return (c.estado || "Pendiente").toLowerCase() === filtro.toLowerCase();
  });

  if (!lista.length) {
    UI.filaVacia(tbody, 6, "No hay citas registradas.");
    return;
  }

  tbody.innerHTML = lista
    .map((c) => {
      const id = c.id ?? c.citaId ?? "";
      const estado = c.estado || "Pendiente";
      return (
        "<tr>" +
        "<td>#" + UI.escapar(id) + "</td>" +
        "<td>" + UI.escapar(c.pacienteNombre || c.paciente || "-") + "</td>" +
        "<td>" + UI.escapar(c.medicoNombre || c.medico || c.medicoId || "-") + "</td>" +
        "<td>" + UI.formatoFecha(c.fecha || c.fechaHora) + "</td>" +
        "<td>" + etiquetaEstado(estado) + "</td>" +
        '<td><div class="acciones-fila">' +
        '<button class="btn btn-secundario btn-mini" data-accion="atender" data-id="' + UI.escapar(id) + '">Atender</button>' +
        '<button class="btn btn-peligro btn-mini" data-accion="cancelar" data-id="' + UI.escapar(id) + '">Cancelar</button>' +
        "</div></td>" +
        "</tr>"
      );
    })
    .join("");

  tbody.querySelectorAll("button[data-accion]").forEach((boton) => {
    boton.addEventListener("click", () => {
      const id = boton.dataset.id;
      if (boton.dataset.accion === "cancelar") cancelarCita(id);
      else cambiarEstado(id, "Atendida");
    });
  });
}

function etiquetaEstado(estado) {
  const e = estado.toLowerCase();
  let clase = "etiqueta-azul";
  if (e.includes("atend") || e.includes("complet")) clase = "etiqueta-verde";
  else if (e.includes("pend")) clase = "etiqueta-amarilla";
  else if (e.includes("cancel")) clase = "etiqueta-roja";
  return '<span class="etiqueta ' + clase + '">' + UI.escapar(estado) + "</span>";
}

function actualizarIndicadores() {
  const total = citasEnMemoria.length;
  const pendientes = citasEnMemoria.filter((c) =>
    (c.estado || "Pendiente").toLowerCase().includes("pend")
  ).length;
  const hoy = new Date().toDateString();
  const deHoy = citasEnMemoria.filter((c) => {
    const f = new Date(c.fecha || c.fechaHora);
    return !isNaN(f) && f.toDateString() === hoy;
  }).length;

  document.getElementById("kpiTotal").textContent = total;
  document.getElementById("kpiPendientes").textContent = pendientes;
  document.getElementById("kpiHoy").textContent = deHoy;
}

/* ---------- Crear cita ---------- */
async function guardarCita(evento) {
  evento.preventDefault();
  UI.limpiarAviso("avisoFormCita");

  const boton = document.getElementById("btnGuardarCita");
  const cita = {
    pacienteNombre: document.getElementById("paciente").value.trim(),
    medicoId: document.getElementById("medicoId").value || null,
    fecha: document.getElementById("fecha").value,
    motivo: document.getElementById("motivo").value.trim(),
    estado: "Pendiente",
  };

  if (!cita.pacienteNombre || !cita.fecha) {
    UI.aviso("avisoFormCita", "Paciente y fecha son obligatorios.", "error");
    return;
  }

  UI.cargando(boton, true);
  try {
    await CitasService.crear(cita);
    document.getElementById("formCita").reset();
    UI.aviso("avisoFormCita", "Cita agendada correctamente.", "ok");
    cargarCitas();
  } catch (error) {
    UI.aviso("avisoFormCita", error.message, "error");
  } finally {
    UI.cargando(boton, false, "Agendar cita");
  }
}

/* ---------- Cambiar estado / cancelar ---------- */
async function cambiarEstado(id, estado) {
  const cita = citasEnMemoria.find((c) => String(c.id ?? c.citaId) === String(id));
  if (!cita) return;
  try {
    await CitasService.actualizar(id, Object.assign({}, cita, { estado }));
    cargarCitas();
  } catch (error) {
    UI.aviso("avisoCitas", error.message, "error");
  }
}

async function cancelarCita(id) {
  if (!confirm("Cancelar la cita #" + id + "?")) return;
  try {
    await CitasService.eliminar(id);
    UI.aviso("avisoCitas", "Cita #" + id + " cancelada.", "ok");
    cargarCitas();
  } catch (error) {
    UI.aviso("avisoCitas", error.message, "error");
  }
}
