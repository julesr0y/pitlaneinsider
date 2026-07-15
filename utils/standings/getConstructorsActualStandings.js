const fs = require('fs');
const path = require('path');

/**
 * @description Returns teams championship standings from actual season
 * @async
 * @returns {Array}
 */
async function getTeamsActualStandings() {
    try {
        const currentYear = 2026;
        
        // F1DB Files
        const constructorStandings = require('../../data/f1db/f1db-seasons-constructor-standings.json').filter(s => s.year === currentYear);
        const constructors = require('../../data/f1db/f1db-constructors.json');
        
        // Entrants chassis to find which chassis the constructor is using this year
        const entrantsChassis = require('../../data/f1db/f1db-seasons-entrants-chassis.json').filter(c => c.year === currentYear);
        const chassisList = require('../../data/f1db/f1db-chassis.json');

        const getConstructor = (id) => constructors.find(c => c.id === id) || {};
        
        let formattedConstructorStandings = constructorStandings.sort((a, b) => a.positionNumber - b.positionNumber).map(s => {
            const c = getConstructor(s.constructorId);
            
            // Find chassis for this constructor
            const entrant = entrantsChassis.find(e => e.constructorId === s.constructorId);
            let chassisName = 'TBC';
            if (entrant) {
                const ch = chassisList.find(x => x.id === entrant.chassisId);
                if (ch) chassisName = ch.fullName || ch.name;
            }

            return {
                ...s,
                constructor: c,
                position: s.positionNumber,
                name: c.name,
                chassisName: chassisName
            };
        });

        return formattedConstructorStandings;
    } catch (error) {
        console.error('getTeamsActualStandings, error during execution :', error);
        throw error;
    }
}

module.exports = getTeamsActualStandings;
