const fs = require('fs');
const path = require('path');

/**
 * @description Returns the actual season calendar from all time races data file
 * @async
 * @returns {Array}
 */
async function getActualSeasonCalendar() {
    try {
        const calendarDataFilePath = path.join(__dirname, '../../data/all_calendar.json');
        const calendarData = JSON.parse(fs.readFileSync(calendarDataFilePath, 'utf-8'));

        var actualSeasonData = calendarData.filter(raceArray => {
            return raceArray.some(element => {
                return element.raceDetails && element.raceDetails.some(detail => detail.year === 2025);
            });
        });

        const calendarFrontData = actualSeasonData.map(raceArray => {
            const raceInformation = {};

            raceArray.forEach(element => {
                if (element.raceDetails) {
                    element.raceDetails.forEach(detail => {
                        if (detail.year === 2025) {
                            raceInformation.id = detail.id;
                            raceInformation.country = detail.country;
                            raceInformation.name = detail.name;
                            raceInformation.year = detail.year;
                            raceInformation.date = detail.date;
                            raceInformation.raceId = detail.raceId;
                            raceInformation.circuitId = detail.circuitId;
                            raceInformation.round = detail.round;
                            raceInformation.isNextGp = detail.isNextGp;
                        }
                    });
                }
                if (element.dateDetails) {
                    element.dateDetails.forEach(dateDetail => {
                        for (let key in dateDetail) {
                            if (dateDetail[key] !== null && key.endsWith('Date')) {
                                dateDetail[key] = convertDate(dateDetail[key]);
                            }
                        }

                        Object.assign(raceInformation, dateDetail);
                    });
                }
            });

            return raceInformation;
        });

        return calendarFrontData;
    } catch (error) {
        console.error('getActualSeasonCalendar, error during execution :', error);
        throw error;
    }
}

module.exports = getActualSeasonCalendar;

/**
 * @description Returns formatted date DD/MM without year like 04/01 for 4th January
 * @param {String} dateString 
 * @returns {String}
 */
function convertDate(dateString) {
    try {
        var date = new Date(dateString);
        var day = date.getDate();
        var month = date.getMonth() + 1;

        return (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;
    } catch (error) {
        console.error('convertDate, error during execution :', error);
        throw error;
    }
}