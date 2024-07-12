const fs = require('fs'); // Module permettant de gérer les fichiers
const path = require('path'); // Module permettant de gérer les chemins de fichiers

async function getWinners() {
    try {
        const filePath = path.join(__dirname, '../python/dataPython/titled_drivers.json');
        const file = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(file);
        let winnersTab = {};

        data.forEach(function (winner) {
            if (winnersTab[winner["driverId"]]) {
                winnersTab[winner["driverId"]].titles++;
            } else {
                winnersTab[winner["driverId"]] = {
                    "driverId": winner["driverId"],
                    "firstName": winner["firstName"],
                    "lastName": winner["lastName"],
                    "abbreviation": winner["abbreviation"],
                    "titles": 1
                };
            }
        });

        let sortedEntries = Object.entries(winnersTab)
            .sort((a, b) => b[1].titles - a[1].titles);

        let sortedDrivers = sortedEntries.reduce((obj, [key, value], index) => {
            obj[index] = { key, ...value };
            return obj;
        }, {});

        return sortedDrivers;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        throw error; // Propager l'erreur pour que le code appelant puisse la gérer
    }
}

module.exports = getWinners;
