const express = require('express');
const router = express.Router();

router.get("/reglementations", async (req, res) => {
    try {
        res.render("reglementations/reglementations");
    } catch (error) {
        res.render('security/error', { textError: '/reglementations route, error during processing', error: error });
    }
});

module.exports = router;