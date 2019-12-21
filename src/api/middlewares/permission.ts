// ref: https://gist.github.com/joshnuss/37ebaf958fe65a18d4ff
import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { AuthRequest } from '@appTypes/auth';

// middleware for doing role-based permissions
export const permit = (...allowed: string[]) => {
  const isAllowed = (role: string) => allowed.indexOf(role) > -1;

  // return a middleware
  return (request: AuthRequest, response: Response, next: NextFunction) => {
    if (request.user && isAllowed(request.user.role)) next();
    // role is allowed, so continue on the next middleware
    else {
      response
        .status(httpStatus.FORBIDDEN)
        .json({ message: 'User is forbidden to access this api.' });
    }
  };
};
