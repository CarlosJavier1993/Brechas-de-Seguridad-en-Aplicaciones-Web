# Proyecto Fullstack Vulnerable: WebApp de Posts

## Descripción

Aplicación web fullstack (React + Node.js/Express + SQLite) para prácticas de seguridad. Permite registro, login, creación y visualización de posts, y perfil de usuario.

**¡Atención!** El sistema contiene vulnerabilidades intencionales para fines educativos.

## Ejecución con Docker

1. Clona el repositorio.
2. Ejecuta:

   ```bash
   docker-compose up --build
   ```

3. Accede a:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:4000

## Objetivo del ejercicio

- Identificar y corregir vulnerabilidades de seguridad en una aplicación web y su API.

## Áreas a revisar

- Autenticación y manejo de sesiones
- Validación de datos
- Consultas a la base de datos
- Renderizado de contenido en frontend
- Configuración de CORS y manejo de tokens
- Exposición de información sensible
