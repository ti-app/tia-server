import express from 'express';
import multer from '../../../config/multer';
import { getPanic, registerPanic } from '../../controllers/panic.controller';

const router = express.Router();

router.route('/').get(getPanic);
router.route('/').post(multer.single('photo'), registerPanic);
export default router;
