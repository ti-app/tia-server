import express from 'express';

import treeRoutes from './tree.route';
import siteRoutes from './site.route';
import treeGroupRoutes from './tree-group.route';
import authorizationRoutes from './authorization.route';
import userRoutes from './user.route';
import topUsersRoutes from './top-users.route';

const router = express.Router();

router.use('/tree', treeRoutes);
router.use('/tree_group', treeGroupRoutes);
router.use('/site', siteRoutes);
router.use('/authorization', authorizationRoutes);
router.use('/user', userRoutes);
router.use('/top-users', topUsersRoutes);

export default router;
