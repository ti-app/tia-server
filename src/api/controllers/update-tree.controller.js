const httpStatus = require('http-status');
const TreeService = require('../services/tree.service');

/**
 * updateTree: Updates TREE for the given request
 */

exports.updateTree = async (req, res, next) => {
  const toBeUpdate = {
    ...req.body,
    ...req.params,
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
