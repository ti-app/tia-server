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

const allTrees = () =>
  new Promise(async (resolve, reject) => {
    db.collection(database.collections.tree)
      .find({})
      // .toArray((err, docs) => {
      //   console.log('DOCS', docs);
      //   return docs;
      // });
      .toArray()
      .then(resolve)
      .catch(reject);
  });

const queries = {
  addNewTree,
  allTrees,
};

module.exports = { queries, setDatabase };
