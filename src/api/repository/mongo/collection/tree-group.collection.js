const { database } = require('../../../../constants');

let db = null;

const setDatabase = (_db) => {
  db = _db;
};

const addNewTreeGroup = async (treeGroup) =>
  new Promise(async (resolve, reject) => {
    db.collection(database.collections.treeGroup)
      .insertOne(treeGroup)
      .then(resolve)
      .catch(reject);
  });

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
