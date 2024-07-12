const getFromErgast = require("./getFromErgast"); // Fonction permettant de récupérer des données depuis l'API Ergast
const fs = require('fs'); // Module permettant de gérer les fichiers
const path = require('path'); // Module permettant de gérer les chemins de fichiers

/**
 * @function
 * @description Fonction permettant de récupérer l'ensemble des pilotes ayant couru en F1
 * @param {boolean} update - Détermine si les données doivent être mises à jour.
 * @returns {Promise<Array>} - Une promesse contenant un tableau d'objets représentant chaque pilote avec son prénom, nom, date de naissance, nationalité et identifiant.
 */
async function getRetroPilotes() {
    try {
        const filePath = path.join(__dirname, '../python/dataPython/all_drivers_stats.json');
        const file = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(file); // On définit le chemin du fichier JSON
        var drivers = [];
        data.forEach(item => {
            const driver = {
                firstName: item.firstName,
                lastName: item.lastName,
                dateOfBirth: item.dateOfBirth,
                nationality: item.nationality,
                driverId: item.id
            };

            drivers.push(driver); // Ajout du pilote au tableau
        });

        return drivers;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        throw error; // Propager l'erreur pour que le code appelant puisse la gérer
    }
}

module.exports = getRetroPilotes;
