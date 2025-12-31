const { Pool } = require('pg');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
    console.error("FATAL ERROR: DATABASE_URL is missing from environment variables.");
    // We don't exit here so the server can at least start and log the error, 
    // but DB operations will fail.
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: true, // Neon requires SSL
    },
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};
