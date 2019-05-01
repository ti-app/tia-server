const express = require('express');
const validate = require('express-validation');
const validation = require('../../validations/tree.validation');

const controller = require('../../controllers/tree.controller');

const router = express.Router();

router.route('/').get(controller.allTrees);
// router.route('/').get(controller.allTrees);

router.route('/water/:treeID').get(controller.waterByPlantID);

module.exports = router;
