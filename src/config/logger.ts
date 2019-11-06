import { createLogger, format, transports } from 'winston';
import expressWinston from 'express-winston';
import constants from '@constants';

const { combine, timestamp, json, label, prettyPrint, colorize, errors } = format;

const logger = createLogger({
  format: combine(
    // colorize(),
    errors({ stack: true }),
    timestamp(),
    label({ label: 'TIA' }),
    prettyPrint()
  ),
  transports: [new transports.Console()],
});

expressWinston.requestWhitelist.push('body');
export const requestLogger = expressWinston.logger({
  transports: [new transports.Console()],
  format: combine(colorize(), json(), prettyPrint()),
  colorize: true,
  headerBlacklist: ['x-id-token'], // remove access token from logs
  skip: (req, res) => {
    // don't log requests in test env
    return constants.env === 'test';
  },
});

export default logger;
