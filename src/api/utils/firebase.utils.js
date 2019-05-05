const admin = require('firebase-admin');
const logger = require('../utils/logger');

const getFirebaseUidFromToken = (idToken) => {
  return admin
    .auth()
    .verifyIdToken(idToken)
    .then((uid) => {
      logger.debug('[getFirebaseUidFromToken] successfully verified idToken and received uid');
      return uid;
    })
    .catch((error) => {
      logger.error('[getFirebaseUidFromToken] something went wrong while verifying the idToken');
      logger.error(error);
      throw error;
    });
};

exports.getFirebaseUidFromToken = getFirebaseUidFromToken;
