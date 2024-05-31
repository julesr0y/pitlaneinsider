const getFromErgast = require("./getFromErgast"); // Fonction permettant de récupérer des données depuis l'API Ergast

/**
 * @function
 * @description Fonction permettant de récupérer les circuits
 * @returns {Promise}
 */
async function getTracks() {
    var tracksData = await getFromErgast(`current/circuits.json?limit=1000&offset=0`); // On récupère les données des circuits
    return await new Promise((resolve, reject) => { // On créé la promesse
        const data = tracksData.MRData.CircuitTable.Circuits; // On récupère les données
        var tracksFront = []; // On créé un tableau pour stocker les données des circuits
        data.forEach(track => {
            const trackId = track.circuitId;
            const trackName = track.circuitName;
            const trackLocality = track.Location.locality;
            const trackCountry = track.Location.country;
            tracksFront.push({
                trackId,
                trackName,
                trackLocality,
                trackCountry
            });
        });

        resolve(tracksFront); // On résout la promesse
    });
}

module.exports = getTracks;