const { database } = require('../../../../constants');

let db = null;

const setDatabase = (_db) => {
  db = _db;
};

const addNewTree = (tree) =>
  new Promise(async (resolve, reject) => {
    db.collection(database.collections.tree)
      .insertMany(tree)
      .then(resolve)
      .catch(reject);
  });

const fetchAllTrees = () =>
  new Promise(async (resolve, reject) => {
    db.collection(database.collections.tree)
      .find({})
      .toArray()
      .then(resolve)
      .catch(reject);
  });

const queries = {
  addNewTree,
  fetchAllTrees,
};

module.exports = { queries, setDatabase };
