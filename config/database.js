const mysql = require('mysql2');

const dbConnexion = mysql.createConnection({
    host: "mysql-pitlaneinsider.alwaysdata.net",
    user: "355843",
    password: "5ANkT9Sm8dmErfV",
    database: "pitlaneinsider_db"
});

dbConnexion.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données :', err);
    } else {
        console.log('Connexion à la base de données établie');
    }
});

module.exports = dbConnexion;