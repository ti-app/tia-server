// Ref: https://wanago.io/2018/12/17/typescript-express-error-handling-validation/
import { Request, Response, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import httpStatus from 'http-status';
import APIError from '@utils/APIError';

export const RequestField = {
  PARAMS: 'params',
  QUERY: 'query',
  BODY: 'body',
};

/**
 *
 * @param requestField - A field of express request object to run validation on. It can be one of params, query, body.
 * @param validationClass - A model class against which validation will be run.
 * @param transformClassToObject - Should the requestField object be converted to validationClass object and added to express request.
 */
export const requestValidator = (
  requestField: string,
  validationClass: any,
  transformClassToObject: boolean = true
) => {
  return (req: any, res: Response, next: NextFunction) => {
    const convertedClassObj = plainToClass(validationClass, req[requestField]);
    validate(convertedClassObj).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors
          .map((error: ValidationError) => Object.values(error.constraints))
          .join(', ');
        next(new APIError({ message: message, status: httpStatus.BAD_REQUEST }));
      } else {
        if (transformClassToObject) {
          req[requestField] = convertedClassObj;
        }
        next();
      }
    });
  };
};
