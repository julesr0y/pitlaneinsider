const getFromErgast = require("../getFromErgast"); // Fonction permettant de récupérer des données depuis l'API Ergast

/**
 * @function
 * @description Fonction permettant de récupérer les informations d'un circuit spécifique
 * @param {string} circuitId - L'identifiant du circuit
 * @returns {Promise} - Promesse contenant les informations du circuit
 */
async function getTrack(circuitId) {
    var trackData = await getFromErgast(`current/circuits/${circuitId}.json?limit=1000&offset=0`); // On récupère les données des circuits
    return await new Promise((resolve, reject) => { // On créé la promesse
        const data = trackData.MRData.CircuitTable.Circuits[0]; // On récupère les données
        const trackId = data.circuitId;
        const trackName = data.circuitName;
        const trackLocality = data.Location.locality;
        const trackCountry = data.Location.country;

        var trackFront = {
            trackId,
            trackName,
            trackLocality,
            trackCountry
        };

        resolve(trackFront); // On résout la promesse
    });
}

module.exports = getTrack;