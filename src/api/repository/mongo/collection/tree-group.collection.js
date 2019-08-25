const { ObjectID } = require('mongodb');
const { database, roles } = require('../../../../constants');

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

const fetchTreeGroups = async (lat, lng, radius, health, uid) => {
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

  const onlyModApprovedTreeGroups = {
    $match: {
      $or: [{ moderatorApproved: { $eq: true } }, { 'owner.userId': { $eq: uid.user_id } }],
    },
  };

  const lookupQuery = {
    $lookup: {
      from: 'tree',
      let: { group_id: '$_id' },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [{ $eq: ['$groupId', '$$group_id'] }, { $ne: ['$deleted', true] }],
            },
          },
        },
      ],
      as: 'trees',
    },
  };

  const filterForTress = {
    $match: {
      'trees.0': { $exists: true },
    },
  };

  if (health) {
    filterForTress.$match.health = {
      $in: health.split(','),
    };
  }
  // if (uid.role !== roles.MODERATOR) {
  //   filterForTress.$match['owner.userId'] = {
  //     $eq: uid.user_id,
  //   };
  // }
  const aggregationPipeline = [
    geoNearOperator,
    onlyModApprovedTreeGroups,
    lookupQuery,
    filterForTress,
  ];

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

const updateModApprovalStatus = (groupID, approve) => {
  return db.collection(TREE_GROUP_COLLECTION).updateOne(
    {
      _id: ObjectID(groupID),
    },
    {
      $set: {
        moderatorApproved: approve,
      },
    }
  );
};

const queries = {
  addNewTreeGroup,
  addTreesToGroup,
  fetchTreeGroups,
  isTreeExistOnCoordinate,
  updateModApprovalStatus,
};

module.exports = { queries, setDatabase };
