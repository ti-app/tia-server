const repository = require('../repository');

class TreeGroupService {
  createTreeGroup(treeGroup) {
    return repository.addNewTreeGroup(treeGroup);
  }

  addTreesToGroup(treeIds, groupId) {
    return repository.addTreesToGroup(treeIds, groupId);
  }
}

module.exports = new TreeGroupService();
