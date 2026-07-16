const fs = require('fs');
const path = require('path');

/**
 * @description Returns data of a specific circuit (using F1DB)
 * @async
 * @param {String} circuitId 
 * @returns {Object}
 */
async function getRetroCircuitData(circuitId) {
    try {
        const circuitDataFilePath = path.join(__dirname, '../../data/f1db/f1db-circuits.json');
        const circuitData = JSON.parse(fs.readFileSync(circuitDataFilePath, 'utf-8'));
        const targetedCircuitData = circuitData.find(item => item.id === circuitId);

        return targetedCircuitData;
    }
    catch (error) {
        console.error('getRetroCircuitData, error during execution :', error);
        throw error;
    }
}

module.exports = getRetroCircuitData;
