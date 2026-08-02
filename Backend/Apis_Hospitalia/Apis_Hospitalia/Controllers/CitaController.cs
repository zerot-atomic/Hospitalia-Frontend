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
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class CitaController : ApiController
    {
        CitaDAO dao = new CitaDAO();

        // GET: api/Citas
        public IEnumerable<Cita> Get()
        {
            return dao.GetAll();
        }

        // GET: api/Citas/3
        public Cita Get(int id)
        {
            return dao.GetById(id);
        }

        // POST: api/Citas
        public void Post(Cita cita)
        {
            dao.Insert(cita);
        }

        // PUT: api/Citas/3
        public void Put(int id, Cita cita)
        {
            dao.Update(id, cita);
        }

        // DELETE: api/Citas/5
        public void Delete(int id)
        {
            dao.Delete(id);
        }
    }
}