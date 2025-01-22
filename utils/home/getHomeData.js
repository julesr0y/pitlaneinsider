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
        const homeOTDDataFilePath = path.join(__dirname, '../../data/home_otd_data.json');
        const homeOTDData = JSON.parse(fs.readFileSync(homeOTDDataFilePath, 'utf-8'));
        return {
            homeData,
            homeOTDData
        };
    } catch (error) {
        console.error('getHomeData, error during execution :', error);
        throw error;
    }
}

module.exports = getHomeData;