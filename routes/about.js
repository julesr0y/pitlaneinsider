const express = require('express');
const router = express.Router();

router.get("/about", async (req, res) => {
    res.render("about/about");
});

module.exports = router;