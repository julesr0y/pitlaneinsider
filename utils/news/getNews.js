const { XMLParser } = require('fast-xml-parser');
const config = require('../../config.json');

/**
 * @description Decodes common XML and HTML numerical/named entities in text strings.
 * @param {string} text - Raw text containing entities.
 * @returns {string} Decoded text.
 */
function decodeEntities(text) {
    if (!text || typeof text !== 'string') return '';
    return text
        .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(num))
        .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'");
}

/**
 * @description Extracts the first valid image URL from RSS item enclosure, media tags, or HTML description.
 * @param {Object} item - Parsed RSS item object.
 * @returns {string} Image URL or default fallback path.
 */
function extractImageUrl(item) {
    if (item.enclosure && item.enclosure['@_url']) {
        return item.enclosure['@_url'];
    }
    if (item['media:content'] && item['media:content']['@_url']) {
        return item['media:content']['@_url'];
    }
    if (item['media:thumbnail'] && item['media:thumbnail']['@_url']) {
        return item['media:thumbnail']['@_url'];
    }
    const htmlContent = item['content:encoded'] || item.description || '';
    if (typeof htmlContent === 'string') {
        const match = htmlContent.match(/<img[^>]+src=["']([^"']+)["']/i);
        if (match && match[1]) {
            return match[1];
        }
    }
    // fallback image path when feed provides no graphic asset
    return '/img/assets/pli-logo-dark.png';
}

/**
 * @description Converts RFC 2822 date string into custom display format and timestamp.
 * @param {string} rfcDate - Raw publication date string.
 * @returns {{formatted: string, rawTime: number}} Formatted string and millisecond timestamp.
 */
function convertRFC2822ToCustom(rfcDate) {
    try {
        const date = new Date(rfcDate);

        if (isNaN(date.getTime())) {
            return { formatted: '', rawTime: 0 };
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return {
            formatted: `${year}/${month}/${day} ${hours}:${minutes}`,
            rawTime: date.getTime(),
        };
    } catch (error) {
        throw new Error('Failed to convert RFC date', { cause: error });
    }
}

/**
 * @description Fetches and parses a single RSS or WordPress REST API feed.
 * @async
 * @param {{name: string, url: string, type?: string}} feed - Feed definition object.
 * @param {XMLParser} parser - Initialized Fast-XML-Parser instance.
 * @returns {Promise<Object[]>} List of normalized articles from the feed.
 */
async function fetchFeedArticles(feed, parser) {
    try {
        const response = await fetch(feed.url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        });

        if (!response.ok) {
            return [];
        }

        // support wordpress rest api json endpoints with embedded media
        if (feed.type === 'wp-json' || response.headers.get('content-type')?.includes('application/json')) {
            const posts = await response.json();
            return posts.map((post) => {
                const dateObj = convertRFC2822ToCustom(post.date_gmt ? `${post.date_gmt}Z` : post.date);
                const featuredImg = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
                    || post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.medium_large?.source_url
                    || '/img/assets/pli-logo-dark.png';

                return {
                    title: decodeEntities(post.title?.rendered || post.title),
                    link: post.link,
                    pubDate: dateObj.formatted,
                    timestamp: dateObj.rawTime,
                    source: feed.name,
                    enclosure: {
                        url: featuredImg,
                        type: null,
                    },
                };
            });
        }

        const rssText = await response.text();
        const parsedData = parser.parse(rssText);
        const rawItems = parsedData.rss?.channel?.item || parsedData.feed?.entry || [];
        const items = Array.isArray(rawItems) ? rawItems : (rawItems ? [rawItems] : []);

        return items.map((item) => {
            const dateObj = convertRFC2822ToCustom(item.pubDate || item.published || item.updated);
            return {
                title: decodeEntities(item.title),
                link: item.link,
                pubDate: dateObj.formatted,
                timestamp: dateObj.rawTime,
                source: feed.name,
                enclosure: {
                    url: extractImageUrl(item),
                    type: item.enclosure?.['@_type'] || null,
                },
            };
        });
    } catch (error) {
        // individual feed failure should not abort the entire news page
        console.error(`Failed to fetch feed: ${feed.name}`, error);
        return [];
    }
}

/**
 * @description Fetches, parses and combines news from multiple international F1 RSS feeds.
 * @async
 * @returns {Promise<Object[]>} Chronologically sorted list of news articles.
 */
async function getNews() {
    try {
        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: '@_',
        });

        const feeds = config.newsFeeds || [];
        const feedResults = await Promise.all(
            feeds.map((feed) => fetchFeedArticles(feed, parser))
        );

        // combine all feeds and sort most recent first
        return feedResults
            .flat()
            .filter((article) => article.timestamp > 0)
            .sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
        throw new Error('getNews failed to fetch news feeds', { cause: error });
    }
}

module.exports = getNews;

