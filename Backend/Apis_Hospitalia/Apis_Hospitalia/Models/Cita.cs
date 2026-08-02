using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Apis_Hospitalia.Models
{
    public class Cita
    {
        public int Id_Cita { get; set; }
        public string PacienteNombre { get; set; }
        public int Id_Medico { get; set; }
        public DateTime Fecha { get; set; }
        public string Motivo { get; set; }
        public string Estado { get; set; } // "Pendiente", "Atendida", "Cancelada"
    }
}