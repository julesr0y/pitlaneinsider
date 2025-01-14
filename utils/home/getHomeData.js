const fs = require('fs');
const path = require('path');

/**
 * @description Returns data needed for home page
 * @async
 * @returns {Array}
 */
async function getHomeData() {
    try {
        const homeDataFilePath = path.join(__dirname, '../../data/home_data.json');
        const homeData = JSON.parse(fs.readFileSync(homeDataFilePath, 'utf-8'));
        return homeData;
    } catch (error) {
        console.error('getHomeData, error during execution :', error);
        throw error;
    }
}

module.exports = getHomeData;