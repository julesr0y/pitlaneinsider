const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: "mysql-pitlaneinsider.alwaysdata.net",
//     user: "355843",
//     password: "5ANkT9Sm8dmErfV",
//     database: "pitlaneinsider_db",
//     waitForConnections: true,
//     connectionLimit: 10, // Le nombre maximum de connexions à créer
//     queueLimit: 0 // Pas de limite pour la file d'attente
// });

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "pitlaneinsider_db",
    waitForConnections: true,
    connectionLimit: 10, // Le nombre maximum de connexions à créer
    queueLimit: 0 // Pas de limite pour la file d'attente
});

module.exports = pool.promise(); // Utilisation de pool en mode promisifié pour plus de simplicité