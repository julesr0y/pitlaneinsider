const fs = require('fs');
const path = require('path');

const driversData = require('../../data/f1db/f1db-drivers.json');
const entrantsDriversData = require('../../data/f1db/f1db-seasons-entrants-drivers.json');
const constructorsData = require('../../data/f1db/f1db-constructors.json');
const driverStandingsData = require('../../data/f1db/f1db-seasons-driver-standings.json');
const racesResultsData = require('../../data/f1db/f1db-races-race-results.json');
const racesData = require('../../data/f1db/f1db-races.json');

/**
 * @description Returns detailed data of a specific driver
 * @async
 * @param {String} driver_id 
 * @returns {Object}
 */
async function getDriverData(driver_id) {
    try {
        const driver = driversData.find(item => item.id === driver_id);
        if (!driver) {
            throw new Error(`Driver not found: ${driver_id}`);
        }

        const driverEntrants = entrantsDriversData.filter(e => e.driverId === driver_id);

        let firstYear = null;
        if (driverEntrants.length > 0) {
            firstYear = Math.min(...driverEntrants.map(e => e.year));
        }
        const numberOfSeasons = new Set(driverEntrants.map(e => e.year)).size;

        // Current Season Info (2026)
        const currentYear = 2026;
        let currentSeason = null;
        const currentEntrant = driverEntrants.find(e => e.year === currentYear && e.testDriver === false);
        if (currentEntrant) {
            currentSeason = {
                constructorId: currentEntrant.constructorId,
                races: 0,
                wins: 0,
                podiums: 0,
                points: 0
            };

            // Get 2026 races where this driver participated
            const races2026 = racesData.filter(r => r.year === currentYear).map(r => r.id);
            const driverResults2026 = racesResultsData.filter(r => r.driverId === driver_id && races2026.includes(r.raceId));

            currentSeason.races = driverResults2026.length;
            currentSeason.wins = driverResults2026.filter(r => r.positionNumber === 1).length;
            currentSeason.podiums = driverResults2026.filter(r => r.positionNumber >= 1 && r.positionNumber <= 3).length;
            currentSeason.points = driverResults2026.reduce((acc, r) => acc + r.points, 0);
        }

        // Teams history (one per year)
        const teamsHistory = [];
        driverEntrants.forEach(e => {
            const constructor = constructorsData.find(c => c.id === e.constructorId);
            if (constructor) {
                teamsHistory.push({
                    year: e.year,
                    constructor: constructor
                });
            }
        });
        teamsHistory.sort((a, b) => b.year - a.year);

        // Charts
        const standings = driverStandingsData.filter(s => s.driverId === driver_id).sort((a, b) => a.year - b.year);
        const chartData = [];

        // Count victories per year
        const allVictories = {};
        const driverWins = racesResultsData.filter(r => r.driverId === driver_id && r.positionNumber === 1);
        driverWins.forEach(win => {
            const race = racesData.find(r => r.id === win.raceId);
            if (race) {
                if (!allVictories[race.year]) {
                    allVictories[race.year] = [];
                }
                const circuit = require('../../data/f1db/f1db-circuits.json').find(c => c.id === race.circuitId);
                const grandPrix = require('../../data/f1db/f1db-grands-prix.json').find(gp => gp.id === race.grandPrixId);
                allVictories[race.year].push({
                    id: race.id,
                    country: circuit ? circuit.countryId : 'unknown',
                    shortName: grandPrix ? grandPrix.name : race.name
                });
            }
        });

        standings.forEach(s => {
            chartData.push({
                season: s.year,
                points: s.points,
                position: s.positionNumber || 99,
                victories: allVictories[s.year] ? allVictories[s.year].length : 0
            });
        });

        return {
            driver: driver,
            history: {
                firstYear: firstYear,
                numberOfSeasons: numberOfSeasons
            },
            currentSeason: currentSeason,
            teamsHistory: teamsHistory,
            charts: chartData,
            allVictories: allVictories
        };

    } catch (error) {
        console.error('getDriverData, error during execution :', error);
        throw error;
    }
}

module.exports = getDriverData;