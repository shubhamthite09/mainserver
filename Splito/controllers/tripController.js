// controllers/tripController.js
const pool = require('../db');

const syncTrips = async (userId, trips) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const insertPromises = trips.map(trip =>
      client.query(
        'INSERT INTO trips (id, name, created_date, balance, user_id) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO UPDATE SET name = excluded.name, created_date = excluded.created_date, balance = excluded.balance',
        [trip.id, trip.name, trip.created_date, trip.balance, userId]
      )
    );

    await Promise.all(insertPromises);

    // Sync trip friends
    for (const trip of trips) {
      await client.query('DELETE FROM trip_friends WHERE trip_id = $1', [trip.id]);

      const tripFriendPromises = trip.friends.map(friend =>
        client.query(
          'INSERT INTO trip_friends (trip_id, friend_id) VALUES ($1, $2)',
          [trip.id, friend.id]
        )
      );

      await Promise.all(tripFriendPromises);
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { syncTrips };
