const fs = require('fs');
const path = require('path');

/**
 * @description Returns an array with constructor's championship winners and their number of titles
 * @async
 * @returns {Array}
 */
async function getConstructorWinners() {
    try {
        const titledConstructorsFilePath = path.join(__dirname, '../../data/titled_constructors.json');
        const titledConstructorsData = JSON.parse(fs.readFileSync(titledConstructorsFilePath, 'utf-8'));
        var titledConstructorsFrontData = {};

        titledConstructorsData.forEach(function (constructor) {
            if (titledConstructorsFrontData[constructor["constructorId"]]) {
                titledConstructorsFrontData[constructor["constructorId"]].titles++;
            } else {
                titledConstructorsFrontData[constructor["constructorId"]] = {
                    "constructorId": constructor["constructorId"],
                    "name": constructor["name"],
                    "titles": 1
                };
            }
        });

        let sortedEntries = Object.entries(titledConstructorsFrontData)
            .sort((a, b) => b[1].titles - a[1].titles);

        let sortedConstructors = sortedEntries.reduce((obj, [key, value], index) => {
            obj[index] = { key, ...value };
            return obj;
        }, {});

        return sortedConstructors;
    } catch (error) {
        console.error('getConstructorWinners, error during execution :', error);
        throw error;
    }
}

module.exports = getConstructorWinners;
