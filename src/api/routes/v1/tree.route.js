const express = require('express');
const validate = require('express-validation');
const validation = require('../../validations/tree.validation');
const updateTreecontroller = require('../../controllers/update-tree.controller');
const controller = require('../../controllers/tree.controller');
const multer = require('../../utils/multer-config');
const router = express.Router();

router.route('/').get(controller.allTrees);
// router.route('/').get(controller.allTrees);
router.route('/update/:treeID').post(multer.single('photo'), updateTreecontroller.updateTree);
router.route('/water/:treeID').get(controller.waterByPlantID);
router.route('/:treeID').delete(controller.deleteTree);

module.exports = router;
