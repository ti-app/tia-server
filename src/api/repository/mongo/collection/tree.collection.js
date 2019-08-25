const { ObjectID } = require('mongodb');
const { database } = require('../../../../constants');
const { treeHealth, activityType } = require('../../../../constants');

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

  const aggregationPipeline = [geoNearOperator];

  if (health) {
    const matchOperator = {
      $match: {
        health: {
          $in: health.split(','),
        },
      },
    };

    aggregationPipeline.push(matchOperator);
  }

  // Fetch only active trees
  const deleteFilter = {
    $match: {
      deleted: { $ne: true },
    },
  };
  aggregationPipeline.push(deleteFilter);

  return db
    .collection(TREE_COLLECTION_NAME)
    .aggregate(aggregationPipeline)
    .toArray();
};

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
    const updatedTree = await db.collection(database.collections.tree).update(
      {
        _id: ObjectID(treeID),
      },
      {
        $push: {
          activityDetails: {
            activity: activityType.waterPlant,
            date: new Date().getTime(),
          },
        },
      },
      {
        $set: {
          health: treeHealth.HEALTHY,
          lastActivityDate: new Date().getTime(),
          lastActivityType: activityType.waterPlant,
        },
      }
    );
    return updatedTree;
  } catch (error) {
    throw error;
  }
};

const deleteTree = async (treeID) => {
  try {
    const updatedTree = await db.collection(database.collections.tree).updateOne(
      {
        _id: ObjectID(treeID),
      },
      {
        $push: {
          activityDetails: {
            activity: activityType.deletePlant,
            date: new Date().getTime(),
          },
        },
        $set: { deleted: true },
      }
    );
    return updatedTree;
  } catch (error) {
    throw error;
  }
};

const fetchTreeForIds = async (treeIDs) => {
  const treeObjIds = treeIDs.map((id) => ObjectID(id));
  try {
    const trees = await db.collection(TREE_COLLECTION_NAME).find({
      _id: { $in: treeObjIds },
      deleted: { $ne: true },
    });
    return trees.toArray();
  } catch (error) {
    throw error;
  }
};

const updateTree = (treeReq) => {
  // let multi = false;
  // if (Object.keys(treeReq).length > 1) {
  //   multi = true;
  // }
  return db.collection(database.collections.tree).update(
    {
      _id: ObjectID(treeReq.treeID),
    },
    {
      $push: {
        activityDetails: {
          activity: activityType.updatePlant,
          date: new Date().getTime(),
        },
      },
      $set: treeReq,
    }
  );
};

const queries = {
  addNewTrees,
  fetchAllTrees,
  fetchAllTreesByLocation,
  updateTreeAfterWatering,
  deleteTree,
  fetchTreeForIds,
  updateTree,
};

module.exports = { queries, setDatabase };
