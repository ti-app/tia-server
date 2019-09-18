const httpStatus = require('http-status');
const TreeService = require('../services/tree.service');
const UploadService = require('../services/upload.service');
const { activityType, treeHealth } = require('../../constants');

exports.waterTree = async (req, res, next) => {
  const { treeID } = req.params;
  try {
    const updatedTree = await TreeService.updateTree(
      treeID,
      {
        health: treeHealth.HEALTHY,
        lastActivityDate: new Date().getTime(),
        lastActivityType: activityType.waterTree,
      },
      activityType.waterTree
    );

    res.status(httpStatus.OK).json(updatedTree);
  } catch (e) {
    next(e);
  }
};

exports.deleteTree = async (req, res, next) => {
  const { treeID } = req.params;
  try {
    const deletedTree = await TreeService.updateTree(
      treeID,
      {
        delete: { deleted: true, moderatorApproved: TreeService.deletedByModerator(req.user.role) },
      },
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

  let uploadedImageURL = '';
  if (req.file && req.file !== undefined) {
    uploadedImageURL = await UploadService.uploadImageToStorage(req.file);
    treeUpdateBody.photo = uploadedImageURL;
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
