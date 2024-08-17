const mysql = require('mysql2');

if (process.env.NODE_ENV === 'production') {
    require('dotenv').config({ path: '.env.production' });
} else {
    require('dotenv').config();
}

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "pitlaneinsider_db",
    waitForConnections: true,
    connectionLimit: 10, // Le nombre maximum de connexions à créer
    queueLimit: 0 // Pas de limite pour la file d'attente
});

module.exports = pool.promise(); // Utilisation de pool en mode promisifié pour plus de simplicité