const express = require('express');
const validate = require('express-validation');

const controller = require('../../controllers/tree-group.controller');
const validation = require('../../validations/tree-group.validation');

const router = express.Router();

router.route('/').post(validate(validation.treeGroup), controller.createTreeGroup);

module.exports = router;
