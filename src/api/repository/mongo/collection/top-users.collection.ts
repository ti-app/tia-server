import { ObjectID } from 'mongodb';
import constants from '@constants';
import MongoClient from '../mongo.repository';
const { database } = constants;

const TREE_ACTIVITY_COLLECTION = database.collections.treeActivity;

export const getTopUsers = (limit: number) => {
  const db = MongoClient.db;

  return db
    .collection('tree-activity')
    .aggregate([
      { $unwind: '$activities' },
      {
        $group: {
          _id: '$activities.user.id',
          activities: { $push: '$$ROOT' },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: limit },
    ])
    .toArray();
};
