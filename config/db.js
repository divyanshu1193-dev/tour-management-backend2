const { Pool } = require('pg');

const pool = new Pool({
    user: 'tour_app_user',
    host: 'localhost',
    database: 'tour_management_db',
    password: 'touradmin', // update if needed
    port: 5432
});

/*const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // For Neon or managed PostgreSQL with SSL
});*/

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to PostgreSQL database successfully!');
  release();
});

module.exports = pool;
