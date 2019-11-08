import express, { Request, Response, NextFunction } from 'express';
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
import { requestValidator, RequestField } from '../../middlewares/request-validator';
import { CreateTreeGroup } from 'models/TreeGroup';

const router = express.Router();

/**
 * multer middleware is used to create a file reference
 */
router
  .route('/')
  .post(
    multer.single('photo'),
    requestValidator(RequestField.BODY, CreateTreeGroup, true),
    createTreeGroup
  );
router.route('/').get(getTreeGroups);

router.route('/:groupID/mod-action').patch(
  permit(constants.roles.MODERATOR),
  // validate(validation.modAction),
  modActionOnTreeGroup
);

router.route('/:groupID').delete(deleteTreeGroup);
router.route('/:groupID/water').get(waterTreeGroup);

export default router;
