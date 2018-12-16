const express = require('express');

const controller = require('../../controllers/tree.controller');
const authenticated = require('../../middlewares/authenticated');

const router = express.Router();

// un protected route
// Notice the same names of functions/object in validation and controller
// router.route('/greet-me').get(validate(validation.me), controller.me);

// protected route
// router.route('/greet-me-protected').get(authenticated, validate(validation.me), contrroueteroller.me);

// router.route('/add').post(authenticated, validate(validation.tree), controller.createTree);

router.route('/').get(authenticated, controller.allTrees);

module.exports = router;
