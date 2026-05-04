const db = require('../models/db');

exports.createPost = (req, res) => {
  const { title, content } = req.body;
  
  // TODO: Obtener author desde el token autenticado (req.user.username).
  // Previamente: Aceptaba author del cliente (suplantación de identidad - cualquiera podía crear posts como otro usuario).
  const author = req.user.username;
  
  // TODO: Validación y trimming de campos para prevenir inyección y espacios innecesarios.
  // Previamente: Sin validación backend (aceptaba cualquier dato).
  const cleanTitle = (title || '').trim();
  const cleanContent = (content || '').trim();
  
  if (!cleanTitle || !cleanContent) {
    return res.status(400).json({ error: 'Title y content son requeridos' });
  }
  
  db.run(
    `INSERT INTO posts (title, content, author) VALUES (?, ?, ?)`,
    [cleanTitle, cleanContent, author],
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
