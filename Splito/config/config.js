require('dotenv').config();

module.exports = {
    user: process.env.PGUSER || 'your_db_username',
    host: process.env.PGHOST || 'your_rds_endpoint',
    database: process.env.PGDATABASE || 'your_db_name',
    password: process.env.PGPASSWORD || 'your_db_password',
    port: process.env.PGPORT || 5432, // Default PostgreSQL port
  };
  