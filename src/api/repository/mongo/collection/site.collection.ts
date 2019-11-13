import { ObjectID } from 'mongodb';
import constants from '@constants';
import MongoClient from '../mongo.repository';
const { database, roles } = constants;

const SITES_COLLECTION = database.collections.site;

export const addNewSite = (site: any) => {
  const db = MongoClient.db;
  return db.collection(database.collections.site).insertOne(site);
};

export const allSites = () => {
  const db = MongoClient.db;
  return db
    .collection(database.collections.site)
    .find({})
    .toArray();
};

export const fetchSites = async (lat: number, lng: number, radius: number, user: any) => {
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

  const onlyModApprovedSites = {
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
  const aggregationPipeline: any[] = [geoNearOperator, notDeleted];
  // Check if current role is moderator or not
  if (user.role !== roles.MODERATOR) {
    aggregationPipeline.push(onlyModApprovedSites);
  }
  const db = MongoClient.db;
  return db
    .collection(SITES_COLLECTION)
    .aggregate(aggregationPipeline)
    .toArray();
};

export const updateSite = (siteId: string, updateBody: any) => {
  const db = MongoClient.db;
  return db.collection(SITES_COLLECTION).updateOne(
    {
      _id: new ObjectID(siteId),
    },
    {
      $set: updateBody,
    }
  );
};

export const updateModDeleteStatus = (siteId: string, deleteApprove: boolean) => {
  const db = MongoClient.db;
  return db.collection(SITES_COLLECTION).updateOne(
    {
      _id: new ObjectID(siteId),
    },
    {
      $set: {
        'delete.isModeratorApproved': deleteApprove,
      },
    }
  );
};

export const rejectSiteDelete = (siteId: string) => {
  const db = MongoClient.db;
  return db.collection(SITES_COLLECTION).updateOne(
    {
      _id: new ObjectID(siteId),
    },
    {
      $unset: {
        delete: 1,
      },
    }
  );
};

export const updateSiteModApprovalStatus = async (siteId: string, approve: boolean) => {
  if (approve) {
    const db = MongoClient.db;
    return db.collection(SITES_COLLECTION).updateOne(
      {
        _id: new ObjectID(siteId),
      },
      {
        $set: {
          moderatorApproved: approve,
        },
      }
    );
  } else {
    const db = MongoClient.db;
    return db.collection(SITES_COLLECTION).deleteOne({
      _id: new ObjectID(siteId),
      moderatorApproved: false,
    });
  }
};
