import admin from 'firebase-admin';
import logger from '@logger';
import constants from '@constants';
import { FirebaseCustomClaims } from '@appTypes/auth';
import { NotificationMessage } from '@appTypes/common-types';

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

export const listModUsers = async (nextPageToken?: string) => {
  // List batch of users, 1000 at a time.
  const customClaimUsers: Array<object> = [];

  return admin
    .auth()
    .listUsers(1000, nextPageToken)
    .then((listUsersResult) => {
      listUsersResult.users.forEach(({ uid, displayName, email, customClaims, photoURL }) => {
        const userCustomClaims = customClaims as FirebaseCustomClaims;
        // if (userCustomClaims && userCustomClaims.role) {
        customClaimUsers.push({
          uid,
          displayName,
          email,
          userCustomClaims,
          photoURL,
        });
        console.log('user', email, displayName, photoURL, userCustomClaims);
        //  }
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

export const listAllUsers = async (nextPageToken?: string) => {
  // List batch of users, 1000 at a time.
  const usersList: Array<object> = [];

  return admin
    .auth()
    .listUsers(1000, nextPageToken)
    .then((listUsersResult) => {
      listUsersResult.users.forEach(({ uid, displayName, email, customClaims, photoURL }) => {
        const userCustomClaims = customClaims as FirebaseCustomClaims;
        usersList.push({
          uid,
          displayName,
          email,
          userCustomClaims,
          photoURL,
        });
        //  console.log('user', usersList);
      });

      if (listUsersResult.pageToken) {
        // List next batch of users.
        listModUsers(listUsersResult.pageToken);
      }

      return usersList;
    })
    .catch((error) => {
      console.log('Error listing users:', error);
    });
};

export const getUsersList = async () => {
  const users = await listAllUsers();
  return users;
};

export const getUserInfoFromUid = async (uid: string) => {
  return admin.auth().getUser(uid);
};

export const sendNotification = async (message: NotificationMessage, token: string) => {
  const notificationMessage = {
    data: message,
    notification: {
      title: message.title,
      body: message.body,
      image: message.image,
    },
    token: token,
  };

  try {
    const notificationResponse = await admin.messaging().send(notificationMessage);
    console.log('Successfully sent message:', notificationResponse);
  } catch (error) {
    console.log('Error sending message:', error);
  }
};

export const sendMulticastNotification = async (message: NotificationMessage, tokens: string[]) => {
  const notificationMessage = {
    data: message,
    notification: {
      title: message.title,
      body: message.body,
      image: message.image,
    },
    tokens,
  };

  try {
    const response = await admin.messaging().sendMulticast(notificationMessage);
    console.log(
      `Should send notification to: ${tokens.length}. Successfully sent to: ${response.successCount}`
    );
    if (response.failureCount > 0) {
      const failedTokens: any[] = [];
      response.responses.forEach((resp, index) => {
        if (!resp.success) {
          failedTokens.push(tokens[index]);
        }
      });
      console.log('List of tokens that caused failures: ' + failedTokens);
    }
  } catch (error) {
    console.log('Error sending message:', error);
  }
};
