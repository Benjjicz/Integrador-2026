-- Extensión necesaria
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;

-- Enums (Tipos de datos)
CREATE TYPE public.clientes_estado_enum AS ENUM ('ACTIVO', 'BAJA');
CREATE TYPE public.estado_meta AS ENUM ('PENDIENTE', 'COMPLETADA', 'CANCELADA');
CREATE TYPE public.estados_clientes AS ENUM ('ACTIVO', 'BAJA');
CREATE TYPE public.estados_proyectos AS ENUM ('ACTIVO', 'FINALIZADO', 'BAJA');
CREATE TYPE public.estados_tareas AS ENUM ('PENDIENTE', 'FINALIZADA', 'BAJA');
CREATE TYPE public.estados_usuarios AS ENUM ('ACTIVO', 'BAJA');
CREATE TYPE public.proyectos_estado_enum AS ENUM ('ACTIVO', 'FINALIZADO', 'BAJA');
CREATE TYPE public.roles_usuarios AS ENUM ('ADMIN', 'USER');
CREATE TYPE public.tareas_estado_enum AS ENUM ('PENDIENTE', 'FINALIZADA', 'BAJA');

-- Funciones y Triggers
CREATE FUNCTION public.actualizar_fecha_actualizacion() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.fecha_actualizacion = CURRENT_TIMESTAMP; RETURN NEW; END;
$$;

CREATE FUNCTION public.registrar_auditoria() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    INSERT INTO auditorias ("id_usuario", "nombre_usuario", "tipo_entidad", "id_entidad", "tipo_operacion", "datosCambio")
    VALUES (1, 'Sistema', TG_TABLE_NAME, COALESCE(NEW.id, OLD.id), TG_OP, row_to_json(COALESCE(NEW, OLD))::jsonb);
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Tablas
CREATE TABLE public.usuarios (
    id SERIAL PRIMARY KEY,
    nombre text NOT NULL UNIQUE,
    clave text NOT NULL,
    estado public.estados_usuarios NOT NULL,
    rol public.roles_usuarios DEFAULT 'USER'
);

CREATE TABLE public.clientes (
    id SERIAL PRIMARY KEY,
    nombre text NOT NULL UNIQUE,
    estado public.estados_clientes NOT NULL,
    email text UNIQUE,
    telefono text
);

CREATE TABLE public.proyectos (
    id SERIAL PRIMARY KEY,
    nombre text NOT NULL UNIQUE,
    estado public.estados_proyectos NOT NULL,
    id_cliente integer REFERENCES public.clientes(id),
    "fechaFinalizacionObjetivo" date,
    "fechaCreacion" timestamp without time zone DEFAULT now(),
    "fechaActualizacion" timestamp without time zone DEFAULT now()
);

CREATE TABLE public.metas_intermedias (
    id SERIAL PRIMARY KEY,
    id_proyecto integer NOT NULL REFERENCES public.proyectos(id) ON DELETE CASCADE,
    nombre character varying(200) NOT NULL,
    descripcion text,
    estado public.estado_meta DEFAULT 'PENDIENTE' NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fecha_actualizacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE (id_proyecto, nombre)
);

CREATE TABLE public.tareas (
    id SERIAL PRIMARY KEY,
    descripcion text NOT NULL,
    estado public.estados_tareas NOT NULL,
    id_proyecto integer REFERENCES public.proyectos(id) ON DELETE CASCADE
);

CREATE TABLE public.comentarios (
    id SERIAL PRIMARY KEY,
    id_tarea integer NOT NULL REFERENCES public.tareas(id) ON DELETE CASCADE,
    id_usuario integer NOT NULL REFERENCES public.usuarios(id),
    contenido character varying(1000) NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Índices básicos
CREATE INDEX idx_proyecto_estado ON public.proyectos(estado);
CREATE INDEX idx_tarea_estado ON public.tareas(estado);
CREATE INDEX idx_tarea_proyecto ON public.tareas(id_proyecto);