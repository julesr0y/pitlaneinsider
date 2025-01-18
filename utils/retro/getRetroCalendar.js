const fs = require('fs');
const path = require('path');

/**
 * @description Returns the calendar of a specific season
 * @async
 * @param {String} season_id 
 * @returns {Array}
 */
async function getRetroCalendar(season_id) {
    try {
        const calendarDataFilePath = path.join(__dirname, '../../data/all_calendar.json');
        const calendarData = JSON.parse(fs.readFileSync(calendarDataFilePath, 'utf-8'));
        const targetedSeasonData = calendarData.filter(race => race[0].raceDetails.some(detail => detail.year == season_id));

        let calendarFrontData = [];
        targetedSeasonData.forEach(function (calendarElement) {
            const raceDetail = calendarElement[0].raceDetails.find(detail => detail.year == season_id);
            const raceInfo = {
                year: raceDetail.year,
                name: raceDetail.name,
                country: raceDetail.country,
                date: raceDetail.date,
                raceId: raceDetail.raceId,
                id: raceDetail.id
            };
            calendarFrontData.push(raceInfo);
        });

        return calendarFrontData;
    } catch (error) {
        console.error('getRetroCalendar, error during execution :', error);
        throw error;
    }
}

module.exports = getRetroCalendar;