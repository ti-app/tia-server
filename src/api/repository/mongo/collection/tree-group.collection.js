const { database } = require('../../../../constants');

let db = null;

const TREE_GROUP_COLLECTION = database.collections.treeGroup;

const setDatabase = async (_db) => {
  db = _db;
  await db.createCollection(TREE_GROUP_COLLECTION);
  await db.collection(TREE_GROUP_COLLECTION).createIndex({ location: '2dsphere' });
};

const addNewTreeGroup = async (treeGroup) => {
  const addedTreeGroup = await db.collection(TREE_GROUP_COLLECTION).insertOne(treeGroup);
  return addedTreeGroup;
};

const addTreesToGroup = async (treeIds, groupId) => {
  try {
    const result = await db.collection(TREE_GROUP_COLLECTION).updateOne(
      {
        _id: groupId,
      },
      {
        $set: { treeIds },
      }
    );
    return result;
  } catch (error) {
    throw error;
  }
};

const fetchTreeGroups = async (lat, lng, radius, health) => {
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
  const lookupQuery = {
    $lookup: {
      from: 'tree',
      let: { group_id: '$_id' },
      pipeline: [
        {
          $match: {
            $expr: { $and: [{ $eq: ['$groupId', '$$group_id'] }, { $ne: ['$deleted', true] }] },
          },
        },
      ],
      as: 'trees',
    },
  };
  const filterForTress = { $match: { 'trees.0': { $exists: true } } };
  const aggregationPipeline = [geoNearOperator, lookupQuery, filterForTress];

  return db
    .collection(TREE_GROUP_COLLECTION)
    .aggregate(aggregationPipeline)
    .toArray();
};

const isTreeExistOnCoordinate = (lat, lng) => {
  return db
    .collection(TREE_GROUP_COLLECTION)
    .findOne({ 'location.coordinates': [parseFloat(lat), parseFloat(lng)] });
};

const queries = {
  addNewTreeGroup,
  addTreesToGroup,
  fetchTreeGroups,
  isTreeExistOnCoordinate,
};

module.exports = { queries, setDatabase };
