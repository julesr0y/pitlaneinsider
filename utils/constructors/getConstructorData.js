const fs = require('fs');
const path = require('path');

const constructorsData = require('../../data/f1db/f1db-constructors.json');
const seasonsConstructorsData = require('../../data/f1db/f1db-seasons-constructors.json');
const entrantsChassisData = require('../../data/f1db/f1db-seasons-entrants-chassis.json');
const entrantsDriversData = require('../../data/f1db/f1db-seasons-entrants-drivers.json');
const chassisData = require('../../data/f1db/f1db-chassis.json');
const driversData = require('../../data/f1db/f1db-drivers.json');

/**
 * @description Returns detailed data of a specific constructor using f1db
 * @async
 * @param {String} constructorId_param
 * @returns {Object}
 */
async function getConstructorData(constructorId_param) {
    try {
        const constructor = constructorsData.find(item => item.id === constructorId_param);
        if (!constructor) {
            throw new Error(`Constructor not found: ${constructorId_param}`);
        }

        const constructorSeasons = seasonsConstructorsData.filter(item => item.constructorId === constructorId_param);

        let firstYear = null;
        if (constructorSeasons.length > 0) {
            firstYear = Math.min(...constructorSeasons.map(s => s.year));
        }

        const numberOfSeasons = new Set(constructorSeasons.map(s => s.year)).size;

        const currentYear = 2026;
        const currentSeasonRecord = constructorSeasons.find(s => s.year === currentYear);
        let currentSeason = null;

        if (currentSeasonRecord) {
            currentSeason = {
                chassis: null,
                drivers: []
            };

            const entrantChassis = entrantsChassisData.find(e => e.year === currentYear && e.constructorId === constructorId_param);
            if (entrantChassis) {
                const chassis = chassisData.find(c => c.id === entrantChassis.chassisId);
                if (chassis) {
                    currentSeason.chassis = chassis;
                }
            }

            const entrantDrivers = entrantsDriversData.filter(e => e.year === currentYear && e.constructorId === constructorId_param && !e.testDriver);
            entrantDrivers.forEach(ed => {
                const driver = driversData.find(d => d.id === ed.driverId);
                if (driver) {
                    currentSeason.drivers.push(driver);
                }
            });
        }

        return {
            constructor: constructor,
            history: {
                firstYear: firstYear,
                numberOfSeasons: numberOfSeasons
            },
            currentSeason: currentSeason
        };

    } catch (error) {
        console.error('getConstructorData, error during execution :', error);
        throw error;
    }
}

module.exports = getConstructorData;