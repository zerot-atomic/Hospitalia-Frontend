/* ============================================================
   UTILIDADES DE INTERFAZ COMPARTIDAS
   Las usan Citas (Integrante 2) e Inventario (Integrante 3).
   ============================================================ */

const UI = {
  /** Atajo de document.getElementById */
  el(id) {
    return document.getElementById(id);
  },

  /**
   * Muestra un aviso en un contenedor.
   * @param {string} idContenedor - id del div .aviso
   * @param {string} mensaje
   * @param {"error"|"ok"|"info"} tipo
   */
  aviso(idContenedor, mensaje, tipo = "info") {
    const caja = UI.el(idContenedor);
    if (!caja) return;
    caja.className = "aviso aviso-" + tipo;
    caja.textContent = mensaje;
    caja.classList.remove("oculto");
  },

  limpiarAviso(idContenedor) {
    const caja = UI.el(idContenedor);
    if (caja) caja.classList.add("oculto");
  },

  /** Bloquea un boton mientras carga */
  cargando(boton, estaCargando, textoOriginal) {
    if (!boton) return;
    boton.disabled = estaCargando;
    if (estaCargando) {
      boton.dataset.textoPrevio = boton.textContent;
      boton.textContent = "Cargando...";
    } else {
      boton.textContent = textoOriginal || boton.dataset.textoPrevio || boton.textContent;
    }
  },

  abrirModal(id) {
    const m = UI.el(id);
    if (m) m.classList.remove("oculto");
  },

  cerrarModal(id) {
    const m = UI.el(id);
    if (m) m.classList.add("oculto");
  },

  /** Escapa texto que viene de la API antes de meterlo al DOM */
  escapar(valor) {
    if (valor === null || valor === undefined) return "";
    return String(valor)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  },

  /** "2026-08-03T14:30:00" -> "03/08/2026 02:30 PM" */
  formatoFecha(iso) {
    if (!iso) return "-";
    const f = new Date(iso);
    if (isNaN(f)) return UI.escapar(iso);
    return f.toLocaleString("es-HN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  },

  /** Pinta la fila de "no hay datos" dentro de un tbody */
  filaVacia(tbody, columnas, mensaje) {
    tbody.innerHTML =
      '<tr><td colspan="' + columnas + '" class="vacio">' +
      UI.escapar(mensaje) +
      "</td></tr>";
  },
};
