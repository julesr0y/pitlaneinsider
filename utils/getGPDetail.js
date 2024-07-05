const fs = require('fs'); // Module permettant de gérer les fichiers
const path = require('path'); // Module permettant de gérer les chemins de fichiers

async function getGPDetail(gp_id) {
    try {
        const filePath = path.join(__dirname, '../python/dataPython/all_races_and_quali_results.json');
        const file = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(file); // On définit le chemin du fichier JSON

        var sortedData = data.filter(item => item.raceId == gp_id);

        let raceData = [];
        sortedData.forEach(function (driver) {
            const gpInfo = {
                driverId: driver.driverId,
                firstName: driver.firstName,
                lastName: driver.lastName,
                position: driver.position,
                grid: driver.grid,
                gap: driver.gap
            };
            raceData.push(gpInfo);
        });

        return raceData;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        throw error; // Propager l'erreur pour que le code appelant puisse la gérer
    }
}

module.exports = getGPDetail;