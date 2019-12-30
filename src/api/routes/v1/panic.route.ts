import express from 'express';
import constants from '@constants';
import multer from '../../../config/multer';
import { getPanic, registerPanic, resolvePanic } from '../../controllers/panic.controller';
import { permit } from '../../middlewares/permission';

const router = express.Router();

router.route('/').get(getPanic);
router.route('/').post(multer.single('photo'), registerPanic);
router.route('/:panicID').delete(permit(constants.roles.MODERATOR), resolvePanic);
export default router;
