const fs = require('fs');
const path = require('path');

async function getRetroDriversStandings(season_id) {
    try {
        const driversStandings = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/f1db/f1db-seasons-driver-standings.json'), 'utf-8'));
        const drivers = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/f1db/f1db-drivers.json'), 'utf-8'));
        const races = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/f1db/f1db-races.json'), 'utf-8'));
        const raceResults = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/f1db/f1db-races-race-results.json'), 'utf-8'));

        const targetedSeasonStandings = driversStandings.filter(item => item.year == season_id);
        const seasonRaces = races.filter(item => item.year == season_id).map(r => r.id);
        const seasonRaceResults = raceResults.filter(item => seasonRaces.includes(item.raceId));

        let driversStandingsFrontData = targetedSeasonStandings.map(element => {
            const driverData = drivers.find(d => d.id === element.driverId);
            const driverResults = seasonRaceResults.filter(r => r.driverId === element.driverId);
            driverResults.sort((a, b) => seasonRaces.indexOf(a.raceId) - seasonRaces.indexOf(b.raceId));
            const constructorIds = [...new Set(driverResults.map(r => r.constructorId))];
            
            return {
                ...element,
                driver: driverData || {},
                constructorIds: constructorIds.length > 0 ? constructorIds : ["unknown"]
            };
        });
        
        driversStandingsFrontData.sort((a, b) => a.positionNumber - b.positionNumber);
        return driversStandingsFrontData;
    } catch (error) {
        console.error('getRetroDriversStandings, error:', error);
        throw error;
    }
}
module.exports = getRetroDriversStandings;
