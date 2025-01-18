const fs = require('fs');
const path = require('path');

/**
 * @description Returns all circuits from F1 history
 * @async
 * @returns {Array}
 */
async function getRetroCircuits() {
    try {
        const circuitsDataFilePath = path.join(__dirname, '../../data/all_tracks.json');
        const circuitsData = JSON.parse(fs.readFileSync(circuitsDataFilePath, 'utf-8'));

        return circuitsData;
    } catch (error) {
        console.error('getRetroTracks, error during execution :', error);
        throw error;
    }
}

module.exports = getRetroCircuits;