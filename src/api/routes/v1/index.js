const express = require('express');

// import all the routes here
const treeRoutes = require('./tree.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

router.use('/tree', treeRoutes);

module.exports = router;
