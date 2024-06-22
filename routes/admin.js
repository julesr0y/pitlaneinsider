const express = require('express');
const router = express.Router();
const dbPool = require('../config/database'); // Importer le pool de connexions
const requireSession = require('../utils/requireSession'); // Importer le middleware de session
const requireAdmin = require('../utils/requireAdmin'); // Importer le middleware des admin

router.get("/administration/panel", requireSession, requireAdmin, async (req, res) => {
    res.render("admin_panel");
});

module.exports = router;