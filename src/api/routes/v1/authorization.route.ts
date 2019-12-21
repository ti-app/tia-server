import express from 'express';
import validate from 'express-validation';

import { addRoleToUser, removeRole, getModUsers } from '../../controllers/authorization.controller';
import validations from '../../validations/authorization.validation';

import constants from '@constants';
import { permit } from '../../middlewares/permission';

const router = express.Router();

router
  .route('/role')
  .post(permit(constants.roles.MODERATOR), validate(validations.addRole), addRoleToUser);

router.route('/role').put(permit(constants.roles.MODERATOR), removeRole);

router.route('/mods').get(permit(constants.roles.MODERATOR), getModUsers);

export default router;
