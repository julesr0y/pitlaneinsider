const getFromErgast = require("./getFromErgast"); // Fonction permettant de récupérer des données depuis l'API Ergast

/**
 * @function
 * @description Fonction permettant de récupérer les informations d'une écurie spécifique
 * @param {string} teamId - L'identifiant de l'écurie
 * @returns {Promise} - Promesse contenant les informations de l'écurie
 */
async function getTeamInfo(teamId) {
    try {
        const dataTeam = await getFromErgast(`current/constructors/${teamId}.json`);
        const team = dataTeam.MRData.ConstructorTable.Constructors[0];
        const teamName = team.name;
        const teamid = team.constructorId;
        const teamNationality = team.nationality;

        const dataDrivers = await getFromErgast(`current/constructors/${teamId}/drivers.json`);

        const drivers = dataDrivers.MRData.DriverTable.Drivers;
        const driversInfo = drivers.map(driver => ({
            name: `${driver.givenName} ${driver.familyName}`,
            number: driver.permanentNumber,
            nationality: (driver.nationality).toLowerCase(),
            driverId: driver.driverId
        }));

        const teamInfo = {
            teamName,
            teamid,
            teamNationality,
            drivers: driversInfo
        };

        return teamInfo;
    } catch (error) {
        throw error;
    }
}

module.exports = getTeamInfo;