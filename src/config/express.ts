import express, { Request, Response } from 'express';
import compress from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import tmp from 'tmp';

import session from './session';
import constants from '@constants';
import { requestLogger } from '@logger';

import routes from '../api/routes/v1';
import * as error from '../api/middlewares/error';
import authenticated from '../api/middlewares/authenticated';

const { corsOptions } = constants;

/**
 * Express instance
 * @public
 */
const app = express();

// TODO: Include CSRF middlewares here

// request logging. dev: console | production: file
// app.use(requestLogger);
// app.use(morgan('dev'));

// parse body params and attache them to req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// gzip compression
app.use(compress());

// secure apps by setting various HTTP headers
app.use(helmet());

// This middleware take care of the origin when the origin is undefined.
// origin is undefined when request is local
// ! You might want to remove this in prod
app.use((req, res, next) => {
  req.headers.origin = req.headers.origin || req.headers.host;
  next();
});
app.use(cors(corsOptions));

// session middlewares
app.use(session());

/**
 * GET v1/status
 */
app.get('/status', (req: Request, res: Response) => {
  return res.status(200).send('OK');
});

app.use(authenticated);

// mount api v1 routes
app.use('/v1', routes);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
// app.use(error.handler);

// temporary files created using tmp will be deleted on UncaughtException
tmp.setGracefulCleanup();

export default app;
