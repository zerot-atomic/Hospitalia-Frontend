using Apis_Hospitalia.Data;
using Apis_Hospitalia.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace Apis_Hospitalia.Controllers
{
    // Etiqueta obligatoria para que el frontend pueda consumir esta clase
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class MedicamentoController : ApiController
    {
        MedicamentoDAO dao = new MedicamentoDAO();

        // Obtener todo
        public IEnumerable<Medicamento> Get()
        {
            return dao.GetAll();
        }

        // Obtener por ID
        public Medicamento Get(int id)
        {
            return dao.GetById(id);
        }

        // Insertar
        public void Post(Medicamento medicamento)
        {
            dao.Insert(medicamento);
        }

        // Actualizar 
        public void Put(int id, Medicamento medicamento)
        {
            dao.Update(id, medicamento);
        }

        // Eliminar
        public void Delete(int id) 
        { 
            dao.Delete(id);
        }
    }
}