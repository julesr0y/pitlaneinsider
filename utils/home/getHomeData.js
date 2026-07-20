const fs = require('fs');
const path = require('path');

/**
 * @description Returns data needed for home page from f1db
 * @async
 * @returns {Object}
 */
async function getHomeData() {
    try {
        const currentYear = 2026;

        // F1DB Files
        const races = require('../../data/f1db/f1db-races.json').filter(r => r.year === currentYear);
        const results = require('../../data/f1db/f1db-races-race-results.json');
        const driverStandings = require('../../data/f1db/f1db-seasons-driver-standings.json').filter(s => s.year === currentYear);
        const constructorStandings = require('../../data/f1db/f1db-seasons-constructor-standings.json').filter(s => s.year === currentYear);

        const drivers = require('../../data/f1db/f1db-drivers.json');
        const constructors = require('../../data/f1db/f1db-constructors.json');
        const grandPrix = require('../../data/f1db/f1db-grands-prix.json');
        const countries = require('../../data/f1db/f1db-countries.json');

        // Helpers to get entities
        const getDriver = (id) => drivers.find(d => d.id === id) || {};
        const getConstructor = (id) => constructors.find(c => c.id === id) || {};
        const getCountry = (id) => countries.find(c => c.id === id) || {};
        const getGP = (id) => grandPrix.find(g => g.id === id) || {};

        // Find last race and next race
        let lastRace = null;
        let nextRaceInfo = null;
        const now = Date.now();

        for (let i = 0; i < races.length; i++) {
            // Find nextRace based on time
            if (!nextRaceInfo) {
                if (races[i].date && races[i].time) {
                    const raceEndTime = new Date(`${races[i].date}T${races[i].time}Z`).getTime() + (3 * 60 * 60 * 1000);
                    if (now <= raceEndTime) {
                        nextRaceInfo = races[i];
                    }
                } else {
                    nextRaceInfo = races[i];
                }
            }

            // Find lastRace based on actual results existing in DB
            if (results.some(r => r.raceId === races[i].id)) {
                lastRace = races[i];
            }
        }

        // Format Next Race
        let nextRaceData = null;
        if (nextRaceInfo) {
            const gp = getGP(nextRaceInfo.grandPrixId);
            const country = getCountry(gp.countryId);

            const sessions = [
                { name: 'FP1', date: nextRaceInfo.freePractice1Date, time: nextRaceInfo.freePractice1Time },
                { name: 'FP2', date: nextRaceInfo.freePractice2Date, time: nextRaceInfo.freePractice2Time },
                { name: 'FP3', date: nextRaceInfo.freePractice3Date, time: nextRaceInfo.freePractice3Time },
                { name: 'Sprint Qualifying', date: nextRaceInfo.sprintQualifyingDate, time: nextRaceInfo.sprintQualifyingTime },
                { name: 'Sprint', date: nextRaceInfo.sprintRaceDate, time: nextRaceInfo.sprintRaceTime },
                { name: 'Qualifications', date: nextRaceInfo.qualifyingDate, time: nextRaceInfo.qualifyingTime },
                { name: 'Race', date: nextRaceInfo.date, time: nextRaceInfo.time }
            ];

            let nextSessionName = 'Race';
            let nextSessionDate = nextRaceInfo.date;
            let nextSessionTime = nextRaceInfo.time;

            const now = Date.now();
            for (let s of sessions) {
                if (s.date && s.time) {
                    const sessionTimeObj = new Date(`${s.date}T${s.time}Z`).getTime();
                    if (sessionTimeObj > now) {
                        nextSessionName = s.name;
                        nextSessionDate = s.date;
                        nextSessionTime = s.time;
                        break;
                    }
                }
            }

            nextRaceData = {
                id: nextRaceInfo.id,
                name: gp.shortName || gp.fullName,
                country: country.id,
                circuitLayoutId: nextRaceInfo.circuitLayoutId,
                nextSessionName: nextSessionName,
                nextSessionDate: nextSessionDate,
                nextSessionTime: nextSessionTime
            };
        }

        // Format Last Race & Podium
        let lastPodiumLocalisation = null;
        let lastPodium = [];
        if (lastRace) {
            const gp = getGP(lastRace.grandPrixId);
            const country = getCountry(gp.countryId);
            lastPodiumLocalisation = {
                id: lastRace.id,
                name: gp.shortName || gp.fullName,
                country: country.id
            };

            const raceResults = results.filter(r => r.raceId === lastRace.id);
            const top3 = raceResults.filter(r => r.positionNumber >= 1 && r.positionNumber <= 3).sort((a, b) => a.positionNumber - b.positionNumber);

            top3.forEach(r => {
                const driver = getDriver(r.driverId);
                lastPodium.push({
                    position: r.positionNumber,
                    driverId: driver.id,
                    abbreviation: driver.threeLetterCode || driver.lastName.substring(0, 3).toUpperCase()
                });
            });
        }

        // Standings
        let formattedDriverStandings = driverStandings.sort((a, b) => a.positionNumber - b.positionNumber).map(s => {
            const d = getDriver(s.driverId);
            return {
                ...s,
                driver: d,
                position: s.positionNumber,
                lastName: d.lastName,
                constructorId: results.find(r => r.driverId === s.driverId && r.raceId >= races[0]?.id)?.constructorId || 'default',
            };
        });

        let formattedConstructorStandings = constructorStandings.sort((a, b) => a.positionNumber - b.positionNumber).map(s => {
            const c = getConstructor(s.constructorId);
            return {
                ...s,
                constructor: c,
                position: s.positionNumber,
                name: c.name
            };
        });

        // Leaders
        const driverLeader = formattedDriverStandings[0] ? {
            year: currentYear,
            driverId: formattedDriverStandings[0].driverId,
            firstName: formattedDriverStandings[0].driver.firstName,
            lastName: formattedDriverStandings[0].driver.lastName,
            abbreviation: formattedDriverStandings[0].driver.threeLetterCode || formattedDriverStandings[0].driver.lastName.substring(0, 3).toUpperCase(),
            position: 1,
            points: formattedDriverStandings[0].points,
            permanentNumber: formattedDriverStandings[0].driver.permanentNumber,
            // Fallback for constructorId: normally in entrants, but for now we might need to find it from race results if not in standings
            // Let's grab it from the first race result of that driver
            constructorId: results.find(r => r.driverId === formattedDriverStandings[0].driverId && r.raceId >= races[0].id)?.constructorId || 'default'
        } : null;

        const constructorLeader = formattedConstructorStandings[0] ? {
            year: currentYear,
            constructorId: formattedConstructorStandings[0].constructorId,
            name: formattedConstructorStandings[0].constructor.name,
            position: 1,
            points: formattedConstructorStandings[0].points
        } : null;

        const homeData = {
            nextRaceInfo: nextRaceData,
            lastPodiumLocalisation: lastPodiumLocalisation,
            lastPodium: lastPodium,
            driverStandings: formattedDriverStandings,
            constructorStandings: formattedConstructorStandings,
            driverLeader: driverLeader,
            constructorLeader: constructorLeader
        };

        return {
            homeData
        };
    } catch (error) {
        console.error('getHomeData, error during execution :', error);
        throw error;
    }
}

module.exports = getHomeData;
