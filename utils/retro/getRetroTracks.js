const getFromErgast = require("../getFromErgast");

async function getTracks() {
    var tracksData = await getFromErgast(`current/circuits.json?limit=1000&offset=0`);
    return await new Promise((resolve, reject) => {
        const data = tracksData.MRData.CircuitTable.Circuits;
        var tracksFront = [];
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

        resolve(tracksFront);
    });
}

module.exports = getTracks;