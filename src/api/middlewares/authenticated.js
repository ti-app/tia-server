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

  getFirebaseUidFromToken(idToken)
    .then((uid) => {
      logger.info('isAuthenticated', uid);
      req.uid = uid;
      next();
    })
    .catch((error) => {
      logger.error(error);
      return res.status(httpStatus.UNAUTHORIZED).json(responses.unAuthorized());
    });

  /**
   * If the incoming request contains proper cookies,
   * 'passport' module will parse the cookies and put the
   * req.user object as the user logged in.
   *
   * Note however that this functionality is strictly limited to 'passport'
   * module which is not included in this boilerplate code.
   *
   * Based on your api and session management configurations,
   * you might want to check req.session.id ( in case of cookies )
   * or req.headers['x-access-token'] and then validate the request
   */
};
