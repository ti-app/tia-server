const repository = require('../repository');
const TreeActivityService = require('../services/tree-activity.service');

class TreeService {
  async addMultipleTrees(trees) {
    return repository.addNewTrees(trees);
  }

  async updateTree(treeID, updateBody, activityType) {
    const activityRes = await TreeActivityService.addTreeActivity([treeID], activityType);
    return repository.updateTree(treeID, updateBody);
  }
}

module.exports = new TreeService();
