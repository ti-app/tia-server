const httpStatus = require('http-status');
const TreeGroupService = require('../services/tree-group.service');
const TreeService = require('../services/tree.service');
const UploadService = require('../services/upload.service');
const {
  generateTreeCoordsForLine,
  generateTreeCoordsForCircle,
  generateTreeCoordsForRect,
} = require('../utils/tree-generator');

const uploadImage = async (file) => {
  const uploadedImage = await UploadService.uploadImageToStorage(file);
  return uploadedImage;
};

exports.createTreeGroup = async (req, res, next) => {
  try {
    const uploadedImageURL = await uploadImage(req.file);
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
    const { distribution } = req.body;
    let trees = [];

    if (distribution === 'line') {
      const { startLat, startLon, endLat, endLon, plants } = req.body;
      trees = generateTreeCoordsForLine(
        { lat: startLat, lon: startLon },
        { lat: endLat, lon: endLon },
        plants
      );
    } else if (distribution === 'rect') {
      // trees = generateTreeCoordsForRect();
    } else if (distribution === 'circle') {
      const { centerX, centerY, radius, plants } = req.body;
      trees = generateTreeCoordsForCircle(centerX, centerY, radius, plants);
    }

    console.log('TCL: exports.createTreeGroup -> trees', trees);
    const treesOfGroup = trees.map((aTree) => {
      // const aTreeToAdd = Object.assign({}, aTree);
      const aTreeToAdd = {
        photo: uploadedImageURL,
        location: {
          type: 'Point',
          coordinates: [parseFloat(aTree.lat), parseFloat(aTree.lon)],
        },
        health: req.body.health,
        groupId,
        meta: {
          createdAt: new Date().getTime(),
        },
      };
      return aTreeToAdd;
    });

    const multipleTreeAddResult = await TreeService.addMultipleTrees(treesOfGroup);
    await TreeGroupService.addTreesToGroup(multipleTreeAddResult.insertedIds, groupId);
    res.status(httpStatus.OK).json({ groupId });
  } catch (e) {
    next(e);
  }
};
