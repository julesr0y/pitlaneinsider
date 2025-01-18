const fs = require('fs');
const path = require('path');

/**
 * @description Returns data of a specific circuit
 * @async
 * @param {String} circuitId 
 * @returns {Array}
 */
async function getRetroCircuitData(circuitId) {
    try {
        const circuitDataFilePath = path.join(__dirname, '../../data/all_tracks.json');
        const circuitData = JSON.parse(fs.readFileSync(circuitDataFilePath, 'utf-8'));
        const targetedCircuitData = circuitData.filter(item => item.id === circuitId);

        return targetedCircuitData[0];
    }
    catch (error) {
        console.error('getRetroCircuitData, error during execution :', error);
        throw error;
    }
}

module.exports = getRetroCircuitData;