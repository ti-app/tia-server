const httpStatus = require('http-status');
const TreeService = require('../services/tree.service');
// const responseService = require('../services/response.service');

exports.createTree = (req, res, next) => {
  try {
    const { plants, ...restTree } = req.body;
    const trees = [];

    for (let i = 0; i < plants; i += 1) {
      trees.push({ ...restTree });
    }
    TreeService.create(trees);
    return res.status(httpStatus.OK).json({ message: 'tree added', trees });
  } catch (e) {
    next(e);
  }
};

exports.allTrees = (req, res, next) => {
  try {
    TreeService.allTrees().then((allTrees) => res.status(httpStatus.OK).json(allTrees));
  } catch (e) {
    next(e);
  }
};

exports.allTreesLocation = (req, res, next) => {
  const { location, distance } = req.body;
  const { lng } = location;
  const { lat } = location;
  try {
    TreeService.allTreesLocation(lng, lat, distance).then((allTrees) =>
      res.status(httpStatus.OK).json(allTrees)
    );
  } catch (e) {
    next(e);
  }
};

exports.allTreesByLocation = (req, res, next) => {
  const { location, distance } = req.body;
  const currentLocation = location;
  const radius = distance;
  try {
    TreeService.allTreesByLocation(currentLocation, radius).then((allTrees) =>
      res.status(httpStatus.OK).json(allTrees)
    );
  } catch (e) {
    next(e);
  }
};
