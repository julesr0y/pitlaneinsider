const fs = require('fs');
const path = require('path');

/**
 * @description Returns data of a specific chassis
 * @async
 * @param {String} chassis_id 
 * @returns {Array}
 */
async function getChassisData(chassis_id) {
    try {
        const chassisDataFilePath = path.join(__dirname, '../../data/chassis.json');
        const chassisData = JSON.parse(fs.readFileSync(chassisDataFilePath, 'utf-8'));
        const targetedChassisInformation = chassisData.filter(item => item.chassisId === chassis_id)[0];
        const chassisInformation = {
            id: targetedChassisInformation.chassisId,
        }

        console.log('getChassisData, chassisInformation :', chassisInformation);
        return chassisInformation;
    } catch (error) {
        console.error('getDriverData, error during execution :', error);
        throw error;
    }
}

module.exports = getChassisData;