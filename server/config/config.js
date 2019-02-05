// ==============================
// Puerto
// ==============================
process.env.PORT = process.env.PORT || 3000;

// ==============================
// Entorno
// ==============================

process.env.NODE_ENV = process.NODE_ENV || 'dev';

// ==============================
// Base de Datos
// ==============================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb://cafemtr:p123456@ds157342.mlab.com:57342/cafemtr';
}

process.env.URLDB = urlDB;