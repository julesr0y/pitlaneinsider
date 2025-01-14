const fs = require('fs');
const path = require('path');

/**
 * @description Returns data needed for home page
 * @async
 * @returns {Array}
 */
async function getHomeData() {
    try {
        const filePath = path.join(__dirname, '../../data/home_data.json');
        const file = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(file);
        return data;
    } catch (error) {
        console.error('getHomeData, error during execution :', error);
        throw error;
    }
}

module.exports = getHomeData;