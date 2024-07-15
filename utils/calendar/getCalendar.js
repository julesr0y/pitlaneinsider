const fs = require('fs');
const path = require('path');

/**
 * @description Returns the actual season calendar from all time races
 * @async
 * @returns {Array}
 */
async function getActualSeasonCalendar() {
    try {
        const filePath = path.join(__dirname, '../../python/dataPython/all_calendar.json');
        const file = fs.readFileSync(filePath, 'utf-8');
        var data = JSON.parse(file);
        data = data.filter(raceArray => {
            return raceArray.some(element => {
                return element.raceDetails && element.raceDetails.some(detail => detail.year === 2024);
            });
        });

        const simplifiedData = data.map(raceArray => {
            const race = {};

            raceArray.forEach(element => {
                if (element.raceDetails) {
                    element.raceDetails.forEach(detail => {
                        if (detail.year === 2024) {
                            race.id = detail.id;
                            race.country = detail.country;
                            race.name = detail.name;
                            race.year = detail.year;
                            race.date = detail.date;
                            race.raceId = detail.raceId;
                            race.circuitId = detail.circuitId;
                            race.isNextGp = detail.isNextGp;
                        }
                    });
                }
                if (element.dateDetails) {
                    element.dateDetails.forEach(dateDetail => {
                        // Appliquer une fonction à l'heure si elle n'est pas nulle
                        for (let key in dateDetail) {
                            if (dateDetail[key] !== null && key.endsWith('Time')) {
                                dateDetail[key] = convertTime(dateDetail[key]);
                            }
                        }

                        for (let key in dateDetail) {
                            if (dateDetail[key] !== null && key.endsWith('Date')) {
                                dateDetail[key] = convertDate(dateDetail[key]);
                            }
                        }
                        // Ajouter les détails de la date directement à l'objet de la course
                        Object.assign(race, dateDetail);
                    });
                }
            });

            return race;
        });

        return simplifiedData;

    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        throw error; // Propager l'erreur pour que le code appelant puisse la gérer
    }
}

module.exports = getActualSeasonCalendar;

/**
 * @description Returns formatted date DD/MM without year like 04/01 for 4th January
 * @param {String} dateString 
 * @returns {String}
 */
function convertDate(dateString) {
    var date = new Date(dateString);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    return (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month;
}

/**
 * @description Returns formatted time HH/MM like 04h30 for 4:30 am
 * @param {String} timeString 
 * @returns {String}
 */
function convertTime(timeString) {
    var timeParts = timeString.split(':');
    var hour = timeParts[0];
    var minute = timeParts[1];
    return minute === '00' ? hour + 'h' : hour + 'h' + minute;
}