const express = require('express');
const validate = require('express-validation');

const controller = require('../../controllers/site.controller');
const validation = require('../../validations/site.validation');
const multer = require('../../../config/multer');
const authenticated = require('../../middlewares/authenticated');

const router = express.Router();

//router.route('/').post(authenticated, validate(validation.site), controller.createSite);

router.route('/').post(multer.single('photo'), controller.createSite);

router.route('/').get(authenticated, controller.getSites);
// router.route('/:siteID').put(multer.single('photo'), controller.updateTree);
router.route('/:siteID').delete(controller.deleteSite);

module.exports = router;
