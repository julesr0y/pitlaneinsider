const getNews = require('./getNews');

/**
 * @description Fetches the latest news articles across all configured sources for the home page.
 * @async
 * @returns {Promise<Object[]>} A list of the latest articles.
 */
async function getNewsHomePage() {
    try {
        const articles = await getNews();
        // limit the number of articles displayed on the home page widget
        return articles.slice(0, 4);
    } catch (error) {
        throw new Error('getNewsHomePage failed to retrieve articles', { cause: error });
    }
}

module.exports = getNewsHomePage;