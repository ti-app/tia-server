const { database } = require('../../../../constants');
const { ObjectID } = require('mongodb');

const TREE_COLLECTION_NAME = database.collections.tree;

let db = null;

const setDatabase = async (_db) => {
  db = _db;
  await db.createCollection(TREE_COLLECTION_NAME);
  await db.collection(TREE_COLLECTION_NAME).createIndex({ location: '2dsphere' });
};

const addNewTrees = (tree) =>
  new Promise((resolve, reject) => {
    db.collection(TREE_COLLECTION_NAME)
      .insertMany(tree)
      .then(resolve)
      .catch(reject);
  });

const fetchAllTrees = (lat, lng, radius, health) => {
  const geoNearOperator = {
    $geoNear: {
      near: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)],
      },
      distanceField: 'dist.calculated',
      maxDistance: parseInt(radius, 10),
      includeLocs: 'dist.location',
      spherical: true,
    },
  };

  const matchOperator = {
    $match: {
      health: {
        $in: health.split(','),
      },
    },
  };

  const aggregationPipeline = [geoNearOperator];

  if (health) aggregationPipeline.push(matchOperator);

  return new Promise(async (resolve, reject) => {
    db.collection(TREE_COLLECTION_NAME)
      .aggregate(aggregationPipeline)
      .toArray()
      .then(resolve)
      .catch(reject);
  });
};
// new Promise(async (resolve, reject) => {
//   db.collection(database.collections.treeGroup)
//     .find({})
//     .toArray()
//     .then(resolve)
//     .catch(reject);
// });

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
      .then(resolve)
      .catch(reject);
  });

const updateTreeAfterWatering = async (treeID) => {
  try {
    const updatedTree = await db.collection(database.collections.tree).updateOne(
      {
        _id: ObjectID(treeID),
      },
      {
        $set: { health: 'healthy' },
      }
    );
    return updatedTree;
  } catch (error) {
    throw error;
  }
};

const queries = {
  addNewTrees,
  fetchAllTrees,
  fetchAllTreesByLocation,
  updateTreeAfterWatering,
};

module.exports = { queries, setDatabase };
