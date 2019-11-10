import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import UserService from '@services/user.service';

import constants from '@constants';

export const userActivity = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  try {
    const userActivity = await UserService.getUserActivity(userId);
    res.status(httpStatus.OK).json(userActivity);
  } catch (e) {
    next(e);
  }
};
