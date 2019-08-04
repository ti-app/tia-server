const express = require('express');
const validate = require('express-validation');

const controller = require('../../controllers/site.controller');
const validation = require('../../validations/site.validation');
const authenticated = require('../../middlewares/authenticated');

const router = express.Router();

//router.route('/').post(authenticated, validate(validation.site), controller.createSite);

router.route('/').post(authenticated, controller.createSite);

router.route('/').get(authenticated, controller.allSites);

module.exports = router;
