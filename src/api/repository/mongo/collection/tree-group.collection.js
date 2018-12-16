const { database } = require('../../../../constants');

let db = null;

const setDatabase = (_db) => {
  db = _db;
};

const addNewTreeGroup = async (treeGroup) => {
  const addedTreeGroup = await db.collection(database.collections.treeGroup).insertOne(treeGroup);
  return addedTreeGroup;
};

const fetchAllTreeGroups = () =>
  new Promise(async (resolve, reject) => {
    db.collection(database.collections.treeGroup)
      .find({})
      .toArray()
      .then(resolve)
      .catch(reject);
  });

const queries = {
  addNewTreeGroup,
  fetchAllTreeGroups,
};

module.exports = { queries, setDatabase };
