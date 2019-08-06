const express = require('express');

// import all the routes here
const treeRoutes = require('./tree.route');
const treeGroupRoutes = require('./tree-group.route');
const authenticated = require('../../middlewares/authenticated');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

router.use('/tree', treeRoutes);
router.use('/tree_group', treeGroupRoutes);

module.exports = router;
