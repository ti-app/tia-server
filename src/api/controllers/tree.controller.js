const httpStatus = require('http-status');
const { TreeService } = require('../services/tree.service');
// const responseService = require('../services/response.service');

exports.createTree = (req, res, next) => {
  try {
    const tree = req.body;
    TreeService.create(tree);
    return res.status(httpStatus.OK).json({ message: 'tree added', tree });
  } catch (e) {
    next(e);
  }
};
