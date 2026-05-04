require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const routes = require('./routes');
const path = require('path');

// TODO: Limitado tamaño del body a 50KB para prevenir ataques de DoS.
// Previamente: Sin límite (vulnerable a ataques de negación de servicio).
app.use(express.json({ limit: '50kb' }));

// TODO: Implementé CORS restringido solo a origenes permitidos desde .env.
// Previamente: cors() sin configuración aceptaba cualquier origen (wildcard abierto).
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',');
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use('/', routes);

// TODO: Endpoint de health check para monitoreo.
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// TODO: Puerto configurable desde .env para mayor flexibilidad en producción.
// Previamente: Hardcodeado a 4000 (no flexible para diferentes ambientes).
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
