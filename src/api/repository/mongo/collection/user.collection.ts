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

export const removeUserFCMToken = (userId: string, fcmToken: string) => {
  const db = MongoClient.db;
  return db.collection(USER_COLLECTION).updateOne(
    {
      userId: userId,
    },
    {
      $pull: { fcmTokens: { $in: [fcmToken] } },
    }
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

export const saveUserLocation = (uid: string, lat: number, lng: number) => {
  const db = MongoClient.db;
  const userLocation = {
    type: 'Point',
    coordinates: [lng, lat],
  };
  return db.collection(USER_COLLECTION).updateOne(
    {
      userId: uid,
    },
    {
      $set: {
        location: userLocation,
      },
    }
  );
};

// Get user document
export const getUser = (uid: string) => {
  const db = MongoClient.db;
  return db.collection(USER_COLLECTION).findOne({
    userId: uid,
  });
};

// radius in meter
export const getUsersInRadius = (lat: number, lng: number, radius: number) => {
  const db = MongoClient.db;

  const geoNearOperator = {
    $geoNear: {
      near: {
        type: 'Point',
        coordinates: [lng, lat],
      },
      distanceField: 'dist.calculated',
      maxDistance: radius,
      includeLocs: 'dist.location',
      spherical: true,
    },
  };

  return db.collection(USER_COLLECTION).aggregate([geoNearOperator]);
};
