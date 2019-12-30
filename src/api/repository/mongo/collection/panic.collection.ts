import { ObjectID } from 'mongodb';
import constants from '@constants';
import MongoClient from '../mongo.repository';
const { database } = constants;

// Change collection name to something more appropriate
// eg, const USER_TABLE = database.tables.user
const PANIC_COLLECTION = database.collections.panic;

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
  const notResolved = {
    $match: {
      $expr: {
        $ne: ['$resolve.resolved', true],
      },
    },
  };
  const aggregationPipeline: any[] = [geoNearOperator, notResolved];
  return db
    .collection(PANIC_COLLECTION)
    .aggregate(aggregationPipeline)
    .toArray();
};

export const registerNewPanic = (panicObj: any) => {
  const db = MongoClient.db;
  return db.collection(PANIC_COLLECTION).insertOne(panicObj);
};

export const updatePanic = (panicId: string, updateBody: any) => {
  const db = MongoClient.db;
  return db.collection(PANIC_COLLECTION).updateOne(
    {
      _id: new ObjectID(panicId),
    },
    {
      $set: updateBody,
    }
  );
};
