const fs = require('fs'); // Module permettant de gérer les fichiers
const path = require('path'); // Module permettant de gérer les chemins de fichiers

/**
 * @description Returns constructor's championship standings from the actual season
 * @async
 * @returns {Array}
 */
async function getConstructorsActualStandings() {
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

module.exports = getConstructorsActualStandings;
