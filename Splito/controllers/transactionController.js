// controllers/transactionController.js
const pool = require('../db');

const syncTransactions = async (trips, transactions) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const insertPromises = transactions.map(transaction =>
      client.query(
        'INSERT INTO transactions (id, created_date, reason, paid_by, amount, split_evenly, trip_id) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO UPDATE SET created_date = excluded.created_date, reason = excluded.reason, paid_by = excluded.paid_by, amount = excluded.amount, split_evenly = excluded.split_evenly',
        [transaction.id, transaction.created_date, transaction.reason, transaction.paidBy, transaction.amount, transaction.splitEvenly, transaction.tripId]
      )
    );

    await Promise.all(insertPromises);

    // Sync transaction split users
    for (const transaction of transactions) {
      await client.query('DELETE FROM transaction_split_users WHERE transaction_id = $1', [transaction.id]);

      const splitUserPromises = transaction.splitUsers.map(user =>
        client.query(
          'INSERT INTO transaction_split_users (transaction_id, friend_id) VALUES ($1, $2)',
          [transaction.id, user.id]
        )
      );

      await Promise.all(splitUserPromises);
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { syncTransactions };
