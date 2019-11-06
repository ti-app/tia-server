import express from 'express';
import validate from 'express-validation';

// const validation = require('../../validations/tree-group.validation');
import {
  createTreeGroup,
  getTreeGroups,
  deleteTreeGroup,
  waterTreeGroup,
  modActionOnTreeGroup,
} from '../../controllers/tree-group.controller';
import { permit } from '../../middlewares/permission';
import multer from '../../../config/multer';
import constants from '@constants';

const router = express.Router();

/**
 * multer middleware is used to create a file reference
 */
router.route('/').post(multer.single('photo'), createTreeGroup);
router.route('/').get(getTreeGroups);

router.route('/:groupID/mod-action').patch(
  permit(constants.roles.MODERATOR),
  // validate(validation.modAction),
  modActionOnTreeGroup
);

router.route('/:groupID').delete(deleteTreeGroup);
router.route('/:groupID/water').get(waterTreeGroup);

export default router;
