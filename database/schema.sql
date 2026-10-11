-- ============================================================================
--  Clinica Mascotas - Esquema de la base de datos (Fase 2)
--  Motor: MySQL / MariaDB (utf8mb4)
-- ============================================================================
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------- Seguridad / accesos ---------------------------
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255) NOT NULL DEFAULT '',
  permisos JSON NULL,
  sistema TINYINT(1) NOT NULL DEFAULT 0,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  documento VARCHAR(50) NOT NULL DEFAULT '',
  email VARCHAR(150) NOT NULL,
  telefono VARCHAR(30) NOT NULL DEFAULT '',
  password_hash VARCHAR(255) NOT NULL,
  rol_id INT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  ultimo_acceso DATE NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_usuarios_email (email),
  KEY ix_usuarios_rol (rol_id),
  CONSTRAINT fk_usuarios_rol FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------- Pacientes ---------------------------------
CREATE TABLE IF NOT EXISTS duenos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  documento VARCHAR(50) NOT NULL DEFAULT '',
  email VARCHAR(150) NOT NULL DEFAULT '',
  telefono VARCHAR(30) NOT NULL DEFAULT '',
  direccion VARCHAR(200) NOT NULL DEFAULT '',
  notas VARCHAR(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS mascotas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  especie VARCHAR(50) NOT NULL DEFAULT '',
  raza VARCHAR(100) NOT NULL DEFAULT '',
  sexo VARCHAR(20) NOT NULL DEFAULT '',
  fecha_nacimiento DATE NULL,
  peso DECIMAL(6,2) NULL,
  color VARCHAR(60) NOT NULL DEFAULT '',
  dueno_id INT NULL,
  esterilizado TINYINT(1) NOT NULL DEFAULT 0,
  notas VARCHAR(255) NOT NULL DEFAULT '',
  foto LONGTEXT NULL,
  KEY ix_mascotas_dueno (dueno_id),
  CONSTRAINT fk_mascotas_dueno FOREIGN KEY (dueno_id) REFERENCES duenos(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------- Atencion medica -------------------------------
CREATE TABLE IF NOT EXISTS diagnosticos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL DEFAULT '',
  nombre VARCHAR(150) NOT NULL,
  categoria VARCHAR(60) NOT NULL DEFAULT '',
  especie VARCHAR(40) NOT NULL DEFAULT 'Todas',
  contagioso TINYINT(1) NOT NULL DEFAULT 0,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  descripcion VARCHAR(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS citas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mascota_id INT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  motivo VARCHAR(200) NOT NULL DEFAULT '',
  veterinario VARCHAR(120) NOT NULL DEFAULT '',
  estado VARCHAR(30) NOT NULL DEFAULT 'Pendiente',
  notas VARCHAR(255) NOT NULL DEFAULT '',
  KEY ix_citas_mascota (mascota_id),
  KEY ix_citas_fecha (fecha),
  CONSTRAINT fk_citas_mascota FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS consultas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cita_id INT NULL,
  mascota_id INT NULL,
  fecha DATE NOT NULL,
  hora TIME NULL,
  motivo VARCHAR(200) NOT NULL DEFAULT '',
  temperatura DECIMAL(5,2) NULL,
  peso DECIMAL(6,2) NULL,
  frecuencia_cardiaca INT NULL,
  diagnostico VARCHAR(200) NOT NULL DEFAULT '',
  tratamiento TEXT NULL,
  observaciones TEXT NULL,
  veterinario VARCHAR(120) NOT NULL DEFAULT '',
  proxima_cita DATE NULL,
  KEY ix_consultas_mascota (mascota_id),
  CONSTRAINT fk_consultas_mascota FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------- Farmacia / ventas -----------------------------
CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  categoria VARCHAR(60) NOT NULL DEFAULT '',
  tipo VARCHAR(40) NOT NULL DEFAULT 'Producto',
  precio DECIMAL(10,2) NOT NULL DEFAULT 0,
  costo DECIMAL(10,2) NOT NULL DEFAULT 0,
  descuento INT NOT NULL DEFAULT 0,
  stock INT NOT NULL DEFAULT 0,
  stock_minimo INT NOT NULL DEFAULT 0,
  unidad VARCHAR(30) NOT NULL DEFAULT 'Unidad',
  lote VARCHAR(50) NOT NULL DEFAULT '',
  vencimiento DATE NULL,
  requiere_receta TINYINT(1) NOT NULL DEFAULT 0,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  descripcion VARCHAR(255) NOT NULL DEFAULT '',
  imagen LONGTEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS ventas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  canal VARCHAR(20) NOT NULL DEFAULT 'Mostrador',
  cliente VARCHAR(150) NOT NULL DEFAULT '',
  direccion VARCHAR(200) NOT NULL DEFAULT '',
  metodo_pago VARCHAR(60) NOT NULL DEFAULT '',
  tipo_entrega VARCHAR(20) NOT NULL DEFAULT 'Mostrador',
  costo_delivery DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  estado VARCHAR(30) NOT NULL DEFAULT 'Completada',
  KEY ix_ventas_fecha (fecha)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS venta_detalle (
  id INT AUTO_INCREMENT PRIMARY KEY,
  venta_id INT NOT NULL,
  producto_id INT NULL,
  nombre VARCHAR(150) NOT NULL DEFAULT '',
  precio DECIMAL(10,2) NOT NULL DEFAULT 0,
  cantidad INT NOT NULL DEFAULT 1,
  KEY ix_detalle_venta (venta_id),
  CONSTRAINT fk_detalle_venta FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------- Contenido / ajustes ---------------------------
CREATE TABLE IF NOT EXISTS sitio (
  id INT PRIMARY KEY,
  contenido JSON NULL,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS configuracion (
  id INT PRIMARY KEY,
  contenido JSON NULL,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
