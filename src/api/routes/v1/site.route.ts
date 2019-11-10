import express from 'express';

import {
  createSite,
  updateSite,
  deleteSite,
  getSites,
  modActionOnSite,
} from '../../controllers/site.controller';
import authenticated from '../../middlewares/authenticated';
import { permit } from '../../middlewares/permission';

import multer from '../../../config/multer';
import constants from '@constants';
import { requestValidator, RequestField } from '../../middlewares/request-validator';
import { ModAction } from '@models/ModAction';

const router = express.Router();

//router.route('/').post(authenticated, validate(validation.site), controller.createSite);

router.route('/').post(multer.single('photo'), createSite);

router.route('/').get(authenticated, getSites);
router.route('/:siteID').put(multer.single('photo'), updateSite);
router.route('/:siteID').delete(deleteSite);
router
  .route('/:siteID/mod-action')
  .patch(
    permit(constants.roles.MODERATOR),
    requestValidator(RequestField.BODY, ModAction, true, { skipMissingProperties: true }),
    modActionOnSite
  );

export default router;
