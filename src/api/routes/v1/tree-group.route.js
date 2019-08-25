const express = require('express');
const validate = require('express-validation');

const controller = require('../../controllers/tree-group.controller');
const validation = require('../../validations/tree-group.validation');
const multer = require('../../../config/multer');

const router = express.Router();

/**
 * multer middleware is used to create a file reference
 */
router.route('/').post(multer.single('photo'), controller.createTreeGroup);
router.route('/').get(controller.getTreeGroups);

module.exports = router;
