const fs = require('fs');
const path = require('path');

async function getConstructorWinners() {
    try {
        const constructorsDataFilePath = path.join(__dirname, '../../data/f1db/f1db-constructors.json');
        const constructorsData = JSON.parse(fs.readFileSync(constructorsDataFilePath, 'utf-8'));
        let winners = constructorsData.filter(c => c.totalChampionshipWins > 0)
            .sort((a, b) => b.totalChampionshipWins - a.totalChampionshipWins);
        return winners.reduce((obj, value, index) => { obj[index] = value; return obj; }, {});
    } catch (error) {
        console.error('getConstructorWinners, error:', error);
        throw error;
    }
}
module.exports = getConstructorWinners;
