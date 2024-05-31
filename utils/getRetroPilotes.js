const getFromErgast = require("./getFromErgast"); // Fonction permettant de récupérer des données depuis l'API Ergast
const fs = require('fs'); // Module permettant de gérer les fichiers
const path = require('path'); // Module permettant de gérer les chemins de fichiers

/**
 * @function
 * @description Fonction permettant de récupérer l'ensemble des pilotes ayant courus en F1
 * @returns {Promise<Array>}
 */
async function getRetroPilotes() {
    try {

        const filePath = path.join(__dirname, '../cache/getRetroPilotes.json'); // On définit le chemin du fichier JSON
        // Vérifier si le fichier existe
        if (fs.existsSync(filePath)) {
            // Lire le contenu du fichier
            const dataF = fs.readFileSync(filePath, 'utf8');

            // Vérifier si le fichier n'est pas vide
            if (dataF) {
                // Convertir les données en JSON et les retourner
                return JSON.parse(dataF);
            }
        }

        const data = await getFromErgast('drivers.json?limit=859');
        const driverLists = data.MRData.DriverTable.Drivers;

        // Array pour stocker les données des pilotes
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

        // Sort drivers by age
        drivers.sort((a, b) => {
            const ageA = new Date().getFullYear() - new Date(a.birthday).getFullYear();
            const ageB = new Date().getFullYear() - new Date(b.birthday).getFullYear();
            return ageA - ageB;
        });

        // Convertir les données en chaîne JSON
        const dataJSON = JSON.stringify(drivers, null, 2);
        // Écrire les données dans un fichier JSON
        fs.writeFile(filePath, dataJSON, (err) => {
            if (err) {
                console.error('Une erreur est survenue lors de l\'écriture du fichier JSON :', err);
            } else {
                console.log('Les données ont été écrites avec succès dans le fichier JSON.');
            }
        });

        return drivers;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        throw error; // Propager l'erreur pour que le code appelant puisse la gérer
    }
}

module.exports = getRetroPilotes;
