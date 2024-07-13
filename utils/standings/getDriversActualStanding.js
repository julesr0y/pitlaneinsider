const fs = require('fs'); // Module permettant de gérer les fichiers
const path = require('path'); // Module permettant de gérer les chemins de fichiers

/**
 * @function
 * @description Fonction permettant de récupérer le classement actuel des pilotes
 * @param {boolean} update - Détermine si les données doivent être mises à jour
 * @returns {Promise} - Promesse contenant la réponse de l'API. Se présente sous la forme d'un tableau de tableaux : 0, Nom et prénom du pilote; 1, id de l'écurie; 2, Position du pilote dans le classement; 3, Nombre de points; 4, Nombre de victoires, 5, id du pilote, 6, code du pilote, 7, numéro du pilote
 */
async function getDriversActualStandings() {
    try {
        const filePath = path.join(__dirname, '../../python/dataPython/all_driver_standings.json');
        const file = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(file); // On définit le chemin du fichier JSON
        var thisYearDriversStandings = data.filter(race => race.year == 2024);
        return thisYearDriversStandings;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        throw error; // Propager l'erreur pour que le code appelant puisse la gérer
    }
}

module.exports = getDriversActualStandings;
