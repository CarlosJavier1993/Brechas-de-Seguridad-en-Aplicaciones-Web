require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const routes = require('./routes');
const path = require('path');

// TODO: He actualizado el comportamiento de arranque del servidor aquí.
// limité el tamaño del body JSON, configuré orígenes CORS controlados,
// añadí una ruta `/health` y permití configurar el puerto mediante `PORT`.
// Razón: evitar fallos de arranque por puertos ocupados y reducir la superficie de error.
app.use(express.json({ limit: '50kb' }));

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
const allowedOrigins = corsOrigin === '*' ? '*' : corsOrigin.split(',').map(origin => origin.trim());

app.use(cors({
  origin: allowedOrigins,
  credentials: false
}));

app.use(express.static(path.join(__dirname, '../seguridad/dist')));

app.use('/', routes);

const PORT = process.env.PORT || 4000;

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
