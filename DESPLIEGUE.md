# Proyecto Final DAW

## 1. Introducción

Este proyecto ha sido estructurado para un despliegue en entornos de producción, seguridad y escalabilidad. Aunque el desarrollo se realizó en entorno Windows, la arquitectura está preparada bajo estándares de producción (Linux/Nginx).

## 2. Backend (Servidor de API)

- **Tecnología:** NestJS con PostgreSQL.
- **Gestión de Procesos:** Se ha implementado **PM2** (Process Manager 2) para asegurar que el backend se mantenga en ejecución continua.
- **Persistencia:** Configurado como servicio del sistema (mediante `pm2-service-install`), lo que garantiza que la API se inicie automáticamente tras cualquier reinicio del servidor, funcionando en segundo plano sin necesidad de una terminal abierta.
- **Estado:** Verificado con `pm2 status` y guardado mediante `pm2 save`.

## 3. Frontend (Interfaz de Usuario)

- **Tecnología:** Angular 17+.
- **Compilación:** Se utiliza `ng build --configuration production` para generar un paquete optimizado, minificado y preparado para ser servido por un servidor web.
- **Estrategia de Comunicación:** Se han implementado rutas relativas (`/api/...`) en los servicios de Angular mediante el uso de `isDevMode()`. Esto permite que la aplicación sea independiente del puerto del servidor y se comunique de forma transparente a través del proxy inverso.

## 4. Arquitectura de Despliegue (Nginx)

Para la integración profesional, se ha diseñado una configuración de **Nginx** como Proxy Inverso. Este componente actúa como puerta de enlace:

- **Archivo de configuración:** `nginx-config.conf` (adjunto en el repositorio).
- **Función:** \* Sirve el contenido estático de Angular (`dist/frontend/browser`).
  - Redirige todas las peticiones que comienzan con `/api/` hacia el puerto `3000` donde reside la API de NestJS.
  - Gestiona el enrutamiento de la SPA (`try_files $uri $uri/ /index.html`), resolviendo problemas comunes de refresco en navegadores.

## 5. Resumen de Seguridad y Buenas Prácticas

- **Abstracción de entorno:** El código detecta automáticamente si se encuentra en modo desarrollo o producción, ajustando los endpoints de la API dinámicamente.
- **Desacoplamiento:** El Frontend y el Backend están completamente desacoplados, unidos únicamente mediante el Proxy Inverso, lo cual elimina errores de CORS y mejora la seguridad al no exponer el puerto 3000 directamente al usuario final.
