import constants from '@constants';
import MongoClient from '../mongo.repository';
const { database } = constants;

const USER_COLLECTION = database.collections.user;

export const saveFCMToken = (userId: string, fcmToken: string) => {
  const db = MongoClient.db;
  // Add unique device tokens
  return db.collection(USER_COLLECTION).updateOne(
    {
      userId: userId,
    },
    {
      $addToSet: {
        fcmTokens: {
          $each: [fcmToken],
        },
      },
    },
    { upsert: true }
  );
};

export const getDeviceTokensOfUser = async (userId: string) => {
  const db = MongoClient.db;
  const result = await db.collection(USER_COLLECTION).findOne({
    userId: userId,
  });

  return result.fcmTokens;
};

export const getAllDeviceTokens = () => {
  const db = MongoClient.db;
  return db.collection(USER_COLLECTION).distinct('fcmTokens', {});
};
