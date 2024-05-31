/**
 * @function
 * @description Fonction permettant de vérifier si une session est bien existante
 */
function verifySession(req) {
    if (req.session.user) { // Si la session existe
        return true;
    } else if ( // Sinon, si la session n'existe pas, mais que les cookies existent, alors on crée la session avec les cookies
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
        return true;
    } else {
        return false;
    }
}

module.exports = verifySession; //on exporte la fonction