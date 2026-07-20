const fs = require('fs');
const path = require('path');

// Load f1db data in memory
const constructorsData = require('../../data/f1db/f1db-constructors.json');
const seasonsConstructorsData = require('../../data/f1db/f1db-seasons-constructors.json');

/**
 * @description Returns all constructors from the actual season using native f1db fields
 * @async
 * @returns {Array}
 */
async function getActualConstructors() {
    try {
        const { currentYear } = require('../../config.json');
        
        // Find which constructors are present in the 2026 season
        const currentSeasonConstructors = seasonsConstructorsData.filter(item => item.year === currentYear);
        
        const constructorsFrontData = [];
        currentSeasonConstructors.forEach(function (seasonConstructor) {
            const constructorObj = constructorsData.find(c => c.id === seasonConstructor.constructorId);
            if (constructorObj) {
                constructorsFrontData.push(constructorObj);
            }
        });

        // Sort alphabetically by name
        constructorsFrontData.sort((a, b) => a.name.localeCompare(b.name));

        return constructorsFrontData;
    } catch (error) {
        console.error('getActualConstructors, error during execution :', error);
        throw error;
    }
}

module.exports = getActualConstructors;