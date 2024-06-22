const getWinners = require('./getWinners'); // On importe la fonction getWinners
const fs = require('fs'); // Module permettant de gérer les fichiers
const path = require('path'); // Module permettant de gérer les chemins de fichiers

/**
 * @function
 * @description Fonction permettant de récupérer les infos présentes sur la page Retro - Accueil
 * @param {boolean} update - Détermine si les données doivent être mises à jour
 * @returns {Promise<Array>} - Promesse contenant un tableau des trois pilotes les plus titrés
 */
async function getRetroAccueil(update) {
    try {
        const winners = await getWinners(false);

        const filePath = path.join(__dirname, '../cache/getRetroAccueil.json'); // On définit le chemin du fichier JSON principal
        const filePathUpdate = path.join(__dirname, '../cache/updates/getRetroAccueil.json'); // Chemin du fichier JSON de mise à jour

        if (!update) {
            // Vérifier si le fichier principal existe
            if (fs.existsSync(filePath)) {
                // Lire le contenu du fichier principal
                const data = fs.readFileSync(filePath, 'utf8');

                // Vérifier si le fichier n'est pas vide
                if (data) {
                    // Convertir les données en JSON et les retourner
                    return JSON.parse(data);
                }
            }
        } else {
            // Tri du tableau des gagnants par le nombre de victoires
            winners.sort((a, b) => b.wins - a.wins);

            // Prendre les trois premiers éléments (les plus titrés)
            const topThreeWinners = winners.slice(0, 3);

            // Convertir les données en chaîne JSON
            const dataJSON = JSON.stringify(topThreeWinners, null, 2);

            // Écrire les données dans le fichier de mise à jour
            fs.writeFileSync(filePathUpdate, dataJSON);

            // Copier les données du fichier de mise à jour vers le fichier principal
            fs.copyFileSync(filePathUpdate, filePath);

            return;
        }

        return [];
    } catch (error) {
        console.error('Erreur lors de la récupération des gagnants :', error);
        throw error;
    }
}

module.exports = getRetroAccueil;
