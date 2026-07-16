const fs = require('fs');
const path = require('path');

async function getRetroCalendar(season_id) {
    try {
        const races = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/f1db/f1db-races.json'), 'utf-8'));
        const gps = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/f1db/f1db-grands-prix.json'), 'utf-8'));
        const circuits = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/f1db/f1db-circuits.json'), 'utf-8'));
        const countries = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/f1db/f1db-countries.json'), 'utf-8'));
        
        let targetedSeasonData = races.filter(race => race.year == season_id);
        return targetedSeasonData.map(race => {
            const gp = gps.find(g => g.id === race.grandPrixId);
            const circuit = circuits.find(c => c.id === race.circuitId);
            const country = countries.find(c => c.id === (circuit ? circuit.countryId : ""));
            return {
                ...race,
                grandPrix: gp || {},
                circuit: circuit || {},
                country: country || {}
            };
        });
    } catch (error) {
        console.error('getRetroCalendar, error:', error);
        throw error;
    }
}
module.exports = getRetroCalendar;
