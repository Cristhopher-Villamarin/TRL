-- Script de inicialización completo para la base de datos trl_db
-- Incluye tablas de Backend_TRL y TRL_Version2 con DATOS INICIALES (Matrices)

-- Crear extensión para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- TABLAS DEL BACKEND (PROYECTO TRL)
-- =============================================================================

CREATE TABLE IF NOT EXISTS rol (
    idrol SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(25) NOT NULL
);

-- Reset de roles para asegurar consistencia con el código Java
TRUNCATE TABLE rol CASCADE;
INSERT INTO rol (idrol, nombre_rol) VALUES (1, 'ADMIN');
INSERT INTO rol (idrol, nombre_rol) VALUES (2, 'USER');
INSERT INTO rol (idrol, nombre_rol) VALUES (3, 'USUARIO');

CREATE TABLE IF NOT EXISTS usuario (
    idusuario SERIAL PRIMARY KEY,
    idrol INTEGER NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    correo VARCHAR(50) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    cuenta_activa VARCHAR(25) NOT NULL,
    FOREIGN KEY (idrol) REFERENCES rol(idrol)
);

-- Insertar/Actualizar Usuario Admin
DELETE FROM usuario WHERE correo = 'admin@trl.com';
INSERT INTO usuario (idrol, nombre, apellido, correo, contrasena, cuenta_activa)
VALUES (1, 'Admin', 'Sistema', 'admin@trl.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOnu', 'Activa');

CREATE TABLE IF NOT EXISTS proyecto (
    idproyecto SERIAL PRIMARY KEY,
    idusuario INTEGER,
    nombreproyecto VARCHAR(255) NOT NULL,
    tipoproyecto VARCHAR(100) NOT NULL,
    responsable VARCHAR(100) NOT NULL,
    tipologia VARCHAR(25) NOT NULL,
    area_investigacion VARCHAR(100) NOT NULL,
    duracionmeses INTEGER NOT NULL,
    departamento VARCHAR(100) NOT NULL,
    carrera VARCHAR(100) NOT NULL,
    linea_investigacion VARCHAR(255) NOT NULL,
    FOREIGN KEY (idusuario) REFERENCES usuario(idusuario)
);

CREATE TABLE IF NOT EXISTS niveltrl (
    idnivel SERIAL PRIMARY KEY,
    numnivel INTEGER NOT NULL,
    nomnivel VARCHAR(50) NOT NULL,
    entorno VARCHAR(20) NOT NULL,
    fase_desarrollo VARCHAR(50) NOT NULL,
    puntaje_minimo INTEGER NOT NULL,
    descripciontrl TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS criterios (
    idcriterio SERIAL PRIMARY KEY,
    idnivel INTEGER NOT NULL,
    nombrecriterio VARCHAR(100) NOT NULL,
    puntajecriterio INTEGER NOT NULL,
    importancia VARCHAR(5) NOT NULL,
    justificacion VARCHAR(100) NOT NULL,
    estadoevidencia VARCHAR(20) NOT NULL,
    fecha_creacion DATE NOT NULL,
    fecha_modificacion DATE NOT NULL,
    FOREIGN KEY (idnivel) REFERENCES niveltrl(idnivel)
);

CREATE TABLE IF NOT EXISTS evidencia (
    idevidencia SERIAL PRIMARY KEY,
    idproyecto INTEGER NOT NULL,
    archivo_nombre VARCHAR(255) NOT NULL,
    archivo_tipo VARCHAR(100),
    archivo_datos BYTEA, -- Almacenamiento binario directo
    descripcion VARCHAR(255) NOT NULL,
    fecha_carga DATE NOT NULL,
    estadoevidencia VARCHAR(20) NOT NULL,
    FOREIGN KEY (idproyecto) REFERENCES proyecto(idproyecto)
);

-- Nueva tabla para reportes PDF generados por la IA
CREATE TABLE IF NOT EXISTS reporte_proyecto (
    idreporte SERIAL PRIMARY KEY,
    idproyecto INTEGER NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    tipo_archivo VARCHAR(50) DEFAULT 'application/pdf',
    archivo_datos BYTEA,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idproyecto) REFERENCES proyecto(idproyecto) ON DELETE CASCADE
);

-- =============================================================================
-- TABLAS DE TRL_Version2 (PROCESAMIENTO DE DOCUMENTOS)
-- =============================================================================

CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_path VARCHAR(500),
    file_type VARCHAR(50),
    file_size INTEGER,
    title VARCHAR(500),
    author VARCHAR(255),
    created_date TIMESTAMP,
    modified_date TIMESTAMP,
    text_content TEXT,
    metadata_json JSONB,
    status VARCHAR(50) DEFAULT 'pending',
    processing_started_at TIMESTAMP,
    processing_completed_at TIMESTAMP,
    error_message TEXT,
    page_count INTEGER,
    word_count INTEGER,
    character_count INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS extracted_images (
    id SERIAL PRIMARY KEY,
    document_id INTEGER NOT NULL,
    image_path VARCHAR(500) NOT NULL,
    page_number INTEGER,
    width INTEGER,
    height INTEGER,
    format VARCHAR(50),
    ocr_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS extracted_tables (
    id SERIAL PRIMARY KEY,
    document_id INTEGER NOT NULL,
    page_number INTEGER,
    table_data JSONB,
    row_count INTEGER,
    column_count INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

-- =============================================================================
-- INSERCIÓN DE DATOS INICIALES (MATRICES TRL)
-- =============================================================================

-- Niveles TRL (Matriz 3 y 4 simplificada)
INSERT INTO niveltrl (idnivel, numnivel, nomnivel, entorno, fase_desarrollo, puntaje_minimo, descripciontrl) VALUES
(1, 1, 'TRL 1', 'Investigación', 'Principios Básicos', 40, 'Observación de principios básicos reportados.'),
(2, 2, 'TRL 2', 'Investigación', 'Concepto Tecnológico', 75, 'Formulación del concepto y/o aplicación tecnológica.'),
(3, 3, 'TRL 3', 'Investigación', 'Prueba de Concepto', 95, 'Prueba analítica y experimental de funciones críticas.'),
(4, 4, 'TRL 4', 'Laboratorio', 'Validación Componentes', 117, 'Validación de componentes en entorno de laboratorio.'),
(5, 5, 'TRL 5', 'Entorno Real', 'Validación Entorno', 147, 'Validación de componentes en entorno relevante.'),
(6, 6, 'TRL 6', 'Simulado', 'Demostración Modelo', 194, 'Modelo de sistema o subsistema en entorno relevante.'),
(7, 7, 'TRL 7', 'Entorno Real', 'Demostración Sistema', 239, 'Demostración de sistema en entorno operacional.'),
(8, 8, 'TRL 8', 'Entorno Real', 'Sistema Completo', 304, 'Sistema completo y calificado mediante pruebas y demostración.'),
(9, 9, 'TRL 9', 'Cmercial', 'Despliegues', 407, 'Sistema real probado en entorno operacional.')
ON CONFLICT (idnivel) DO NOTHING;

-- Criterios TRL 1
INSERT INTO criterios (idnivel, nombrecriterio, puntajecriterio, importancia, justificacion, estadoevidencia, fecha_creacion, fecha_modificacion) VALUES
(1, 'Publicación en Scopus (Q1–Q2)', 20, 'Alta', 'Revistas confiables de prestigio internacional.', 'PENDIENTE', CURRENT_DATE, CURRENT_DATE),
(1, 'Publicación en Scopus (Q3–Q4)', 15, 'Media', 'Útiles pero con menor reconocimiento.', 'PENDIENTE', CURRENT_DATE, CURRENT_DATE),
(1, 'Publicación en Scielo o Redalyc', 10, 'Media', 'Apoya el proyecto, prestigio regional.', 'PENDIENTE', CURRENT_DATE, CURRENT_DATE),
(1, 'Referencias bibliográficas (>10)', 10, 'Media', 'Dan sustento a la investigación realizada.', 'PENDIENTE', CURRENT_DATE, CURRENT_DATE),
(1, 'Documentación técnica del principio', 5, 'Alta', 'Explica la base conceptual del desarrollo.', 'PENDIENTE', CURRENT_DATE, CURRENT_DATE),

-- Criterios TRL 2
(2, 'Artículo aplicado en Scopus (Q1–Q2)', 20, 'Alta', 'Demuestra aplicación exitosa de la idea.', 'PENDIENTE', CURRENT_DATE, CURRENT_DATE),
(2, 'Documento de formulación del concepto', 10, 'Alta', 'Explica claramente qué se quiere hacer y cómo.', 'PENDIENTE', CURRENT_DATE, CURRENT_DATE),
(2, 'Relación con necesidad institucional/nacional', 10, 'Media', 'Evidencia resolución de un problema real.', 'PENDIENTE', CURRENT_DATE, CURRENT_DATE),
(2, 'Validación de pares (académicos)', 5, 'Media', 'Revisión experta externa.', 'PENDIENTE', CURRENT_DATE, CURRENT_DATE),

-- Criterios TRL 3
(3, 'Simulación funcional Proteus', 5, 'Alta', 'Integración software/hardware profesional.', 'PENDIENTE', CURRENT_DATE, CURRENT_DATE),
(3, 'Simulación MATLAB/Simulink', 5, 'Alta', 'Validación numérica rigurosa.', 'PENDIENTE', CURRENT_DATE, CURRENT_DATE),
(3, 'Prototipo funcional en laboratorio', 10, 'Media', 'Muestra capacidad real de construcción.', 'PENDIENTE', CURRENT_DATE, CURRENT_DATE),
(3, 'Registro de pruebas (bitácora validada)', 5, 'Alta', 'Fechas, errores, ajustes, validaciones firmadas.', 'PENDIENTE', CURRENT_DATE, CURRENT_DATE)
ON CONFLICT DO NOTHING;

-- Índices de optimización
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_usuario_correo ON usuario(correo);
CREATE INDEX IF NOT EXISTS idx_proyecto_usuario ON proyecto(idusuario);
