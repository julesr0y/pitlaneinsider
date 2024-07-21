const fs = require('fs');
const path = require('path');

/**
 * @description Returns data of a specific GP
 * @async
 * @param {Int} gp_id
 * @returns {Object}
 */
async function getGPDetail(gp_id) {
    try {
        const filePath = path.join(__dirname, '../../python/dataPython/all_races_and_quali_results.json');
        const file = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(file);

        let raceData = [];
        let gpInfo = {};

        data.forEach(race => {
            if (race.raceInfo[0].raceId == gp_id) {
                gpInfo = {
                    raceId: race.raceInfo[0].raceId,
                    gpId: race.raceInfo[0].gpId,
                    gpOfficialName: race.raceInfo[0].gpOfficialName,
                    gpShortName: race.raceInfo[0].gpShortName,
                    gpFullName: race.raceInfo[0].gpFullName,
                    countryId: race.raceInfo[0].countryId,
                    circuitId: race.raceInfo[0].circuitId,
                    date: race.raceInfo[0].date
                };

                race.results.forEach(driver => {
                    const driverInfo = {
                        driverId: driver.driverId,
                        firstName: driver.firstName,
                        lastName: driver.lastName,
                        abbreviation: driver.abbreviation,
                        position: driver.position,
                        grid: driver.grid,
                        gap: driver.gap,
                        fastestLapTime: driver.fastestLapTime,
                        fastestPitTime: driver.fastestPitTime
                    };
                    raceData.push(driverInfo);
                });
            }
        });

        return { gpInfo, raceData };
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        throw error;
    }
}

module.exports = getGPDetail;