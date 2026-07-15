const fs = require('fs');

const chassisData = require('../../data/f1db/f1db-chassis.json');
const entrantsChassisData = require('../../data/f1db/f1db-seasons-entrants-chassis.json');
const entrantsEnginesData = require('../../data/f1db/f1db-seasons-entrants-engines.json');
const entrantsTyresData = require('../../data/f1db/f1db-seasons-entrants-tyre-manufacturers.json');
const raceResultsData = require('../../data/f1db/f1db-races-race-results.json');
const enginesData = require('../../data/f1db/f1db-engines.json');
const tyreManufacturersData = require('../../data/f1db/f1db-tyre-manufacturers.json');

/**
 * @description Returns data of a specific chassis using native f1db fields
 * @async
 * @param {String} chassis_id 
 * @returns {Object}
 */
async function getChassisData(chassis_id) {
    try {
        const chassis = chassisData.find(item => item.id === chassis_id);
        if (!chassis) {
            throw new Error(`Chassis not found: ${chassis_id}`);
        }

        // Find all entrants that used this chassis
        const entrantsChassis = entrantsChassisData.filter(ec => ec.chassisId === chassis_id);

        const combinations = entrantsChassis.map(ec => ({
            year: ec.year,
            entrantId: ec.entrantId,
            constructorId: ec.constructorId
        }));

        // Years
        const years = [...new Set(combinations.map(c => c.year))].sort((a, b) => b - a);

        // Deduplicate combinations for results processing to avoid double counting
        // A constructor might have multiple entrants in a year using the same chassis (rare, but possible).
        const uniqueCombinations = [];
        combinations.forEach(c => {
            if (!uniqueCombinations.find(uc => uc.year === c.year && uc.constructorId === c.constructorId)) {
                uniqueCombinations.push({ year: c.year, constructorId: c.constructorId });
            }
        });

        let wins = 0;
        let podiums = 0;
        let poles = 0;

        uniqueCombinations.forEach(combo => {
            const results = raceResultsData.filter(r => r.year === combo.year && r.constructorId === combo.constructorId);
            
            results.forEach(r => {
                if (r.positionNumber === 1) wins++;
                if (r.positionNumber >= 1 && r.positionNumber <= 3) podiums++;
                if (r.polePosition === true) poles++;
            });
        });

        // Engines
        const enginesSet = new Set();
        const enginesList = [];
        combinations.forEach(c => {
            const entrantsEngines = entrantsEnginesData.filter(ee => ee.entrantId === c.entrantId && ee.year === c.year);
            entrantsEngines.forEach(ee => {
                if (ee.engineId && !enginesSet.has(ee.engineId)) {
                    enginesSet.add(ee.engineId);
                    const engineObj = enginesData.find(e => e.id === ee.engineId);
                    if (engineObj) {
                        enginesList.push(engineObj);
                    }
                }
            });
        });

        // Tyres
        const tyresSet = new Set();
        const tyresList = [];
        combinations.forEach(c => {
            const entrantsTyres = entrantsTyresData.filter(et => et.entrantId === c.entrantId && et.year === c.year);
            entrantsTyres.forEach(et => {
                if (et.tyreManufacturerId && !tyresSet.has(et.tyreManufacturerId)) {
                    tyresSet.add(et.tyreManufacturerId);
                    const tyreObj = tyreManufacturersData.find(t => t.id === et.tyreManufacturerId);
                    if (tyreObj) {
                        tyresList.push(tyreObj);
                    }
                }
            });
        });

        return {
            chassis: chassis,
            years: years,
            wins: wins,
            podiums: podiums,
            poles: poles,
            engines: enginesList,
            tyres: tyresList
        };

    } catch (error) {
        console.error('getChassisData, error during execution :', error);
        throw error;
    }
}

module.exports = getChassisData;