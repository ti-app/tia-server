const { database } = require('../../../../constants');

let db = null;

const TREE_GROUP_COLLECTION = database.collections.treeGroup;

const setDatabase = async (_db) => {
  db = _db;
  await db.createCollection(TREE_GROUP_COLLECTION);
  await db.collection(TREE_GROUP_COLLECTION).createIndex({ location: '2dsphere' });
};

const addNewTreeGroup = async (treeGroup) => {
  const addedTreeGroup = await db.collection(TREE_GROUP_COLLECTION).insertOne(treeGroup);
  return addedTreeGroup;
};

const addTreesToGroup = async (treeIds, groupId) => {
  try {
    const result = await db.collection(TREE_GROUP_COLLECTION).updateOne(
      {
        _id: groupId,
      },
      {
        $set: { treeIds },
      }
    );
    return result;
  } catch (error) {
    throw error;
  }
};

const queries = {
  addNewTreeGroup,
  addTreesToGroup,
};

module.exports = { queries, setDatabase };
