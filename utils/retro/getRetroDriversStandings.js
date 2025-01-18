const fs = require('fs');
const path = require('path');

/**
 * @description Returns drivers standings of a specific season
 * @async
 * @param {String} season_id 
 * @returns {Array}
 */
async function getRetroDriversStandings(season_id) {
    try {
        const driversStandingsDataFilePath = path.join(__dirname, '../../data/all_driver_standings.json');
        const driversStandingsData = JSON.parse(fs.readFileSync(driversStandingsDataFilePath, 'utf-8'));
        const targetedSeasonData = driversStandingsData.filter(item => item.year == season_id);

        let driversStandingsFrontData = [];
        targetedSeasonData.forEach(function (element) {
            const driverInfo = {
                driverId: element.driverId,
                actualConstructor: element.actualTeam,
                position: element.position,
                firstName: element.firstName,
                lastName: element.lastName,
                points: element.points
            };

            driversStandingsFrontData.push(driverInfo);
        });

        return driversStandingsFrontData;
    } catch (error) {
        console.error('getRetroDriversStandings, error during execution :', error);
        throw error;
    }
}

module.exports = getRetroDriversStandings;