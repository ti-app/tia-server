const express = require('express');
const validate = require('express-validation');
const validation = require('../../validations/tree.validation');
const controller = require('../../controllers/tree.controller');
const multer = require('../../../config/multer');
const constants = require('../../../constants');
const { permit } = require('../../middlewares/permission');

const router = express.Router();

router.route('/:treeID').put(multer.single('photo'), controller.updateTree);
router.route('/:treeID/water').get(controller.waterTree);
router.route('/:treeID').delete(controller.deleteTree);
router.route('/:treeID/mod-action').patch(
  permit(constants.roles.MODERATOR),
  // validate(validation.modAction),
  controller.modActionOnTree
);
module.exports = router;
