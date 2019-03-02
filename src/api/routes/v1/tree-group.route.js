const express = require('express');
const validate = require('express-validation');

const controller = require('../../controllers/tree-group.controller');
const validation = require('../../validations/tree-group.validation');

const Multer = require('multer');

const router = express.Router();

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

router.route('/').post(multer.single('photo'), controller.createTreeGroup);

module.exports = router;
