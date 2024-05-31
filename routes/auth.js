const express = require('express');
const router = express.Router();

// fonctions
const bcrypt = require('bcrypt');
const requireNoSession = require('../utils/requireNoSession');
const dbConnexion = require('../config/database');

// pages des formulaires
router.get('/signup', requireNoSession, (req, res) => {
    res.render('signup', { msg: req.query.msg }); // affichage de la page d'inscription
});

router.get('/signin', requireNoSession, (req, res) => {
    res.render('signin', { msg: req.query.msg }); // affichage de la page de connexion
});

router.post("/signinProcess", async (req, res) => {
    const { email, mdp } = req.body; // récupération des données du formulaire
    await new Promise((resolve, reject) => { //promesse pour la requête SQL
        dbConnexion.query('SELECT * FROM users WHERE email = ?', [email], function (err, rows) {
            if (err) { // si erreur
                reject(err); // rejet de la promesse
            } else {
                resolve(rows[0]); // résolution de la promesse
            }
        });
    })
        .then(async (row) => { // si la promesse est résolue
            if (row && (await bcrypt.compare(mdp, row.mdp))) { // si le mot de passe est correct
                // Stocker les informations de l'utilisateur dans la session et les cookies
                req.session.user = {
                    idUser: row.idUser,
                    email: email,
                    username: row.username,
                    nom: row.nom,
                    prenom: row.prenom
                };
                // cookies pour la session (30 jours)
                res.cookie("idUser", row.idUser, {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                });
                res.cookie("email", email, {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                });
                res.cookie("username", row.username, {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                });
                res.cookie("nom", row.nom, {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                });
                res.cookie("prenom", row.prenom, {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                });
                res.redirect("/profil"); // redirection vers la page de profil
            } else {
                res.redirect("/signin?msg=mdporemailincorrect"); // redirection vers la page de connexion avec un message d'erreur
            }
        })
        .catch((err) => {
            // Gérer l'erreur
            console.error(err);
            res.redirect("/signin?msg=erreur"); // redirection vers la page de connexion avec un message d'erreur
        });
});

router.post("/signupProcess", async (req, res) => {
    const { email, username, nom, prenom, naissance, mdp, confirm_mdp } = req.body; // récupération des données du formulaire
    if (mdp !== confirm_mdp) { // si les mots de passe ne correspondent pas
        res.redirect("/signup?msg=mdpnotsame"); // redirection vers la page d'inscription avec un message d'erreur
        return;
    }
    const hashedPassword = bcrypt.hashSync(mdp, 10); // hachage du mot de passe
    let id_user; // variable pour stocker l'id de l'utilisateur (depuis la db)
    await new Promise((resolve, reject) => { // promesse pour la requête SQL
        dbConnexion.query('INSERT INTO users(email, username, nom, prenom, naissance, mdp) VALUES(?, ?, ?, ?, ?, ?)', [email, username, nom, prenom, naissance, hashedPassword], function (err, rows) { // requête SQL
            if (err) { // si erreur
                reject(err); // rejet de la promesse
            }
            else { // si pas d'erreur
                id_user = rows.insertId; // récupération de l'id de l'utilisateur (dernier inséré)
                resolve(rows); // résolution de la promesse
            }
        });
    });

    // Stocker les informations de l'utilisateur dans la session et les cookies
    req.session.user = {
        idUser: id_user,
        email: email,
        username: username,
        nom: nom,
        prenom: prenom
    };

    // cookies pour la session (30 jours)
    res.cookie("idUser", id_user, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    });
    res.cookie("email", email, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    });
    res.cookie("username", username, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    });
    res.cookie("nom", nom, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    });
    res.cookie("prenom", prenom, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    });

    res.redirect('/profil'); // redirection vers la page de profil
});

// Déconnexion
router.get("/signout", (req, res) => {
    // Détruire la session
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }

        // Supprimer les cookies
        res.clearCookie("idUser");
        res.clearCookie("email");
        res.clearCookie("username");
        res.clearCookie("nom");
        res.clearCookie("prenom");

        // Rediriger vers la page de connexion
        res.redirect("/signin");
    });
});

module.exports = router;