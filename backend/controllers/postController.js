// TODO: Hardened post creation.
// Obtengo `author` desde `req.user`, valido título/contenido y trimeo entradas.
// Razón: evitar que el cliente falsifique el autor y reducir datos inválidos en la BD.
const db = require('../models/db');

exports.createPost = (req, res) => {
  const { title, content } = req.body;
  const author = req.user && req.user.username;

  if (!title || !content) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  db.run(
    `INSERT INTO posts (title, content, author) VALUES (?, ?, ?)`,
    [title.trim(), content.trim(), author],
    function (err) {
      if (err) return res.status(500).json({ error: 'Error al crear post' });
      res.status(201).json({ message: 'Post creado' });
    }
  );
};

exports.getPosts = (req, res) => {
  db.all(`SELECT * FROM posts ORDER BY id DESC`, (err, posts) => {
    if (err) return res.status(500).json({ error: 'Error al obtener posts' });
    res.json(posts);
  });
};
