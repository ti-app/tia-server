import { MongoClient, Db } from 'mongodb';

import constants from '@constants';
const { database } = constants;
const { tree, treeGroup, site, user } = database.collections;

// collectionName:indexType
const dbIndexMap = {
  [tree]: { location: '2dsphere' },
  [treeGroup]: { location: '2dsphere' },
  [site]: { location: '2dsphere' },
  [user]: { location: '2dsphere' },
};

export default class MongoRepository {
  public static db: Db;
  public static client: MongoClient;

  connectionInProgress = false;
  connectionPromise: Promise<Db> = null;

  public connect(): Promise<Db> {
    return new Promise((resolve, reject) => {
      // logic to open a connection to database
      // once the connection is open, save the instance in db variable here
      // Check if another promise is pending.
      if (this.connectionInProgress) {
        // Yes there is, just return the previous promise
        return this.connectionPromise;
      }
      // No there is no promise pending. Let us create a new one
      this.connectionInProgress = true; // setting the flag
      this.connectionPromise = new Promise(() => {
        MongoClient.connect(
          database.uri,
          { useNewUrlParser: true, useUnifiedTopology: true },
          async (err, client) => {
            if (err) {
              this.connectionInProgress = false; // unsetting the flag
              return reject(err);
            }
            const _db = client.db(database.database);
            MongoRepository.db = _db;
            MongoRepository.client = client;

            // Create index
            // If you call db.collection.createIndex() for an index that already exists,
            // MongoDB does not recreate the index.
            for (let [key, value] of Object.entries(dbIndexMap)) {
              await _db.collection(key).createIndex(value);
            }

            this.connectionInProgress = false; // unsetting the flag
            return resolve(_db);
          }
        );
      });
      return this.connectionPromise;
    });
  }

  public disconnect(): void {
    if (MongoRepository.client) {
      MongoRepository.client.close();
    }
  }
}
