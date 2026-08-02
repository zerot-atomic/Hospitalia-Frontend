using Apis_Hospitalia.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace Apis_Hospitalia.Data
{
    public class MedicamentoDAO
    {
        string connectionString = ConfigurationManager.ConnectionStrings["HospitaliaConnection"].ConnectionString;
        
        // Obtener todos los datos
        public List<Medicamento> GetAll()
        {
            List<Medicamento> lista = new List<Medicamento>();
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                string query = "SELECT * FROM Medicamentos";
                SqlCommand cmd = new SqlCommand(query, conn);
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    lista.Add(new Medicamento()
                    {
                        Id = (int)reader["Id"],
                        nombreComercial = reader["nombreComercial"].ToString(),
                        laboratorio = reader["laboratorio"].ToString(),
                        presentacion = reader["presentacion"].ToString(),
                        descripcion = reader["descripcion"].ToString(),
                        precio = Convert.ToDouble(reader["precio"]),
                        stock = (int)reader["stock"]
                    });
                }
            }
            return lista;
        }

        // Obtener dato por ID
        public Medicamento GetById(int id)
        {
            Medicamento m = null;
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                string query = "SELECT * FROM Medicamentos WHERE Id=@id";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@id", id);
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    m = new Medicamento()
                    {
                        Id = (int)reader["Id"],
                        nombreComercial = reader["nombreComercial"].ToString(),
                        laboratorio = reader["laboratorio"].ToString(),
                        presentacion = reader["presentacion"].ToString(),
                        descripcion = reader["descripcion"].ToString(),
                        precio = Convert.ToDouble(reader["precio"]),
                        stock = (int)reader["stock"]
                    };
                }
            }
            return m;
        }

        // Insertar 
        public void Insert(Medicamento m)
        {
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                string query = @"INSERT INTO Medicamentos 
                                 (nombreComercial, laboratorio, presentacion, descripcion, precio, stock) 
                                 VALUES (@nombreComercial, @laboratorio, @presentacion, @descripcion, @precio, @stock)";
                SqlCommand cmd = new SqlCommand(query, conn);

                // Evitamos la inyección SQL pasando todo por parámetros
                cmd.Parameters.AddWithValue("@nombreComercial", m.nombreComercial);
                cmd.Parameters.AddWithValue("@laboratorio", m.laboratorio);
                cmd.Parameters.AddWithValue("@presentacion", m.presentacion);
                cmd.Parameters.AddWithValue("@descripcion", m.descripcion);
                cmd.Parameters.AddWithValue("@precio", m.precio);
                cmd.Parameters.AddWithValue("@stock", m.stock);

                conn.Open();
                cmd.ExecuteNonQuery();
            }
        }

        // Actualizar
        public void Update(int id, Medicamento m)
        {
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                string query = @"UPDATE Medicamentos 
                                 SET nombreComercial=@nombreComercial, laboratorio=@laboratorio, 
                                     presentacion=@presentacion, descripcion=@descripcion, 
                                     precio=@precio, stock=@stock 
                                 WHERE Id=@id";
                SqlCommand cmd = new SqlCommand(query, conn);

                cmd.Parameters.AddWithValue("@id", id);
                cmd.Parameters.AddWithValue("@nombreComercial", m.nombreComercial);
                cmd.Parameters.AddWithValue("@laboratorio", m.laboratorio);
                cmd.Parameters.AddWithValue("@presentacion", m.presentacion);
                cmd.Parameters.AddWithValue("@descripcion", m.descripcion);
                cmd.Parameters.AddWithValue("@precio", m.precio);
                cmd.Parameters.AddWithValue("@stock", m.stock);

                conn.Open();
                cmd.ExecuteNonQuery();
            }
        }

        // Eliminar
        public void Delete(int id)
        {
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                string query = "DELETE FROM Medicamentos WHERE Id=@id";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@id", id);

                conn.Open();
                cmd.ExecuteNonQuery();
            }
        }
    }
}