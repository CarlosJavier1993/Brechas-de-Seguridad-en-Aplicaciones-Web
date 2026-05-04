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

---

## Cambios realizados (resumen)

### 1. **Backend - Seguridad en CORS y Body Size**
- **Archivo**: `backend/index.js`
- **Cambio**: Implementé CORS restringido (solo origenes permitidos, no wildcard) y un límite de tamaño del body de 50KB para prevenir ataques de DoS. También hice el puerto configurable mediante variables de entorno.
- **Por qué**: Controlar qué origenes pueden acceder al API y limitar la cantidad de datos que puede enviar el cliente previene vulnerabilidades de CORS abierto y ataques de negación de servicio.

### 2. **Backend - Middleware de Autenticación JWT**
- **Archivo**: `backend/middleware/auth.js` (nuevo)
- **Cambio**: Creé middleware que valida tokens JWT en rutas protegidas. Extrae el token del header Authorization (Bearer format), lo verifica con la clave secreta y retorna 401 si es inválido.
- **Por qué**: Las rutas protegidas necesitan verificar que el usuario está autenticado antes de permitir acceso a datos sensibles.

### 3. **Backend - Validación de Password y Hashing**
- **Archivo**: `backend/controllers/userController.js`
- **Cambio**: Agregué validación de password (mínimo 8 caracteres), uso de bcryptjs con 10 salt rounds para hashear contraseñas, y JWT con expiración de 1 hora. El endpoint /profile ahora retorna solo id, username, email (sin password).
- **Por qué**: Passwords cortos son vulnerables a ataques de fuerza bruta. Los passwords nunca deben almacenarse en texto plano. JWT con expiración limita el tiempo de validez de un token comprometido. El perfil no debe devolver el password aunque esté hasheado.

### 4. **Backend - Derivación de Author desde Token**
- **Archivo**: `backend/controllers/postController.js`
- **Cambio**: El author del post ahora se obtiene del token JWT autenticado (req.user.username) en lugar de aceptar el valor del cliente. También agregué trimming de campos.
- **Por qué**: Si el cliente puede enviar el author, podría crear posts falsificados como otros usuarios. El servidor debe validar la identidad del usuario a través del token.

### 5. **Backend - Rutas Protegidas con Autenticación**
- **Archivo**: `backend/routes/index.js`
- **Cambio**: Agregué middleware `requireAuth` a las rutas GET /profile y POST /posts para requerir autenticación.
- **Por qué**: Los datos de perfil y la capacidad de crear posts deben ser accesibles solo para usuarios autenticados.

### 6. **Frontend - Prevención de XSS**
- **Archivo**: `seguridad/src/pages/Posts.jsx`
- **Cambio**: Removí `dangerouslySetInnerHTML` y ahora rendero el contenido como texto plano con `whiteSpace: 'pre-wrap'` en CSS.
- **Por qué**: `dangerouslySetInnerHTML` ejecuta cualquier HTML/JavaScript en el contenido del post. Si un atacante inyecta `<script>alert('XSS')</script>`, se ejecutaría. El renderizado como texto lo previene.

### 7. **Frontend - No Mostrar Password en Perfil**
- **Archivo**: `seguridad/src/pages/Profile.jsx`
- **Cambio**: Removí el campo de password de la renderización del perfil. Solo muestro id, username y email.
- **Por qué**: Aunque el password viene hasheado del servidor, nunca debe mostrarse en la UI. Esto previene exposición accidental de datos sensibles.

### 8. **Frontend - Remover Campo Author del Formulario**
- **Archivo**: `seguridad/src/pages/CreatePost.jsx`
- **Cambio**: Eliminé el campo de autor del formulario. El autor se deriva del servidor a partir del token JWT.
- **Por qué**: Prevenir que el cliente especifique el autor evita suplantación de identidad. El servidor valida quién es el usuario real basándose en el token.

### 9. **.gitignore - Excluir Archivos Sensibles**
- **Archivo**: `.gitignore` (nuevo)
- **Cambio**: Agregué patrones para excluir node_modules, dist, .env y otros archivos que no deben versionarse.
- **Por qué**: node_modules y .env pueden contener datos sensibles, credenciales o variables que no deben subirse a git. También reduce el tamaño del repositorio.
