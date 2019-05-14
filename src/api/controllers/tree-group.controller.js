const httpStatus = require('http-status');
const TreeGroupService = require('../services/tree-group.service');
const TreeService = require('../services/tree.service');
const UploadService = require('../services/upload.service');

const uploadImage = async (file) => {
  const uploadedImage = await UploadService.uploadImageToStorage(file);
  return uploadedImage;
};

exports.createTreeGroup = async (req, res, next) => {
  try {
    if(req.file && req.file != undefined){
      const uploadedImageURL = await uploadImage(req.file);
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
