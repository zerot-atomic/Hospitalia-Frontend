CREATE DATABASE HospitaliaDB;
USE HospitaliaDB;

-- USUARIOS (Entidad Principal y Roles)
CREATE TABLE Usuarios (
    Id_Usuario INT IDENTITY(1,1) PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Correo VARCHAR(100) UNIQUE NOT NULL,
    Contrasena VARCHAR(255) NOT NULL,
    Rol VARCHAR(50) NOT NULL -- 'Administrador', 'Recepcionista', 'Medico'
);

-- Insertar usuarios de prueba para API de Login y para agendar citas
INSERT INTO Usuarios (Nombre, Correo, Contrasena, Rol) VALUES 
('Carlos Admin', 'admin@hospitalia.hn', '123456', 'Administrador'),
('Ana Recepcion', 'ana@hospitalia.hn', '123456', 'Recepcionista'),
('Dra. Teresa', 'teresa@hospitalia.hn', '123456', 'Medico'),
('Dr. Roberto', 'roberto@hospitalia.hn', '123456', 'Medico');

-- MEDICAMENTOS (Módulo de Inventario)
CREATE TABLE Medicamentos (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    nombreComercial VARCHAR(150) NOT NULL,
    laboratorio VARCHAR(100) NOT NULL,
    presentacion VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL
);

-- Insertar inventario inicial
INSERT INTO Medicamentos (nombreComercial, laboratorio, presentacion, descripcion, precio, stock)
VALUES 
    ('Paracetamol 500mg', 'Bayer', 'Tabletas', 'Analgésico y antipirético para fiebre y dolor.', 45.00, 150),
    ('Amoxil 250mg', 'Pfizer', 'Cápsulas', 'Antibiótico de amplio espectro.', 210.50, 45),
    ('Alerfín 10mg', 'Novartis', 'Jarabe', 'Antihistamínico para alergias.', 85.00, 80),
    ('Ibuprofeno 400mg', 'GSK', 'Tabletas', 'Antiinflamatorio no esteroideo para dolor e inflamación.', 35.00, 200),
    ('Aspirina 100mg', 'Bayer', 'Tabletas', 'Analgésico y antiplaquetario.', 25.00, 300),
    ('Omeprazol 20mg', 'AstraZeneca', 'Cápsulas', 'Inhibidor de la bomba de protones para acidez.', 120.00, 100),
    ('Simvastatina 20mg', 'Merck', 'Tabletas', 'Reductor de colesterol.', 180.00, 60),
    ('Metformina 500mg', 'Sanofi', 'Tabletas', 'Antidiabético oral.', 50.00, 120),
    ('Losartán 50mg', 'Novartis', 'Tabletas', 'Antihipertensivo.', 75.00, 90),
    ('Amlodipino 5mg', 'Pfizer', 'Tabletas', 'Bloqueador de canales de calcio para hipertensión.', 40.00, 110);

-- CITAS (Módulo de Citas)
CREATE TABLE Citas (
    Id_Cita INT IDENTITY(1,1) PRIMARY KEY,
    PacienteNombre VARCHAR(150) NOT NULL,
    Id_Medico INT NOT NULL, 
    Fecha DATETIME NOT NULL,
    Motivo VARCHAR(255) NULL,
    Estado VARCHAR(50) DEFAULT 'Pendiente', -- 'Pendiente', 'Atendida', 'Cancelada'
    
    -- Relación con la tabla Usuarios (Solo deben asignarse usuarios con rol 'Medico')
    CONSTRAINT FK_Citas_Usuarios FOREIGN KEY (Id_Medico) 
    REFERENCES Usuarios(Id_Usuario)
);

-- Insertar un par de citas de prueba para el GET del frontend
INSERT INTO Citas (PacienteNombre, Id_Medico, Fecha, Motivo, Estado) VALUES 
('Oscar Martinez', 3, '2026-08-02 10:00:00', 'Chequeo general de rutina', 'Pendiente'),
('Laura Gomez', 4, '2026-08-02 11:30:00', 'Dolor de cabeza constante', 'Atendida');

SELECT * FROM Medicamentos;
SELECT * FROM Usuarios;
SELECT * FROM Citas;

-- DELETE Citas Where Id_Cita = 3;