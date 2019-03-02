const { port, env } = require('./constants');
const app = require('./config/express');
const logger = require('./api/utils/logger');

// listen to requests - sample update
app.listen(port, () => logger.info(`server started on port ${port} (${env})`));

/**
 * Exports express
 * @public
 */
module.exports = app;
