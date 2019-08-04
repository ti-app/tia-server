const express = require('express');
const validate = require('express-validation');

const controller = require('../../controllers/site.controller');
const validation = require('../../validations/site.validation');
const authenticated = require('../../middlewares/authenticated');

const router = express.Router();

// un protected route
// Notice the same names of functions/object in validation and controller
// router.route('/greet-me').get(validate(validation.me), controller.me);

// protected route
// router.route('/greet-me-protected').get(authenticated, validate(validation.me), contrroueteroller.me);

router.route('/add').post(authenticated, validate(validation.site), controller.createSite);

router.route('/sites').get(authenticated, controller.allSites);

module.exports = router;
