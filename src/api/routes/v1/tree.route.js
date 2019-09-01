const express = require('express');
const validate = require('express-validation');
const validation = require('../../validations/tree.validation');
const controller = require('../../controllers/tree.controller');
const multer = require('../../../config/multer');

const router = express.Router();

router.route('/:treeID').put(multer.single('photo'), controller.updateTree);
router.route('/:treeID/water').get(controller.waterTree);
router.route('/:treeID').delete(controller.deleteTree);

module.exports = router;
