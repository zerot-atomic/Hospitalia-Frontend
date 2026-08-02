using Apis_Hospitalia.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace Apis_Hospitalia.Data
{
    public class CitaDAO
    {
        string connectionString = ConfigurationManager.ConnectionStrings["HospitaliaConnection"].ConnectionString;

        // OBTENER TODAS
        public List<Cita> GetAll()
        {
            List<Cita> lista = new List<Cita>();
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                string query = "SELECT * FROM Citas";
                SqlCommand cmd = new SqlCommand(query, conn);
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    lista.Add(new Cita()
                    {
                        Id_Cita = (int)reader["Id_Cita"],
                        PacienteNombre = reader["PacienteNombre"].ToString(),
                        Id_Medico = (int)reader["Id_Medico"],
                        Fecha = (DateTime)reader["Fecha"],
                        Motivo = reader["Motivo"].ToString(),
                        Estado = reader["Estado"].ToString()
                    });
                }
            }
            return lista;
        }

        // OBTENER POR ID
        public Cita GetById(int id)
        {
            Cita cita = null;
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                string query = "SELECT * FROM Citas WHERE Id_Cita = @id";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@id", id);
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    cita = new Cita()
                    {
                        Id_Cita = (int)reader["Id_Cita"],
                        PacienteNombre = reader["PacienteNombre"].ToString(),
                        Id_Medico = (int)reader["Id_Medico"],
                        Fecha = (DateTime)reader["Fecha"],
                        Motivo = reader["Motivo"].ToString(),
                        Estado = reader["Estado"].ToString()
                    };
                }
            }
            return cita;
        }

        // INSERTAR
        public void Insert(Cita cita)
        {
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                string query = "INSERT INTO Citas (PacienteNombre, Id_Medico, Fecha, Motivo, Estado) VALUES (@paciente, @medico, @fecha, @motivo, @estado)";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@paciente", cita.PacienteNombre);
                cmd.Parameters.AddWithValue("@medico", cita.Id_Medico);
                cmd.Parameters.AddWithValue("@fecha", cita.Fecha);
                cmd.Parameters.AddWithValue("@motivo", cita.Motivo);
                cmd.Parameters.AddWithValue("@estado", string.IsNullOrEmpty(cita.Estado) ? "Pendiente" : cita.Estado);

                conn.Open();
                cmd.ExecuteNonQuery();
            }
        }

        // ACTUALIZAR
        public void Update(int id, Cita cita)
        {
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                string query = "UPDATE Citas SET PacienteNombre=@paciente, Id_Medico=@medico, Fecha=@fecha, Motivo=@motivo, Estado=@estado WHERE Id_Cita=@id";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@id", id);
                cmd.Parameters.AddWithValue("@paciente", cita.PacienteNombre);
                cmd.Parameters.AddWithValue("@medico", cita.Id_Medico);
                cmd.Parameters.AddWithValue("@fecha", cita.Fecha);
                cmd.Parameters.AddWithValue("@motivo", cita.Motivo);
                cmd.Parameters.AddWithValue("@estado", cita.Estado);

                conn.Open();
                cmd.ExecuteNonQuery();
            }
        }

        // ELIMINAR
        public void Delete(int id)
        {
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                string query = "DELETE FROM Citas WHERE Id_Cita = @id";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@id", id);
                conn.Open();
                cmd.ExecuteNonQuery();
            }
        }
    }
}