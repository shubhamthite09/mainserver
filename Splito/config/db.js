const { Pool } = require('pg');
const config = require('./config');

const pool = new Pool({
  user: config.user,
  host: config.host,
  database: config.database,
  password: config.password,
  port: config.port,
  ssl: {
    rejectUnauthorized: false, // If using SSL in AWS RDS, ensure you handle SSL correctly
  },
});

module.exports = {
  pool
}