const getFromErgast = require("../getFromErgast");

async function getTrack(circuitId) {
    var trackData = await getFromErgast(`current/circuits/${circuitId}.json?limit=1000&offset=0`);
    return await new Promise((resolve, reject) => {
        const data = trackData.MRData.CircuitTable.Circuits[0];
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

        resolve(trackFront);
    });
}

module.exports = getTrack;