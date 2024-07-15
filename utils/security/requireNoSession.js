/**
    * @description Used for pages accessible only if user is disconnected from his account (auth pages for example)
    */
function requireNoSession(req, res, next) {
    if (
        !req.session.user &&
        !req.cookies.idUser &&
        !req.cookies.email &&
        !req.cookies.username &&
        !req.cookies.nom &&
        !req.cookies.prenom
    ) {
        next();
    } else {
        req.session.user = {
            idUser: req.cookies.idUser,
            email: req.cookies.email,
            username: req.cookies.username,
            nom: req.cookies.nom,
            prenom: req.cookies.prenom
        };
        res.redirect("/profile");
    }
}

module.exports = requireNoSession;