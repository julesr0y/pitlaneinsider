const fs = require('fs'); // Module permettant de gérer les fichiers
const path = require('path'); // Module permettant de gérer les chemins de fichiers

/**
 * @function
 * @description Fonction permettant de récupérer le classement actuel des écuries de Formule 1
 * @returns {Promise<Array>} - Une promesse contenant un tableau d'objets représentant chaque équipe avec son nom, identifiant, position et points.
 */
async function getTeamsActualStandings() {
    try {
        const filePath = path.join(__dirname, '../../python/dataPython/all_constructor_standings.json');
        const file = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(file); // On définit le chemin du fichier JSON
        var thisYearConstructorsStandings = data.filter(race => race.year == 2024);
        return thisYearConstructorsStandings;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        throw error; // Propager l'erreur pour que le code appelant puisse la gérer
    }
}

module.exports = getTeamsActualStandings;
