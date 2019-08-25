const express = require('express');
const validate = require('express-validation');

const controller = require('../../controllers/tree-group.controller');
const validation = require('../../validations/tree-group.validation');
const { permit } = require('../../middlewares/permission');
const multer = require('../../../config/multer');
const constants = require('../../../constants');

const router = express.Router();

/**
 * multer middleware is used to create a file reference
 */
router.route('/').post(multer.single('photo'), controller.createTreeGroup);
router.route('/').get(controller.getTreeGroups);

router
  .route('/:groupID/mod-action')
  .patch(
    permit(constants.roles.MODERATOR),
    validate(validation.modAction),
    controller.modActionOnTreeGroup
  );

module.exports = router;
