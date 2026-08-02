using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Apis_Hospitalia.Models
{
    public class Medicamento
    {
        public int Id { get; set; }
        public string nombreComercial { get; set; }
        public string laboratorio { get; set; }
        public string presentacion { get; set; }
        public string descripcion { get; set; }
        public double precio { get; set; }
        public int stock { get; set; }
    }
}