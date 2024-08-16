const fs = require('fs');
const path = require('path');

/**
 * @description Returns all tracks from F1 history
 * @async
 * @returns {Array}
 */
async function getRetroTracks() {
    try {
        const filePath = path.join(__dirname, '../../data/all_tracks.json');
        const file = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(file);

        var allTracks = []
        data.forEach(function (track) {
            const trackData = {
                "id": track.id,
                "name": track.name,
                "fullName": track.fullName,
                "type": track.type,
                "placeName": track.placeName,
                "countryId": track.countryId,
                "totalRacesHeld": track.totalRacesHeld
            }
            allTracks.push(trackData);
        })

        return allTracks;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        throw error;
    }
}

module.exports = getRetroTracks;