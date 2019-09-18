const express = require('express');
const validate = require('express-validation');

const controller = require('../../controllers/authorization.controller');
const { permit } = require('../../middlewares/permission');
const constants = require('../../../constants');
const validations = require('../../validations/authorization.validation');

const router = express.Router();

router
  .route('/role')
  .post(permit(constants.roles.MODERATOR), validate(validations.addRole), controller.addRoleToUser);

router.route('/role').put(permit(constants.roles.MODERATOR), controller.removeRole);

router.route('/mods').get(permit(constants.roles.MODERATOR), controller.getModUsers);

module.exports = router;
