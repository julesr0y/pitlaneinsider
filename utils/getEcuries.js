const fs = require('fs'); // Module permettant de gérer les fichiers
const path = require('path'); // Module permettant de gérer les chemins de fichiers

async function getTeams() {
    try {
        const filePath = path.join(__dirname, '../python/dataPython/all_teams_stats.json');
        const file = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(file); // On définit le chemin du fichier JSON

        var allTeams = []
        data.forEach(function (team) {
            const teamData = {
                constructorId: team.constructorId,
                name: team.name,
                fullName: team.fullName
            }
            allTeams.push(teamData);
        })

        return allTeams;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        throw error; // Propager l'erreur pour que le code appelant puisse la gérer
    }
}

module.exports = getTeams;