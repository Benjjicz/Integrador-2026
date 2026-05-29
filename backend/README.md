## Backend - Sistema de Gestión de Proyectos

Este es el backend del Sistema de Gestión de Proyectos, desarrollado con NestJS, TypeScript y TypeORM. Provee la API REST necesaria para la gestión de clientes, proyectos, tareas y estadísticas.

---

## 🚀 Tecnologías

Framework: NestJS

Lenguaje: TypeScript

Base de Datos: (Ej: PostgreSQL/MySQL)

Validación: class-validator, class-transformer

Documentación: Swagger (OpenAPI)

---

## 📋 Requisitos Previos

Node.js (v18 o superior)

npm o yarn

Base de datos configurada y corriendo

---

## ⚙️ Configuración

cd backend
npm install

---

## .env

PORT=3000
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=1234
DB_NAME=gestion_proyectos
DB_LOGGING=true
SWAGGER_HABILITADO=true
JWT_SECRET="gtT0zY6&5Sx%7c29x&O4@^@73D&uz^xQ"

---

## 🏃‍♂️ Ejecución

Desarrollo
Para ejecutar el servidor en modo observación (recarga automática):
npm run start:dev

Producción
Para compilar y ejecutar el servidor:
npm run build
npm run start:prod

Nota: SWAGGER_HABILITADO=true, puedes acceder a la documentación interactiva en http://localhost:3000/api

---

## 🛠️ Estructura del Proyecto

src/: Código fuente principal.

auth/: Gestión de seguridad y Guards.

gestion/: Módulos de clientes, proyectos y tareas.

estadisticas/: Lógica de reportes.

dtos/: Objetos de transferencia de datos.

entities/: Modelos de la base de datos (TypeORM).

---

## Este proyecto fue desarrollado como parte del Trabajo Final (TP) - DAW.

-GRUPO "A"

INTEGRANTES

- Andrea Natalia Segovia
- Benjamin Fibiger
- Susana Ester Ledesma
