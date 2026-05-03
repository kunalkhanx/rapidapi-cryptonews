const Parser = require('rss-parser');
const router = require('express').Router();
const pool = require('./database');


router.get('/news', async (req, res) => {
    try{
        const page = parseInt(req.query.page) || 1;
        const source = req.query.source;
        const pageSize = 20;
        const offset = (page - 1) * pageSize;
        const [rows] = await pool.query('SELECT title, link, pubDate, description FROM crypto_news WHERE source = ? ORDER BY pubDate DESC LIMIT ? OFFSET ?', [source, pageSize, offset]);
        res.json(rows);
    }catch(error){
        console.error(`Error fetching news from ${source}:`, error);
        res.status(500).json({ error: `An error occurred while fetching news from ${source}.` });
    }
});

const RSS_SOURCES = {
    'coindesk': 'https://www.coindesk.com/arc/outboundfeeds/rss/',
    'cointelegraph': 'https://cointelegraph.com/rss',
    'cryptonews': 'https://cryptonews.com/news/feed/',
};

router.get('/news/fetch', async (req, res) => {
    try{
        const source = req.query.source;
        const RSS = RSS_SOURCES[source];
        const parser = new Parser();
        const feed = await parser.parseURL(RSS);
        const news = feed.items.map((item) => ({
            title: item.title,
            link: item.link,
            pubDate: new Date(item.pubDate),
            source: source,
            description: item.contentSnippet,
        }));
        const insertQuery = 'INSERT IGNORE INTO crypto_news (title, link, pubDate, description, source) VALUES ?';
        const values = news.map((item) => [item.title, item.link, item.pubDate, item.description, item.source]);
        await pool.query(insertQuery, [values]);
        res.json({ message: 'News fetched and stored successfully.' });
    }catch(error){
        console.error(`Error fetching news from ${source}:`, error);
        res.status(500).json({ error: `An error occurred while fetching news from ${source}.` });
    }
});


module.exports = router;