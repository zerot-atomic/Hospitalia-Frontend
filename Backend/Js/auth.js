const Auth = {
  guardarSesion(token, usuario) {
    sessionStorage.setItem(CONFIG.STORAGE.TOKEN, token || "");
    sessionStorage.setItem(
      CONFIG.STORAGE.USUARIO,
      JSON.stringify(usuario || {})
    );
  },

  usuario() {
    const crudo = sessionStorage.getItem(CONFIG.STORAGE.USUARIO);
    if (!crudo) return null;
    try {
      return JSON.parse(crudo);
    } catch (_) {
      return null;
    }
  },

  haySesion() {
    return sessionStorage.getItem(CONFIG.STORAGE.TOKEN) !== null;
  },

  cerrarSesion() {
    sessionStorage.removeItem(CONFIG.STORAGE.TOKEN);
    sessionStorage.removeItem(CONFIG.STORAGE.USUARIO);
    window.location.href = "index.html";
  },

  /** Llamar al inicio de toda pagina interna (citas, inventario). */
  protegerPagina() {
    if (!Auth.haySesion()) {
      window.location.href = "index.html";
      return false;
    }
    Auth.pintarUsuario();
    return true;
  },

  /** Rellena el nombre y el avatar de la barra superior si existen. */
  pintarUsuario() {
    const u = Auth.usuario() || {};
    const nombre = u.nombre || u.correo || "Usuario";
    const cajaNombre = document.getElementById("nombreUsuario");
    const avatar = document.getElementById("avatarUsuario");
    if (cajaNombre) cajaNombre.textContent = nombre;
    if (avatar) avatar.textContent = nombre.charAt(0).toUpperCase();

    const btnSalir = document.getElementById("btnCerrarSesion");
    if (btnSalir) btnSalir.addEventListener("click", Auth.cerrarSesion);
  },
};

/* ------------------------------------------------------------
   Pantalla de login (solo corre en index.html)
   ------------------------------------------------------------ */
function iniciarLogin() {
  const formulario = document.getElementById("formLogin");
  if (!formulario) return;

  // Si ya inicio sesion, saltar directo a citas
  if (Auth.haySesion()) {
    window.location.href = "citas.html";
    return;
  }

  formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    UI.limpiarAviso("avisoLogin");

    const correo = document.getElementById("correo").value.trim();
    const contrasena = document.getElementById("contrasena").value;
    const boton = document.getElementById("btnEntrar");

    if (!correo || !contrasena) {
      UI.aviso("avisoLogin", "Escribe tu correo y contrasena.", "error");
      return;
    }

    UI.cargando(boton, true);
    try {
      const respuesta = await UsuariosService.login(correo, contrasena);

      // La API puede devolver el token con distintos nombres.
      // Si el Integrante 1 usa otro campo, ajustar aqui.
      const token =
        (respuesta && (respuesta.token || respuesta.accessToken)) ||
        "sesion-local";
      const usuario = (respuesta && (respuesta.usuario || respuesta.user)) || {
        correo,
      };

      Auth.guardarSesion(token, usuario);
      window.location.href = "citas.html";
    } catch (error) {
      const mensaje =
        error.status === 401 || error.status === 400
          ? "Correo o contrasena incorrectos."
          : error.message;
      UI.aviso("avisoLogin", mensaje, "error");
    } finally {
      UI.cargando(boton, false, "Entrar");
    }
  });
}

document.addEventListener("DOMContentLoaded", iniciarLogin);
