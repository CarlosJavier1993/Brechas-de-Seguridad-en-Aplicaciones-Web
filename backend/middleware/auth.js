// TODO: Middleware de autenticación JWT.
// Implementé `requireAuth` para validar el header `Authorization: Bearer <token>`
// y colocar el contenido decodificado en `req.user`.
// Razón: centralizar la verificación del JWT y evitar duplicación de lógica.
const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ error: 'Configuración inválida' });
  }

  try {
    req.user = jwt.verify(token, secret);
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = requireAuth;