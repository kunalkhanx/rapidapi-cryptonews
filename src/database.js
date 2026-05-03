const mysql = require('mysql2/promise');

// Create a connection pool to the MySQL database
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 5,
    maxIdle: 5,
    idleTimeout: 60000,       // release idle connections after 60 s
    queueLimit: 0,            // unlimited queued requests
    // Network stability
    enableKeepAlive: true,
    keepAliveInitialDelay: 30000,
    connectTimeout: 10000,
    // Automatically reconnect on query errors
    namedPlaceholders: false,
});

module.exports = pool;