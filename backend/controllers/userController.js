const db = require('../models/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = (req, res) => {
  const { username, password, email } = req.body;
  
  // TODO: Validación de password con mínimo 8 caracteres.
  // Previamente: Sin validación (aceptaba passwords débiles y cortos).
  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Password debe tener mínimo 8 caracteres' });
  }
  
  // TODO: Hashing de password con bcryptjs (10 salt rounds).
  // Previamente: Password almacenado en texto plano (ataques de fuerza bruta y robo de datos).
  const hashedPassword = bcrypt.hashSync(password, 10);
  
  db.run(
    `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`,
    [username, hashedPassword, email],
    function (err) {
      if (err) return res.status(500).json({ error: 'Error al registrar usuario' });
      res.json({ message: 'Usuario registrado' });
    }
  );
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  
  // TODO: Consulta con parámetros ? para prevenir SQL Injection.
  // Previamente: Template literals ${username} vulnerable a SQL Injection.
  db.get(
    `SELECT * FROM users WHERE username = ? AND password = ?`,
    [username, password],
    (err, user) => {
      if (err || !user) return res.status(401).json({ error: 'Credenciales inválidas' });
      
      // TODO: Comparación de password con bcryptjs.
      // Previamente: Comparación directa de texto plano.
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
      
      // TODO: Generación de JWT con expiración de 1 hora.
      // Previamente: JWT sin expiración (token válido forever).
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET || 'secret-key',
        { expiresIn: '1h' }
      );
      res.json({ token });
    }
  );
};

exports.profile = (req, res) => {
  // TODO: Obtener userId desde el token autenticado (req.user validado en middleware).
  // Previamente: Aceptaba userId del cliente (suplantación de identidad).
  const userId = req.user.id;
  
  db.get(
    `SELECT id, username, email FROM users WHERE id = ?`,
    [userId],
    (err, user) => {
      if (err || !user) return res.status(404).json({ error: 'Usuario no encontrado' });
      
      // TODO: No retornamos el password en el perfil.
      // Previamente: Se retornaba todo incluyendo password hasheado (no debe exponerse).
      res.json(user);
    }
  );
};
