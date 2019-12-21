import express from 'express';
import {
  userActivity,
  registerUserFCMToken,
  deregisterUserFCMToken,
} from '../../controllers/user.controller';

const router = express.Router();

router.route('/:userId/activity').get(userActivity);
router.route('/notification/register').post(registerUserFCMToken);
router.route('/notification/deregister').patch(deregisterUserFCMToken);

export default router;
