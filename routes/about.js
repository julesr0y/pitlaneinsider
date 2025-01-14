const express = require('express');
const router = express.Router();

router.get("/about", async (req, res) => {
    try {
        res.render("about/about");
    } catch (error) {
        res.render('security/error', { textError: '/about route, error during processing', error: error });
    }
});

module.exports = router;