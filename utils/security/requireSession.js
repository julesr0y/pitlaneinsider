/**
    * @description Used for pages accessible only if user is connected to his account (live pages). Also recreates the session with cookies if session is destroyed and cookies are valid
    */
function requireSession(req, res, next) {
    if (req.session.user) {
        next();
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
        next();
    } else {
        res.redirect("/signin");
    }
}

module.exports = requireSession;