const fs = require('fs');
const path = require('path');

/**
 * @description Returns data of a specific GP
 * @async
 * @param {Int} year
 * @param {Int} gp_id
 * @returns {Object}
 */
async function getGPDetail(year, gp_id) {
    try {
        const racesInfoFilePath = path.join(__dirname, `../../data/races-info.json`);
        const racesResultsFilePath = path.join(__dirname, `../../data/all_races_and_quali_results.json`);
        const weatherFilePath = path.join(__dirname, '../../data/all_races_weather.json');
        const racesInfoData = JSON.parse(fs.readFileSync(racesInfoFilePath, 'utf-8'));
        const racesResultsData = JSON.parse(fs.readFileSync(racesResultsFilePath, 'utf-8'));
        const weatherData = JSON.parse(fs.readFileSync(weatherFilePath, 'utf-8'));

        let raceData = [];
        let gpInfos = [];

        racesInfoData.forEach(race => {
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
                    date: race.date
                };
                gpInfos.push(gpInfo);
            }
        });

        racesResultsData.forEach(race => {
            if (race.raceInfo[0].raceId == gp_id) {
                race.results.forEach(driver => {
                    const driverInfo = {
                        constructorId: driver.constructorId,
                        driverId: driver.driverId,
                        firstName: driver.firstName,
                        lastName: driver.lastName,
                        abbreviation: driver.abbreviation,
                        position: driver.position,
                        qualiPosition: driver.qualiPosition,
                        qualiTime: driver.qualiTime,
                        q1time: driver.q1time,
                        q2time: driver.q2time,
                        q3time: driver.q3time,
                        gap: driver.gap,
                        fastestLapTime: driver.fastestLapTime,
                        fastestPitTime: driver.fastestPitTime
                    };
                    raceData.push(driverInfo);
                });
            }
        });

        weatherData.forEach(weather => {
            if (weather.raceId == gp_id) {
                gpInfos[0].weather = weather.weather;
            }
        });

        return { gpInfos, raceData };
    } catch (error) {
        console.error('getGPDetail, error during execution :', error);
        throw error;
    }
}

module.exports = getGPDetail;