// ==============================
// Puerto
// ==============================
process.env.PORT = process.env.PORT || 3000;

// ==============================
// Entorno
// ==============================

process.env.NODE_ENV = process.NODE_ENV || 'dev';

// ==============================
// Vencimiento toke
// ==============================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ==============================
// SEED
// ==============================

process.env.SEDD = process.env.SEDD || "48h";

// ==============================
// Base de Datos
// ==============================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGU_URI;
}

process.env.URLDB = urlDB;