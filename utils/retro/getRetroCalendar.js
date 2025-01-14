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
        const filePath = path.join(__dirname, '../../data/all_calendar.json');
        const file = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(file);

        var sortedData = data.filter(race => race[0].raceDetails.some(detail => detail.year == season_id));

        let calendar = [];
        sortedData.forEach(function (calendarElement) {
            const raceDetail = calendarElement[0].raceDetails.find(detail => detail.year == season_id);
            const seasonInfo = {
                year: raceDetail.year,
                name: raceDetail.name,
                country: raceDetail.country,
                date: raceDetail.date,
                raceId: raceDetail.raceId,
                id: raceDetail.id
            };
            calendar.push(seasonInfo);
        });

        return calendar;
    } catch (error) {
        console.error('getRetroCalendar, error during execution :', error);
        throw error;
    }
}

module.exports = getRetroCalendar;