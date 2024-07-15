const express = require('express');
const router = express.Router();
const dbPool = require('../../config/database'); // Importer le pool de connexions
const requireSession = require('../../utils/security/requireSession'); // Importer le middleware de session

router.get("/profile", requireSession, async (req, res) => {
    try {
        const [rows] = await dbPool.query('SELECT * FROM users WHERE idUser = ?', [req.session.user.idUser]);
        const userInfos = rows[0];
        const adminValue = rows[0].admin;
        res.render("account/profile", { userInfosFront: userInfos, adminValue: adminValue });
    } catch (err) {
        console.error('Erreur lors de la récupération des informations utilisateur:', err);
        res.status(500).send('Erreur interne du serveur');
    }
});

router.get("/edit", requireSession, async (req, res) => {
    try {
        const [rows] = await dbPool.query('SELECT * FROM users WHERE idUser = ?', [req.session.user.idUser]);
        const userInfos = rows[0];
        res.render("account/profileEdit", { userInfosFront: userInfos });
    } catch (err) {
        console.error('Erreur lors de la récupération des informations utilisateur pour l\'édition:', err);
        res.status(500).send('Erreur interne du serveur');
    }
});

router.post("/profileEditProcess", requireSession, async (req, res) => {
    const { nom, prenom, username, email, naissance, language, theme } = req.body;
    try {
        await dbPool.query('UPDATE users SET nom = ?, prenom = ?, username = ?, email = ?, naissance = ?, language = ?, theme = ? WHERE idUser = ?',
            [nom, prenom, username, email, naissance, language, theme, req.session.user.idUser]);
        res.redirect("/profile");
    } catch (err) {
        console.error('Erreur lors de la mise à jour des informations utilisateur:', err);
        res.status(500).send('Erreur interne du serveur');
    }
});

module.exports = router;