const httpStatus = require('http-status');
const TreeGroupService = require('../services/tree-group.service');
const TreeService = require('../services/tree.service');
const UploadService = require('../services/upload.service');
const toArray = require('../utils/to-array');

const uploadImage = async (file) => {
  const uploadedImage = await UploadService.uploadImageToStorage(file);
  return uploadedImage;
};

exports.createTreeGroup = async (req, res, next) => {
  try {
    let uploadedImageURL = '';
    if (req.file && req.file != undefined) {
      uploadedImageURL = await uploadImage(req.file);
    }

    /**
     * Changing data format from form data to json
     */
    const treeGroup = {
      photo: uploadedImageURL,
      location: {
        type: 'Point',
        coordinates: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
      },
      health: req.body.health,
      plants: req.body.plants,
      uploadedUser: req.uid.user_id,
      lastActivityDate: new Date().getTime(),
      lastActedUSer: '',
      lastActivityType: 'Plant Addition',
      healthCycle: '7 Days',
      activeTrees: true,
    };

    const treeGroupResult = await TreeGroupService.createTreeGroup(treeGroup);
    const groupId = treeGroupResult.insertedId;

    const numTrees = treeGroup.plants;
    const trees = [];
    for (let i = 0; i < numTrees; i += 1) {
      const aTreeToAdd = Object.assign({}, treeGroup);
      delete aTreeToAdd.plants;
      // treeGroup is getting mutated by insert method..i guess, as it is having _id
      delete aTreeToAdd._id;
      aTreeToAdd.groupId = groupId;
      aTreeToAdd.meta = {
        createdAt: new Date().getTime(),
      };
      trees.push(aTreeToAdd);
    }

    const multipleTreeAddResult = await TreeService.addMultipleTrees(trees);
    await TreeGroupService.addTreesToGroup(multipleTreeAddResult.insertedIds, groupId);
    res.status(httpStatus.OK).json({ groupId });
  } catch (e) {
    next(e);
  }
};

exports.getTreeGroups = async (req, res, next) => {
  try {
    const { lat, lng, radius, health } = req.query;
    const allTreeGroups = await TreeGroupService.fetchTreeGroups(lat, lng, radius, health);
    const treeGroupResponse = [];

    // for (aGroup of allTreeGroups) {
    //   const allTreeIds = toArray(aGroup.treeIds);
    //   const allTrees = await TreeService.fetchTreeForIds(allTreeIds);
    //   const group = Object.assign({}, aGroup);
    //   delete group.treeIds;
    //   delete group.dist;
    //   group.trees = allTrees;
    //   treeGroupResponse.push(group);
    // }

    res.status(httpStatus.OK).json(allTreeGroups);
  } catch (e) {
    next(e);
  }
};
