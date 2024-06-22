const getFromOpenF1 = require("./getFromOpenF1"); // Fonction permettant de récupérer des données depuis l'API OpenF1
const fs = require('fs'); // Module permettant de gérer les fichiers
const path = require('path'); // Module permettant de gérer les chemins de fichiers

const driverMapping = {
    "Verstappen": "max_verstappen",
    "Magnussen": "kevin_magnussen",
    "Sargeant": "sargeant",
    "Ricciardo": "ricciardo",
    "Gasly": "gasly",
    "Hamilton": "hamilton",
    "Sainz": "sainz",
    "Leclerc": "leclerc",
    "Bottas": "bottas",
    "Russell": "russell",
    "Perez": "perez",
    "Norris": "norris",
    "Stroll": "stroll",
    "Alonso": "alonso",
    "Ocon": "ocon",
    "Albon": "albon",
    "Tsunoda": "tsunoda",
    "Piastri": "piastri",
    "Zhou": "zhou",
    "Hulkenberg": "hulkenberg",
    "Bearman": "bearman",
};

const constructorMapping = {
    "Mercedes": "mercedes",
    "Red Bull Racing": "red_bull",
    "McLaren": "mclaren",
    "Aston Martin": "aston_martin",
    "Alpine": "alpine",
    "Ferrari": "ferrari",
    "RB": "RB",
    "Kick Sauber": "sauber",
    "Haas F1 Team": "haas",
    "Williams": "williams"
};

const nationalityMapping = {
    "NED": "Dutch",
    "DEN": "Danish",
    "USA": "American",
    "AUS": "Australian",
    "GBR": "British",
    "ESP": "Spanish",
    "MEX": "Mexican",
    "MON": "Monegasque",
    "FIN": "Finnish",
    "CAN": "Canadian",
    "FRA": "French",
    "CHN": "Chinese",
    "THA": "Thai",
    "JPN": "Japanese",
    "GER": "German"
}

/**
 * @function
 * @description Fonction permettant de récupérer la liste des pilotes actuels avec les détails de leur écurie
 * @param {boolean} update - Détermine si les données doivent être mises à jour
 * @returns {Promise} - Promesse contenant la réponse de l'API. Se présente sous la forme d'un tableau contenant les détails des pilotes et de leur écurie
 */
async function getActualPilotesWithConstructors(update) {
    const filePath = path.join(__dirname, '../cache/getActualPilotes.json'); // On définit le chemin du fichier JSON
    const filePathUpdate = path.join(__dirname, '../cache/updates/getActualPilotes.json');

    if (!update) {
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
    } else {
        const actualPilotes = await getFromOpenF1('drivers?session_key=latest');

        const dataPilotes = actualPilotes.map(pilote => {
            const driver_id = driverMapping[pilote.last_name] || pilote.last_name || "null";
            const constructor_id = constructorMapping[pilote.team_name] || pilote.team_name;
            const nationality = nationalityMapping[pilote.country_code];

            return {
                id: driver_id,
                firstName: pilote.first_name,
                lastName: pilote.last_name,
                nationality: nationality,
                number: pilote.driver_number,
                constructor: pilote.team_name,
                constructorId: constructor_id
            };
        });

        // Convertir les données en chaîne JSON
        const dataJSON = JSON.stringify(dataPilotes, null, 2);

        // Vérifier si les données récupérées depuis l'API ne sont pas vides
        if (dataPilotes.length === 0) {
            // Si les données de l'API sont vides, copier les données de filePath dans filePathUpdate
            if (fs.existsSync(filePath)) {
                const originalData = fs.readFileSync(filePath, 'utf8');
                if (originalData) {
                    fs.writeFileSync(filePathUpdate, originalData);
                }
            }
        } else {
            // Vider et écrire les données dans le fichier de mise à jour
            fs.writeFileSync(filePathUpdate, dataJSON);
            // Vider et écrire les données dans le fichier principal
            fs.writeFileSync(filePath, dataJSON);
        }
    }

    // Lire les données finales depuis le fichier principal et les retourner
    const finalData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(finalData);
}

module.exports = getActualPilotesWithConstructors;
