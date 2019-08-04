const { database } = require('../../../../constants');

let db = null;

const setDatabase = (_db) => {
  db = _db;
};

const addNewSite = (site) =>
  new Promise(async (resolve, reject) => {
    db.collection(database.collections.site)
      .insertMany(site)
      .then(resolve)
      .catch(reject);
  });

const allSites = () =>
  new Promise(async (resolve, reject) => {
    db.collection(database.collections.site)
      .find({})
      .toArray()
      .then(resolve)
      .catch(reject);
  });

const queries = {
  addNewSite,
  allSites,
};

module.exports = { queries, setDatabase };
