const fs = require('fs');

/**
 * @description Returns all chassis from F1 history using f1db
 * @async
 * @returns {Array}
 */
async function getRetroChassis() {
    try {
        const chassisData = require('../../data/f1db/f1db-chassis.json');

        var chassisFrontData = [];
        chassisData.forEach(item => {
            const chassisInfo = {
                chassisId: item.id,
                chassisFullName: item.fullName
            };

            chassisFrontData.push(chassisInfo);
        });

        // Optionally sort alphabetically by full name
        chassisFrontData.sort((a, b) => a.chassisFullName.localeCompare(b.chassisFullName));

        return chassisFrontData;
    } catch (error) {
        console.error('getRetroChassis, error during execution :', error);
        throw error;
    }
}

module.exports = getRetroChassis;
