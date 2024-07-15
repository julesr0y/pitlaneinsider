const fs = require('fs');
const path = require('path');

/**
 * @description Returns data needed for home page
 * @async
 * @returns {Array}
 */
async function getHomeData() {
    try {
        const filePath = path.join(__dirname, '../../python/dataPython/home_data.json');
        const file = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(file);
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        throw error;
    }
}

module.exports = getHomeData;