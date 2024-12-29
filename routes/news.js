const express = require('express');
const router = express.Router();

// funtions
const getNews = require('../utils/news/news');

router.get('/news', async (req, res) => {
    var news = await getNews();
    res.render('news/news', { newsFront: news });
});

module.exports = router;