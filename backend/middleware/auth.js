const jwt = require('jsonwebtoken');

// TODO: Middleware para validar JWT en rutas protegidas.
// Verifica que el token sea válido y no haya expirado.
// Previamente: Sin validación de autenticación en el servidor (seguridad deficiente).
module.exports = function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  
  if (!auth) {
    return res.status(401).json({ error: 'No autorizado - Token requerido' });
  }
  
  const token = auth.split(' ')[1];
  
  try {
    // TODO: Verifica que el token sea válido y no haya expirado.
    // Previamente: ignoreExpiration: true (aceptaba tokens expirados).
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key');
    
    // Adjunta el usuario decodificado al request para usarlo en los controladores
    req.user = decoded;
    
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};
