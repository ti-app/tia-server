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

  const notDeleted = {
    $match: {
      $expr: {
        $ne: ['$delete.isModeratorApproved', true],
      },
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
              $and: [
                { $eq: ['$groupId', '$$group_id'] },
                // { $ne: ['$delete.deleted', true] },
                { $ne: ['$delete.isModeratorApproved', true] },
              ],
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

  const aggregationPipeline = [geoNearOperator, notDeleted];

  if (uid.role !== roles.MODERATOR) {
    aggregationPipeline.push(onlyModApprovedTreeGroups);
  }

  aggregationPipeline.push(lookupQuery, filterForTress);

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
  if (approve) {
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
  }
  return db.collection(TREE_GROUP_COLLECTION).deleteOne({
    _id: ObjectID(groupID),
  });
};

const getTreesOfGroup = (treeId) => {
  return db
    .collection('tree')
    .aggregate([
      { $match: { _id: ObjectID(treeId) } },
      { $project: { groupId: 1 } },
      {
        $lookup: {
          from: 'tree-group',
          let: { group_id: '$groupId' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$group_id'] } } },
            {
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
            },
          ],
          as: 'group',
        },
      },
      { $unwind: '$group' },
    ])
    .toArray();
};

const updateTreeGroup = (groupId, updateBody) => {
  return db.collection(TREE_GROUP_COLLECTION).updateOne(
    {
      _id: ObjectID(groupId),
    },
    {
      $set: updateBody,
    }
  );
};

const deleteTreeGroup = async (groupId, userId, isModeratorApproved) => {
  const treeGroupRes = await db.collection(TREE_GROUP_COLLECTION).updateOne(
    {
      _id: ObjectID(groupId),
    },
    {
      $set: {
        delete: {
          deleted: true,
          deletedBy: userId,
          isModeratorApproved,
        },
      },
    }
  );

  return treeGroupRes;
};

const updateModDeleteStatus = async (groupId, deleteApprove) => {
  const treeRes = await db.collection('tree').updateMany(
    {
      groupId: ObjectID(groupId),
    },
    {
      $set: {
        delete: {
          deleted: true,
          isModeratorApproved: true,
        },
      },
    }
  );

  return db.collection(TREE_GROUP_COLLECTION).updateOne(
    {
      _id: ObjectID(groupId),
    },
    {
      $set: {
        'delete.isModeratorApproved': deleteApprove,
      },
    }
  );
};

const rejectTreeGroupDelete = (groupId) => {
  return db.collection(TREE_GROUP_COLLECTION).updateOne(
    {
      _id: ObjectID(groupId),
    },
    {
      $unset: {
        delete: 1,
      },
    }
  );
};

const waterTreesOfGroup = (groupId, updateBody) => {
  return db.collection('tree').updateMany(
    {
      groupId: ObjectID(groupId),
    },
    {
      $set: updateBody,
    }
  );
};

const queries = {
  addNewTreeGroup,
  addTreesToGroup,
  fetchTreeGroups,
  isTreeExistOnCoordinate,
  updateModApprovalStatus,
  getTreesOfGroup,
  updateTreeGroup,
  deleteTreeGroup,
  updateModDeleteStatus,
  rejectTreeGroupDelete,
  waterTreesOfGroup,
};

module.exports = { queries, setDatabase };
