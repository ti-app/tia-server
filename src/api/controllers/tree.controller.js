const httpStatus = require('http-status');
const TreeService = require('../services/tree.service');
const TreeGroupService = require('../services/tree-group.service');
const UploadService = require('../services/upload.service');
const { activityType, treeHealth, treeHealthValue } = require('../../constants');
const { toTreeHealth, toTreeHealthValue } = require('../utils/common-utils');

exports.waterTree = async (req, res, next) => {
  const { treeID } = req.params;
  try {
    const updatedTree = await TreeService.updateTree(
      treeID,
      {
        health: treeHealth.HEALTHY,
        healthValue: toTreeHealthValue(treeHealth.HEALTHY),
        lastActivityDate: new Date().getTime(),
        lastActivityType: activityType.waterTree,
      },
      activityType.waterTree
    );

    const result = await TreeGroupService.getTreesOfGroup(treeID);
    const { _id: groupId, trees } = result[0].group;

    let minHealth = Number.POSITIVE_INFINITY;

    trees.forEach((aTree) => {
      if (aTree.healthValue < minHealth) {
        minHealth = aTree.healthValue;
      }
    });

    const upatedTreGroupRes = await TreeGroupService.updateTreeGroup(groupId, {
      health: toTreeHealth(minHealth),
      healthValue: minHealth,
    });

    res.status(httpStatus.OK).json({ status: 'success' });
  } catch (e) {
    next(e);
  }
};

exports.deleteTree = async (req, res, next) => {
  const { treeID } = req.params;
  try {
    const deletedTree = await TreeService.updateTree(
      treeID,
      { deleted: true },
      activityType.deleteTree
    );

    res.status(httpStatus.OK).json({
      status: 'success',
    });
  } catch (e) {
    next(e);
  }
};

exports.updateTree = async (req, res, next) => {
  const { treeID } = req.params;
  const treeUpdateBody = {
    ...req.body,
  };

  if (req.file && req.file !== undefined) {
    const { url, fileName } = await UploadService.uploadImageToStorage(req.file);
    treeUpdateBody.photo = url;
    treeUpdateBody.photoName = fileName;
  }

  // uploadedUser never changes
  delete treeUpdateBody.uploadedUser;
  try {
    const updatedTree = await TreeService.updateTree(
      treeID,
      treeUpdateBody,
      activityType.updateTree
    );

    res.status(httpStatus.OK).json({
      status: 'success',
    });
  } catch (e) {
    next(e);
  }
};
