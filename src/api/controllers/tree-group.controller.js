const httpStatus = require('http-status');
const TreeGroupService = require('../services/tree-group.service');
const TreeService = require('../services/tree.service');
const logger = require('../utils/logger');

const { getFirebaseUidFromToken } = require('../utils/firebase.utils');

// const responseService = require('../services/response.service');

exports.createTreeGroup = async (req, res, next) => {
  try {
    const treeGroup = req.body;
    await TreeGroupService.createTreeGroup(treeGroup);

    const idToken = req.headers['x-id-token'];

    const userId = await getFirebaseUidFromToken(idToken).then((uid) => {
      logger.info('isAuthenticated', uid);
      return uid;
    });

    const numTrees = treeGroup.plants;
    const trees = [];
    for (let i = 0; i < numTrees; i += 1) {
      const aTreeToAdd = Object.assign({}, treeGroup);
      delete aTreeToAdd._id;
      delete aTreeToAdd.plants;
      aTreeToAdd.group_id = treeGroup._id;
      aTreeToAdd.userId = userId.user_id;
      trees.push(aTreeToAdd);
    }

    TreeService.createMultiple(trees);
    return res.status(httpStatus.OK).json({ treeGroup });
  } catch (e) {
    next(e);
  }
};
