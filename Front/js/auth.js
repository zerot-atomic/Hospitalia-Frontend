const Auth = {
  // Ahora solo guardamos el objeto usuario, adiós token
  guardarSesion(usuario) {
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

  // Verificamos la sesión viendo si existe el usuario, no el token
  haySesion() {
    return sessionStorage.getItem(CONFIG.STORAGE.USUARIO) !== null;
  },

  cerrarSesion() {
    sessionStorage.removeItem(CONFIG.STORAGE.USUARIO);
    window.location.href = "index.html";
  },

  /** Llamar al inicio de toda página interna (citas, inventario). */
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
    // AJUSTADO: Tu C# devuelve Nombre y Correo (con mayúscula)
    const nombre = u.Nombre || u.Correo || "Usuario"; 
    
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

  // Si ya inició sesión, saltar directo a citas
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
      UI.aviso("avisoLogin", "Escribe tu correo y contraseña.", "error");
      return;
    }

    UI.cargando(boton, true);
    try {
      const respuesta = await UsuariosService.login(correo, contrasena);

      // El backend devuelve un JSON así: { "usuario": { "Id_Usuario": 1, ... } }
      const usuario = respuesta.usuario;

      if (!usuario) {
          throw new Error("Credenciales incorrectas.");
      }

      // Guardamos directamente el usuario
      Auth.guardarSesion(usuario);
      window.location.href = "citas.html";
      
    } catch (error) {
      const mensaje = "Correo o contraseña incorrectos.";
      UI.aviso("avisoLogin", mensaje, "error");
    } finally {
      UI.cargando(boton, false, "Entrar");
    }
  });
}

document.addEventListener("DOMContentLoaded", iniciarLogin);