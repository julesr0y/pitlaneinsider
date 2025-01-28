const fs = require('fs');
const path = require('path');
const msgpack = require('msgpack-lite');

/**
 * @description Returns data of a specific GP
 * @async
 * @param {Int} year
 * @param {Int} gp_id
 * @returns {Object}
 */
async function getGPDetail(year, gp_id) {
    try {
        const racesResultsFilePath = path.join(__dirname, `../../data/seasons/${year}/pli-data-sessions-results.msgpack`);
        const racesResultsData = msgpack.decode(fs.readFileSync(racesResultsFilePath));

        let raceData = [];
        let gpInfos = [];

        racesResultsData[0].raceInfo.forEach(race => {
            if (race.raceId == gp_id) {
                const gpInfo = {
                    raceId: race.raceId,
                    gpId: race.gpId,
                    gpOfficialName: race.gpOfficialName,
                    gpShortName: race.gpShortName,
                    gpFullName: race.gpFullName,
                    countryId: race.countryId,
                    circuitId: race.circuitId,
                    circuitName: race.circuitName,
                    date: race.date,
                    weather: race.weather,
                    sprintQualifyingFormat: race.sprintQualifyingFormat,
                    qualifyingFormat: race.qualifyingFormat
                };
                gpInfos.push(gpInfo);
            }
        });

        racesResultsData[0].results.forEach(driver => {
            if (driver.raceId == gp_id) {
                const driverInfo = {
                    constructorId: driver.constructorId,
                    driverId: driver.driverId,
                    firstName: driver.firstName,
                    lastName: driver.lastName,
                    abbreviation: driver.abbreviation,
                    fp1Position: driver.fp1Position,
                    fp1Time: driver.fp1Time,
                    fp2Position: driver.fp2Position,
                    fp2Time: driver.fp2Time,
                    fp3Position: driver.fp3Position,
                    fp3Time: driver.fp3Time,
                    qualiPosition: driver.qualiPosition,
                    qualiTime: driver.qualiTime,
                    q1time: driver.q1time,
                    q2time: driver.q2time,
                    q3time: driver.q3time,
                    sprintQualiPosition: driver.sprintQualiPosition,
                    sprintQualiTime: driver.sprintQualiTime,
                    sprintRacePosition: driver.sprintRacePosition,
                    sprintRaceGap: driver.sprintRaceGap,
                    sprintRacePoints: driver.sprintRacePoints,
                    position: driver.position,
                    gap: driver.gap,
                    racePoints: driver.racePoints,
                    fastestLapTime: driver.fastestLapTime,
                    fastestPitTime: driver.fastestPitTime,
                    sprintQualifyingFormat: driver.sprintQualifyingFormat,
                    qualifyingFormat: driver.qualifyingFormat
                };
                raceData.push(driverInfo);
            }
        });

        return { gpInfos, raceData };
    } catch (error) {
        console.error('getGPDetail, error during execution :', error);
        throw error;
    }
}

module.exports = getGPDetail;