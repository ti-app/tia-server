import express from 'express';
import validate from 'express-validation';

import {
  createSite,
  updateSite,
  deleteSite,
  getSites,
  modActionOnSite,
} from '../../controllers/site.controller';
// const validation = require('../../validations/site.validation');
import authenticated from '../../middlewares/authenticated';
import { permit } from '../../middlewares/permission';

import multer from '../../../config/multer';
import constants from '@constants';
const router = express.Router();

//router.route('/').post(authenticated, validate(validation.site), controller.createSite);

router.route('/').post(multer.single('photo'), createSite);

router.route('/').get(authenticated, getSites);
router.route('/:siteID').put(multer.single('photo'), updateSite);
router.route('/:siteID').delete(deleteSite);
router.route('/:siteID/mod-action').patch(
  permit(constants.roles.MODERATOR),
  // validate(validation.modAction),
  modActionOnSite
);

export default router;
