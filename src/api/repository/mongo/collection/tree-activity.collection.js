const { ObjectID } = require('mongodb');
const { database } = require('../../../../constants');

const TREE_ACTIVITY_COLLECTION = database.collections.treeActivity;

let db = null;

const setDatabase = async (_db) => {
  db = _db;
  await db.createCollection(TREE_ACTIVITY_COLLECTION);
};

const addActivity = (treeIDs, activity, insert = false) => {
  // if insert=true, do bulk insert for all the ids
  let bulkOps = [];
  if (insert) {
    bulkOps = treeIDs.map((aTreeId) => {
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
    bulkOps = treeIDs.map((aTreeId) => {
      return {
        updateOne: {
          filter: { treeId: ObjectID(aTreeId) },
          update: { $push: { activities: activity } },
        },
      };
    });
  }

  return db.collection(TREE_ACTIVITY_COLLECTION).bulkWrite(bulkOps);
};

const queries = { addActivity };

module.exports = { queries, setDatabase };
