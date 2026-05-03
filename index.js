const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./src/database');
const newsRouter = require('./src/routes');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use('/api/v1', newsRouter);

app.listen(PORT, async () => {
    try {
        // Connect to the database
        await pool.getConnection();
        console.log('Connected to the database successfully.');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
    console.log(`Server is running on port ${PORT}`);
});