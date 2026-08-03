/* ============================================================
   MODULO INVENTARIO (FARMACIA) - INTEGRANTE 3
   ============================================================ */

let medicamentos = []; // cache local de lo que devuelve la API

document.addEventListener("DOMContentLoaded", () => {
  if (!Auth.protegerPagina()) return;

  // --- Botones ya conectados a funciones vacias ---
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

  // TODO Integrante 3:
  //   medicamentos = await MedicamentosService.listar() || [];
  //   pintarTabla();
  //   manejar el error con try/catch y UI.aviso("avisoInventario", e.message, "error")
  UI.filaVacia(tbody, 8, "TODO: implementar cargarMedicamentos()");
}

/* ------------------------------------------------------------
   2. PINTAR TABLA (+ filtro del buscador)
   ------------------------------------------------------------ */
function pintarTabla() {
  const tbody = UI.el("cuerpoTablaInventario");
  const texto = UI.el("buscador").value.toLowerCase();

  // TODO Integrante 3:
  //   filtrar `medicamentos` por nombre que incluya `texto`
  //   construir las filas <tr> con UI.escapar(...)
  //   cada fila lleva 2 botones:
  //     <button data-accion="editar" data-id="...">Editar stock</button>
  //     <button data-accion="eliminar" data-id="...">Eliminar</button>
  //   y despues:
  //     tbody.querySelectorAll("button[data-accion]").forEach(...)
  //   para engancharlos a abrirFormularioEditar(id) / eliminarMedicamento(id)
  UI.filaVacia(tbody, 8, "TODO: implementar pintarTabla()");

  actualizarIndicadoresInventario();
}

/* ------------------------------------------------------------
   3. INDICADORES (KPIs de arriba)
   ------------------------------------------------------------ */
function actualizarIndicadoresInventario() {
  // TODO Integrante 3:
  //   total    = medicamentos.length
  //   bajo     = stock > 0 && stock <= 10
  //   agotados = stock === 0
  UI.el("kpiTotalMedicamentos").textContent = medicamentos.length;
  UI.el("kpiStockBajo").textContent = 0;
  UI.el("kpiAgotados").textContent = 0;
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
   5. ABRIR MODAL EN MODO "EDITAR STOCK"
   ------------------------------------------------------------ */
function abrirFormularioEditar(id) {
  UI.el("tituloModal").textContent = "Editar medicamento";
  UI.limpiarAviso("avisoModal");

  // TODO Integrante 3:
  //   const m = medicamentos.find(x => String(x.id) === String(id));
  //   rellenar los inputs: nombreMedicamento, descripcionMedicamento,
  //   stockMedicamento, precioMedicamento, vencimientoMedicamento
  //   UI.el("medicamentoId").value = id;   <- con valor = editar

  UI.abrirModal("modalMedicamento");
}

/* ------------------------------------------------------------
   6. GUARDAR (POST si no hay id, PUT si hay id)
   ------------------------------------------------------------ */
async function guardarMedicamento(evento) {
  evento.preventDefault();
  UI.limpiarAviso("avisoModal");

  const id = UI.el("medicamentoId").value;
  const medicamento = {
    nombre: UI.el("nombreMedicamento").value.trim(),
    descripcion: UI.el("descripcionMedicamento").value.trim(),
    stock: Number(UI.el("stockMedicamento").value),
    precio: Number(UI.el("precioMedicamento").value),
    fechaVencimiento: UI.el("vencimientoMedicamento").value || null,
  };

  // TODO Integrante 3:
  //   validar nombre no vacio y stock >= 0
  //   if (id) await MedicamentosService.actualizar(id, medicamento);
  //   else    await MedicamentosService.crear(medicamento);
  //   UI.cerrarModal("modalMedicamento"); cargarMedicamentos();
  //   try/catch -> UI.aviso("avisoModal", error.message, "error")

  UI.aviso("avisoModal", "TODO: implementar guardarMedicamento()", "info");
}

/* ------------------------------------------------------------
   7. ELIMINAR (DELETE)
   ------------------------------------------------------------ */
async function eliminarMedicamento(id) {
  if (!confirm("Eliminar el medicamento #" + id + "?")) return;

  // TODO Integrante 3:
  //   await MedicamentosService.eliminar(id);
  //   UI.aviso("avisoInventario", "Medicamento eliminado.", "ok");
  //   cargarMedicamentos();
}
