import { ObjectID, UpdateWriteOpResult } from 'mongodb';
import * as _ from 'lodash';
import geohash from 'ngeohash';
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

  console.log(treeGroups);
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

export const updateMultipleTreeGroup = (
  groupIds: [any],
  updateBody: any
): Promise<UpdateWriteOpResult> => {
  const db = MongoClient.db;

  return db.collection(TREE_GROUP_COLLECTION).updateMany(
    {
      _id: {
        $in: groupIds.map(({ id }) => new ObjectID(id)),
      },
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

export const fetchTreeGroupsV2 = async (bbox: string) => {
  // const bboxString = '73.625379,18.388787,74.027583,18.710622';
  const coordinates = _.map(bbox.split(','), parseFloat);
  const bboxCorners = {
    bottomLeft: [coordinates[0], coordinates[1]],
    upperRight: [coordinates[2], coordinates[3]],
  };
  const blHash = geohash.encode(bboxCorners.bottomLeft[1], bboxCorners.bottomLeft[0]);
  const urHash = geohash.encode(bboxCorners.upperRight[1], bboxCorners.upperRight[0]);

  let geohashPrefixLength;
  for (geohashPrefixLength = 0; geohashPrefixLength < blHash.length; geohashPrefixLength++) {
    if (blHash[geohashPrefixLength] !== urHash[geohashPrefixLength]) break;
  }

  console.log('blHash', blHash);
  console.log('urHash', urHash);
  console.log('geohashPrefixLength', geohashPrefixLength);
  console.log(blHash.substring(0, geohashPrefixLength));

  const incFactor = 4; // grouping factor, should depend on zoom/grid size

  const aggregation = {
    query: [
      {
        $match: {
          location: {
            $geoWithin: {
              $box: [bboxCorners.bottomLeft, bboxCorners.upperRight],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          geo: {
            $substr: ['$geohash', 0, geohashPrefixLength + incFactor],
          },
          location: 1,
          treeGroup: '$$ROOT',
        },
      },
      {
        $group: {
          _id: '$geo',
          count: {
            $sum: 1,
          },
          lat: {
            $avg: {
              $arrayElemAt: ['$location.coordinates', 1],
            },
          },
          lng: {
            $avg: {
              $arrayElemAt: ['$location.coordinates', 0],
            },
          },
          data: { $first: '$$ROOT' },
        },
      },
      {
        $project: {
          _id: 1,
          count: 1,
          lat: 1,
          lng: 1,
          data: {
            $cond: { if: { $eq: ['$count', 1] }, then: '$data.treeGroup', else: '$$REMOVE' },
          },
        },
      },
    ],
  };

  const db = MongoClient.db;
  const treeGroups = await db
    .collection('tree-group')
    .aggregate(aggregation.query)
    .toArray();
  return treeGroups;
};

export const waterTreesOfMultipleGroups = (groupIds: [{ id: string }], updateBody: any) => {
  const db = MongoClient.db;

  return db.collection('tree').updateMany(
    {
      groupId: {
        $in: groupIds.map(({ id }) => new ObjectID(id)),
      },
    },
    {
      $set: updateBody,
    }
  );
};
