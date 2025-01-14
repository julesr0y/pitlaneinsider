const fs = require('fs');
const path = require('path');

/**
 * @description Returns an array with driver's championship winners and their number of titles
 * @async
 * @returns {Array}
 */
async function getDriverWinners() {
    try {
        const titledDriversFilePath = path.join(__dirname, '../../data/titled_drivers.json');
        const titledDriversData = JSON.parse(fs.readFileSync(titledDriversFilePath, 'utf-8'));
        var titledDriversFrontData = {};

        titledDriversData.forEach(function (driver) {
            if (titledDriversFrontData[driver["driverId"]]) {
                titledDriversFrontData[driver["driverId"]].titles++;
            } else {
                titledDriversFrontData[driver["driverId"]] = {
                    "driverId": driver["driverId"],
                    "firstName": driver["firstName"],
                    "lastName": driver["lastName"],
                    "abbreviation": driver["abbreviation"],
                    "titles": 1
                };
            }
        });

        let sortedEntries = Object.entries(titledDriversFrontData)
            .sort((a, b) => b[1].titles - a[1].titles);

        let sortedDrivers = sortedEntries.reduce((obj, [key, value], index) => {
            obj[index] = { key, ...value };
            return obj;
        }, {});

        return sortedDrivers;
    } catch (error) {
        console.error('getDriverWinners, error during execution :', error);
        throw error;
    }
}

module.exports = getDriverWinners;
