/* ============================================================
   MODULO CITAS - Integrante 2 (Corregido para hacer match con C#)
   ============================================================ */

let citasEnMemoria = [];

document.addEventListener("DOMContentLoaded", () => {
  if (!Auth.protegerPagina()) return;

  document.getElementById("formCita").addEventListener("submit", guardarCita);
  document.getElementById("btnRecargar").addEventListener("click", cargarCitas);
  document.getElementById("filtroEstado").addEventListener("change", pintarCitas);

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

/* ---------- Cargar médicos en el <select> ---------- */
async function cargarMedicos() {
  const select = document.getElementById("medicoId");
  try {
    const usuarios = await UsuariosService.listar();
    
    // Tu backend devuelve 'Rol', no 'rol'. Y el rol es 'Medico' o 'Médico'
    const medicos = (usuarios || []).filter(
      (u) => (u.Rol || "").toLowerCase().includes("medic")
    );

    select.innerHTML = '<option value="">Selecciona un médico</option>';
    medicos.forEach((m) => {
      const opcion = document.createElement("option");
      // Tu backend devuelve Id_Usuario y Nombre
      opcion.value = m.Id_Usuario;
      opcion.textContent = m.Nombre;
      select.appendChild(opcion);
    });
  } catch (error) {
    select.innerHTML = '<option value="">(Error al cargar médicos)</option>';
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
    // Tu backend devuelve 'Estado'
    return (c.Estado || "Pendiente").toLowerCase() === filtro.toLowerCase();
  });

  if (!lista.length) {
    UI.filaVacia(tbody, 6, "No hay citas registradas.");
    return;
  }

  tbody.innerHTML = lista
    .map((c) => {
      // Usamos exactamente los nombres que devuelve tu C#
      const id = c.Id_Cita;
      const estado = c.Estado || "Pendiente";
      
      return (
        "<tr>" +
        "<td>#" + UI.escapar(id) + "</td>" +
        "<td>" + UI.escapar(c.PacienteNombre) + "</td>" +
        // El frontend no tiene los nombres de los doctores en la tabla citas, solo el Id.
        // Así que mostramos el ID por ahora para que no truene.
        "<td>Doctor ID: " + UI.escapar(c.Id_Medico) + "</td>" +
        "<td>" + UI.formatoFecha(c.Fecha) + "</td>" +
        "<td>" + etiquetaEstado(estado) + "</td>" +
        '<td><div class="acciones-fila">' +
        '<button class="btn btn-secundario btn-mini" data-accion="atender" data-id="' + id + '">Atender</button>' +
        '<button class="btn btn-peligro btn-mini" data-accion="cancelar" data-id="' + id + '">Eliminar</button>' +
        "</div></td>" +
        "</tr>"
      );
    })
    .join("");

  // Agregar los event listeners de los botones
  tbody.querySelectorAll("button[data-accion]").forEach((boton) => {
    boton.addEventListener("click", () => {
      const id = parseInt(boton.dataset.id);
      if (boton.dataset.accion === "cancelar") cancelarCita(id);
      else cambiarEstado(id, "Atendida");
    });
  });

  // --- PARCHE DE ROLES (CITAS) ---
  const usuarioActual = Auth.usuario() || {};
  const rol = usuarioActual.Rol || "";

  // Si es Medico, le quitamos el botón de Cancelar
  if (rol === "Medico") {
    document.querySelectorAll("button[data-accion='cancelar']").forEach(btn => {
      btn.style.display = "none";
    });
  }
  
  // Si es Recepcionista, le quitamos el botón de Atender (eso lo hace el doctor)
  if (rol === "Recepcionista") {
    document.querySelectorAll("button[data-accion='atender']").forEach(btn => {
      btn.style.display = "none";
    });
  }
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
    (c.Estado || "Pendiente").toLowerCase().includes("pend")
  ).length;
  
  const hoy = new Date().toDateString();
  const deHoy = citasEnMemoria.filter((c) => {
    const f = new Date(c.Fecha);
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
  
  // Aquí es VITAL usar los nombres EXACTOS de tu modelo de C#
  const cita = {
    PacienteNombre: document.getElementById("paciente").value.trim(),
    Id_Medico: parseInt(document.getElementById("medicoId").value) || 0,
    Fecha: document.getElementById("fecha").value,
    Motivo: document.getElementById("motivo").value.trim(),
    Estado: "Pendiente"
  };

  if (!cita.PacienteNombre || !cita.Fecha || cita.Id_Medico === 0) {
    UI.aviso("avisoFormCita", "Paciente, Médico y Fecha son obligatorios.", "error");
    return;
  }

  UI.cargando(boton, true);
  try {
    await CitasService.crear(cita);
    document.getElementById("formCita").reset();
    UI.aviso("avisoFormCita", "Cita agendada correctamente.", "ok");
    cargarCitas(); // Recarga la tabla
  } catch (error) {
    UI.aviso("avisoFormCita", error.message, "error");
  } finally {
    UI.cargando(boton, false, "Agendar cita");
  }
}

/* ---------- Cambiar estado / actualizar ---------- */
async function cambiarEstado(id, nuevoEstado) {
  // Buscamos la cita completa original
  const citaOriginal = citasEnMemoria.find((c) => c.Id_Cita === id);
  if (!citaOriginal) return;

  // Creamos una copia y le cambiamos solo el estado
  const citaActualizada = Object.assign({}, citaOriginal, { Estado: nuevoEstado });
  
  try {
    // Hacemos el PUT a tu API mandando el objeto con el estado nuevo
    await CitasService.actualizar(id, citaActualizada);
    cargarCitas();
  } catch (error) {
    UI.aviso("avisoCitas", error.message, "error");
  }
}

/* ---------- Eliminar Cita ---------- */
async function cancelarCita(id) {
  if (!confirm("¿Seguro que deseas eliminar la cita #" + id + " por completo?")) return;
  
  try {
    // Aquí mandamos a llamar tu endpoint DELETE
    await CitasService.eliminar(id);
    UI.aviso("avisoCitas", "Cita #" + id + " eliminada correctamente.", "ok");
    cargarCitas(); // Recargamos la tabla para que desaparezca
  } catch (error) {
    UI.aviso("avisoCitas", error.message, "error");
  }
}