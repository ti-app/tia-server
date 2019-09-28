const express = require('express');
const validate = require('express-validation');

const controller = require('../../controllers/site.controller');
const validation = require('../../validations/site.validation');
const multer = require('../../../config/multer');
const authenticated = require('../../middlewares/authenticated');
const constants = require('../../../constants');
const { permit } = require('../../middlewares/permission');

const router = express.Router();

//router.route('/').post(authenticated, validate(validation.site), controller.createSite);

router.route('/').post(multer.single('photo'), controller.createSite);

router.route('/').get(authenticated, controller.getSites);
// router.route('/:siteID').put(multer.single('photo'), controller.updateSite);
router.route('/:siteID').delete(controller.deleteSite);
router.route('/:siteID/mod-action').patch(
  permit(constants.roles.MODERATOR),
  // validate(validation.modAction),
  controller.modActionOnSite
);

module.exports = router;
