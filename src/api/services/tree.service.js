const repository = require('../repository');

class TreeService {
  static create(tree) {
    repository.addNewTree(tree);
  }

  static allTrees() {
    return repository.fetchAllTrees();
  }
}

module.exports = { TreeService };
