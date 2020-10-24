import express from 'express';
import {
  updateTree,
  waterTree,
  deleteTree,
  modActionOnTree,
  treeActivity,
  getSingleTreeDetail,
} from '../../controllers/tree.controller';
import multer from '../../../config/multer';
import constants from '@constants';
import { permit } from '../../middlewares/permission';
import { requestValidator, RequestField } from '../../middlewares/request-validator';
import { ModAction } from '@models/ModAction';

const router = express.Router();

router.route('/:treeId').put(multer.single('photo'), updateTree);
router.route('/:treeId/water').get(waterTree);
router.route('/:treeId').get(getSingleTreeDetail);
router.route('/:treeId/activity').get(treeActivity);
router.route('/:treeId').delete(deleteTree);
router
  .route('/:treeId/mod-action')
  .patch(
    permit(constants.roles.MODERATOR),
    requestValidator(RequestField.BODY, ModAction, true, { skipMissingProperties: true }),
    modActionOnTree
  );

export default router;
