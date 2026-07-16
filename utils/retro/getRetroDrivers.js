const fs = require('fs');
const path = require('path');

async function getRetroDrivers() {
    try {
        const driversDataFilePath = path.join(__dirname, '../../data/f1db/f1db-drivers.json');
        const driversData = JSON.parse(fs.readFileSync(driversDataFilePath, 'utf-8'));
        driversData.sort((a, b) => {
            const dateA = a.dateOfBirth ? new Date(a.dateOfBirth) : new Date(0);
            const dateB = b.dateOfBirth ? new Date(b.dateOfBirth) : new Date(0);
            return dateB - dateA;
        });
        return driversData;
    } catch (error) {
        console.error('getRetroDrivers, error:', error);
        throw error;
    }
}
module.exports = getRetroDrivers;
