import constants from '@constants';
import MongoClient from './mongo.repository';
const { database } = constants;

// Change collection name to something more appropriate
// eg, const USER_TABLE = database.tables.user
const COLLECTION_NAME = database.collections.collectionName;

export const get{{pascalCase name}} = () => {
  const db = MongoClient.db;
  return db
    .collection(database.collections.site)
    .find({})
    .toArray();
};
