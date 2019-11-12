import { MongoClient, Db } from 'mongodb';

import constants from '@constants';
const { database } = constants;

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
          (err, client) => {
            if (err) {
              this.connectionInProgress = false; // unsetting the flag
              return reject(err);
            }
            const _db = client.db(database.database);
            MongoRepository.db = _db;
            MongoRepository.client = client;

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
