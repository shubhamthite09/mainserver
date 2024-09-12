// routes/syncRoutes.js
const express = require('express');
const router = express.Router();
const { syncData } = require('../controllers/syncController');

router.post('/sync', syncData);

module.exports = router;
