import { MongoClient, firebaseStub } from './import-helper';
import { MOD_USER } from './test-constants';

export const initDB = async () => {
  try {
    const dbClient = new MongoClient();
    const dbInstance = await dbClient.connect();
    console.log(`Connected to mongodb...`);
  } catch (error) {
    console.log(`Failed to connect to mongodb...`);
  }
};

export const disconnectDB = async () => {
  if (MongoClient.client) {
    try {
      await MongoClient.client.close();
      console.log('DB disconnected.');
    } catch (error) {
      console.log('Failed to disconnect DB.');
    }
  }
};

export const authorizeRequestAs = (user = MOD_USER) => {
  firebaseStub.resolves(user);
};
