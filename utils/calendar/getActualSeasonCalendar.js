const fs = require('fs');
const path = require('path');

/**
 * @description Returns the actual season calendar from f1db
 * @async
 * @returns {Array}
 */
async function getActualSeasonCalendar() {
    try {
        const currentYear = 2026;
        const races = require('../../data/f1db/f1db-races.json').filter(r => r.year === currentYear);
        const grandPrix = require('../../data/f1db/f1db-grands-prix.json');
        const countries = require('../../data/f1db/f1db-countries.json');

        const getGP = (id) => grandPrix.find(g => g.id === id) || {};
        const getCountry = (id) => countries.find(c => c.id === id) || {};

        // Find next race based on current date
        const now = Date.now();
        let nextRaceId = null;

        for (let r of races) {
            // We use race date and time to find next gp
            const raceDateStr = r.date + (r.time ? 'T' + r.time + 'Z' : 'T00:00:00Z');
            const raceTime = new Date(raceDateStr).getTime();
            if (raceTime > now) {
                nextRaceId = r.id;
                break;
            }
        }

        const calendarFrontData = races.map(r => {
            const gp = getGP(r.grandPrixId);
            const country = getCountry(gp.countryId);

            const formatD = (d) => {
                if (!d) return null;
                const parts = d.split('-');
                if (parts.length === 3) {
                    return parts[1] + '-' + parts[2];
                }
                return d;
            };

            const raceDateStr = r.date + (r.time ? 'T' + r.time + 'Z' : 'T00:00:00Z');
            const raceTimeObj = new Date(raceDateStr).getTime();

            return {
                id: r.id,
                raceId: r.id,
                circuitId: r.circuitId,
                round: r.round,
                name: gp.shortName || gp.fullName,
                country: country.id,
                year: r.year,
                isNextGp: r.id === nextRaceId,
                hasOccurred: raceTimeObj <= now,
                
                // Formatted dates
                freePractice1Date: formatD(r.freePractice1Date),
                freePractice1Time: r.freePractice1Time,
                freePractice2Date: formatD(r.freePractice2Date),
                freePractice2Time: r.freePractice2Time,
                freePractice3Date: formatD(r.freePractice3Date),
                freePractice3Time: r.freePractice3Time,
                sprintQualifyingDate: formatD(r.sprintQualifyingDate),
                sprintQualifyingTime: r.sprintQualifyingTime,
                sprintRaceDate: formatD(r.sprintRaceDate),
                sprintRaceTime: r.sprintRaceTime,
                qualifyingDate: formatD(r.qualifyingDate),
                qualifyingTime: r.qualifyingTime,
                raceDate: formatD(r.date),
                raceTime: r.time
            };
        });

        return calendarFrontData;
    } catch (error) {
        console.error('getActualSeasonCalendar, error during execution :', error);
        throw error;
    }
}

module.exports = getActualSeasonCalendar;
