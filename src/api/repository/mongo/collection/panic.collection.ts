import constants from '@constants';
import MongoClient from '../mongo.repository';
import { async } from 'rxjs/internal/scheduler/async';
const { database } = constants;

// Change collection name to something more appropriate
// eg, const USER_TABLE = database.tables.user
const PANIC_COLLECTION = database.collections.panic;
const USER_COLLECTION = database.collections.user;

export const getPanic = (lat: number, lng: number, radius: number, user: any) => {
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
  const aggregationPipeline: any[] = [geoNearOperator];
  return db
    .collection(PANIC_COLLECTION)
    .aggregate(aggregationPipeline)
    .toArray();
};

export const registerNewPanic = (panicObj: any) => {
  const db = MongoClient.db;
  return db.collection(PANIC_COLLECTION).insertOne(panicObj);
};

export const findUserFcmTokensForPanicNotification = (lat: number, lng: number, radius: number) => {
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
  const fcmTokens = { $project: { fcmTokens: '$fcmTokens', _id: 0 } };
  const aggregationPipeline: any[] = [geoNearOperator, fcmTokens];

  return db
    .collection(USER_COLLECTION)
    .aggregate(aggregationPipeline)
    .toArray();
};
