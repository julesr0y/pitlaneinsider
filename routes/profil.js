const express = require('express');
const router = express.Router();
const dbPool = require('../config/database'); // Importer le pool de connexions
const requireSession = require('../utils/requireSession'); // Importer le middleware de session

router.get("/profil", requireSession, async (req, res) => {
    try {
        const [rows] = await dbPool.query('SELECT * FROM users WHERE idUser = ?', [req.session.user.idUser]);
        const userInfos = rows[0];
        const adminValue = rows[0].admin;
        res.render("profil", { userInfosFront: userInfos, adminValue: adminValue });
    } catch (err) {
        console.error('Erreur lors de la récupération des informations utilisateur:', err);
        res.status(500).send('Erreur interne du serveur');
    }
});

router.get("/edit", requireSession, async (req, res) => {
    try {
        const [rows] = await dbPool.query('SELECT * FROM users WHERE idUser = ?', [req.session.user.idUser]);
        const userInfos = rows[0];
        res.render("profilEdit", { userInfosFront: userInfos });
    } catch (err) {
        console.error('Erreur lors de la récupération des informations utilisateur pour l\'édition:', err);
        res.status(500).send('Erreur interne du serveur');
    }
});

router.post("/profilEditProcess", requireSession, async (req, res) => {
    const { nom, prenom, username, email, naissance } = req.body;
    try {
        await dbPool.query('UPDATE users SET nom = ?, prenom = ?, username = ?, email = ?, naissance = ? WHERE idUser = ?',
            [nom, prenom, username, email, naissance, req.session.user.idUser]);
        res.redirect("/profil");
    } catch (err) {
        console.error('Erreur lors de la mise à jour des informations utilisateur:', err);
        res.status(500).send('Erreur interne du serveur');
    }
});

module.exports = router;