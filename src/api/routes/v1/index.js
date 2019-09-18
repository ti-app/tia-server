const express = require('express');

// import all the routes here
const treeRoutes = require('./tree.route');
const siteRoutes = require('./site.route');
const treeGroupRoutes = require('./tree-group.route');
const authorizationRoutes = require('./authorization.route');
const authenticated = require('../../middlewares/authenticated');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

router.use('/tree', authenticated, treeRoutes);
router.use('/tree_group', authenticated, treeGroupRoutes);
router.use('/site', authenticated, siteRoutes);
router.use('/authorization', authorizationRoutes);
module.exports = router;
