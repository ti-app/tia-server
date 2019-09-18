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

const getUsersWithRole = async () => {
  const users = await listModUsers();
  return users;
};

const listModUsers = async (nextPageToken) => {
  // List batch of users, 1000 at a time.
  const customClaimUsers = [];

  return admin
    .auth()
    .listUsers(1000, nextPageToken)
    .then((listUsersResult) => {
      listUsersResult.users.forEach(({ uid, displayName, email, customClaims, photoURL }) => {
        if (customClaims && customClaims.role) {
          customClaimUsers.push({
            uid,
            displayName,
            email,
            customClaims,
            photoURL,
          });
          console.log('user', email, customClaims);
        }
      });

      if (listUsersResult.pageToken) {
        // List next batch of users.
        listModUsers(listUsersResult.pageToken);
      }

      return customClaimUsers;
    })
    .catch((error) => {
      console.log('Error listing users:', error);
    });
};

const removeUserRole = async (email) => {
  const user = await admin.auth().getUserByEmail(email);
  return admin.auth().setCustomUserClaims(user.uid, {});
};

module.exports = {
  getFirebaseUidFromToken,
  getUserRole,
  addUserRole,
  getUsersWithRole,
  removeUserRole,
};
