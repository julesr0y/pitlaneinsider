const getWinners = require('./getWinners'); // On importe la fonction getWinners
const fs = require('fs'); // Module permettant de gérer les fichiers
const path = require('path'); // Module permettant de gérer les chemins de fichiers

/**
 * @function
 * @description Fonction permettant de récupérer les infos présentes sur la page Retro - Accueil
 * @returns {Promise<Array>}
 */
async function getRetroAccueil() {
    try {
        const winners = await getWinners();
        const filePath = path.join(__dirname, '../cache/getRetroAccueil.json'); // On définit le chemin du fichier JSON
        // Vérifier si le fichier existe
        if (fs.existsSync(filePath)) {
            // Lire le contenu du fichier
            const data = fs.readFileSync(filePath, 'utf8');

            // Vérifier si le fichier n'est pas vide
            if (data) {
                // Convertir les données en JSON et les retourner
                return JSON.parse(data);
            }
        }

        // Tri du tableau des gagnants par le nombre de victoires
        winners.sort((a, b) => b.wins - a.wins);

        // Prendre les trois premiers éléments (les plus titrés)
        const topThreeWinners = winners.slice(0, 3);

        // Convertir les données en chaîne JSON
        const dataJSON = JSON.stringify(topThreeWinners, null, 2);

        // Écrire les données dans un fichier JSON
        fs.writeFile(filePath, dataJSON, (err) => {
            if (err) {
                console.error('Une erreur est survenue lors de l\'écriture du fichier JSON :', err);
            } else {
                console.log('Les données ont été écrites avec succès dans le fichier JSON.');
            }
        });

        return topThreeWinners;
    } catch (error) {
        console.error('Erreur lors de la récupération des gagnants :', error);
        throw error;
    }
}

// Utilisation de la fonction pour obtenir les trois pilotes les plus titrés
module.exports = getRetroAccueil;
