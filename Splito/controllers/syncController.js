// controllers/syncController.js
const { syncUser } = require('./userController');
const { syncFriends } = require('./friendController');
const { syncTrips } = require('./tripController');
const { syncTransactions } = require('./transactionController');

const syncData = async (req, res) => {
  try {
    const { user, friends, trips, transactions } = req.body;

    const userId = await syncUser(user);
    await syncFriends(userId, friends);
    await syncTrips(userId, trips);
    await syncTransactions(trips, transactions);

    res.status(200).send({ message: 'Data synced successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error syncing data', error });
  }
};

module.exports = { syncData };
