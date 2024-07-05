const fs = require('fs'); // Module permettant de gérer les fichiers
const path = require('path'); // Module permettant de gérer les chemins de fichiers

async function getSeasonRanking(season_id) {
    try {
        const filePath = path.join(__dirname, '../python/dataPython/all_driver_standings.json');
        const file = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(file); // On définit le chemin du fichier JSON

        var sortedData = data.filter(item => item.year == season_id);

        let ranking = [];
        sortedData.forEach(function (element) {
            const driverInfo = {
                position: element.position,
                firstName: element.firstName,
                lastName: element.lastName,
                points: element.points
            };

            ranking.push(driverInfo);
        })

        return ranking;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        throw error; // Propager l'erreur pour que le code appelant puisse la gérer
    }
}

module.exports = getSeasonRanking;