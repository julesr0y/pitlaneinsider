const express = require('express');
const router = express.Router();

// fonctions
const dbConnexion = require('../config/database');
const requireSession = require('../utils/requireSession');

router.get("/profil", requireSession, async (req, res) => { // Page de profil
    var userInfos;
    if (dbConnexion.state === 'disconnected') {
        dbConnexion.connect(function (err) {
            if (err) throw err;
            console.log("Connected!");
        });
    }
    await new Promise((resolve, reject) => {
        dbConnexion.query('SELECT * FROM users WHERE idUser = ?', [req.session.user.idUser], function (err, rows) {
            if (err) {
                reject(err);
            } else {
                userInfos = rows[0];
                resolve(rows[0]);
            }
        });
    })
    res.render("profil", { userInfosFront: userInfos });
});

router.get("/edit", requireSession, async (req, res) => { // Page d'édition du profil
    var userInfos;
    await new Promise((resolve, reject) => {
        dbConnexion.query('SELECT * FROM users WHERE idUser = ?', [req.session.user.idUser], function (err, rows) {
            if (err) {
                reject(err);
            } else {
                userInfos = rows[0];
                resolve(rows[0]);
            }
        });
    })
    res.render("profilEdit", { userInfosFront: userInfos });
});

router.post("/profilEditProcess", requireSession, async (req, res) => { // Traitement de l'édition du profil
    const { nom, prenom, username, email, naissance } = req.body;
    await new Promise((resolve, reject) => {
        dbConnexion.query('UPDATE users SET nom = ?, prenom = ?, username = ?, email = ?, naissance = ? WHERE idUser = ?', [nom, prenom, username, email, naissance, req.session.user.idUser], function (err, rows) {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    })
    res.redirect("/profil");
});

module.exports = router;