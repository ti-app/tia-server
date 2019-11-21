import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import UserService from '@services/user.service';
import constants from '@constants';
import { AuthRequest } from '@appTypes/auth';

export const userActivity = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  try {
    const userActivity = await UserService.getUserActivity(userId);
    res.status(httpStatus.OK).json(userActivity);
  } catch (e) {
    next(e);
  }
};

export const registerUserFCMToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { fcmToken } = req.body;
  try {
    await UserService.saveUserFCMToken(req.user.uid, fcmToken);
    res.status(httpStatus.OK).json({ status: 'success' });
  } catch (e) {
    next(e);
  }
};
