const getFromErgast = require("./getFromErgast"); // Fonction permettant de récupérer des données depuis l'API Ergast
const fs = require('fs'); // Module permettant de gérer les fichiers
const path = require('path'); // Module permettant de gérer les chemins de fichiers

/**
 * @function
 * @description Fonction permettant de récupérer l'ensemble des pilotes ayant couru en F1
 * @param {boolean} update - Détermine si les données doivent être mises à jour.
 * @returns {Promise<Array>} - Une promesse contenant un tableau d'objets représentant chaque pilote avec son prénom, nom, date de naissance, nationalité et identifiant.
 */
async function getRetroPilotes(update) {
    try {
        const filePath = path.join(__dirname, '../cache/getRetroPilotes.json'); // On définit le chemin du fichier JSON
        const filePathUpdate = path.join(__dirname, '../cache/updates/getRetroPilotes.json'); // Chemin du fichier JSON de mise à jour

        // Vérifier si le fichier principal existe et que l'option update est désactivée
        if (!update && fs.existsSync(filePath)) {
            // Lire le contenu du fichier principal
            const dataF = fs.readFileSync(filePath, 'utf8');

            // Vérifier si le fichier n'est pas vide
            if (dataF) {
                // Convertir les données en JSON et les retourner
                return JSON.parse(dataF);
            }
        }

        // Récupérer les données depuis l'API Ergast
        const response = await getFromErgast('drivers.json?limit=859');
        const driverLists = response.MRData.DriverTable.Drivers;

        // Array pour stocker les informations des pilotes
        let drivers = [];

        driverLists.forEach(driverList => {
            const fname = driverList.givenName;
            const lname = driverList.familyName;
            const bday = driverList.dateOfBirth;
            const natio = driverList.nationality;
            const driverId = driverList.driverId;

            // Création d'un objet contenant les informations du pilote
            const driver = {
                firstName: fname,
                lastName: lname,
                birthday: bday,
                nationality: natio,
                driverId: driverId
            };

            drivers.push(driver); // Ajout du pilote au tableau
        });

        // Trier les pilotes par âge croissant
        drivers.sort((a, b) => {
            const ageA = new Date().getFullYear() - new Date(a.birthday).getFullYear();
            const ageB = new Date().getFullYear() - new Date(b.birthday).getFullYear();
            return ageA - ageB;
        });

        // Convertir les données en chaîne JSON
        const dataJSON = JSON.stringify(drivers, null, 2);

        // Écrire les données dans le fichier JSON de mise à jour
        fs.writeFileSync(filePathUpdate, dataJSON);

        // Copier les données du fichier de mise à jour vers le fichier principal
        fs.copyFileSync(filePathUpdate, filePath);

        return;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        throw error; // Propager l'erreur pour que le code appelant puisse la gérer
    }
}

module.exports = getRetroPilotes;
