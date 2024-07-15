const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const requireNoSession = require('../../utils/security/requireNoSession');
const dbPool = require('../../config/database'); // Importer le pool de connexions

// pages des formulaires
router.get('/signup', requireNoSession, (req, res) => {
    res.render('account/signup', { msg: req.query.msg }); // affichage de la page d'inscription
});

router.get('/signin', requireNoSession, (req, res) => {
    res.render('account/signin', { msg: req.query.msg }); // affichage de la page de connexion
});

router.post("/signinProcess", async (req, res) => {
    const { email, mdp } = req.body; // récupération des données du formulaire

    try {
        const [rows] = await dbPool.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];

        if (user && (await bcrypt.compare(mdp, user.mdp))) {
            // Stocker les informations de l'utilisateur dans la session et les cookies
            req.session.user = {
                idUser: user.idUser,
                email: email,
                username: user.username,
                nom: user.nom,
                prenom: user.prenom
            };
            // cookies pour la session (30 jours)
            res.cookie("idUser", user.idUser, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            res.cookie("email", email, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            res.cookie("username", user.username, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            res.cookie("nom", user.nom, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            res.cookie("prenom", user.prenom, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            res.redirect("/profile"); // redirection vers la page de profil
        } else {
            res.redirect("/signin?msg=mdporemailincorrect"); // redirection vers la page de connexion avec un message d'erreur
        }
    } catch (err) {
        console.error('Erreur lors de la connexion de l\'utilisateur:', err);
        res.redirect("/signin?msg=erreur"); // redirection vers la page de connexion avec un message d'erreur
    }
});

router.post("/signupProcess", async (req, res) => {
    const { email, username, nom, prenom, naissance, mdp, confirm_mdp } = req.body; // récupération des données du formulaire
    if (mdp !== confirm_mdp) { // si les mots de passe ne correspondent pas
        res.redirect("/signup?msg=mdpnotsame"); // redirection vers la page d'inscription avec un message d'erreur
        return;
    }
    const hashedPassword = bcrypt.hashSync(mdp, 10); // hachage du mot de passe

    try {
        const [result] = await dbPool.query('INSERT INTO users(email, username, nom, prenom, naissance, mdp) VALUES(?, ?, ?, ?, ?, ?)', [email, username, nom, prenom, naissance, hashedPassword]);
        const id_user = result.insertId;

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

        res.redirect('/profile'); // redirection vers la page de profil
    } catch (err) {
        console.error('Erreur lors de l\'inscription de l\'utilisateur:', err);
        res.redirect("/signup?msg=erreur"); // redirection vers la page d'inscription avec un message d'erreur
    }
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