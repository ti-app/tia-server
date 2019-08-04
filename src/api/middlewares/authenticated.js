const httpStatus = require('http-status');
const responses = require('../services/response.service');
const logger = require('../utils/logger');
const constants = require('../../constants');

const { getFirebaseUidFromToken } = require('../utils/firebase.utils');

const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(constants.firebase.firebaseServiceAccount),
  databaseURL: constants.firebase.databaseURL,
});

module.exports = (req, res, next) => {
  const idToken = req.headers['x-id-token'];
  if (!idToken) {
    // prettier-ignore
    logger.debug('[authenticated-middleware] required header x-id-token not found. request is unauthorized');
    return res.status(httpStatus.UNAUTHORIZED).json(responses.unAuthorized());
  }
  return getFirebaseUidFromToken(idToken)
    .then((uid) => {
      logger.debug(`[authenticated-middleware] request is authenticated. uid: "${uid}"`);
      req.uid = uid;
      next();
    })
    .catch((error) => {
      // prettier-ignore
      logger.error('[authenticated-middleware] something went wrong while getting uid from iDToken');
      logger.error(error);
      return res.status(httpStatus.UNAUTHORIZED).json(responses.unAuthorized());
    });
};
