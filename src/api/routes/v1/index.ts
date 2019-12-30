import express from 'express';
import panicRoutes from './panic.route';

import treeRoutes from './tree.route';
import siteRoutes from './site.route';
import treeGroupRoutes from './tree-group.route';
import authorizationRoutes from './authorization.route';
import userRoutes from './user.route';
import topUsersRoutes from './top-users.route';
import notificationService from '@services/notification.service';

const router = express.Router();
router.use('/panic', panicRoutes);

router.use('/tree', treeRoutes);
router.use('/tree_group', treeGroupRoutes);
router.use('/site', siteRoutes);
router.use('/authorization', authorizationRoutes);
router.use('/user', userRoutes);
router.use('/top-users', topUsersRoutes);

// Just to test notifications...will be removed
router.get('/notify', async (req, res) => {
  await notificationService._sendMulticastNotificationMessage();
  res.status(200).json({ status: 'success' });
});

export default router;
