const repository = require('../repository');
const TreeActivityService = require('../services/tree-activity.service');
const common = require('../../constants/constants.common');

class TreeService {
  async addMultipleTrees(trees) {
    return repository.addNewTrees(trees);
  }

  async updateTree(treeID, updateBody, activityType) {
    const activityRes = await TreeActivityService.addTreeActivity([treeID], activityType);
    return repository.updateTree(treeID, updateBody);
  }

  deletedByModerator(role) {
    return role === common.roles.MODERATOR;
  }

  updateModDeleteStatus(treeID, deleteApprove) {
    return repository.updateModDeleteStatus(treeID, deleteApprove);
  }

  rejectTreeDelete(treeID) {
    return repository.rejectTreeDelete(treeID);
  }
}

module.exports = new TreeService();
