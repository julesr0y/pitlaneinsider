/**
 * @description Verify if session exists
 */
function verifySession(req) {
    if (req.session.user) {
        return true;
    } else if (
        !req.session.user &&
        req.cookies.idUser &&
        req.cookies.email &&
        req.cookies.username &&
        req.cookies.nom &&
        req.cookies.prenom
    ) {
        req.session.user = {
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

module.exports = verifySession;