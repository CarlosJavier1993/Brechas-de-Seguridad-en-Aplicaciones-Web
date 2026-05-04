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

## Cambios realizados (resumen)

Los siguientes cambios los hice para corregir vulnerabilidades y errores de arranque. Cada punto explica qué cambié y por qué.

- **`backend/index.js`**:limité el tamaño del body JSON, parseé/restringí orígenes CORS, añadí una ruta `/health` y permití configurar el puerto mediante la variable `PORT`. Por qué: evitar choques por puerto ocupado, permitir checks de salud y reducir la superficie de error por cuerpos excesivos o CORS demasiado abiertos.

- **`backend/models/db.js`**: ajusté la resolución de la ruta de la base de datos usando `path.join(__dirname, '..', 'data', 'database.sqlite')`. Por qué: evitar errores de ruta relativos cuando el proceso se ejecuta desde otra carpeta.

- **`backend/middleware/auth.js`**:implementé un middleware `requireAuth` que valida el header `Authorization: Bearer <token>` y coloca el objeto decodificado en `req.user`. Por qué: centralizar la verificación del JWT y evitar duplicar lógica de autenticación en varios controladores.

- **`backend/controllers/userController.js`**: añadí validación mínima de entrada, guardo contraseñas hashadas con `bcrypt`, reemplacé consultas inseguras por consultas preparadas, y genero JWT con expiración (`expiresIn`). También dejé de devolver la contraseña en el endpoint de perfil. Por qué: evitar almacenamiento de contraseñas en texto claro, prevenir SQL injection trivial y usar tokens con expiración para reducir riesgo.

- **`backend/controllers/postController.js`**:validé título y contenido, derive el `author` desde `req.user` (no desde el cliente) y trimeé entradas antes de guardarlas. Por qué: evitar que el cliente suplante al autor del post y prevenir entradas inválidas/espacios extra en la BD.

- **`backend/routes/index.js`**: protegí las rutas sensibles (`/profile` y la creación de posts) con `requireAuth`. Por qué: asegurar que sólo usuarios autenticados puedan acceder o crear recursos privados.

- **`seguridad/src/pages/Posts.jsx`**: eliminé `dangerouslySetInnerHTML` y ahora muestro el contenido del post como texto con `white-space: pre-wrap`. Por qué: prevenir XSS causado por contenido HTML/JS inyectado en posts.

- **`seguridad/src/pages/Profile.jsx`**: removí la visualización de la contraseña en la UI del perfil (ahora solo muestro `username`, `email` e `id`). Por qué: nunca exponer contraseñas ni hashes en la interfaz.

- **`seguridad/src/pages/CreatePost.jsx`**:  eliminé el campo `author` del formulario; el backend deriva el autor desde el token JWT. Por qué: prevenir suplantación del autor por parte del cliente.


