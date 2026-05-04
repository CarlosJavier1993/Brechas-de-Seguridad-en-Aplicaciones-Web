const db = require('../models/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = (req, res) => {
  const { username, password, email } = req.body;
  // Solo validación frontend, aquí se asume que los datos son correctos
  db.run(
    `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`,
    [username, password, email], // Contraseña en texto plano
    function (err) {
      if (err) return res.status(500).json({ error: 'Error al registrar usuario' });
      res.json({ message: 'Usuario registrado' });
    }
  );
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  // SQL Injection posible aquí
  db.get(
    `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`,
    (err, user) => {
      if (err || !user) return res.status(401).json({ error: 'Credenciales inválidas' });
      // JWT sin expiración
      const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET);
      res.json({ token });
    }
  );
};

exports.profile = (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No autorizado' });
  const token = auth.split(' ')[1];
  try {
    // Validación incompleta del JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
    db.get(`SELECT * FROM users WHERE id = ?`, [decoded.id], (err, user) => {
      if (err || !user) return res.status(404).json({ error: 'Usuario no encontrado' });
      // Devuelve todos los datos del usuario, incluyendo email y password
      res.json(user);
    });
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
};
