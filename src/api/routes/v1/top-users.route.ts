import express from 'express';
import validate from 'express-validation';
// const validation = require('../../validations/tree.validation');
import { topUsers } from '../../controllers/top-users.controller';
import constants from '@constants';
import { permit } from '../../middlewares/permission';

const router = express.Router();

router.route('/').get(topUsers);

export default router;
