using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Apis_Hospitalia.Models
{
    public class Usuarios
    {
        public int Id_Usuario { get; set; }
        public string Nombre { get; set; }
        public string Correo { get; set; }
        public string Contrasena { get; set; }
        public string Rol { get; set; }
    }

    // DTO (Data Transfer Object) solo para recibir la petición del frontend
    public class LoginRequest
    {
        public string correo { get; set; }
        public string contrasena { get; set; }
    }
}