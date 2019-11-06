import { ObjectID } from 'mongodb';
import constants from '@constants';
import MongoClient from '../mongo.repository';
const { database } = constants;

const TREE_COLLECTION_NAME = database.collections.tree;

export const addNewTrees = (tree: any) => {
  const db = MongoClient.db;
  return db.collection(TREE_COLLECTION_NAME).insertMany(tree);
};

export const updateTree = (treeId: string, updateBody: any) => {
  const db = MongoClient.db;
  return db.collection(TREE_COLLECTION_NAME).updateOne(
    {
      _id: new ObjectID(treeId),
    },
    {
      $set: updateBody,
    }
  );
};

export const updateModDeleteStatus = (treeId: string, deleteApprove: boolean) => {
  const db = MongoClient.db;
  return db.collection(TREE_COLLECTION_NAME).updateOne(
    {
      _id: new ObjectID(treeId),
    },
    {
      $set: {
        'delete.isModeratorApproved': deleteApprove,
      },
    }
  );
};

export const rejectTreeDelete = (treeId: string) => {
  const db = MongoClient.db;
  return db.collection(TREE_COLLECTION_NAME).updateOne(
    {
      _id: new ObjectID(treeId),
    },
    {
      $unset: {
        delete: 1,
      },
    }
  );
};
