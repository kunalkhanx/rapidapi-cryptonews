const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT) || 3306,
    });

    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS crypto_news (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            link TEXT NOT NULL,
            pubDate DATETIME NOT NULL,
            description TEXT NOT NULL,
            source VARCHAR(255) NOT NULL,
            UNIQUE KEY unique_link (link(255))
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    try {
        await connection.execute(createTableQuery);
        console.log('Migration completed successfully.');
    } catch (error) {
        console.error('Error during migration:', error);
    } finally {
        await connection.end();
    }
}

migrate();