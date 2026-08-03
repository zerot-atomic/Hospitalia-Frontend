/* ============================================================
   MODULO INVENTARIO (FARMACIA) - Completado e Integrado con C#
   ============================================================ */

let medicamentos = []; // cache local de lo que devuelve la API

document.addEventListener("DOMContentLoaded", () => {
  if (!Auth.protegerPagina()) return;

  // --- Botones ya conectados ---
  UI.el("btnNuevoMedicamento").addEventListener("click", abrirFormularioNuevo);
  UI.el("btnRecargarInventario").addEventListener("click", cargarMedicamentos);
  UI.el("btnCerrarModal").addEventListener("click", () => UI.cerrarModal("modalMedicamento"));
  UI.el("btnCancelarModal").addEventListener("click", () => UI.cerrarModal("modalMedicamento"));
  UI.el("formMedicamento").addEventListener("submit", guardarMedicamento);
  UI.el("buscador").addEventListener("input", pintarTabla);

  cargarMedicamentos();
});

/* ------------------------------------------------------------
   1. LEER (GET)
   ------------------------------------------------------------ */
async function cargarMedicamentos() {
  const tbody = UI.el("cuerpoTablaInventario");
  UI.filaVacia(tbody, 8, "Cargando medicamentos...");

  try {
    medicamentos = (await MedicamentosService.listar()) || [];
    pintarTabla();
    UI.limpiarAviso("avisoInventario");
  } catch (error) {
    medicamentos = [];
    UI.filaVacia(tbody, 8, "No se pudieron cargar los medicamentos.");
    UI.aviso("avisoInventario", error.message, "error");
  }
}

/* ------------------------------------------------------------
   2. PINTAR TABLA (+ filtro del buscador)
   ------------------------------------------------------------ */
function pintarTabla() {
  const tbody = UI.el("cuerpoTablaInventario");
  const texto = UI.el("buscador").value.toLowerCase();

  // Filtrar usando el campo nombreComercial de tu backend
  const lista = medicamentos.filter((m) => {
    if (!texto) return true;
    return (m.nombreComercial || "").toLowerCase().includes(texto);
  });

  if (!lista.length) {
    UI.filaVacia(tbody, 8, "No hay medicamentos registrados.");
    return;
  }

  tbody.innerHTML = lista
    .map((m) => {
      // Ajustado a los nombres exactos de tu modelo Medicamento en C#
      return (
        "<tr>" +
        "<td>#" + UI.escapar(m.Id) + "</td>" +
        "<td>" + UI.escapar(m.nombreComercial) + "</td>" +
        "<td>" + UI.escapar(m.laboratorio) + "</td>" +
        "<td>" + UI.escapar(m.presentacion) + "</td>" +
        "<td>" + UI.escapar(m.stock) + "</td>" +
        "<td>$" + UI.escapar(m.precio) + "</td>" +
        '<td><div class="acciones-fila">' +
        '<button class="btn btn-secundario btn-mini" data-accion="editar" data-id="' + m.Id + '">Editar</button>' +
        '<button class="btn btn-peligro btn-mini" data-accion="eliminar" data-id="' + m.Id + '">Eliminar</button>' +
        "</div></td>" +
        "</tr>"
      );
    })
    .join("");
  
  // Agregar eventos a los botones de Editar y Eliminar
  tbody.querySelectorAll("button[data-accion]").forEach((boton) => {
    boton.addEventListener("click", () => {
      const id = parseInt(boton.dataset.id);
      if (boton.dataset.accion === "editar") abrirFormularioEditar(id);
      else eliminarMedicamento(id);
    });
  });

  actualizarIndicadoresInventario();

  // --- PARCHE DE ROLES (INVENTARIO) ---
  const usuarioActual = Auth.usuario() || {};
  const rol = usuarioActual.Rol || ""; 

  // Si no es el Administrador absoluto, le ocultamos todos los botones de acción
  if (rol !== "Administrador") {
    // Ocultar botones de la tabla
    document.querySelectorAll("button[data-accion='eliminar'], button[data-accion='editar']").forEach(btn => {
      btn.style.display = "none";
    });
    // Ocultar botón de agregar nuevo
    const btnNuevo = document.getElementById("btnNuevoMedicamento");
    if (btnNuevo) btnNuevo.style.display = "none";
  }
}

/* ------------------------------------------------------------
   3. INDICADORES (KPIs de arriba)
   ------------------------------------------------------------ */
function actualizarIndicadoresInventario() {
  // Ajustado para leer el campo 'stock'
  const total = medicamentos.length;
  const bajo = medicamentos.filter(m => m.stock > 0 && m.stock <= 10).length;
  const agotados = medicamentos.filter(m => m.stock === 0).length;

  UI.el("kpiTotalMedicamentos").textContent = total;
  UI.el("kpiStockBajo").textContent = bajo;
  UI.el("kpiAgotados").textContent = agotados;
}

/* ------------------------------------------------------------
   4. ABRIR MODAL EN MODO "NUEVO"
   ------------------------------------------------------------ */
function abrirFormularioNuevo() {
  UI.el("tituloModal").textContent = "Agregar medicamento";
  UI.el("formMedicamento").reset();
  UI.el("medicamentoId").value = ""; // vacio = crear
  UI.limpiarAviso("avisoModal");
  UI.abrirModal("modalMedicamento");
}

/* ------------------------------------------------------------
   5. ABRIR MODAL EN MODO "EDITAR"
   ------------------------------------------------------------ */
function abrirFormularioEditar(id) {
  UI.el("tituloModal").textContent = "Editar medicamento";
  UI.limpiarAviso("avisoModal");

  const m = medicamentos.find(x => x.Id === id);
  if (!m) return;

  // Llenamos el formulario con los campos de tu API
  UI.el("medicamentoId").value = m.Id;
  UI.el("nombreMedicamento").value = m.nombreComercial || "";
  UI.el("laboratorioMedicamento").value = m.laboratorio || "";
  UI.el("presentacionMedicamento").value = m.presentacion || "";
  UI.el("descripcionMedicamento").value = m.descripcion || "";
  UI.el("stockMedicamento").value = m.stock || 0;
  UI.el("precioMedicamento").value = m.precio || 0;

  UI.abrirModal("modalMedicamento");
}

/* ------------------------------------------------------------
   6. GUARDAR (POST si no hay id, PUT si hay id)
   ------------------------------------------------------------ */
async function guardarMedicamento(evento) {
  evento.preventDefault();
  UI.limpiarAviso("avisoModal");

  const id = UI.el("medicamentoId").value;
  
  // Armamos el JSON exactamente como lo pide tu C#
  const medicamento = {
    nombreComercial: UI.el("nombreMedicamento").value.trim(),
    laboratorio: UI.el("laboratorioMedicamento").value.trim(),
    presentacion: UI.el("presentacionMedicamento").value.trim(),
    descripcion: UI.el("descripcionMedicamento").value.trim(),
    stock: parseInt(UI.el("stockMedicamento").value) || 0,
    precio: parseFloat(UI.el("precioMedicamento").value) || 0.0,
  };

  if (!medicamento.nombreComercial || medicamento.stock < 0) {
    UI.aviso("avisoModal", "El nombre comercial es obligatorio y el stock no puede ser negativo.", "error");
    return;
  }

  try {
    if (id) {
      await MedicamentosService.actualizar(id, medicamento);
      UI.aviso("avisoInventario", "Medicamento actualizado correctamente.", "ok");
    } else {
      await MedicamentosService.crear(medicamento);
      UI.aviso("avisoInventario", "Medicamento agregado al inventario.", "ok");
    }
    UI.cerrarModal("modalMedicamento");
    cargarMedicamentos(); // Refrescamos la tabla
  } catch (error) {
    UI.aviso("avisoModal", error.message, "error");
  }
}

/* ------------------------------------------------------------
   7. ELIMINAR (DELETE)
   ------------------------------------------------------------ */
async function eliminarMedicamento(id) {
  if (!confirm("¿Seguro que deseas eliminar el medicamento #" + id + " por completo?")) return;

  try {
    await MedicamentosService.eliminar(id);
    UI.aviso("avisoInventario", "Medicamento eliminado correctamente.", "ok");
    cargarMedicamentos();
  } catch (error) {
    UI.aviso("avisoInventario", error.message, "error");
  }
} 