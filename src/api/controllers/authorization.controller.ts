import httpStatus from 'http-status';
import { addUserRole, getUsersWithRole, removeUserRole } from '@utils/firebase.utils';
import { Request, Response, NextFunction } from 'express';

export const addRoleToUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, role } = req.body;
    addUserRole(email, role).then(() => {
      return res.status(httpStatus.OK).json({ message: 'Role has been added.' });
    });
  } catch (e) {
    next(e);
  }
};

export const getModUsers = (req: Request, res: Response, next: NextFunction) => {
  try {
    getUsersWithRole().then((users) => {
      return res.status(httpStatus.OK).json({ users });
    });
  } catch (e) {
    next(e);
  }
};

export const removeRole = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    removeUserRole(email).then(() => {
      return res.status(httpStatus.OK).json({ message: 'Role has been removed.' });
    });
  } catch (e) {
    next(e);
  }
};
