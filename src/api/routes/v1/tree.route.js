const express = require('express');
const validate = require('express-validation');
const validation = require('../../validations/tree.validation');

const controller = require('../../controllers/tree.controller');

const router = express.Router();

router.route('/').get(validate(validation.get), controller.allTrees);
// router.route('/').get(controller.allTrees);

module.exports = router;
