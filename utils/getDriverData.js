const getFromErgast = require("./getFromErgast"); // Fonction permettant de récupérer des données depuis l'API Ergast

/**
    * @function
    * @description Fonction permettant de récupérer les données d'un pilote
    * @returns {Promise} - Promesse contenant la réponse de l'API. Se présente sous la forme d'un objet JSON : name, surname, birthDate, age, permanentNumber, nationality
    */
async function getDriverData(driver_id) {
    var driverData = await getFromErgast(`drivers/${driver_id}.json`);
    return await new Promise((resolve, reject) => {
        const driver = driverData.MRData.DriverTable.Drivers[0];
        var name = driver.familyName;
        var surname = driver.givenName;
        var birthDate = new Date(driver.dateOfBirth); // Convertir directement en Date
        const convertedDate = birthDate.toLocaleDateString("fr-FR");
        const currentDate = new Date();
        const ageDiff = currentDate - birthDate; // Utiliser l'objet Date pour le calcul
        const millisecondsPerYear = 1000 * 60 * 60 * 24 * 365.25;
        const age = Math.floor(ageDiff / millisecondsPerYear);
        var permanentNumber = driver.permanentNumber;
        var nationality = driver.nationality;

        // Créer un objet avec les données du pilote
        var driverDataFront = {
            name: name,
            surname: surname,
            birthDate: convertedDate,
            age: age,
            permanentNumber: permanentNumber,
            nationality: nationality
        };

        resolve(driverDataFront); // Résoudre la promesse avec l'objet
    });
}

module.exports = getDriverData;