import { CustomModuleLoader } from './custom-module-loader';

// Path aliases work only with TS,
// To resolve aliases present in tsconfig.js after build,
// 'module-alias' package is being used.
if (process.env.NODE_ENV === 'production' || process.env.DEBUG === 'debug') {
  let moduleLoader = new CustomModuleLoader();
  console.log('Resolving path aliases for prod build...', process.env.NODE_ENV);
}

import 'reflect-metadata';
import constants from '@constants';
import logger from '@logger';
import app from './config/express';
import { MongoClient } from './api/repository';

const { port, env } = constants;

app.listen(port, async () => {
  logger.info(`server started on port ${port} (${env})`);
  try {
    const dbClient = new MongoClient();
    const dbInstance = await dbClient.connect();
    logger.info(`Connected to mongodb...`);
  } catch (error) {}
});

/**
 * Exports express
 * @public
 */
export default app;
