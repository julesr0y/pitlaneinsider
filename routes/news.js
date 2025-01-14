const express = require('express');
const router = express.Router();

// funtions
const getNews = require('../utils/news/news');

router.get('/news', async (req, res) => {
    try {
        var news = await getNews();
        res.render('news/news', { newsFront: news });
    } catch (error) {
        res.render('security/error', { textError: '/news route, error during processing', error: error });
    }
});

module.exports = router;