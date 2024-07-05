const fs = require('fs'); // Module permettant de gérer les fichiers
const path = require('path'); // Module permettant de gérer les chemins de fichiers

async function getSeasonList(season_id) {
    try {
        const filePath = path.join(__dirname, '../python/dataPython/all_calendar.json');
        const file = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(file); // On définit le chemin du fichier JSON

        var sortedData = data.filter(race => race[0].raceDetails.some(detail => detail.year == season_id));

        let calendar = [];
        sortedData.forEach(function (calendarElement) {
            const raceDetail = calendarElement[0].raceDetails.find(detail => detail.year == season_id);
            const seasonInfo = {
                year: raceDetail.year,
                name: raceDetail.name,
                country: raceDetail.country,
                date: raceDetail.date,
                raceId: raceDetail.raceId,
                id: raceDetail.id
            };
            calendar.push(seasonInfo); // Ajout des informations au tableau
        });

        return calendar;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        throw error; // Propager l'erreur pour que le code appelant puisse la gérer
    }
}

module.exports = getSeasonList;