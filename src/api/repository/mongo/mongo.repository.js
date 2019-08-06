const { MongoClient } = require('mongodb');
const treeCollection = require('./collection/tree.collection');
const siteCollection = require('./collection/site.collection');
const treeGroupCollection = require('./collection/tree-group.collection');

const { database } = require('../../../constants');

// Holds the current connection to repository

let db = null;

let connectionInProgress = false;
let connectionPromise = null;

/**
 * Opens the connection to database and saves the connection in 'db' variable.
 * @returns {Promise} A promise that will be resolved to the database connection if successful
 */
const connect = () =>
  new Promise((resolve, reject) => {
    // logic to open a connection to database
    // once the connection is open, save the instance in db variable here
    // Check if another promise is pending.
    if (connectionInProgress) {
      // Yes there is, just return the previous promise
      return connectionPromise;
    }
    // No there is no promise pending. Let us create a new one
    connectionInProgress = true; // setting the flag
    connectionPromise = new Promise(() => {
      MongoClient.connect(
        database.uri,
        { useNewUrlParser: true },
        (err, client) => {
          if (err) {
            connectionInProgress = false; // unsetting the flag
            return reject(err);
          }
          db = client.db(database.database);
          connectionInProgress = false; // unsetting the flag
          return resolve(db);
          // client.db().collection().findOne()
        }
      );
    });
    return connectionPromise;
  });

// Asynchronously open the connection
(async () => {
  await connect();
  console.log('Connected with mongo client');
  treeCollection.setDatabase(db);
  siteCollection.setDatabase(db);
  treeGroupCollection.setDatabase(db);
})();

module.exports = {
  ...treeCollection.queries,
  ...siteCollection.queries,
  ...treeGroupCollection.queries,
};
