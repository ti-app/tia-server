const httpStatus = require('http-status');
const responses = require('../services/response.service');
const logger = require('../utils/logger');
const constants = require('../../constants');

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
  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      const uid = decodedToken;
      next();
    })
    .catch((error) => {
      logger.error(error);
      return res.status(httpStatus.UNAUTHORIZED).json(responses.unAuthorized());
    });
};
