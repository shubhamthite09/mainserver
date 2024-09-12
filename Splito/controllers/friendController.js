// controllers/friendController.js
const pool = require('../db');

const syncFriends = async (userId, friends) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Delete existing friends for the user
    await client.query('DELETE FROM friends WHERE user_id = $1', [userId]);

    // Insert new friends
    const insertPromises = friends.map(friend =>
      client.query(
        'INSERT INTO friends (id, name, user_id) VALUES ($1, $2, $3) ON CONFLICT (id) DO UPDATE SET name = excluded.name',
        [friend.id, friend.name, userId]
      )
    );

    await Promise.all(insertPromises);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { syncFriends };
