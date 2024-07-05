const fs = require('fs'); // Module permettant de gérer les fichiers
const path = require('path'); // Module permettant de gérer les chemins de fichiers

async function getHomeData() {
    try {
        const filePath = path.join(__dirname, '../python/dataPython/home_data.json');
        const file = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(file); // On définit le chemin du fichier JSON
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        throw error; // Propager l'erreur pour que le code appelant puisse la gérer
    }
}

module.exports = getHomeData;