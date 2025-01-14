const fs = require('fs');
const path = require('path');

/**
 * @description Returns all cars from F1 history
 * @async
 * @returns {Array}
 */
async function getRetroCars() {
    try {
        const filePath = path.join(__dirname, '../../data/chassis.json');
        const file = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(file);
        var cars = [];
        data.forEach(item => {
            const car = {
                chassisId: item.chassisId,
                chassisFullName: item.chassisFullName
            };

            cars.push(car);
        });

        return cars;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        throw error;
    }
}

module.exports = getRetroCars;
