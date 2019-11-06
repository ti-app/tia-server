import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import expressValidation from 'express-validation';
import constants from '@constants';
import logger from '@logger';
import APIError from '../utils/APIError';

const { env } = constants;

/**
 * Error handler. Send stacktrace only during development
 * @public
 */
export const handler = (err: APIError, req: Request, res: Response, next?: NextFunction) => {
  const response = {
    code: err.status || httpStatus.INTERNAL_SERVER_ERROR,
    message: err.message || (httpStatus as any)[err.status],
    errors: err.errors,
    stack: err.stack,
  };

  if (env !== 'development') {
    delete response.stack;
  }

  logger.error(err);
  // console.log('TCL: handler -> err', err);
  res
    .status(response.code)
    .json(response)
    .end();
};

/**
 * If error is not an instanceOf APIError, convert it.
 * @public
 */
export const converter = (err: any, req: Request, res: Response, next: NextFunction) => {
  let convertedError = err;

  if (err instanceof expressValidation.ValidationError) {
    convertedError = new APIError({
      message: 'Validation Error',
      errors: err.errors.map((error) => error.message),
      status: err.status || httpStatus.INTERNAL_SERVER_ERROR,
    });
  } else if (!(err instanceof APIError)) {
    convertedError = new APIError({
      message: err.message,
      status: err.status || httpStatus.INTERNAL_SERVER_ERROR,
      stack: err.stack,
    });
  }

  return handler(convertedError, req, res);
};

/**
 * Catch 404 and forward to error handler
 * @public
 */
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const err = new APIError({
    message: 'Not found',
    status: httpStatus.NOT_FOUND,
  });
  return handler(err, req, res);
};
