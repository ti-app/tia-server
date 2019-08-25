const httpStatus = require('http-status');
const TreeGroupService = require('../services/tree-group.service');
const TreeService = require('../services/tree.service');
const UploadService = require('../services/upload.service');
const { activityType } = require('../constants/tree.constants');

exports.createTreeGroup = async (req, res, next) => {
  try {
    const { lat, lng, isCoordinateExists, health, plants, plantType, waterCycle } = req.body;

    const isTreeExist = await TreeGroupService.isTreeExistOnCoordinate(lat, lng);
    if (isTreeExist && !isCoordinateExists) {
      const isCoordinateExists = true;
      return res.status(httpStatus.ALREADY_REPORTED).json({
        message: `Tree/ site Already exists on the request location. If you still wants to plant click on yes, click on NO and add the plant again.`,
        isCoordinateExists,
      });
    }

    if (isCoordinateExists) {
      TreeService.updateTree(req.body);
    }

    let uploadedImage = {
      url: '',
      fileName: '',
    };

    if (req.file && req.file != undefined) {
      uploadedImage = await UploadService.uploadImageToStorage(req.file);
    }

    /**
     * Changing data format from form data to json
     */
    const treeGroup = {
      photo: uploadedImage.url,
      photoName: uploadedImage.fileName,
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)],
      },
      plantType,
      healthCycle: Math.round(waterCycle),
      health,
      plants,
      uploadedDate: new Date().getTime(),
      uploadedUser: req.uid.user_id,
      lastActivityDate: new Date().getTime(),
      lastActedUser: req.uid.user_id,
      owner: {
        userId: req.uid.user_id,
        displayName: req.uid.displayName,
      },
      lastActivityType: activityType.addPlant,
      activityDetails: [
        {
          activity: activityType.addPlant,
          date: new Date().getTime(),
          user: req.uid.displayName,
        },
      ],
      activeTrees: true,
      moderatorApproved: TreeGroupService.addedByModerator(req.uid.role),
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
    const { uid } = req;
    const { lat, lng, radius, health } = req.query;
    const allTreeGroups = await TreeGroupService.fetchTreeGroups(lat, lng, radius, health, uid);
    res.status(httpStatus.OK).json(allTreeGroups);
  } catch (e) {
    next(e);
  }
};
