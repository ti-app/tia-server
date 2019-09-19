const { ObjectID } = require('mongodb');
const { database } = require('../../../../constants');

const TREE_COLLECTION_NAME = database.collections.tree;

let db = null;

const setDatabase = async (_db) => {
  db = _db;
  await db.createCollection(TREE_COLLECTION_NAME);
  await db.collection(TREE_COLLECTION_NAME).createIndex({ location: '2dsphere' });
};

const addNewTrees = (tree) => {
  return db.collection(TREE_COLLECTION_NAME).insertMany(tree);
};

const updateTree = (treeID, updateBody) => {
  return db.collection(TREE_COLLECTION_NAME).updateOne(
    {
      _id: ObjectID(treeID),
    },
    {
      $set: updateBody,
    }
  );
};
const updateModDeleteStatus = (treeID, deleteApprove) => {
  return db.collection(TREE_COLLECTION_NAME).updateOne(
    {
      _id: ObjectID(treeID),
    },
    {
      $set: {
        'delete.isModeratorApproved': deleteApprove,
      },
    }
  );
};
const queries = {
  addNewTrees,
  updateTree,
  updateModDeleteStatus,
};

module.exports = { queries, setDatabase };
