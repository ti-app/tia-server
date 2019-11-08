import express from 'express';
import validate from 'express-validation';
// const validation = require('../../validations/tree.validation');
import {
  updateTree,
  waterTree,
  deleteTree,
  modActionOnTree,
} from '../../controllers/tree.controller';
import multer from '../../../config/multer';
import constants from '@constants';
import { permit } from '../../middlewares/permission';

const router = express.Router();

router.route('/:treeId').put(multer.single('photo'), updateTree);
router.route('/:treeId/water').get(waterTree);
router.route('/:treeId').delete(deleteTree);
router.route('/:treeId/mod-action').patch(
  permit(constants.roles.MODERATOR),
  // validate(validation.modAction),
  modActionOnTree
);

export default router;
