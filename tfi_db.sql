--
-- PostgreSQL database dump
--

\restrict 5gSlQFGGU7gKx2dBFz5aM1jBhtfg7waIecS8Z8TdT9P9WprsfwgK5yKoIUm0qyz

-- Dumped from database version 16.13
-- Dumped by pg_dump version 16.13

-- Started on 2026-06-01 13:26:30

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 6 (class 2615 OID 21391)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 5034 (class 0 OID 0)
-- Dependencies: 6
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- TOC entry 2 (class 3079 OID 21551)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 5036 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 928 (class 1247 OID 21940)
-- Name: clientes_estado_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.clientes_estado_enum AS ENUM (
    'ACTIVO',
    'BAJA'
);


ALTER TYPE public.clientes_estado_enum OWNER TO postgres;

--
-- TOC entry 931 (class 1247 OID 21946)
-- Name: estado_meta; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_meta AS ENUM (
    'PENDIENTE',
    'COMPLETADA',
    'CANCELADA'
);


ALTER TYPE public.estado_meta OWNER TO postgres;

--
-- TOC entry 907 (class 1247 OID 21734)
-- Name: estados_clientes; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estados_clientes AS ENUM (
    'ACTIVO',
    'BAJA'
);


ALTER TYPE public.estados_clientes OWNER TO postgres;

--
-- TOC entry 910 (class 1247 OID 21740)
-- Name: estados_proyectos; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estados_proyectos AS ENUM (
    'ACTIVO',
    'FINALIZADO',
    'BAJA'
);


ALTER TYPE public.estados_proyectos OWNER TO postgres;

--
-- TOC entry 913 (class 1247 OID 21748)
-- Name: estados_tareas; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estados_tareas AS ENUM (
    'PENDIENTE',
    'FINALIZADA',
    'BAJA'
);


ALTER TYPE public.estados_tareas OWNER TO postgres;

--
-- TOC entry 904 (class 1247 OID 21728)
-- Name: estados_usuarios; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estados_usuarios AS ENUM (
    'ACTIVO',
    'BAJA'
);


ALTER TYPE public.estados_usuarios OWNER TO postgres;

--
-- TOC entry 934 (class 1247 OID 21954)
-- Name: proyectos_estado_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.proyectos_estado_enum AS ENUM (
    'ACTIVO',
    'FINALIZADO',
    'BAJA'
);


ALTER TYPE public.proyectos_estado_enum OWNER TO postgres;

--
-- TOC entry 901 (class 1247 OID 21722)
-- Name: roles_usuarios; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.roles_usuarios AS ENUM (
    'ADMIN',
    'USER'
);


ALTER TYPE public.roles_usuarios OWNER TO postgres;

--
-- TOC entry 937 (class 1247 OID 21962)
-- Name: tareas_estado_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tareas_estado_enum AS ENUM (
    'PENDIENTE',
    'FINALIZADA',
    'BAJA'
);


ALTER TYPE public.tareas_estado_enum OWNER TO postgres;

--
-- TOC entry 287 (class 1255 OID 21969)
-- Name: actualizar_fecha_actualizacion(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.actualizar_fecha_actualizacion() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.actualizar_fecha_actualizacion() OWNER TO postgres;

--
-- TOC entry 284 (class 1255 OID 21590)
-- Name: registrar_auditoria(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.registrar_auditoria() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO auditorias ("id_usuario", "nombre_usuario", "tipo_entidad", "id_entidad", "tipo_operacion", "datosCambio")
    VALUES (1, 'Sistema', TG_TABLE_NAME, COALESCE(NEW.id, OLD.id), TG_OP, row_to_json(COALESCE(NEW, OLD))::jsonb);
    RETURN COALESCE(NEW, OLD);
END;
$$;


ALTER FUNCTION public.registrar_auditoria() OWNER TO postgres;

--
-- TOC entry 236 (class 1255 OID 21970)
-- Name: validar_baja_cliente(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.validar_baja_cliente() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.estado = 'BAJA' AND OLD.estado <> 'BAJA' THEN
        IF EXISTS (
            SELECT 1 FROM proyectos WHERE id_cliente = NEW.id
        ) THEN
            RAISE EXCEPTION 'No se puede dar de baja un cliente que está registrado en algún proyecto.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.validar_baja_cliente() OWNER TO postgres;

--
-- TOC entry 286 (class 1255 OID 21588)
-- Name: validar_cliente_activo_en_proyecto(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.validar_cliente_activo_en_proyecto() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    
    IF NEW.id_cliente IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM clientes WHERE id = NEW.id_cliente AND estado = 'ACTIVO'
    ) THEN
        RAISE EXCEPTION 'El cliente no está activo';
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.validar_cliente_activo_en_proyecto() OWNER TO postgres;

--
-- TOC entry 285 (class 1255 OID 21971)
-- Name: verificar_tareas_vencidas(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.verificar_tareas_vencidas() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.estado = 'FINALIZADA' THEN
        IF NOT EXISTS (
            SELECT 1
            FROM tareas
            WHERE "idProyecto" = NEW."idProyecto" AND estado = 'PENDIENTE'
        ) THEN
            NULL;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.verificar_tareas_vencidas() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 235 (class 1259 OID 22082)
-- Name: auditorias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auditorias (
    id integer NOT NULL,
    id_usuario integer,
    nombre_usuario character varying(100),
    tipo_entidad character varying(100),
    id_entidad integer,
    tipo_operacion character varying(20),
    "datosCambio" jsonb,
    fecha timestamp without time zone DEFAULT now()
);


ALTER TABLE public.auditorias OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 22081)
-- Name: auditorias_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.auditorias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.auditorias_id_seq OWNER TO postgres;

--
-- TOC entry 5037 (class 0 OID 0)
-- Dependencies: 234
-- Name: auditorias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auditorias_id_seq OWNED BY public.auditorias.id;


--
-- TOC entry 217 (class 1259 OID 21768)
-- Name: clientes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clientes (
    id integer NOT NULL,
    nombre text NOT NULL,
    estado public.estados_clientes NOT NULL,
    email text,
    telefono text,
    correo character varying(255)
);


ALTER TABLE public.clientes OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 21767)
-- Name: clientes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clientes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clientes_id_seq OWNER TO postgres;

--
-- TOC entry 5038 (class 0 OID 0)
-- Dependencies: 216
-- Name: clientes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clientes_id_seq OWNED BY public.clientes.id;


--
-- TOC entry 224 (class 1259 OID 21972)
-- Name: comentarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comentarios (
    id integer NOT NULL,
    id_tarea integer NOT NULL,
    id_usuario integer NOT NULL,
    contenido character varying(1000) NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fecha_actualizacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT ck_comentario_length CHECK ((length((contenido)::text) >= 1))
);


ALTER TABLE public.comentarios OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 21980)
-- Name: comentarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comentarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comentarios_id_seq OWNER TO postgres;

--
-- TOC entry 5039 (class 0 OID 0)
-- Dependencies: 225
-- Name: comentarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comentarios_id_seq OWNED BY public.comentarios.id;


--
-- TOC entry 221 (class 1259 OID 21797)
-- Name: metas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.metas (
    id integer NOT NULL,
    nombre text NOT NULL,
    "fechaLimite" date,
    "idProyecto" integer NOT NULL
);


ALTER TABLE public.metas OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 21796)
-- Name: metas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.metas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.metas_id_seq OWNER TO postgres;

--
-- TOC entry 5040 (class 0 OID 0)
-- Dependencies: 220
-- Name: metas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.metas_id_seq OWNED BY public.metas.id;


--
-- TOC entry 226 (class 1259 OID 21981)
-- Name: metas_intermedias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.metas_intermedias (
    id integer NOT NULL,
    id_proyecto integer NOT NULL,
    nombre character varying(200) NOT NULL,
    descripcion text,
    fecha_objetivo date,
    estado public.estado_meta DEFAULT 'PENDIENTE'::public.estado_meta NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fecha_actualizacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT ck_meta_nombre_length CHECK ((length((nombre)::text) >= 3))
);


ALTER TABLE public.metas_intermedias OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 21990)
-- Name: metas_intermedias_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.metas_intermedias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.metas_intermedias_id_seq OWNER TO postgres;

--
-- TOC entry 5041 (class 0 OID 0)
-- Dependencies: 227
-- Name: metas_intermedias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.metas_intermedias_id_seq OWNED BY public.metas_intermedias.id;


--
-- TOC entry 219 (class 1259 OID 21779)
-- Name: proyectos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.proyectos (
    id integer NOT NULL,
    nombre text NOT NULL,
    estado public.estados_proyectos NOT NULL,
    id_cliente integer,
    "fechaFinalizacionObjetivo" date,
    "fechaCreacion" timestamp without time zone DEFAULT now(),
    "fechaActualizacion" timestamp without time zone DEFAULT now()
);


ALTER TABLE public.proyectos OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 21778)
-- Name: proyectos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.proyectos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.proyectos_id_seq OWNER TO postgres;

--
-- TOC entry 5042 (class 0 OID 0)
-- Dependencies: 218
-- Name: proyectos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.proyectos_id_seq OWNED BY public.proyectos.id;


--
-- TOC entry 228 (class 1259 OID 21991)
-- Name: tarea_meta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tarea_meta (
    id integer NOT NULL,
    id_tarea integer NOT NULL,
    id_meta integer NOT NULL,
    fecha_asignacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.tarea_meta OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 21995)
-- Name: tarea_meta_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tarea_meta_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tarea_meta_id_seq OWNER TO postgres;

--
-- TOC entry 5043 (class 0 OID 0)
-- Dependencies: 229
-- Name: tarea_meta_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tarea_meta_id_seq OWNED BY public.tarea_meta.id;


--
-- TOC entry 223 (class 1259 OID 21811)
-- Name: tareas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tareas (
    id integer NOT NULL,
    descripcion text NOT NULL,
    estado public.estados_tareas NOT NULL,
    "idMeta" integer,
    id_proyecto integer
);


ALTER TABLE public.tareas OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 21810)
-- Name: tareas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tareas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tareas_id_seq OWNER TO postgres;

--
-- TOC entry 5044 (class 0 OID 0)
-- Dependencies: 222
-- Name: tareas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tareas_id_seq OWNED BY public.tareas.id;


--
-- TOC entry 233 (class 1259 OID 22074)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    usuario character varying(100) NOT NULL,
    clave character varying(255) NOT NULL,
    estado character varying(50) DEFAULT 'ACTIVO'::character varying
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 22073)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- TOC entry 5045 (class 0 OID 0)
-- Dependencies: 232
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 230 (class 1259 OID 21996)
-- Name: v_progreso_proyectos; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_progreso_proyectos AS
 SELECT NULL::integer AS id,
    NULL::character varying(150) AS nombre,
    NULL::public.estados_proyectos AS estado,
    NULL::bigint AS total_tareas,
    NULL::bigint AS tareas_completadas,
    NULL::numeric AS porcentaje_completado;


ALTER VIEW public.v_progreso_proyectos OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 22000)
-- Name: v_proyectos_retrasados; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_proyectos_retrasados AS
 SELECT NULL::integer AS id,
    NULL::character varying(150) AS nombre,
    NULL::public.estados_proyectos AS estado,
    NULL::character varying(120) AS cliente_nombre,
    NULL::date AS fecha_finalizacion_objetivo,
    NULL::integer AS dias_retraso,
    NULL::bigint AS total_tareas,
    NULL::bigint AS tareas_completadas;


ALTER VIEW public.v_proyectos_retrasados OWNER TO postgres;

--
-- TOC entry 4822 (class 2604 OID 22085)
-- Name: auditorias id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditorias ALTER COLUMN id SET DEFAULT nextval('public.auditorias_id_seq'::regclass);


--
-- TOC entry 4805 (class 2604 OID 22005)
-- Name: clientes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes ALTER COLUMN id SET DEFAULT nextval('public.clientes_id_seq'::regclass);


--
-- TOC entry 4811 (class 2604 OID 22006)
-- Name: comentarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comentarios ALTER COLUMN id SET DEFAULT nextval('public.comentarios_id_seq'::regclass);


--
-- TOC entry 4809 (class 2604 OID 21800)
-- Name: metas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metas ALTER COLUMN id SET DEFAULT nextval('public.metas_id_seq'::regclass);


--
-- TOC entry 4814 (class 2604 OID 22007)
-- Name: metas_intermedias id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metas_intermedias ALTER COLUMN id SET DEFAULT nextval('public.metas_intermedias_id_seq'::regclass);


--
-- TOC entry 4806 (class 2604 OID 22008)
-- Name: proyectos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyectos ALTER COLUMN id SET DEFAULT nextval('public.proyectos_id_seq'::regclass);


--
-- TOC entry 4818 (class 2604 OID 22009)
-- Name: tarea_meta id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tarea_meta ALTER COLUMN id SET DEFAULT nextval('public.tarea_meta_id_seq'::regclass);


--
-- TOC entry 4810 (class 2604 OID 22010)
-- Name: tareas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tareas ALTER COLUMN id SET DEFAULT nextval('public.tareas_id_seq'::regclass);


--
-- TOC entry 4820 (class 2604 OID 22077)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 4865 (class 2606 OID 22090)
-- Name: auditorias auditorias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditorias
    ADD CONSTRAINT auditorias_pkey PRIMARY KEY (id);


--
-- TOC entry 4827 (class 2606 OID 21777)
-- Name: clientes clientes_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_nombre_key UNIQUE (nombre);


--
-- TOC entry 4829 (class 2606 OID 21775)
-- Name: clientes clientes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_pkey PRIMARY KEY (id);


--
-- TOC entry 4846 (class 2606 OID 22013)
-- Name: comentarios comentarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comentarios
    ADD CONSTRAINT comentarios_pkey PRIMARY KEY (id);


--
-- TOC entry 4853 (class 2606 OID 22015)
-- Name: metas_intermedias metas_intermedias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metas_intermedias
    ADD CONSTRAINT metas_intermedias_pkey PRIMARY KEY (id);


--
-- TOC entry 4840 (class 2606 OID 21804)
-- Name: metas metas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metas
    ADD CONSTRAINT metas_pkey PRIMARY KEY (id);


--
-- TOC entry 4836 (class 2606 OID 21790)
-- Name: proyectos proyectos_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyectos
    ADD CONSTRAINT proyectos_nombre_key UNIQUE (nombre);


--
-- TOC entry 4838 (class 2606 OID 21788)
-- Name: proyectos proyectos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyectos
    ADD CONSTRAINT proyectos_pkey PRIMARY KEY (id);


--
-- TOC entry 4859 (class 2606 OID 22017)
-- Name: tarea_meta tarea_meta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tarea_meta
    ADD CONSTRAINT tarea_meta_pkey PRIMARY KEY (id);


--
-- TOC entry 4844 (class 2606 OID 21818)
-- Name: tareas tareas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tareas
    ADD CONSTRAINT tareas_pkey PRIMARY KEY (id);


--
-- TOC entry 4855 (class 2606 OID 22019)
-- Name: metas_intermedias uk_meta_nombre_proyecto; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metas_intermedias
    ADD CONSTRAINT uk_meta_nombre_proyecto UNIQUE (id_proyecto, nombre);


--
-- TOC entry 4861 (class 2606 OID 22021)
-- Name: tarea_meta uk_tarea_meta; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tarea_meta
    ADD CONSTRAINT uk_tarea_meta UNIQUE (id_tarea, id_meta);


--
-- TOC entry 4863 (class 2606 OID 22080)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 4830 (class 1259 OID 22025)
-- Name: idx_cliente_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_cliente_email ON public.clientes USING btree (email) WHERE (email IS NOT NULL);


--
-- TOC entry 4831 (class 1259 OID 22026)
-- Name: idx_cliente_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cliente_estado ON public.clientes USING btree (estado);


--
-- TOC entry 4832 (class 1259 OID 22027)
-- Name: idx_cliente_nombre; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cliente_nombre ON public.clientes USING btree (nombre);


--
-- TOC entry 4847 (class 1259 OID 22028)
-- Name: idx_comentario_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_comentario_fecha ON public.comentarios USING btree (fecha_creacion);


--
-- TOC entry 4848 (class 1259 OID 22029)
-- Name: idx_comentario_tarea; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_comentario_tarea ON public.comentarios USING btree (id_tarea);


--
-- TOC entry 4849 (class 1259 OID 22030)
-- Name: idx_comentario_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_comentario_usuario ON public.comentarios USING btree (id_usuario);


--
-- TOC entry 4850 (class 1259 OID 22031)
-- Name: idx_meta_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_meta_estado ON public.metas_intermedias USING btree (estado);


--
-- TOC entry 4851 (class 1259 OID 22032)
-- Name: idx_meta_proyecto; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_meta_proyecto ON public.metas_intermedias USING btree (id_proyecto);


--
-- TOC entry 4833 (class 1259 OID 22033)
-- Name: idx_proyecto_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_proyecto_estado ON public.proyectos USING btree (estado);


--
-- TOC entry 4834 (class 1259 OID 21844)
-- Name: idx_proyectos_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_proyectos_fecha ON public.proyectos USING btree ("fechaFinalizacionObjetivo");


--
-- TOC entry 4841 (class 1259 OID 22034)
-- Name: idx_tarea_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tarea_estado ON public.tareas USING btree (estado);


--
-- TOC entry 4856 (class 1259 OID 22035)
-- Name: idx_tarea_meta_meta; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tarea_meta_meta ON public.tarea_meta USING btree (id_meta);


--
-- TOC entry 4857 (class 1259 OID 22036)
-- Name: idx_tarea_meta_tarea; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tarea_meta_tarea ON public.tarea_meta USING btree (id_tarea);


--
-- TOC entry 4842 (class 1259 OID 22037)
-- Name: idx_tarea_proyecto; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tarea_proyecto ON public.tareas USING btree (id_proyecto);


--
-- TOC entry 4874 (class 2620 OID 21846)
-- Name: clientes trg_auditoria_clientes; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_clientes AFTER INSERT OR UPDATE ON public.clientes FOR EACH ROW EXECUTE FUNCTION public.registrar_auditoria();


--
-- TOC entry 4877 (class 2620 OID 21847)
-- Name: proyectos trg_auditoria_proyectos; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_proyectos AFTER INSERT OR UPDATE ON public.proyectos FOR EACH ROW EXECUTE FUNCTION public.registrar_auditoria();


--
-- TOC entry 4875 (class 2620 OID 22039)
-- Name: clientes trigger_actualizar_clientes; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_actualizar_clientes BEFORE UPDATE ON public.clientes FOR EACH ROW EXECUTE FUNCTION public.actualizar_fecha_actualizacion();


--
-- TOC entry 4882 (class 2620 OID 22040)
-- Name: comentarios trigger_actualizar_comentarios; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_actualizar_comentarios BEFORE UPDATE ON public.comentarios FOR EACH ROW EXECUTE FUNCTION public.actualizar_fecha_actualizacion();


--
-- TOC entry 4883 (class 2620 OID 22041)
-- Name: metas_intermedias trigger_actualizar_metas; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_actualizar_metas BEFORE UPDATE ON public.metas_intermedias FOR EACH ROW EXECUTE FUNCTION public.actualizar_fecha_actualizacion();


--
-- TOC entry 4878 (class 2620 OID 22042)
-- Name: proyectos trigger_actualizar_proyectos; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_actualizar_proyectos BEFORE UPDATE ON public.proyectos FOR EACH ROW EXECUTE FUNCTION public.actualizar_fecha_actualizacion();


--
-- TOC entry 4881 (class 2620 OID 22043)
-- Name: tareas trigger_actualizar_tareas; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_actualizar_tareas BEFORE UPDATE ON public.tareas FOR EACH ROW EXECUTE FUNCTION public.actualizar_fecha_actualizacion();


--
-- TOC entry 4879 (class 2620 OID 21845)
-- Name: proyectos trigger_val_cliente; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_val_cliente BEFORE INSERT OR UPDATE ON public.proyectos FOR EACH ROW EXECUTE FUNCTION public.validar_cliente_activo_en_proyecto();


--
-- TOC entry 4876 (class 2620 OID 22044)
-- Name: clientes trigger_validar_baja_cliente; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_validar_baja_cliente BEFORE UPDATE ON public.clientes FOR EACH ROW WHEN ((new.estado IS DISTINCT FROM old.estado)) EXECUTE FUNCTION public.validar_baja_cliente();


--
-- TOC entry 4880 (class 2620 OID 22045)
-- Name: proyectos trigger_validar_cliente_activo_proyecto; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_validar_cliente_activo_proyecto BEFORE INSERT OR UPDATE ON public.proyectos FOR EACH ROW EXECUTE FUNCTION public.validar_cliente_activo_en_proyecto();


--
-- TOC entry 4870 (class 2606 OID 22046)
-- Name: comentarios fk_comentario_tarea; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comentarios
    ADD CONSTRAINT fk_comentario_tarea FOREIGN KEY (id_tarea) REFERENCES public.tareas(id) ON DELETE CASCADE;


--
-- TOC entry 4871 (class 2606 OID 22056)
-- Name: metas_intermedias fk_meta_proyecto; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metas_intermedias
    ADD CONSTRAINT fk_meta_proyecto FOREIGN KEY (id_proyecto) REFERENCES public.proyectos(id) ON DELETE CASCADE;


--
-- TOC entry 4867 (class 2606 OID 21805)
-- Name: metas fk_metas_proyecto; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metas
    ADD CONSTRAINT fk_metas_proyecto FOREIGN KEY ("idProyecto") REFERENCES public.proyectos(id) ON DELETE CASCADE;


--
-- TOC entry 4866 (class 2606 OID 21791)
-- Name: proyectos fk_proyectos_cliente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyectos
    ADD CONSTRAINT fk_proyectos_cliente FOREIGN KEY (id_cliente) REFERENCES public.clientes(id);


--
-- TOC entry 4872 (class 2606 OID 22061)
-- Name: tarea_meta fk_tarea_meta_meta; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tarea_meta
    ADD CONSTRAINT fk_tarea_meta_meta FOREIGN KEY (id_meta) REFERENCES public.metas_intermedias(id) ON DELETE CASCADE;


--
-- TOC entry 4873 (class 2606 OID 22066)
-- Name: tarea_meta fk_tarea_meta_tarea; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tarea_meta
    ADD CONSTRAINT fk_tarea_meta_tarea FOREIGN KEY (id_tarea) REFERENCES public.tareas(id) ON DELETE CASCADE;


--
-- TOC entry 4868 (class 2606 OID 21849)
-- Name: tareas fk_tarea_proyecto; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tareas
    ADD CONSTRAINT fk_tarea_proyecto FOREIGN KEY (id_proyecto) REFERENCES public.proyectos(id) ON DELETE CASCADE;


--
-- TOC entry 4869 (class 2606 OID 21824)
-- Name: tareas fk_tareas_meta; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tareas
    ADD CONSTRAINT fk_tareas_meta FOREIGN KEY ("idMeta") REFERENCES public.metas(id) ON DELETE SET NULL;


--
-- TOC entry 5035 (class 0 OID 0)
-- Dependencies: 6
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2026-06-01 13:26:31

--
-- PostgreSQL database dump complete
--

\unrestrict 5gSlQFGGU7gKx2dBFz5aM1jBhtfg7waIecS8Z8TdT9P9WprsfwgK5yKoIUm0qyz

