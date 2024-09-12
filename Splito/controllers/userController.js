// controllers/userController.js
const pool = require('../db');

const syncUser = async (user) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const result = await client.query(
      'INSERT INTO users (name, email, phone, password) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO UPDATE SET name = excluded.name, phone = excluded.phone, password = excluded.password RETURNING id',
      [user.name, user.email, user.phone, user.password]
    );
    const userId = result.rows[0].id;

    await client.query('COMMIT');
    return userId;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { syncUser };
