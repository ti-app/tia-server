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
    db.collection(database.collections.treeGroup)
      .find({})
      .toArray()
      .then(resolve)
      .catch(reject);
  });

const fetchAllTreesByLocation = (lng, lat, distance) =>
  new Promise(async (resolve, reject) => {
    db.collection(database.collections.treeGroup)
      .aggregate([
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [parseFloat(lng), parseFloat(lat)],
            },
            distanceField: 'dist.calculated',
            maxDistance: distance,
            includeLocs: 'dist.location',
            spherical: true,
          },
        },
      ])
      .toArray()
      .then(resolve);
  });

const queries = {
  addNewTree,
  fetchAllTrees,
  fetchAllTreesByLocation,
};

module.exports = { queries, setDatabase };
