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
          update: {
            $push: {
              activities: {
                $each: [activity],
                $position: 0, // insert the activity at the beginning of array
              },
            },
          },
        },
      };
    });
  }

  return db.collection(TREE_ACTIVITY_COLLECTION).bulkWrite(bulkOps);
};

// ref: https://stackoverflow.com/a/15389094/5271656
// sort the activities array in descending order and restructure the doc response
// and to preserve treeId field: https://stackoverflow.com/a/16662878/5271656
export const getTreeActivity = async (treeId: string) => {
  const db = MongoClient.db;

  const activities = await db
    .collection('tree-activity')
    .aggregate([
      { $match: { treeId: new ObjectID(treeId) } },
      { $unwind: '$activities' },
      {
        $sort: {
          'activities.date': -1,
        },
      },
      {
        $group: {
          _id: '$_id',
          treeId: { $first: '$treeId' },
          activities: { $push: '$activities' },
        },
      },
      { $project: { activities: '$activities', treeId: '$treeId' } },
    ])
    .toArray();

  // this is to sort using js if mongo query takes too long
  // const sortedActivities = activities[0].activities.sort((a: any, b: any) => b.date - a.date);
  // return {
  //   ...activities[0],
  //   activities: sortedActivities,
  // };

  return activities[0];
};

export const getUserActivity = async (userId: string) => {
  const db = MongoClient.db;

  const res = await db
    .collection('tree-activity')
    .aggregate([
      { $unwind: '$activities' },
      { $match: { 'activities.user.id': userId } },
      {
        $sort: {
          'activities.date': -1,
        },
      },
      {
        $group: {
          _id: '$activities.user.id',
          // activities: { $push: '$$ROOT' },
          activities: {
            $push: {
              treeId: '$treeId',
              activity: '$activities',
            },
          },
        },
      },
      // { $project: { activities: '$activities' } },
    ])
    .toArray();

  return res[0];
};
