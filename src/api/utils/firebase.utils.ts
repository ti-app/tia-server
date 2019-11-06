import admin from 'firebase-admin';
import logger from '@logger';
import constants from '@constants';
import { FirebaseCustomClaims } from '@appTypes/auth';

admin.initializeApp({
  credential: admin.credential.cert(constants.firebase.firebaseServiceAccount),
  databaseURL: constants.firebase.databaseURL,
});

export const getFirebaseUidFromToken = (idToken: string) => {
  return admin.auth().verifyIdToken(idToken);
};

export const getUserRole = async (idToken: string) => {
  try {
    const user = await getFirebaseUidFromToken(idToken);
    return user.customClaims.role;
  } catch (error) {
    logger.error('Failed to get user role', error);
    return error;
  }
};

export const addUserRole = async (email: string, role: string) => {
  const user = await admin.auth().getUserByEmail(email);
  return admin.auth().setCustomUserClaims(user.uid, {
    role,
  });
};

export const getUsersWithRole = async () => {
  const users = await listModUsers();
  return users;
};

const listModUsers = async (nextPageToken?: string) => {
  // List batch of users, 1000 at a time.
  const customClaimUsers: Array<object> = [];

  return admin
    .auth()
    .listUsers(1000, nextPageToken)
    .then((listUsersResult) => {
      listUsersResult.users.forEach(({ uid, displayName, email, customClaims, photoURL }) => {
        const userCustomClaims = customClaims as FirebaseCustomClaims;
        if (userCustomClaims && userCustomClaims.role) {
          customClaimUsers.push({
            uid,
            displayName,
            email,
            userCustomClaims,
            photoURL,
          });
          console.log('user', email, userCustomClaims);
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

export const removeUserRole = async (email: string) => {
  const user = await admin.auth().getUserByEmail(email);
  return admin.auth().setCustomUserClaims(user.uid, {});
};
