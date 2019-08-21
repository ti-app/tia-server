const httpStatus = require('http-status');
const responses = require('../services/response.service');
const logger = require('../utils/logger');

const { getFirebaseUidFromToken } = require('../utils/firebase.utils');

module.exports = (req, res, next) => {
  const idToken = req.headers['x-id-token'];
  if (!idToken) {
    // prettier-ignore
    logger.debug('[authenticated-middleware] required header x-id-token not found. request is unauthorized');
    return res.status(httpStatus.UNAUTHORIZED).json(responses.unAuthorized());
  }
  return getFirebaseUidFromToken(idToken)
    .then((user) => {
      logger.debug('[authenticated-middleware] request is authenticated. user:', user);
      req.uid = user;
      req.user = user;
      next();
    })
    .catch((error) => {
      // prettier-ignore
      logger.error('[authenticated-middleware] something went wrong while getting uid from iDToken');
      logger.error(error);
      return res.status(httpStatus.UNAUTHORIZED).json(responses.unAuthorized());
    });
};
