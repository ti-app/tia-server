const repository = require('../repository');

class TreeGroupService {
  createTreeGroup(treeGroup) {
    return repository.addNewTreeGroup(treeGroup);
  }

  allTreeGroups() {
    return repository.fetchAllTreeGroups();
  }
}

module.exports = new TreeGroupService();
