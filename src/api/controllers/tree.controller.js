const httpStatus = require('http-status');
const TreeService = require('../services/tree.service');

exports.allTrees = async (req, res, next) => {
  try {
    const { lat, lng, radius, health } = req.query;
    const allTrees = await TreeService.allTrees(lat, lng, radius, health);
    res.status(httpStatus.OK).json(allTrees);
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
