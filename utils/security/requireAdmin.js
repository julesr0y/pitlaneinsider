const dbPool = require('../../config/database');

/**
    * @function
    * @description Fonction permettant de vérifier si l'utilisateur est bien un admin
    */
async function requireAdmin(req, res, next) {
    try {
        const [rows] = await dbPool.query('SELECT * FROM users WHERE idUser = ?', [req.session.user.idUser]);
        const adminValue = rows[0].admin;
        if (adminValue == 1) {
            next();
        }
        else {
            res.redirect("/profile");
        }
    } catch (err) {
        console.error('Erreur lors de la récupération des informations:', err);
        res.status(500).send('Erreur interne du serveur');
    }
}

module.exports = requireAdmin; //on exporte la fonction