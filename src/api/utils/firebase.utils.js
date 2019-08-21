const admin = require('firebase-admin');
const logger = require('../utils/logger');
const constants = require('../../constants');

admin.initializeApp({
  credential: admin.credential.cert(constants.firebase.firebaseServiceAccount),
  databaseURL: constants.firebase.databaseURL,
});

const getFirebaseUidFromToken = (idToken) => {
  return admin.auth().verifyIdToken(idToken);
};

const getUserRole = async (idToken) => {
  try {
    const user = await getFirebaseUidFromToken(idToken);
    return user.customClaims.role;
  } catch (error) {
    logger.error('Failed to get user role', error);
    return error;
  }
};

const addUserRole = async (email, role) => {
  const user = await admin.auth().getUserByEmail(email);
  return admin.auth().setCustomUserClaims(user.uid, {
    role,
  });
};

module.exports = { getFirebaseUidFromToken, getUserRole, addUserRole };
