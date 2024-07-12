/**
    * @function
    * @description Fonction permettant de vérifier si une session est bien existante, si non mais que les cookies existent, alors créé la session avec, sinon, redirige vers la page de connexion
    */
function requireSession(req, res, next) {
    if (req.session.user) { // Si la session existe
        next(); // On laisse passer la requête
    } else if ( // Sinon, si la session n'existe pas, mais que les cookies existent, alors on crée la session avec les cookies et on laisse passer la requête
        !req.session.user &&
        req.cookies.idUser &&
        req.cookies.email &&
        req.cookies.username &&
        req.cookies.nom &&
        req.cookies.prenom
    ) {
        req.session.user = { // On crée la session avec les cookies
            idUser: req.cookies.idUser,
            email: req.cookies.email,
            username: req.cookies.username,
            nom: req.cookies.nom,
            prenom: req.cookies.prenom
        };
        next(); // On laisse passer la requête
    } else {
        res.redirect("/signin"); // Sinon, on redirige vers la page de connexion
    }
}

module.exports = requireSession; //on exporte la fonction