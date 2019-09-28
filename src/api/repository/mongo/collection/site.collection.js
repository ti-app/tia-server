const { ObjectID } = require('mongodb');
const { database } = require('../../../../constants');

let db = null;
const SITES_COLLECTION = database.collections.site;

const setDatabase = async (_db) => {
  db = _db;
  await db.createCollection(SITES_COLLECTION);
  await db.collection(SITES_COLLECTION).createIndex({ location: '2dsphere' });
};

const addNewSite = (site) =>
  new Promise(async (resolve, reject) => {
    db.collection(database.collections.site)
      .insert(site)
      .then(resolve)
      .catch(reject);
  });

const allSites = () =>
  new Promise(async (resolve, reject) => {
    db.collection(database.collections.site)
      .find({})
      .toArray()
      .then(resolve)
      .catch(reject);
  });

const fetchSites = async (lat, lng, radius, uid) => {
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

  const onlyModApprovedSites = {
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
  const aggregationPipeline = [geoNearOperator, onlyModApprovedSites, notDeleted];

  return db
    .collection(SITES_COLLECTION)
    .aggregate(aggregationPipeline)
    .toArray();
};

const updateSite = (siteID, updateBody) => {
  return db.collection(SITES_COLLECTION).updateOne(
    {
      _id: ObjectID(siteID),
    },
    {
      $set: updateBody,
    }
  );
};
const updateModDeleteStatus = (siteID, deleteApprove) => {
  return db.collection(SITES_COLLECTION).updateOne(
    {
      _id: ObjectID(siteID),
    },
    {
      $set: {
        'delete.isModeratorApproved': deleteApprove,
      },
    }
  );
};

const rejectSiteDelete = (siteID) => {
  return db.collection(SITES_COLLECTION).updateOne(
    {
      _id: ObjectID(siteID),
    },
    {
      $unset: {
        delete: 1,
      },
    }
  );
};

const queries = {
  addNewSite,
  allSites,
  fetchSites,
  updateSite,
  updateModDeleteStatus,
  rejectSiteDelete,
};

module.exports = { queries, setDatabase };
