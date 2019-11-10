import express from 'express';
import validate from 'express-validation';
// const validation = require('../../validations/tree.validation');
import { userActivity } from '../../controllers/user.controller';
import constants from '@constants';
import { permit } from '../../middlewares/permission';

const router = express.Router();

router.route('/:userId/activity').get(userActivity);

export default router;
