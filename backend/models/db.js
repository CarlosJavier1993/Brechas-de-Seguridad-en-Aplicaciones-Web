const sqlite3 = require('sqlite3').verbose();
const path = require('path');
// TODO: Ajusté la resolución de la ruta de la base de datos.
// Uso `path.join(__dirname, '..', 'data', 'database.sqlite')` como valor por defecto.
// Razón: asegurar rutas correctas independientemente del directorio de trabajo.
const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'database.sqlite');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      email TEXT
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      content TEXT,
      author TEXT
    )
  `);
});

module.exports = db;
