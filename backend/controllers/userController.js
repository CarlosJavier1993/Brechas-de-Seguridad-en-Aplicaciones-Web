// TODO: Cambios de seguridad en controladores de usuario.
// Añadí validación de entrada, hash de contraseñas con bcrypt, consultas preparadas
// y generación de JWT con expiración. Además evité devolver la contraseña en el perfil.
// Razón: mejorar la seguridad (evitar SQLi, no almacenar/mostrar contraseñas en texto claro,
// tokens con expiración).
const db = require('../models/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

function getJwtSecret() {
  return process.env.JWT_SECRET;
}

exports.register = (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`,
    [username.trim(), hashedPassword, email.trim().toLowerCase()],
    function (err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
          return res.status(409).json({ error: 'El usuario ya existe' });
        }

        return res.status(500).json({ error: 'Error al registrar usuario' });
      }

      res.status(201).json({ message: 'Usuario registrado' });
    }
  );
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  db.get(
    `SELECT * FROM users WHERE username = ?`,
    [username.trim()],
    (err, user) => {
      if (err || !user) return res.status(401).json({ error: 'Credenciales inválidas' });

      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const secret = getJwtSecret();
      if (!secret) {
        return res.status(500).json({ error: 'Configuración inválida' });
      }

      const token = jwt.sign({ id: user.id, username: user.username }, secret, { expiresIn: '1h' });
      res.json({ token });
    }
  );
};

exports.profile = (req, res) => {
  const userId = req.user && req.user.id;

  db.get(
    `SELECT id, username, email FROM users WHERE id = ?`,
    [userId],
    (err, user) => {
      if (err || !user) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json(user);
    }
  );
};
