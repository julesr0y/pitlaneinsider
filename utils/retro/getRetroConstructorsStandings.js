const fs = require('fs');
const path = require('path');

async function getRetroConstructorsStandings(season_id) {
    try {
        const constructorsStandings = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/f1db/f1db-seasons-constructor-standings.json'), 'utf-8'));
        const constructors = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/f1db/f1db-constructors.json'), 'utf-8'));
        
        const targetedSeasonData = constructorsStandings.filter(item => item.year == season_id);
        let constructorsStandingsFrontData = targetedSeasonData.map(element => {
            const constructorData = constructors.find(c => c.id === element.constructorId);
            return {
                ...element,
                constructor: constructorData || {}
            };
        });

        constructorsStandingsFrontData.sort((a, b) => a.positionNumber - b.positionNumber);
        return constructorsStandingsFrontData;
    } catch (error) {
        console.error('getRetroConstructorsStandings, error:', error);
        throw error;
    }
}
module.exports = getRetroConstructorsStandings;
