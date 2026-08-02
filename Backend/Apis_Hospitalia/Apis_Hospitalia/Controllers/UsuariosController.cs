using Apis_Hospitalia.Data;
using Apis_Hospitalia.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.UI.WebControls;

namespace Apis_Hospitalia.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class UsuariosController : ApiController
    {
        UsuarioDAO dao = new UsuarioDAO();

        public IHttpActionResult Post(LoginRequest request)
        {
            Usuarios usuarioLogueado = dao.Login(request.correo, request.contrasena);

            if (usuarioLogueado != null)
            {
                return Ok(
                    new
                    {
                        usuario = usuarioLogueado
                    });
            }

            // Si el DAO devolvió null (contraseña o correo equivocados)
            return Unauthorized(); // Devuelve un error 401
        }
    }
}