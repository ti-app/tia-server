import express, { Request, Response, NextFunction } from 'express';
import {
  createTreeGroup,
  getTreeGroups,
  deleteTreeGroup,
  waterTreeGroup,
  modActionOnTreeGroup,
  getTreeGroupClusters,
  waterMultipleTreeGroups,
  getAggregatedTreeGroupData,
} from '../../controllers/tree-group.controller';
import { permit } from '../../middlewares/permission';
import multer from '../../../config/multer';
import constants from '@constants';
import { requestValidator, RequestField } from '../../middlewares/request-validator';
import { CreateTreeGroup } from '@models/TreeGroup';
import { ModAction } from '@models/ModAction';

const router = express.Router();

/**
 * multer middleware is used to create a file reference
 */
router
  .route('/')
  .post(
    multer.single('photo'),
    requestValidator(RequestField.BODY, CreateTreeGroup),
    createTreeGroup
  );
router.route('/').get(getTreeGroups);
router.route('/cluster').get(getTreeGroupClusters);
router.route('/aggregated').get(getAggregatedTreeGroupData);
router.route('/water').patch(waterMultipleTreeGroups);

router
  .route('/:groupID/mod-action')
  .patch(
    permit(constants.roles.MODERATOR),
    requestValidator(RequestField.BODY, ModAction, true, { skipMissingProperties: true }),
    modActionOnTreeGroup
  );
router.route('/:groupID').delete(deleteTreeGroup);
router.route('/:groupID/water').get(waterTreeGroup);

export default router;
