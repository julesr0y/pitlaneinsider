const express = require('express');
const router = express.Router();

router.get("/reglementations", async (req, res) => {
    res.render("reglementations");
});

module.exports = router;