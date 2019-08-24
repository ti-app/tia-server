const httpStatus = require('http-status');
const TreeService = require('../services/tree.service');
const UploadService = require('../services/upload.service');

const uploadImage = async (file) => {
  const uploadedImage = await UploadService.uploadImageToStorage(file);
  return uploadedImage;
};


/**
 * updateTree: Updates TREE for the given request
 */

exports.updateTree = async (req, res, next) => {
  let uploadedImageURL = '';
  if (req.file && req.file != undefined) {
    uploadedImageURL = await uploadImage(req.file);
  }

  const toBeUpdate = {
    ...req.body,
    ...req.params,
    photo: uploadedImageURL,
  };

  // uploadedUser never changes
  delete toBeUpdate.uploadedUser;
  try {
    const allTrees = await TreeService.updateTree(toBeUpdate);
    res.status(httpStatus.OK).json(allTrees);
  } catch (e) {
    next(e);
  }
};
