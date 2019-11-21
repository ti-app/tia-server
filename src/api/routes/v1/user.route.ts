import express from 'express';
import { userActivity, registerUserFCMToken } from '../../controllers/user.controller';

const router = express.Router();

router.route('/:userId/activity').get(userActivity);
router.route('/notification/register').post(registerUserFCMToken);

export default router;
