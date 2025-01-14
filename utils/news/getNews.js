const { XMLParser } = require('fast-xml-parser');

/**
 * @description Fetches and parses news from Motorsport.com RSS feed.
 * @async
 * @returns {Promise<Object[]>} A list of articles in JSON format.
 */
async function getNews() {
    const motorsportRSS = 'https://www.motorsport.com/rss/f1/news/';

    try {
        // Fetch RSS feed
        const response = await fetch(motorsportRSS);
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const rssText = await response.text();

        // Parse XML
        const parser = new XMLParser({
            ignoreAttributes: false, // Keep XML attributes
            attributeNamePrefix: '@_', // Prefix for attributes
        });
        const parsedData = parser.parse(rssText);

        // Map articles
        const articles = parsedData.rss.channel.item.map(item => ({
            title: item.title,
            link: item.link,
            pubDate: convertRFC2822ToCustom(item.pubDate),
            enclosure: item.enclosure ? {
                url: item.enclosure['@_url'],
                type: item.enclosure['@_type'] || null,
            } : null,
        }));

        return articles;
    } catch (error) {
        console.error('getNews, error during execution :', error);
        throw error;
    }
}

/**
 * @description Convertit une date RFC 2822 en format personnalisé YYYY/MM/DD HH:mm
 * @param {string} rfcDate - La date au format RFC 2822
 * @returns {string} La date au format YYYY/MM/DD HH:mm
 */
function convertRFC2822ToCustom(rfcDate) {
    try {
        const date = new Date(rfcDate);

        if (isNaN(date.getTime())) {
            throw new Error("Date invalide !");
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Les mois vont de 0 à 11
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}/${month}/${day} ${hours}:${minutes}`;
    } catch (error) {
        console.error('convertRFC2822ToCustom, error during execution :', error);
        throw error;
    }
}

module.exports = getNews;
