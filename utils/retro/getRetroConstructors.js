const fs = require('fs');
const path = require('path');

async function getRetroConstructors() {
    try {
        const constructorsDataFilePath = path.join(__dirname, '../../data/f1db/f1db-constructors.json');
        return JSON.parse(fs.readFileSync(constructorsDataFilePath, 'utf-8'));
    } catch (error) {
        console.error('getRetroConstructors, error:', error);
        throw error;
    }
}
module.exports = getRetroConstructors;
