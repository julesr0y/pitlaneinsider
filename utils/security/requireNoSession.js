/**
    * @function
    * @description Fonction permettant de vérifier si la session n'est pas existante, pour l'accès aux pages de connexion/inscription, sinon, redirige vers la page de profil
    */
function requireNoSession(req, res, next) {
    if ( // Si la session n'existe pas, et que les cookies n'existent pas, alors on laisse passer la requête
        !req.session.user &&
        !req.cookies.idUser &&
        !req.cookies.email &&
        !req.cookies.username &&
        !req.cookies.nom &&
        !req.cookies.prenom
    ) {
        next(); // On laisse passer la requête
    } else { // Sinon, si la session n'existe pas, mais que les cookies existent, alors on crée la session avec les cookies et on redirige vers la page de profil
        req.session.user = { // Sinon, on crée la session avec les cookies
            idUser: req.cookies.idUser,
            email: req.cookies.email,
            username: req.cookies.username,
            nom: req.cookies.nom,
            prenom: req.cookies.prenom
        };
        res.redirect("/profile"); // On redirige vers la page de profil
    }
}

module.exports = requireNoSession;