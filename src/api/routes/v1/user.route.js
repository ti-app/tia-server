const express = require('express');
const controller = require('../../controllers/user.controller');

const router = express.Router();

router.route('/rating').get(controller.getUserRating);

module.exports = router;
