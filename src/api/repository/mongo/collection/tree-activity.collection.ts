import { ObjectID } from 'mongodb';
import constants from '@constants';
import MongoClient from '../mongo.repository';
const { database } = constants;

const TREE_ACTIVITY_COLLECTION = database.collections.treeActivity;

export const addActivity = (treeIds: string[], activity: any, insert: boolean = false) => {
  const db = MongoClient.db;
  // if insert=true, do bulk insert for all the ids
  let bulkOps = [];
  if (insert) {
    bulkOps = treeIds.map((aTreeId) => {
      return {
        insertOne: {
          document: {
            treeId: aTreeId,
            activities: [activity],
          },
        },
      };
    });
  } else {
    bulkOps = treeIds.map((aTreeId) => {
      return {
        updateOne: {
          filter: { treeId: new ObjectID(aTreeId) },
          update: { $push: { activities: activity } },
        },
      };
    });
  }

  return db.collection(TREE_ACTIVITY_COLLECTION).bulkWrite(bulkOps);
};

export const getTreeActivity = (treeId: string) => {
  const db = MongoClient.db;

  return db
    .collection('tree-activity')
    .aggregate([
      { $match: { treeId: new ObjectID(treeId) } },
      { $unwind: '$activities' },
      {
        $sort: {
          'activities.date': -1,
        },
      },
    ])
    .toArray();
};
