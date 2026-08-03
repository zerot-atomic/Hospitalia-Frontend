using Apis_Hospitalia.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace Apis_Hospitalia.Data
{
    public class UsuarioDAO
    {
        string connectionString = ConfigurationManager.ConnectionStrings["HospitaliaConnection"].ConnectionString;

        public Usuarios Login(string correo, string contrasena)
        {
            Usuarios u = null;
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                // Buscamos al usuario que coincida con el correo y la contraseña
                string query = "SELECT Id_Usuario, Nombre, Correo, Rol FROM Usuarios WHERE Correo=@correo AND Contrasena=@contrasena";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@correo", correo);
                cmd.Parameters.AddWithValue("@contrasena", contrasena);

                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();

                // Si entra al if, significa que las credenciales son correctas
                if (reader.Read())
                {
                    u = new Usuarios()
                    {
                        Id_Usuario = (int)reader["Id_Usuario"],
                        Nombre = reader["Nombre"].ToString(),
                        Correo = reader["Correo"].ToString(),
                        Rol = reader["Rol"].ToString()
                        // La contraseña se omite a propósito
                    };
                }
            }
            return u; // Si las credenciales están mal, devolverá null
        }


        // OBTENER TODOS LOS USUARIOS
        public List<Usuarios> GetAll()
        {
            List<Usuarios> lista = new List<Usuarios>();
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                // Solo pedimos los campos seguros, ignorando la contraseña
                string query = "SELECT Id_Usuario, Nombre, Correo, Rol FROM Usuarios";
                SqlCommand cmd = new SqlCommand(query, conn);
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    lista.Add(new Usuarios()
                    {
                        Id_Usuario = (int)reader["Id_Usuario"],
                        Nombre = reader["Nombre"].ToString(),
                        Correo = reader["Correo"].ToString(),
                        Rol = reader["Rol"].ToString()
                    });
                }
            }
            return lista;
        }
    }
}