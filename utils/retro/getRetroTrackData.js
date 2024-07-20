const fs = require('fs');
const path = require('path');

/**
 * @description Returns data of a specific track
 * @async
 * @param {String} trackId 
 * @returns {Array}
 */
async function getRetroTrackData(trackId) {
    try {
        const filePath = path.join(__dirname, '../../python/dataPython/all_tracks.json');
        const file = fs.readFileSync(filePath, 'utf-8');
        var data = JSON.parse(file);
        data = data.filter(item => item.id === trackId);
        data = data[0]

        const trackData = {
            id: data.id,
            name: data.name,
            fullName: data.fullName,
            type: data.type,
            placeName: data.placeName,
            countryId: data.countryId,
            totalRacesHeld: data.totalRacesHeld
        }

        return trackData;
    }
    catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        throw error;
    }
}

module.exports = getRetroTrackData;