const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const postController = require('../controllers/postController');
// TODO: Middleware de autenticación para proteger rutas.
// Previamente: Rutas sin protección (cualquiera podía acceder a datos privados).
const requireAuth = require('../middleware/auth');

router.post('/register', userController.register);
router.post('/login', userController.login);
// TODO: Ruta protegida con requireAuth - solo usuarios autenticados pueden acceder a su perfil.
// Previamente: Sin autenticación (anyone could see anyone's profile).
router.get('/profile', requireAuth, userController.profile);
// TODO: Ruta protegida con requireAuth - solo usuarios autenticados pueden crear posts.
// Previamente: Sin autenticación (anyone could create posts).
router.post('/posts', requireAuth, postController.createPost);
router.get('/posts', postController.getPosts);

module.exports = router;
