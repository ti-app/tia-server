const httpStatus = require('http-status');
const TreeGroupService = require('../services/tree-group.service');
const TreeService = require('../services/tree.service');
const UploadService = require('../services/upload.service');
const formidable = require('formidable');

const logger = require('../utils/logger');

const parsedData = async (req) => {
  console.log('BODY', req.body);
  const uploadedImage = await UploadService.uploadImageToStorage(req.file);
};

exports.createTreeGroup = async (req, res, next) => {
  try {
    const treeGroup = parsedData(req);

    // const treeGroup = req.body;
    // const treeGroupResult = await TreeGroupService.createTreeGroup(treeGroup);
    // const groupId = treeGroupResult.insertedId;

    // const numTrees = treeGroup.plants;
    // const trees = [];
    // for (let i = 0; i < numTrees; i += 1) {
    //   const aTreeToAdd = Object.assign({}, treeGroup);
    //   delete aTreeToAdd.plants;
    //   delete aTreeToAdd._id; // treeGroup is getting mutated by insert method..i guess, as it is having _id
    //   aTreeToAdd.groupId = groupId;
    //   trees.push(aTreeToAdd);
    // }

    // const multipleTreeAddResult = await TreeService.addMultipleTrees(trees);
    // await TreeGroupService.addTreesToGroup(multipleTreeAddResult.insertedIds, groupId);
    res.status(httpStatus.OK).json({ status: 'ok' });
  } catch (e) {
    next(e);
  }
};
