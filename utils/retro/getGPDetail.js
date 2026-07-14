const path = require('path');

// Load JSON data in memory once to act as cache and improve performance
const racesData = require('../../data/f1db/f1db-races.json');
const gpData = require('../../data/f1db/f1db-grands-prix.json');
const circuitsData = require('../../data/f1db/f1db-circuits.json');
const driversData = require('../../data/f1db/f1db-drivers.json');

const raceResultsData = require('../../data/f1db/f1db-races-race-results.json');
const fp1Data = require('../../data/f1db/f1db-races-free-practice-1-results.json');
const fp2Data = require('../../data/f1db/f1db-races-free-practice-2-results.json');
const fp3Data = require('../../data/f1db/f1db-races-free-practice-3-results.json');
const qualiData = require('../../data/f1db/f1db-races-qualifying-results.json');
const sprintQualiData = require('../../data/f1db/f1db-races-sprint-qualifying-results.json');
const sprintRaceData = require('../../data/f1db/f1db-races-sprint-race-results.json');
const fastestLapData = require('../../data/f1db/f1db-races-fastest-laps.json');
const pitStopsData = require('../../data/f1db/f1db-races-pit-stops.json');

/**
 * @description Returns data of a specific GP with native f1db structure
 * @async
 * @param {Int} year
 * @param {Int} gp_id
 * @returns {Object}
 */
async function getGPDetail(year, gp_id) {
    try {
        const raceId = parseInt(gp_id);
        const raceYear = parseInt(year);

        const race = racesData.find(r => r.id === raceId && r.year === raceYear);
        if (!race) {
            return { gpInfos: {}, raceData: [] };
        }

        const grandPrix = gpData.find(g => g.id === race.grandPrixId) || {};
        const circuit = circuitsData.find(c => c.id === race.circuitId) || {};

        const gpInfos = {
            ...race,
            grandPrix: grandPrix,
            circuit: circuit
        };

        const raceResults = raceResultsData.filter(r => r.raceId === raceId);
        const fp1Results = fp1Data.filter(r => r.raceId === raceId);
        const fp2Results = fp2Data.filter(r => r.raceId === raceId);
        const fp3Results = fp3Data.filter(r => r.raceId === raceId);
        const qualiResults = qualiData.filter(r => r.raceId === raceId);
        const sqResults = sprintQualiData.filter(r => r.raceId === raceId);
        const srResults = sprintRaceData.filter(r => r.raceId === raceId);
        const fLapResults = fastestLapData.filter(r => r.raceId === raceId);
        const pitResults = pitStopsData.filter(r => r.raceId === raceId);

        let raceDataMap = {};

        function initDriver(driverId) {
            if (!raceDataMap[driverId]) {
                const driver = driversData.find(d => d.id === driverId) || {};
                raceDataMap[driverId] = {
                    driver: driver,
                    race: null,
                    fp1: null,
                    fp2: null,
                    fp3: null,
                    quali: null,
                    sprintQuali: null,
                    sprintRace: null,
                    fastestLap: null,
                    fastestPit: null
                };
            }
            return raceDataMap[driverId];
        }

        // Race Results
        raceResults.forEach(res => {
            const drv = initDriver(res.driverId);
            // In case of gap being null for DNF, we use positionText (to keep the string value like "DNF")
            // We just override it in a new object so we don't mutate the global f1db cache
            const raceObj = { ...res };
            if (!raceObj.gap && isNaN(parseInt(raceObj.positionText))) {
                raceObj.gap = raceObj.positionText;
            }
            drv.race = raceObj;
        });

        // Other Sessions
        fp1Results.forEach(res => {
            const drv = initDriver(res.driverId);
            drv.fp1 = res;
        });

        fp2Results.forEach(res => {
            const drv = initDriver(res.driverId);
            drv.fp2 = res;
        });

        fp3Results.forEach(res => {
            const drv = initDriver(res.driverId);
            drv.fp3 = res;
        });

        qualiResults.forEach(res => {
            const drv = initDriver(res.driverId);
            drv.quali = res;
        });

        sqResults.forEach(res => {
            const drv = initDriver(res.driverId);
            drv.sprintQuali = res;
        });

        srResults.forEach(res => {
            const drv = initDriver(res.driverId);
            const srObj = { ...res };
            if (!srObj.gap && isNaN(parseInt(srObj.positionText))) {
                srObj.gap = srObj.positionText;
            }
            drv.sprintRace = srObj;
        });

        // Fastest lap (get the overall fastest)
        const fLap = fLapResults.find(r => r.positionNumber === 1);
        if (fLap) {
            const drv = initDriver(fLap.driverId);
            drv.fastestLap = fLap;
        }

        // Pit stops (get the minimum time overall)
        let bestPit = null;
        pitResults.forEach(res => {
            if (!bestPit || res.timeMillis < bestPit.timeMillis) {
                bestPit = res;
            }
        });
        if (bestPit) {
            const drv = initDriver(bestPit.driverId);
            drv.fastestPit = bestPit;
        }

        let raceData = Object.values(raceDataMap);

        return { gpInfos, raceData };

    } catch (error) {
        console.error('getGPDetail, error during execution :', error);
        throw error;
    }
}

module.exports = getGPDetail;