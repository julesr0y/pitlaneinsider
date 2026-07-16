const fs = require('fs');
const path = require('path');

/**
 * @description Returns all circuits from F1 history (using F1DB)
 * @async
 * @returns {Array}
 */
async function getRetroCircuits() {
    try {
        const circuitsDataFilePath = path.join(__dirname, '../../data/f1db/f1db-circuits.json');
        const circuitsData = JSON.parse(fs.readFileSync(circuitsDataFilePath, 'utf-8'));

        return circuitsData;
    } catch (error) {
        console.error('getRetroCircuits, error during execution :', error);
        throw error;
    }
}

module.exports = getRetroCircuits;
