import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import logger from '@logger';
import { getFirebaseUidFromToken } from '@utils/firebase.utils';
import { AuthRequest } from '@appTypes/auth';
import responses from '../services/response.service';
import Context from '../services/context.service';

export default (req: AuthRequest, res: Response, next: NextFunction) => {
  const idToken: string = <string>req.headers['x-id-token'];
  if (!idToken) {
    // prettier-ignore
    logger.debug('[authenticated-middleware] required header x-id-token not found. request is unauthorized');
    return res.status(httpStatus.UNAUTHORIZED).json(responses.unAuthorized());
  }
  return getFirebaseUidFromToken(idToken)
    .then((user) => {
      logger.debug('[authenticated-middleware] request is authenticated. user:', user);
      req.user = user;
      Context.set('user', user);
      next();
    })
    .catch((error) => {
      // prettier-ignore
      logger.error('[authenticated-middleware] something went wrong while getting uid from iDToken');
      logger.error(error);
      return res.status(httpStatus.UNAUTHORIZED).json(responses.unAuthorized());
    });
};
