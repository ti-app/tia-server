import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { AuthRequest } from '@appTypes/requests';
import {{pascalCase name}}Service from '@services/{{name}}.service'

export const get{{pascalCase name}} = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { user } = req;
    res.status(httpStatus.OK).json({
      status: 'success',
    });
  } catch (e) {
    next(e);
  }
};
