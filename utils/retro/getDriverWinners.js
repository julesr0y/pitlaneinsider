const fs = require('fs');
const path = require('path');

async function getDriverWinners() {
    try {
        const driversDataFilePath = path.join(__dirname, '../../data/f1db/f1db-drivers.json');
        const driversData = JSON.parse(fs.readFileSync(driversDataFilePath, 'utf-8'));
        let winners = driversData.filter(d => d.totalChampionshipWins > 0)
            .sort((a, b) => b.totalChampionshipWins - a.totalChampionshipWins);
        return winners.reduce((obj, value, index) => { obj[index] = value; return obj; }, {});
    } catch (error) {
        console.error('getDriverWinners, error:', error);
        throw error;
    }
}
module.exports = getDriverWinners;
