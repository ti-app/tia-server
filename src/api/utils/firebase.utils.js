const admin = require('firebase-admin');
const logger = require('../utils/logger');

const getFirebaseUidFromToken = (idToken) => {
  return admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      const uid = decodedToken;
      console.log(uid);
      return uid;
    })
    .catch((error) => {
      logger.error(error);
      throw error;
    });
};

exports.getFirebaseUidFromToken = getFirebaseUidFromToken;
