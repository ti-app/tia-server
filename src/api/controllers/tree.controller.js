const httpStatus = require('http-status');
const TreeService = require('../services/tree.service');
const UploadService = require('../services/upload.service');

exports.allTrees = async (req, res, next) => {
  try {
    const { lat, lng, radius, health } = req.query;
    const allTrees = await TreeService.allTrees(lat, lng, radius, health);
    const currentTreeHealth = TreeService.getCurrentTreeHealth(allTrees);
    res.status(httpStatus.OK).json(currentTreeHealth);
  } catch (e) {
    next(e);
  }
};

exports.allTreesByLocation = async (req, res, next) => {
  const { location, distance } = req.body;
  const { lng } = location;
  const { lat } = location;

  try {
    const allTrees = await TreeService.allTreesByLocation(lng, lat, distance);
    res.status(httpStatus.OK).json(allTrees);
  } catch (e) {
    next(e);
  }
};

exports.waterByPlantID = async (req, res, next) => {
  const { treeID } = req.params;
  try {
    const updatedTree = await TreeService.updateTreeHealthByID(treeID);
    res.status(httpStatus.OK).json(updatedTree);
  } catch (e) {
    next(e);
  }
};

exports.deleteTree = async (req, res, next) => {
  const { treeID } = req.params;
  try {
    const deletedTree = await TreeService.deleteTree(treeID);
    res.status(httpStatus.OK).json({
      status: 'success',
    });
  } catch (e) {
    next(e);
  }
};

exports.updateTree = async (req, res, next) => {
  const toBeUpdate = {
    ...req.body,
    ...req.params,
  };

  let uploadedImageURL = '';
  if (req.file && req.file !== undefined) {
    uploadedImageURL = await UploadService.uploadImageToStorage(req.file);
    toBeUpdate.photo = uploadedImageURL;
  }

  // uploadedUser never changes
  delete toBeUpdate.uploadedUser;
  try {
    const updatedTree = await TreeService.updateTree(toBeUpdate);
    res.status(httpStatus.OK).json({
      status: 'success',
    });
  } catch (e) {
    next(e);
  }
};
