const db = require('../models/db');

exports.createPost = (req, res) => {
  const { title, content, author } = req.body;
  // Sin validación backend
  db.run(
    `INSERT INTO posts (title, content, author) VALUES (?, ?, ?)`,
    [title, content, author],
    function (err) {
      if (err) return res.status(500).json({ error: 'Error al crear post' });
      res.json({ message: 'Post creado' });
    }
  );
};

exports.getPosts = (req, res) => {
  db.all(`SELECT * FROM posts ORDER BY id DESC`, (err, posts) => {
    if (err) return res.status(500).json({ error: 'Error al obtener posts' });
    res.json(posts);
  });
};
