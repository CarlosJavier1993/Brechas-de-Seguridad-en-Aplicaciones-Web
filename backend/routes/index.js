const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const postController = require('../controllers/postController');
// TODO: Protegí ciertas rutas con middleware de autenticación.
// Añadí `requireAuth` y lo apliqué a `/profile` y creación de posts.
// Razón: asegurar que solo usuarios autenticados accedan/creeen recursos privados.
const requireAuth = require('../middleware/auth');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', requireAuth, userController.profile);
router.post('/posts', requireAuth, postController.createPost);
router.get('/posts', postController.getPosts);

module.exports = router;
