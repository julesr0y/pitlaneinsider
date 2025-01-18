const fs = require('fs');
const path = require('path');

/**
 * @description Returns all chassis from F1 history
 * @async
 * @returns {Array}
 */
async function getRetroChassis() {
    try {
        const chassisDataFilePath = path.join(__dirname, '../../data/chassis.json');
        const chassisData = JSON.parse(fs.readFileSync(chassisDataFilePath, 'utf-8'));

        var chassisFrontData = [];
        chassisData.forEach(item => {
            const chassisInfo = {
                chassisId: item.chassisId,
                chassisFullName: item.chassisFullName
            };

            chassisFrontData.push(chassisInfo);
        });

        return chassisFrontData;
    } catch (error) {
        console.error('getRetroChassis, error during execution :', error);
        throw error;
    }
}

module.exports = getRetroChassis;
