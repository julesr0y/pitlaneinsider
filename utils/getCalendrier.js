const { name } = require("ejs");
const getFromErgast = require("./getFromErgast"); // Fonction permettant de récupérer des données depuis l'API Ergast
const fs = require('fs'); // Module permettant de gérer les fichiers
const path = require('path'); // Module permettant de gérer les chemins de fichiers

/**
    * @function
    * @description Fonction permettant de récupérer le calendrier de la saison actuelle
    * @returns {Promise} - Promesse contenant la réponse de l'API.
    */
async function getCalendrierActuel() {
    const filePath = path.join(__dirname, '../cache/getCalendrier.json'); // On définit le chemin du fichier JSON
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

    var dataCalendar = await getFromErgast('current.json'); // On récupère les données du calendrier actuel

    var calendrierActuelFront = {}; // On créé un objet pour stocker les courses du calendrier
    const calendrierActuel = dataCalendar.MRData.RaceTable.Races; // On récupère le calendrier
    calendrierActuel.forEach(round => {
        let raceCalendar = {} // On créé un objet pour stocker les informations de la course
        raceCalendar.raceName = round.raceName; // On ajoute le nom de la course
        const countryName = (round.Circuit.Location.country).toLowerCase(); // On récupère le nom du pays de la course
        raceCalendar.country = countryName; // On ajoute le nom du pays de la course

        let session = {};

        if (round.hasOwnProperty('FirstPractice')) {
            session.FirstPractice = {
                type: 'FP1',
                date: convertDate(round.FirstPractice.date),
                time: convertTime(round.FirstPractice.time)
            };
        }
        if (round.hasOwnProperty('SecondPractice')) {
            session.SecondPractice = {
                type: 'FP2',
                date: convertDate(round.SecondPractice.date),
                time: convertTime(round.SecondPractice.time)
            };
        }
        if (round.hasOwnProperty('ThirdPractice')) {
            session.ThirdPractice = {
                type: 'FP3',
                date: convertDate(round.ThirdPractice.date),
                time: convertTime(round.ThirdPractice.time)
            };
        }
        if (round.hasOwnProperty('Sprint')) {
            session.Sprint = {
                type: 'S',
                date: convertDate(round.Sprint.date),
                time: convertTime(round.Sprint.time)
            };
        }
        if (round.hasOwnProperty('Qualifying')) {
            session.Qualifying = {
                type: 'Q',
                date: convertDate(round.Qualifying.date),
                time: convertTime(round.Qualifying.time)
            };
        }

        session.Race = {
            type: 'R',
            date: convertDate(round.date),
            time: convertTime(round.time)
        }

        raceCalendar.sessions = session;
        calendrierActuelFront[round.round] = raceCalendar;
    });

    // Convertir les données en chaîne JSON
    const dataJSON = JSON.stringify(calendrierActuelFront, null, 2);

    // Écrire les données dans un fichier JSON
    fs.writeFile(filePath, dataJSON, (err) => {
        if (err) {
            console.error('Une erreur est survenue lors de l\'écriture du fichier JSON :', err);
        } else {
            console.log('Les données ont été écrites avec succès dans le fichier JSON.');
        }
    });

    return calendrierActuelFront;
}

function convertDate(dateString) {
    var date = new Date(dateString);
    var day = date.getDate();
    var month = date.getMonth() + 1; // Les mois sont indexés à partir de 0 en JavaScript
    return (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month;
}

function convertTime(timeString) {
    var timeParts = timeString.split(':'); // Les heures sont le premier élément, les minutes sont le deuxième
    var hour = timeParts[0];
    var minute = timeParts[1];
    return minute === '00' ? hour + 'h' : hour + 'h' + minute;
}

module.exports = getCalendrierActuel;