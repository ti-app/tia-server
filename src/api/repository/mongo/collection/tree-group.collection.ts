import { ObjectID } from 'mongodb';
import constants from '@constants';
import MongoClient from '../mongo.repository';
const { database, roles } = constants;

// This will always be undefined as all the collection files
// are loaded before the db connection.
// const db = MongoClient.db;

// Use MongoClient.db in functions instead.
// This will work because functions are called after
// db connection and the static `db` variable has been updated by then.

const TREE_GROUP_COLLECTION = database.collections.treeGroup;

export const addNewTreeGroup = (treeGroup: any) => {
  const db = MongoClient.db;
  return db.collection(TREE_GROUP_COLLECTION).insertOne(treeGroup);
};

export const addTreesToGroup = (treeIds: string[], groupId: string) => {
  const db = MongoClient.db;

  return db.collection(TREE_GROUP_COLLECTION).updateOne(
    {
      _id: groupId,
    },
    {
      $set: { treeIds },
    }
  );
};

export const fetchTreeGroups = async (
  lat: number,
  lng: number,
  radius: number,
  health: string,
  user: any
) => {
  const db = MongoClient.db;

  const geoNearOperator = {
    $geoNear: {
      near: {
        type: 'Point',
        coordinates: [lng, lat],
      },
      distanceField: 'dist.calculated',
      maxDistance: radius,
      includeLocs: 'dist.location',
      spherical: true,
    },
  };

  const onlyModApprovedTreeGroups = {
    $match: {
      $or: [{ moderatorApproved: { $eq: true } }, { 'owner.userId': { $eq: user.user_id } }],
    },
  };

  const notDeleted = {
    $match: {
      $expr: {
        $ne: ['$delete.isModeratorApproved', true],
      },
    },
  };

  // this stage is to remove delete object from response for users other than mod and user who deleted the tree
  // not working 😥
  // const removeDeleteForOtherUsers = {
  //   $project: {
  //     delete: {
  //       $cond: {
  //         if: {
  //           $and: [{ $ne: ['$delete', undefined] }, { $ne: [user.user_id, '$delete.deletedBy'] }],
  //         },
  //         then: '$$REMOVE',
  //         else: '$delete',
  //       },
  //     },
  //   },
  // };

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
                { $ne: ['$delete.isModeratorApproved', true] }, // deleted but not approved
              ],
            },
          },
        },
      ],
      as: 'trees',
    },
  };

  const filterForTress: any = {
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

  const aggregationPipeline: any[] = [geoNearOperator, notDeleted];

  if (user.role !== roles.MODERATOR) {
    aggregationPipeline.push(onlyModApprovedTreeGroups);
  }

  aggregationPipeline.push(lookupQuery, filterForTress);

  const treeGroups = await db
    .collection(TREE_GROUP_COLLECTION)
    .aggregate(aggregationPipeline)
    .toArray();

  // TODO: try doing this in aggregation pipeline
  if (user.role !== roles.MODERATOR) {
    treeGroups.forEach((treeGroup) => {
      if (treeGroup.delete && treeGroup.delete.deletedBy !== user.user_id) {
        delete treeGroup.delete;
      }
    });
  }

  return treeGroups;
};

export const isTreeExistOnCoordinate = (lat: number, lng: number) => {
  const db = MongoClient.db;
  return db.collection(TREE_GROUP_COLLECTION).findOne({ 'location.coordinates': [lng, lat] });
};

export const updateModApprovalStatus = (groupId: string, approve: boolean) => {
  const db = MongoClient.db;
  if (approve) {
    return db.collection(TREE_GROUP_COLLECTION).updateOne(
      {
        _id: new ObjectID(groupId),
      },
      {
        $set: {
          moderatorApproved: approve,
        },
      }
    );
  }
  return db.collection(TREE_GROUP_COLLECTION).deleteOne({
    _id: new ObjectID(groupId),
    moderatorApproved: false,
  });
};

export const getTreesOfGroup = (treeId: string) => {
  const db = MongoClient.db;

  return db
    .collection('tree')
    .aggregate([
      { $match: { _id: new ObjectID(treeId) } },
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

export const updateTreeGroup = (groupId: string, updateBody: any) => {
  const db = MongoClient.db;

  return db.collection(TREE_GROUP_COLLECTION).updateOne(
    {
      _id: new ObjectID(groupId),
    },
    {
      $set: updateBody,
    }
  );
};

export const deleteTreeGroup = (groupId: string, userId: string, isModeratorApproved: boolean) => {
  const db = MongoClient.db;

  return db.collection(TREE_GROUP_COLLECTION).updateOne(
    {
      _id: new ObjectID(groupId),
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
};

export const updateModDeleteStatus = (groupId: string, deleteApprove: boolean) => {
  const db = MongoClient.db;

  return db
    .collection('tree')
    .updateMany(
      {
        groupId: new ObjectID(groupId),
      },
      {
        $set: {
          delete: {
            deleted: true,
            isModeratorApproved: true,
          },
        },
      }
    )
    .then(() => {
      return db.collection(TREE_GROUP_COLLECTION).updateOne(
        {
          _id: new ObjectID(groupId),
        },
        {
          $set: {
            'delete.isModeratorApproved': deleteApprove,
          },
        }
      );
    });
};

export const rejectTreeGroupDelete = (groupId: string) => {
  const db = MongoClient.db;

  return db.collection(TREE_GROUP_COLLECTION).updateOne(
    {
      _id: new ObjectID(groupId),
    },
    {
      $unset: {
        delete: 1,
      },
    }
  );
};

export const waterTreesOfGroup = (groupId: string, updateBody: any) => {
  const db = MongoClient.db;

  return db.collection('tree').updateMany(
    {
      groupId: new ObjectID(groupId),
    },
    {
      $set: updateBody,
    }
  );
};
