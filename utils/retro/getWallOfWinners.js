const racesData = require('../../data/f1db/f1db-races.json');
const raceResultsData = require('../../data/f1db/f1db-races-race-results.json');
const constructorsData = require('../../data/f1db/f1db-constructors.json');
const driversData = require('../../data/f1db/f1db-drivers.json');
const gpData = require('../../data/f1db/f1db-grands-prix.json');

/**
 * @description Returns wall of winners data grouped by decade from 1950 to present.
 * @async
 * @returns {Object} Object mapping decade strings to arrays of race winner objects.
 */
async function getWallOfWinners() {
    try {
        // map winning race result for each race
        const p1ResultsMap = new Map();
        raceResultsData.forEach(result => {
            if (result.positionNumber === 1 && !p1ResultsMap.has(result.raceId)) {
                p1ResultsMap.set(result.raceId, result);
            }
        });

        const wallData = {};

        // group race winners by decade
        racesData.forEach(race => {
            const winner = p1ResultsMap.get(race.id);
            if (!winner) return;

            const decade = Math.floor(race.year / 10) * 10;
            if (!wallData[decade]) {
                wallData[decade] = [];
            }

            const constructorObj = constructorsData.find(c => c.id === winner.constructorId);
            const driverObj = driversData.find(d => d.id === winner.driverId);
            const gpObj = gpData.find(g => g.id === race.grandPrixId);

            wallData[decade].push({
                id: race.id,
                year: race.year,
                round: race.round,
                gpName: gpObj ? gpObj.name : race.officialName,
                driverName: driverObj ? `${driverObj.firstName} ${driverObj.lastName}` : winner.driverId,
                constructorId: winner.constructorId,
                constructorName: constructorObj ? constructorObj.name : winner.constructorId
            });
        });

        return wallData;
    } catch (error) {
        console.error('getWallOfWinners, error during execution :', error);
        throw error;
    }
}

module.exports = getWallOfWinners;
