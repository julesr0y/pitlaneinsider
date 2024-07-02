const express = require('express');
const router = express.Router();
const dbPool = require('../config/database'); // Importer le pool de connexions
const { v4: uuidv4 } = require('uuid');
const requireSession = require('../utils/requireSession'); // Importer le middleware de session
const requireAdmin = require('../utils/requireAdmin'); // Importer le middleware des admin
const getLastPodium = require("../utils/getLastPodium"); // Fonction permettant de récupérer le podium de la dernière course
const getDriversActualStandings = require("../utils/getDriversActualStanding"); // Fonction permettant de récupérer le classement actuel des pilotes
const getTeamsActualStandings = require("../utils/getTeamsActualStandings"); // Fonction permettant de récupérer le classement actuel des écuries
const getCalendrier = require("../utils/getCalendrier"); // Fonction permettant de récupérer le calendrier de la saison actuelle
const getActualPilotes = require("../utils/getActualPilotes"); // Fonction permettant de récupérer les pilotes actuels
const getActualTeams = require("../utils/getActualTeams"); // Fonction permettant de récupérer les équipes de la saison actuelle
const getEcuries = require("../utils/getEcuries"); // Fonction permettant de récupérer les écuries retro
const getRetroAccueil = require("../utils/getRetroAccueil"); // Fonction permettant de récupérer les infos présentes sur la page Retro - Accueil
const getWinners = require("../utils/getWinners"); // Fonction permettant de récupérer les gagnants
const getCircuits = require('../utils/getCircuits'); // Fonction permettant de récupérer les circuits
const getRetroPilotes = require('../utils/getRetroPilotes'); // Fonction permettant de récupérer les pilotes retro

router.get("/administration/panel", requireSession, requireAdmin, async (req, res) => {
    res.render("admin_panel");
});

router.get("/administration/updateCaches", requireSession, requireAdmin, async (req, res) => {
    const taskId = uuidv4(); // Générer un identifiant de tâche unique
    updateCaches(taskId); // Démarrer la mise à jour des caches en arrière-plan

    res.json({ taskId });
});

// Fonction pour mettre à jour les caches en arrière-plan
async function updateCaches(taskId) {
    try {
        // await getActualPilotes(true);
        await getDriversActualStandings(true);
        await getCalendrier(true);
        // await getActualTeams(true);
        await getEcuries(true);
        await getLastPodium(true);
        await getRetroAccueil(true);
        await getWinners(true);
        await getCircuits(true);
        await getRetroPilotes(true);
        await getTeamsActualStandings(true);

        console.log(`Mise à jour des caches terminée pour la tâche ${taskId}`);
    } catch (error) {
        console.error(`Erreur lors de la mise à jour des caches pour la tâche ${taskId}:`, error);
    }
}

// Route pour vérifier l'état de la tâche
router.get("/checkTaskStatus", (req, res) => {
    const { taskId } = req.query;

    // Fonction pour vérifier l'état de la tâche
    function checkTaskStatus(taskId) {
        // Vous pouvez implémenter votre propre logique ici pour vérifier l'état de la tâche
        // Par exemple, vérifier si la tâche correspondant à taskId est terminée ou non
        // Pour cet exemple, nous allons simplement renvoyer 'completed' après un court délai
        setTimeout(() => {
            res.send('completed');
        }, 2000); // Simuler une attente de 2 secondes pour la démonstration
    }

    // Appel de la fonction pour vérifier l'état de la tâche
    checkTaskStatus(taskId);
});

module.exports = router;