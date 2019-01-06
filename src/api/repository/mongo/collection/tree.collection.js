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

const fetchAllTreesByLocation = (lng, lat) =>
  new Promise(async (resolve, reject) => {
    console.log('lat and long', lat, lng);
    db.collection(database.collections.tree)
      .aggregate([
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [parseFloat(lng), parseFloat(lat)],
            },
            distanceField: 'distance',
            maxDistance: 1,
            spherical: true,
            query: { 'loc.type': 'Point' },
          },
        },
        {
          $sort: { distance: -1 }, // Sort the nearest first
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
