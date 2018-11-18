const { database } = require('../../../../constants');

let db = null;

const setDatabase = (_db) => {
  db = _db;
};

const addNewTree = (tree) =>
  new Promise(async (resolve, reject) => {
    db.collection(database.collections.tree)
      .insertOne(tree)
      .then(resolve)
      .catch(reject);
  });

const queries = {
  addNewTree,
};

module.exports = { queries, setDatabase };
